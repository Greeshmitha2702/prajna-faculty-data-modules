// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – API Integration Construct
// Adds all Module 8 routes to the shared API Gateway HTTP API
// Consumes existing Cognito Authorizer from Module 3
// ─────────────────────────────────────────────────────────────────────────────

import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as apigwv2Authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export interface ApiIntegrationConstructProps {
  stage: string;
  deliverableHandler: lambda.IFunction;
  submissionHandler: lambda.IFunction;
  uploadHandler: lambda.IFunction;
  feedbackHandler: lambda.IFunction;
  scheduleHandler: lambda.IFunction;
  gradebookHandler: lambda.IFunction;
}

export class ApiIntegrationConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ApiIntegrationConstructProps) {
    super(scope, id);

    const { stage } = props;

    // ── Import shared HTTP API ────────────────────────────────────────────────
    const apiId = ssm.StringParameter.valueForStringParameter(
      this,
      `/prajna/${stage}/api/http-api-id`
    );

    const httpApi = apigwv2.HttpApi.fromHttpApiAttributes(this, 'SharedHttpApi', {
      httpApiId: apiId,
    });

    // ── Import Cognito Authorizer from Module 3 ──────────────────────────────
    const authorizerId = ssm.StringParameter.valueForStringParameter(
      this,
      `/prajna/${stage}/auth/cognito-authorizer-id`
    );

    // ── Helper: Lambda Integration ──
    const addRoute = (id: string, path: string, method: string, fn: lambda.IFunction) => {
      const integration = new apigwv2.CfnIntegration(this, `${id}Integration`, {
        apiId,
        integrationType: 'AWS_PROXY',
        integrationUri: fn.functionArn,
        payloadFormatVersion: '2.0',
      });

      new apigwv2.CfnRoute(this, `${id}Route`, {
        apiId,
        routeKey: `${method} ${path}`,
        authorizationType: 'JWT',
        authorizerId,
        target: `integrations/${integration.ref}`,
      });
      
      // Grant API Gateway permission to invoke lambda
      fn.addPermission(`${id}Invoke`, {
        principal: new cdk.aws_iam.ServicePrincipal('apigateway.amazonaws.com'),
        action: 'lambda:InvokeFunction',
      });
    };

    // ── Teaching Routes ──

    addRoute('Load', '/faculty/teaching/load', 'GET', props.scheduleHandler);
    addRoute('Timetable', '/faculty/teaching/timetable', 'GET', props.scheduleHandler);
    addRoute('TeachingDeps', '/faculty/{facultyId}/teaching', 'GET', props.scheduleHandler);

    // ── Lesson Plan Routes ──
    addRoute('LPPost', '/faculty/teaching/lesson-plan', 'POST', props.scheduleHandler);
    addRoute('LPGet', '/faculty/teaching/lesson-plan', 'GET', props.scheduleHandler);
    addRoute('LPPut', '/faculty/teaching/lesson-plan/{id}', 'PUT', props.scheduleHandler);
    addRoute('LPDel', '/faculty/teaching/lesson-plan/{id}', 'DELETE', props.scheduleHandler);

    // ── Attendance Routes ──
    addRoute('AttPost', '/faculty/teaching/attendance', 'POST', props.scheduleHandler);
    addRoute('AttGet', '/faculty/teaching/attendance', 'GET', props.scheduleHandler);
    addRoute('AttPut', '/faculty/teaching/attendance/{id}', 'PUT', props.scheduleHandler);

    // ── Deliverable Routes ──
    addRoute('DelPost', '/deliverables', 'POST', props.deliverableHandler);
    addRoute('DelGet', '/deliverables', 'GET', props.deliverableHandler);
    addRoute('DelPutId', '/deliverables/{id}', 'PUT', props.deliverableHandler);
    addRoute('DelDelId', '/deliverables/{id}', 'DELETE', props.deliverableHandler);
    addRoute('DelGetId', '/deliverables/{id}', 'GET', props.deliverableHandler);

    // ── Feedback Routes ──
    addRoute('FbPost', '/feedback', 'POST', props.feedbackHandler);
    addRoute('FbGet', '/feedback', 'GET', props.feedbackHandler);
    addRoute('FbGetId', '/feedback/{id}', 'GET', props.feedbackHandler);
    addRoute('FbPutId', '/feedback/{id}/release', 'PUT', props.feedbackHandler);
    addRoute('FbPostResp', '/feedback/{id}/response', 'POST', props.feedbackHandler);

    // ── GradeBook Routes ──
    addRoute('GbGet', '/gradebook', 'GET', props.gradebookHandler);
    addRoute('GbSync', '/gradebook/sync', 'GET', props.gradebookHandler);

    // ── Upload Routes ──
    addRoute('UpTeaching', '/upload/teaching', 'POST', props.uploadHandler);
    addRoute('UpDel', '/upload/deliverable/{deliverableId}', 'POST', props.uploadHandler);
    addRoute('UpSub', '/upload/submission/{deliverableId}/{studentId}', 'POST', props.uploadHandler);
    addRoute('UpDl', '/download', 'POST', props.uploadHandler);
  }
}
