/**
 * Mock time-series data for usage/inference dashboards.
 */

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface DashboardMetrics {
  requestVolume: TimeSeriesPoint[];
  latencyP50: TimeSeriesPoint[];
  latencyP99: TimeSeriesPoint[];
  errorRate: TimeSeriesPoint[];
  tokenUsage: TimeSeriesPoint[];
  costDaily: TimeSeriesPoint[];
  modelBreakdown: { modelName: string; requests: number; cost: number; percentage: number }[];
  regionBreakdown: { region: string; requests: number; latencyMs: number }[];
  summary: {
    totalRequests: number;
    totalCost: number;
    avgLatencyMs: number;
    errorRate: number;
    topModel: string;
    costTrend: 'up' | 'down' | 'stable';
    requestTrend: 'up' | 'down' | 'stable';
  };
}

function generateTimeSeries(
  days: number,
  baseValue: number,
  variance: number,
  trend: 'up' | 'down' | 'stable' = 'stable'
): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const now = new Date('2025-06-10');

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    let trendModifier = 0;
    if (trend === 'up') trendModifier = ((days - i) / days) * baseValue * 0.3;
    if (trend === 'down') trendModifier = -((days - i) / days) * baseValue * 0.15;

    const noise = (Math.random() - 0.5) * variance;
    const value = Math.max(0, Math.round(baseValue + trendModifier + noise));

    points.push({
      timestamp: date.toISOString().split('T')[0],
      value,
    });
  }

  return points;
}

export const mockDashboardData: DashboardMetrics = {
  requestVolume: generateTimeSeries(30, 5200, 2000, 'up'),
  latencyP50: generateTimeSeries(30, 850, 200, 'stable'),
  latencyP99: generateTimeSeries(30, 2400, 600, 'stable'),
  errorRate: generateTimeSeries(30, 2.1, 1.5, 'down'),
  tokenUsage: generateTimeSeries(30, 1200000, 400000, 'up'),
  costDaily: generateTimeSeries(30, 42, 15, 'up'),

  modelBreakdown: [
    { modelName: 'Claude Sonnet 4', requests: 89400, cost: 245.30, percentage: 52 },
    { modelName: 'Claude Haiku 3', requests: 45200, cost: 18.90, percentage: 26 },
    { modelName: 'Titan Text Express', requests: 28100, cost: 12.40, percentage: 16 },
    { modelName: 'Mistral Large', requests: 9800, cost: 48.20, percentage: 6 },
  ],

  regionBreakdown: [
    { region: 'us-east-1', requests: 98200, latencyMs: 820 },
    { region: 'us-west-2', requests: 52400, latencyMs: 910 },
    { region: 'eu-west-1', requests: 18300, latencyMs: 1050 },
    { region: 'ap-northeast-1', requests: 3600, latencyMs: 1180 },
  ],

  summary: {
    totalRequests: 172500,
    totalCost: 324.80,
    avgLatencyMs: 890,
    errorRate: 1.8,
    topModel: 'Claude Sonnet 4',
    costTrend: 'up',
    requestTrend: 'up',
  },
};
