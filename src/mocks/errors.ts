export interface ErrorEntry {
  id: string;
  timestamp: string;
  code: string;
  rawMessage: string;
  // Tiered explanations
  friendlyMessage: string; // Explorer
  technicalDetail: string; // Builder
  cause: string;
  nextStep: string;
  relatedDocs: string;
}

export const mockErrors: ErrorEntry[] = [
  {
    id: 'err-001',
    timestamp: '2025-06-10T14:32:00Z',
    code: 'ThrottlingException',
    rawMessage: 'Rate exceeded for model anthropic.claude-sonnet-4-20250514-v1:0 in us-east-1. Retry after 2s.',
    friendlyMessage: 'Too many requests sent at once. The system paused briefly to catch up.',
    technicalDetail: 'Request rate exceeded the per-model RPM quota (50 req/min). Exponential backoff recommended.',
    cause: 'Your application sent more requests per minute than your current quota allows.',
    nextStep: 'Add a short delay between requests, or request a quota increase in Service Quotas.',
    relatedDocs: 'https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html',
  },
  {
    id: 'err-002',
    timestamp: '2025-06-10T13:15:00Z',
    code: 'ValidationException',
    rawMessage: 'Input token count 250000 exceeds model maximum of 200000 for anthropic.claude-sonnet-4-20250514-v1:0',
    friendlyMessage: 'The text you sent was too long for this model to process at once.',
    technicalDetail: 'Input tokens (250K) exceeded the model context window (200K). Truncate or chunk the input.',
    cause: 'The document or prompt exceeded the model\'s maximum input size.',
    nextStep: 'Split your text into smaller pieces and send them separately, or use a model with a larger context window.',
    relatedDocs: 'https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html',
  },
  {
    id: 'err-003',
    timestamp: '2025-06-10T11:45:00Z',
    code: 'ModelTimeoutException',
    rawMessage: 'Inference timeout after 60000ms for model anthropic.claude-sonnet-4-20250514-v1:0',
    friendlyMessage: 'The model took too long to respond and the request was cancelled.',
    technicalDetail: 'Inference exceeded 60s timeout. Often caused by very long inputs combined with high max_tokens.',
    cause: 'The combination of input length and requested output length made the response take too long.',
    nextStep: 'Reduce your input size or lower the max_tokens parameter. Consider using a faster model for this task.',
    relatedDocs: 'https://docs.aws.amazon.com/bedrock/latest/userguide/troubleshooting.html',
  },
  {
    id: 'err-004',
    timestamp: '2025-06-09T16:20:00Z',
    code: 'ResourceNotFoundException',
    rawMessage: 'Model anthropic.claude-sonnet-4-20250514-v1:0 is not available in ap-southeast-2',
    friendlyMessage: 'This model is not available in the region you selected.',
    technicalDetail: 'Model not provisioned in ap-southeast-2. Available in: us-east-1, us-west-2, eu-west-1, ap-northeast-1.',
    cause: 'You tried to use a model in a region where it has not been deployed.',
    nextStep: 'Switch to a region where this model is available, or choose a different model that is available in your region.',
    relatedDocs: 'https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html',
  },
  {
    id: 'err-005',
    timestamp: '2025-06-09T09:00:00Z',
    code: 'AccessDeniedException',
    rawMessage: 'User: arn:aws:iam::123456789012:user/dev-user is not authorized to perform: bedrock:InvokeModel',
    friendlyMessage: 'Your account does not have permission to use this model.',
    technicalDetail: 'IAM policy missing bedrock:InvokeModel permission. Check the user/role policies in IAM console.',
    cause: 'The credentials you are using do not include permission to call this model.',
    nextStep: 'Ask your AWS administrator to add bedrock:InvokeModel permission to your IAM user or role.',
    relatedDocs: 'https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html',
  },
];
