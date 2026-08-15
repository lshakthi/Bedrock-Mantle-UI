import { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Select from '@cloudscape-design/components/select';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { useProficiency } from '@/hooks/useProficiency';
import { mockQuotas, estimateBatchCost } from '@/mocks/quotas';

/**
 * Quotas and Pricing: "Can I afford to run this on 10,000 records?"
 *
 * Explorer: Cost calculator in plain language, no token math
 * Builder: Token pricing with glosses, quota utilization bars
 * Practitioner: Full table, raw numbers
 */
export function QuotasPricingPage() {
  const { tier } = useProficiency();

  if (tier === 'explorer') return <ExplorerView />;
  if (tier === 'builder') return <BuilderView />;
  return <PractitionerView />;
}

// --- Explorer View ---
function ExplorerView() {
  const [recordCount, setRecordCount] = useState('1000');
  const [selectedModel, setSelectedModel] = useState(mockQuotas[0]);

  const estimate = estimateBatchCost(selectedModel, parseInt(recordCount) || 0);

  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Find out how much it costs to run your task. No token math needed."
      >
        Quotas and pricing
      </Header>

      <Container header={<Header variant="h2">Cost calculator</Header>}>
        <SpaceBetween size="m">
          <ColumnLayout columns={2}>
            <FormField
              label="Which model?"
              description="Pick the model you want to use"
            >
              <Select
                selectedOption={{ label: selectedModel.modelName, value: selectedModel.modelId }}
                onChange={({ detail }) => {
                  const found = mockQuotas.find((q) => q.modelId === detail.selectedOption.value);
                  if (found) setSelectedModel(found);
                }}
                options={mockQuotas.map((q) => ({ label: q.modelName, value: q.modelId }))}
              />
            </FormField>

            <FormField
              label="How many items?"
              description="Number of records, documents, or messages to process"
            >
              <Input
                type="number"
                value={recordCount}
                onChange={({ detail }) => setRecordCount(detail.value)}
                inputMode="numeric"
              />
            </FormField>
          </ColumnLayout>

          <Container>
            <ColumnLayout columns={3} variant="text-grid">
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Estimated cost</Box>
                <Box fontSize="heading-xl">${estimate.cost.toFixed(2)}</Box>
                <Box fontSize="body-s" color="text-body-secondary">
                  For {parseInt(recordCount || '0').toLocaleString()} items
                </Box>
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Time to complete</Box>
                <Box fontSize="heading-xl">~{estimate.timeEstimateMinutes} min</Box>
                <Box fontSize="body-s" color="text-body-secondary">
                  At current quota limits
                </Box>
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Cost per 100 items</Box>
                <Box fontSize="heading-xl">${selectedModel.costPer100Uses.toFixed(2)}</Box>
              </SpaceBetween>
            </ColumnLayout>
          </Container>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Model pricing at a glance</Header>}>
        <SpaceBetween size="s">
          {mockQuotas.map((q) => (
            <Box key={q.modelId} padding="s">
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Box fontWeight="bold">{q.modelName}</Box>
                <Box>${q.costPer100Uses.toFixed(2)} per 100 uses</Box>
              </SpaceBetween>
            </Box>
          ))}
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}

// --- Builder View ---
function BuilderView() {
  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Token pricing, quota utilization, and capacity planning."
      >
        Quotas and pricing
      </Header>

      {mockQuotas.map((quota) => (
        <Container
          key={quota.modelId}
          header={
            <Header variant="h2" description={quota.modelId}>
              {quota.modelName}
            </Header>
          }
        >
          <ColumnLayout columns={3} variant="text-grid">
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Input pricing</Box>
              <Box>${quota.inputPricePerMToken} per million tokens</Box>
              <Box fontSize="body-s" color="text-body-secondary">
                Tokens are roughly 0.75 words each
              </Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Output pricing</Box>
              <Box>${quota.outputPricePerMToken} per million tokens</Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Cost per 100 typical uses</Box>
              <Box>${quota.costPer100Uses.toFixed(2)}</Box>
            </SpaceBetween>

            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Request quota</Box>
              <Box>{quota.requestsPerMinute} req/min</Box>
              <QuotaBar current={quota.currentUsageRpm} max={quota.requestsPerMinute} />
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Token quota</Box>
              <Box>{(quota.tokensPerMinute / 1000).toFixed(0)}K tokens/min</Box>
              <QuotaBar current={quota.currentUsageTpm} max={quota.tokensPerMinute} />
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Region</Box>
              <Box>{quota.region}</Box>
            </SpaceBetween>
          </ColumnLayout>
        </Container>
      ))}
    </SpaceBetween>
  );
}

// --- Practitioner View ---
function PractitionerView() {
  return (
    <SpaceBetween size="l">
      <Header variant="h1">Quotas and pricing</Header>

      <Table
        items={mockQuotas}
        columnDefinitions={[
          { id: 'model', header: 'Model', cell: (item) => item.modelName, sortingField: 'modelName' },
          { id: 'modelId', header: 'Model ID', cell: (item) => <Box variant="code" fontSize="body-s">{item.modelId}</Box> },
          { id: 'region', header: 'Region', cell: (item) => item.region },
          { id: 'inputPrice', header: '$/M input', cell: (item) => `$${item.inputPricePerMToken}` },
          { id: 'outputPrice', header: '$/M output', cell: (item) => `$${item.outputPricePerMToken}` },
          { id: 'rpm', header: 'RPM limit', cell: (item) => item.requestsPerMinute },
          { id: 'rpmUsage', header: 'RPM current', cell: (item) => item.currentUsageRpm },
          { id: 'tpm', header: 'TPM limit', cell: (item) => `${(item.tokensPerMinute / 1000).toFixed(0)}K` },
          { id: 'tpmUsage', header: 'TPM current', cell: (item) => `${(item.currentUsageTpm / 1000).toFixed(0)}K` },
          {
            id: 'utilization',
            header: 'Utilization',
            cell: (item) => {
              const pct = Math.round((item.currentUsageRpm / item.requestsPerMinute) * 100);
              return <StatusIndicator type={pct > 80 ? 'warning' : 'success'}>{pct}%</StatusIndicator>;
            },
          },
        ]}
        sortingDisabled={false}
        empty={<Box textAlign="center" padding="xxl"><b>No quota data</b></Box>}
        header={<Header counter={`(${mockQuotas.length})`}>Quotas</Header>}
      />
    </SpaceBetween>
  );
}

// --- Shared quota utilization bar ---
function QuotaBar({ current, max }: { current: number; max: number }) {
  const pct = Math.round((current / max) * 100);
  const color = pct > 80 ? '#d13212' : pct > 50 ? '#ff9900' : '#1d8102';

  return (
    <Box>
      <div
        style={{ width: '100%', height: '8px', background: '#e9ebed', borderRadius: '4px', overflow: 'hidden' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Quota utilization: ${pct}%`}
      >
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px' }} />
      </div>
      <Box fontSize="body-s" color="text-body-secondary">{pct}% used</Box>
    </Box>
  );
}
