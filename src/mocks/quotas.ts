export interface QuotaInfo {
  modelId: string;
  modelName: string;
  region: string;
  requestsPerMinute: number;
  tokensPerMinute: number;
  currentUsageRpm: number;
  currentUsageTpm: number;
  inputPricePerMToken: number;
  outputPricePerMToken: number;
  // Explorer-friendly
  costPer100Uses: number;
  canAffordEstimate: (recordCount: number) => { cost: number; withinQuota: boolean; timeEstimateMinutes: number };
}

export interface QuotaEntry {
  modelId: string;
  modelName: string;
  region: string;
  requestsPerMinute: number;
  tokensPerMinute: number;
  currentUsageRpm: number;
  currentUsageTpm: number;
  inputPricePerMToken: number;
  outputPricePerMToken: number;
  costPer100Uses: number;
}

export const mockQuotas: QuotaEntry[] = [
  {
    modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
    modelName: 'Claude Sonnet 4',
    region: 'us-east-1',
    requestsPerMinute: 50,
    tokensPerMinute: 100000,
    currentUsageRpm: 12,
    currentUsageTpm: 24000,
    inputPricePerMToken: 3.0,
    outputPricePerMToken: 15.0,
    costPer100Uses: 0.45,
  },
  {
    modelId: 'anthropic.claude-haiku-3-20240307-v1:0',
    modelName: 'Claude Haiku 3',
    region: 'us-east-1',
    requestsPerMinute: 100,
    tokensPerMinute: 200000,
    currentUsageRpm: 45,
    currentUsageTpm: 89000,
    inputPricePerMToken: 0.25,
    outputPricePerMToken: 1.25,
    costPer100Uses: 0.04,
  },
  {
    modelId: 'amazon.titan-text-express-v1',
    modelName: 'Amazon Titan Text Express',
    region: 'us-east-1',
    requestsPerMinute: 100,
    tokensPerMinute: 150000,
    currentUsageRpm: 67,
    currentUsageTpm: 112000,
    inputPricePerMToken: 0.2,
    outputPricePerMToken: 0.6,
    costPer100Uses: 0.03,
  },
];

/**
 * Utility for Explorer-tier cost estimation.
 * "Can I afford to run this on 10,000 records?"
 */
export function estimateBatchCost(
  quota: QuotaEntry,
  recordCount: number,
  avgInputTokens = 500,
  avgOutputTokens = 200
): { cost: number; withinQuota: boolean; timeEstimateMinutes: number } {
  const inputCost = (recordCount * avgInputTokens * quota.inputPricePerMToken) / 1_000_000;
  const outputCost = (recordCount * avgOutputTokens * quota.outputPricePerMToken) / 1_000_000;
  const cost = inputCost + outputCost;
  const timeEstimateMinutes = Math.ceil(recordCount / quota.requestsPerMinute);
  const withinQuota = true; // Quota is per-minute, so any count works given enough time

  return { cost: Math.round(cost * 100) / 100, withinQuota, timeEstimateMinutes };
}
