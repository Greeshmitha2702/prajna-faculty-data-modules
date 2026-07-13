import { DdbAdapter } from '../../../src/adapters/ddb.adapter';
import { EventBridgeAdapter } from '../../../src/adapters/eventbridge.adapter';
import { S3Adapter } from '../../../src/adapters/s3.adapter';

// Mock AWS clients
jest.mock('@aws-sdk/lib-dynamodb', () => {
  const mockSend = jest.fn();
  return {
    DynamoDBDocumentClient: {
      from: jest.fn().mockReturnValue({
        send: mockSend,
      }),
    },
    PutCommand: jest.fn(),
    GetCommand: jest.fn(),
    UpdateCommand: jest.fn(),
    DeleteCommand: jest.fn(),
    QueryCommand: jest.fn(),
    TransactWriteCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn(),
}));

jest.mock('@aws-sdk/client-eventbridge', () => {
  const mockSend = jest.fn();
  return {
    EventBridgeClient: jest.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    PutEventsCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/client-s3', () => {
  const mockSend = jest.fn();
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    GetObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
    HeadObjectCommand: jest.fn(),
    PutObjectCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('http://signed-url'),
}));

describe('Adapters Unit Tests', () => {
  describe('DdbAdapter', () => {
    let adapter: DdbAdapter;
    let mockSend: jest.Mock;

    beforeEach(() => {
      const docClient = require('@aws-sdk/lib-dynamodb').DynamoDBDocumentClient.from();
      mockSend = docClient.send as jest.Mock;
      adapter = new DdbAdapter('test-table');
    });

    it('should call put', async () => {
      mockSend.mockResolvedValue({});
      await adapter.put({ PK: '1', SK: '1' });
      expect(mockSend).toHaveBeenCalled();
    });

    it('should call putIfNotExists', async () => {
      mockSend.mockResolvedValue({});
      await adapter.putIfNotExists({ PK: '1', SK: '1' }, 'PK', 'SK');
      expect(mockSend).toHaveBeenCalled();
    });

    it('should call get', async () => {
      mockSend.mockResolvedValue({ Item: { PK: '1' } });
      const res = await adapter.get<any>({ PK: '1', SK: '1' });
      expect(res?.PK).toBe('1');
    });

    it('should call update', async () => {
      mockSend.mockResolvedValue({});
      await adapter.update('test-table', { key: { PK: '1', SK: '1' }, updateExpression: 'SET val = :v', expressionAttributeValues: { ':v': 1 } });
      expect(mockSend).toHaveBeenCalled();
    });

    it('should call updateItem', async () => {
      mockSend.mockResolvedValue({});
      await adapter.updateItem({ key: { PK: '1', SK: '1' }, updateExpression: 'SET val = :v', expressionAttributeValues: { ':v': 1 } });
      expect(mockSend).toHaveBeenCalled();
    });

    it('should call delete', async () => {
      mockSend.mockResolvedValue({});
      await adapter.delete({ PK: '1', SK: '1' });
      expect(mockSend).toHaveBeenCalled();
    });

    it('should call query', async () => {
      mockSend.mockResolvedValue({ Items: [] });
      await adapter.query({ keyConditionExpression: 'PK = :pk', expressionAttributeValues: { ':pk': '1' } });
      expect(mockSend).toHaveBeenCalled();
    });

    it('should call transactWrite', async () => {
      mockSend.mockResolvedValue({});
      await adapter.transactWrite([]);
      expect(mockSend).toHaveBeenCalled();
    });
  });

  describe('EventBridgeAdapter', () => {
    let adapter: EventBridgeAdapter;
    let mockSend: jest.Mock;

    beforeEach(() => {
      const { EventBridgeClient } = require('@aws-sdk/client-eventbridge');
      mockSend = new EventBridgeClient().send as jest.Mock;
      adapter = new EventBridgeAdapter('test-bus');
    });

    it('should publish event', async () => {
      mockSend.mockResolvedValue({});
      await adapter.publish({ eventType: 'deliverable.published', facultyId: '1', campus: '1', department: '1', courseCode: '1', academicYear: '1', semester: '1', payload: {} });
      expect(mockSend).toHaveBeenCalled();
    });

    it('should publishBatch events', async () => {
      mockSend.mockResolvedValue({});
      await adapter.publishBatch([]);
      expect(mockSend).toHaveBeenCalled();
    });
  });

  describe('S3Adapter', () => {
    let adapter: S3Adapter;
    let mockSend: jest.Mock;

    beforeEach(() => {
      const { S3Client } = require('@aws-sdk/client-s3');
      mockSend = new S3Client().send as jest.Mock;
      adapter = new S3Adapter('test-bucket');
    });

    it('generates presigned upload URL', async () => {
      const res = await adapter.generatePresignedUploadUrl('key', 'application/pdf');
      expect(res.uploadUrl).toBe('http://signed-url');
    });

    it('generates presigned download URL', async () => {
      const res = await adapter.generatePresignedDownloadUrl('key');
      expect(res.downloadUrl).toBe('http://signed-url');
    });

    it('deletes object', async () => {
      mockSend.mockResolvedValue({});
      await adapter.deleteObject('key');
      expect(mockSend).toHaveBeenCalled();
    });

    it('heads object returning true when exists', async () => {
      mockSend.mockResolvedValue({});
      const res = await adapter.headObject('key');
      expect(res).toBe(true);
    });

    it('heads object returning false when missing', async () => {
      mockSend.mockRejectedValue(new Error('NoSuchKey'));
      const res = await adapter.headObject('key');
      expect(res).toBe(false);
    });

    it('builds keys correctly', () => {
      expect(adapter.buildTeachingUploadKey('fac-1', 'file.pdf')).toContain('documents/faculty/fac-1/teaching/');
      expect(adapter.buildDeliverableKey('fac-1', 'del-1', 'file.pdf')).toContain('deliverables/del-1/');
      expect(adapter.buildSubmissionKey('fac-1', 'del-1', 'stud-1', 'file.pdf')).toContain('submissions/stud-1/');
    });
  });
});
