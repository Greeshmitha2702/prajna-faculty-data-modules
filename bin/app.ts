#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PrajnaTeachingStack } from '../src/infrastructure/stacks/prajna-teaching.stack';

const app = new cdk.App();

const stages = ['dev', 'qa', 'prod'] as const;
const stage = (app.node.tryGetContext('stage') as string) || 'dev';

if (!stages.includes(stage as typeof stages[number])) {
  throw new Error(`Invalid stage: ${stage}. Must be one of: ${stages.join(', ')}`);
}

new PrajnaTeachingStack(app, `PrajnaTeaching-${stage}`, {
  stage,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'ap-south-1',
  },
  tags: {
    Project: 'PRAJNA',
    Module: 'Module8',
    Stage: stage,
    ManagedBy: 'CDK',
  },
});

app.synth();
