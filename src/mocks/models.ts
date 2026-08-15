export interface ModelSpec {
  id: string;
  name: string;
  provider: string;
  modalities: string[];
  contextWindow: number;
  maxOutput: number;
  inputPricePerMToken: number;
  outputPricePerMToken: number;
  regions: string[];
  quotas: { requestsPerMinute: number; tokensPerMinute: number };
  serviceTiers: ('priority' | 'standard' | 'flexible')[];
  // Explorer-friendly fields
  taskDescription: string;
  strengthsSummary: string;
  costPer100Uses: number; // Dollars per 100 typical uses
  bestFor: string[];
}

export const mockModels: ModelSpec[] = [
  {
    id: 'anthropic.claude-sonnet-4-20250514-v1:0',
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    modalities: ['text', 'image', 'document'],
    contextWindow: 200000,
    maxOutput: 8192,
    inputPricePerMToken: 3.0,
    outputPricePerMToken: 15.0,
    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1'],
    quotas: { requestsPerMinute: 50, tokensPerMinute: 100000 },
    serviceTiers: ['priority', 'standard', 'flexible'],
    taskDescription: 'Complex analysis, coding, and detailed writing',
    strengthsSummary: 'Best balance of capability and speed. Handles nuanced tasks well.',
    costPer100Uses: 0.45,
    bestFor: ['Code generation', 'Analysis', 'Long documents', 'Creative writing'],
  },
  {
    id: 'anthropic.claude-haiku-3-20240307-v1:0',
    name: 'Claude Haiku 3',
    provider: 'Anthropic',
    modalities: ['text', 'image'],
    contextWindow: 200000,
    maxOutput: 4096,
    inputPricePerMToken: 0.25,
    outputPricePerMToken: 1.25,
    regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
    quotas: { requestsPerMinute: 100, tokensPerMinute: 200000 },
    serviceTiers: ['standard', 'flexible'],
    taskDescription: 'Quick tasks, classification, and simple Q&A',
    strengthsSummary: 'Fastest and most affordable. Good for high-volume simple tasks.',
    costPer100Uses: 0.04,
    bestFor: ['Classification', 'Quick answers', 'Data extraction', 'Summarization'],
  },
  {
    id: 'meta.llama3-70b-instruct-v1:0',
    name: 'Llama 3 70B',
    provider: 'Meta',
    modalities: ['text'],
    contextWindow: 8192,
    maxOutput: 2048,
    inputPricePerMToken: 2.65,
    outputPricePerMToken: 3.5,
    regions: ['us-east-1', 'us-west-2'],
    quotas: { requestsPerMinute: 40, tokensPerMinute: 80000 },
    serviceTiers: ['standard'],
    taskDescription: 'General text tasks with open-source flexibility',
    strengthsSummary: 'Strong open-source model. Good for general text when you want open weights.',
    costPer100Uses: 0.35,
    bestFor: ['General text', 'Open-source projects', 'Research'],
  },
  {
    id: 'amazon.titan-text-express-v1',
    name: 'Amazon Titan Text Express',
    provider: 'Amazon',
    modalities: ['text'],
    contextWindow: 8192,
    maxOutput: 4096,
    inputPricePerMToken: 0.2,
    outputPricePerMToken: 0.6,
    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
    quotas: { requestsPerMinute: 100, tokensPerMinute: 150000 },
    serviceTiers: ['priority', 'standard', 'flexible'],
    taskDescription: 'Cost-effective text generation and summarization',
    strengthsSummary: 'Low cost, widely available. Solid for straightforward tasks.',
    costPer100Uses: 0.03,
    bestFor: ['Summarization', 'Simple generation', 'High volume', 'Budget-friendly'],
  },
  {
    id: 'mistral.mistral-large-2402-v1:0',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    modalities: ['text'],
    contextWindow: 32768,
    maxOutput: 8192,
    inputPricePerMToken: 4.0,
    outputPricePerMToken: 12.0,
    regions: ['us-east-1', 'us-west-2'],
    quotas: { requestsPerMinute: 30, tokensPerMinute: 60000 },
    serviceTiers: ['standard', 'flexible'],
    taskDescription: 'Multilingual tasks and complex reasoning',
    strengthsSummary: 'Strong at multilingual content and structured reasoning.',
    costPer100Uses: 0.55,
    bestFor: ['Multilingual', 'Reasoning', 'Code', 'Structured output'],
  },
];
