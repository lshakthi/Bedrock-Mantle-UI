import { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import Select from '@cloudscape-design/components/select';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { useProficiency } from '@/hooks/useProficiency';
import { mockDashboardData } from '@/mocks/dashboard';
import type { TimeSeriesPoint } from '@/mocks/dashboard';

/**
 * Usage / Inference Dashboard with time-series charts.
 *
 * Explorer: Simple health summary, cost in dollars, trends as "up/down/stable"
 * Builder: Charts with annotations, model breakdown, region performance
 * Practitioner: Full metrics grid, all charts, raw data tables
 */
export function UsageDashboardPage() {
  const { tier } = useProficiency();

  if (tier === 'explorer') return <ExplorerDashboard />;
  if (tier === 'builder') return <BuilderDashboard />;
  return <PractitionerDashboard />;
}

// ============================================================
// Shared: Simple SVG chart component (no external dependency)
// ============================================================
function MiniChart({ data, color = '#0972d3', height = 60, label }: {
  data: TimeSeriesPoint[];
  color?: string;
  height?: number;
  label: string;
}) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const width = 300;
  const padding = 4;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = padding + (1 - (v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div role="img" aria-label={`${label} chart showing ${values.length} data points`}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Gradient fill under the line */}
        <defs>
          <linearGradient id={`grad-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
          fill={`url(#grad-${label.replace(/\s/g, '')})`}
        />
      </svg>
    </div>
  );
}

function TrendBadge({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <Badge color="red">↑ Increasing</Badge>;
  if (trend === 'down') return <Badge color="green">↓ Decreasing</Badge>;
  return <Badge color="grey">→ Stable</Badge>;
}

// ============================================================
// EXPLORER: Simple health view
// ============================================================
function ExplorerDashboard() {
  const { summary } = mockDashboardData;

  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="How your AI usage is going this month. Costs, performance, and anything that needs attention."
      >
        Usage insights
      </Header>

      <Container header={<Header variant="h2">This month at a glance</Header>}>
        <ColumnLayout columns={3} variant="text-grid">
          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Total cost</Box>
            <Box fontSize="heading-xl">${summary.totalCost.toFixed(2)}</Box>
            <TrendBadge trend={summary.costTrend} />
          </SpaceBetween>
          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Requests made</Box>
            <Box fontSize="heading-xl">{summary.totalRequests.toLocaleString()}</Box>
            <TrendBadge trend={summary.requestTrend} />
          </SpaceBetween>
          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Error rate</Box>
            <Box fontSize="heading-xl">{summary.errorRate}%</Box>
            <StatusIndicator type={summary.errorRate < 3 ? 'success' : 'warning'}>
              {summary.errorRate < 3 ? 'Normal' : 'Above average'}
            </StatusIndicator>
          </SpaceBetween>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">What you are using most</Header>}>
        <SpaceBetween size="s">
          {mockDashboardData.modelBreakdown.map((m) => (
            <Box key={m.modelName} padding="xs">
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Box fontWeight="bold" display="inline">{m.modelName}</Box>
                <Box display="inline">{m.percentage}% of requests</Box>
                <Box display="inline" color="text-body-secondary">${m.cost.toFixed(2)} this month</Box>
              </SpaceBetween>
              <div
                style={{
                  height: '8px',
                  background: '#e9ebed',
                  borderRadius: '4px',
                  marginTop: '4px',
                  overflow: 'hidden',
                }}
                role="progressbar"
                aria-valuenow={m.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${m.modelName}: ${m.percentage}% usage`}
              >
                <div style={{ width: `${m.percentage}%`, height: '100%', background: '#0972d3', borderRadius: '4px' }} />
              </div>
            </Box>
          ))}
        </SpaceBetween>
      </Container>

      <ExpandableSection headerText="Show detailed charts">
        <SpaceBetween size="m">
          <Box variant="awsui-key-label">Daily cost trend</Box>
          <MiniChart data={mockDashboardData.costDaily} color="#0972d3" height={80} label="Daily cost" />
          <Box variant="awsui-key-label">Request volume trend</Box>
          <MiniChart data={mockDashboardData.requestVolume} color="#037f0c" height={80} label="Request volume" />
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}

// ============================================================
// BUILDER: Charts with context, model/region breakdown
// ============================================================
function BuilderDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const { summary } = mockDashboardData;

  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Inference usage, latency, costs, and capacity. Charts show the last 30 days."
      >
        Usage insights
      </Header>

      <SpaceBetween size="xs" direction="horizontal" alignItems="center">
        <Select
          selectedOption={{ value: timeRange, label: timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days' }}
          onChange={({ detail }) => setTimeRange(detail.selectedOption.value || '30d')}
          options={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
          ]}
        />
      </SpaceBetween>

      {/* Key metrics */}
      <ColumnLayout columns={4}>
        <Container>
          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Total requests</Box>
            <Box fontSize="heading-l">{summary.totalRequests.toLocaleString()}</Box>
            <TrendBadge trend={summary.requestTrend} />
          </SpaceBetween>
        </Container>
        <Container>
          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Total cost</Box>
            <Box fontSize="heading-l">${summary.totalCost.toFixed(2)}</Box>
            <TrendBadge trend={summary.costTrend} />
          </SpaceBetween>
        </Container>
        <Container>
          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Avg latency</Box>
            <Box fontSize="heading-l">{summary.avgLatencyMs}ms</Box>
            <Box fontSize="body-s" color="text-body-secondary">P50. Time from request to first token.</Box>
          </SpaceBetween>
        </Container>
        <Container>
          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Error rate</Box>
            <Box fontSize="heading-l">{summary.errorRate}%</Box>
            <StatusIndicator type={summary.errorRate < 3 ? 'success' : 'warning'}>
              {summary.errorRate < 3 ? 'Healthy' : 'Elevated'}
            </StatusIndicator>
          </SpaceBetween>
        </Container>
      </ColumnLayout>

      {/* Charts */}
      <ColumnLayout columns={2}>
        <Container header={<Header variant="h3">Request volume</Header>}>
          <MiniChart data={mockDashboardData.requestVolume} color="#0972d3" height={100} label="Request volume" />
          <Box fontSize="body-s" color="text-body-secondary" margin={{ top: 'xs' }}>
            Daily request count across all models
          </Box>
        </Container>
        <Container header={<Header variant="h3">Daily cost ($)</Header>}>
          <MiniChart data={mockDashboardData.costDaily} color="#d13212" height={100} label="Daily cost" />
          <Box fontSize="body-s" color="text-body-secondary" margin={{ top: 'xs' }}>
            Total inference spend per day
          </Box>
        </Container>
        <Container header={<Header variant="h3">Latency (P50)</Header>}>
          <MiniChart data={mockDashboardData.latencyP50} color="#ff9900" height={100} label="P50 latency" />
          <Box fontSize="body-s" color="text-body-secondary" margin={{ top: 'xs' }}>
            Median response time in milliseconds
          </Box>
        </Container>
        <Container header={<Header variant="h3">Error rate (%)</Header>}>
          <MiniChart data={mockDashboardData.errorRate} color="#d13212" height={100} label="Error rate" />
          <Box fontSize="body-s" color="text-body-secondary" margin={{ top: 'xs' }}>
            Percentage of requests returning errors
          </Box>
        </Container>
      </ColumnLayout>

      {/* Model breakdown */}
      <Container header={<Header variant="h3">Model breakdown</Header>}>
        <Table
          items={mockDashboardData.modelBreakdown}
          columnDefinitions={[
            { id: 'model', header: 'Model', cell: (item) => item.modelName },
            { id: 'requests', header: 'Requests', cell: (item) => item.requests.toLocaleString() },
            { id: 'cost', header: 'Cost', cell: (item) => `$${item.cost.toFixed(2)}` },
            { id: 'share', header: 'Share', cell: (item) => `${item.percentage}%` },
          ]}
          sortingDisabled={false}
          empty={<Box>No data</Box>}
        />
      </Container>

      {/* Region breakdown */}
      <Container header={<Header variant="h3">Region performance</Header>}>
        <Table
          items={mockDashboardData.regionBreakdown}
          columnDefinitions={[
            { id: 'region', header: 'Region', cell: (item) => item.region },
            { id: 'requests', header: 'Requests', cell: (item) => item.requests.toLocaleString() },
            { id: 'latency', header: 'Avg latency', cell: (item) => `${item.latencyMs}ms` },
          ]}
          sortingDisabled={false}
          empty={<Box>No data</Box>}
        />
      </Container>
    </SpaceBetween>
  );
}


// ============================================================
// PRACTITIONER: Full metrics grid, all charts, raw tables
// ============================================================
function PractitionerDashboard() {
  const { summary } = mockDashboardData;

  return (
    <SpaceBetween size="l">
      <Header variant="h1">Usage insights</Header>

      {/* Summary row */}
      <ColumnLayout columns={6}>
        <MetricCard label="Requests" value={summary.totalRequests.toLocaleString()} trend={summary.requestTrend} />
        <MetricCard label="Cost" value={`$${summary.totalCost.toFixed(2)}`} trend={summary.costTrend} />
        <MetricCard label="P50 latency" value={`${summary.avgLatencyMs}ms`} />
        <MetricCard label="Error rate" value={`${summary.errorRate}%`} status={summary.errorRate < 3 ? 'success' : 'warning'} />
        <MetricCard label="Top model" value={summary.topModel} />
        <MetricCard label="Token usage" value={`${(mockDashboardData.tokenUsage[mockDashboardData.tokenUsage.length - 1].value / 1000000).toFixed(1)}M/day`} />
      </ColumnLayout>

      {/* All charts */}
      <ColumnLayout columns={3}>
        <Container header={<Header variant="h3">Requests/day</Header>}>
          <MiniChart data={mockDashboardData.requestVolume} height={80} label="Requests per day" />
        </Container>
        <Container header={<Header variant="h3">Cost/day</Header>}>
          <MiniChart data={mockDashboardData.costDaily} color="#d13212" height={80} label="Cost per day" />
        </Container>
        <Container header={<Header variant="h3">Tokens/day</Header>}>
          <MiniChart data={mockDashboardData.tokenUsage} color="#037f0c" height={80} label="Tokens per day" />
        </Container>
        <Container header={<Header variant="h3">P50 latency</Header>}>
          <MiniChart data={mockDashboardData.latencyP50} color="#ff9900" height={80} label="P50 latency" />
        </Container>
        <Container header={<Header variant="h3">P99 latency</Header>}>
          <MiniChart data={mockDashboardData.latencyP99} color="#ff9900" height={80} label="P99 latency" />
        </Container>
        <Container header={<Header variant="h3">Error %</Header>}>
          <MiniChart data={mockDashboardData.errorRate} color="#d13212" height={80} label="Error rate" />
        </Container>
      </ColumnLayout>

      {/* Tables */}
      <ColumnLayout columns={2}>
        <Container header={<Header variant="h3">By model</Header>}>
          <Table
            items={mockDashboardData.modelBreakdown}
            columnDefinitions={[
              { id: 'model', header: 'Model', cell: (item) => item.modelName, sortingField: 'modelName' },
              { id: 'reqs', header: 'Requests', cell: (item) => item.requests.toLocaleString() },
              { id: 'cost', header: 'Cost', cell: (item) => `$${item.cost.toFixed(2)}` },
              { id: 'pct', header: '%', cell: (item) => `${item.percentage}%` },
            ]}
            sortingDisabled={false}
            empty={<Box>No data</Box>}
          />
        </Container>
        <Container header={<Header variant="h3">By region</Header>}>
          <Table
            items={mockDashboardData.regionBreakdown}
            columnDefinitions={[
              { id: 'region', header: 'Region', cell: (item) => item.region, sortingField: 'region' },
              { id: 'reqs', header: 'Requests', cell: (item) => item.requests.toLocaleString() },
              { id: 'latency', header: 'Latency', cell: (item) => `${item.latencyMs}ms` },
            ]}
            sortingDisabled={false}
            empty={<Box>No data</Box>}
          />
        </Container>
      </ColumnLayout>
    </SpaceBetween>
  );
}

function MetricCard({ label, value, trend, status }: {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'success' | 'warning' | 'error';
}) {
  return (
    <Container>
      <SpaceBetween size="xxxs">
        <Box fontSize="body-s" color="text-body-secondary">{label}</Box>
        <Box fontSize="heading-m">{value}</Box>
        {trend && <TrendBadge trend={trend} />}
        {status && <StatusIndicator type={status}>{status === 'success' ? 'OK' : 'Alert'}</StatusIndicator>}
      </SpaceBetween>
    </Container>
  );
}
