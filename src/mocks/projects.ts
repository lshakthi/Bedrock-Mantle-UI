export interface ProjectMetrics {
  totalRequests: number;
  successRate: number;
  averageLatencyMs: number;
  costLast30Days: number;
  costTrend: 'up' | 'down' | 'stable';
  topErrors: { code: string; count: number; friendlyMessage: string }[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  modelId: string;
  modelName: string;
  createdAt: string;
  lastActivity: string;
  metrics: ProjectMetrics;
  // Explorer-friendly
  healthStatus: 'healthy' | 'needs-attention' | 'degraded';
  healthSummary: string;
  nextAction: string;
}

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Customer Support Bot',
    description: 'Handles tier-1 support tickets with automated responses',
    modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
    modelName: 'Claude Sonnet 4',
    createdAt: '2025-01-15T10:00:00Z',
    lastActivity: '2025-06-10T14:30:00Z',
    metrics: {
      totalRequests: 45230,
      successRate: 0.987,
      averageLatencyMs: 1200,
      costLast30Days: 127.45,
      costTrend: 'stable',
      topErrors: [
        { code: 'ThrottlingException', count: 23, friendlyMessage: 'Too many requests sent at once' },
        { code: 'ValidationException', count: 8, friendlyMessage: 'Input format was incorrect' },
      ],
    },
    healthStatus: 'healthy',
    healthSummary: 'Running well. 98.7% of requests succeed.',
    nextAction: 'No action needed. Consider reviewing the 23 throttling events if volume increases.',
  },
  {
    id: 'proj-002',
    name: 'Document Summarizer',
    description: 'Summarizes legal documents for internal review',
    modelId: 'anthropic.claude-haiku-3-20240307-v1:0',
    modelName: 'Claude Haiku 3',
    createdAt: '2025-03-20T09:00:00Z',
    lastActivity: '2025-06-09T11:15:00Z',
    metrics: {
      totalRequests: 12800,
      successRate: 0.945,
      averageLatencyMs: 800,
      costLast30Days: 18.90,
      costTrend: 'up',
      topErrors: [
        { code: 'ModelTimeoutException', count: 145, friendlyMessage: 'Model took too long to respond' },
        { code: 'ValidationException', count: 62, friendlyMessage: 'Document exceeded size limit' },
      ],
    },
    healthStatus: 'needs-attention',
    healthSummary: 'Success rate dropped to 94.5%. Many timeouts on large documents.',
    nextAction: 'Split large documents into smaller chunks before sending, or switch to a model with a larger context window.',
  },
  {
    id: 'proj-003',
    name: 'Product Catalog Tagger',
    description: 'Auto-tags products with categories from descriptions',
    modelId: 'amazon.titan-text-express-v1',
    modelName: 'Amazon Titan Text Express',
    createdAt: '2025-05-01T16:00:00Z',
    lastActivity: '2025-06-08T08:45:00Z',
    metrics: {
      totalRequests: 89400,
      successRate: 0.998,
      averageLatencyMs: 350,
      costLast30Days: 42.10,
      costTrend: 'down',
      topErrors: [
        { code: 'ThrottlingException', count: 12, friendlyMessage: 'Too many requests sent at once' },
      ],
    },
    healthStatus: 'healthy',
    healthSummary: 'Excellent performance. 99.8% success rate, costs trending down.',
    nextAction: 'No action needed.',
  },
];
