import { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Cards from '@cloudscape-design/components/cards';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import TextFilter from '@cloudscape-design/components/text-filter';
import { useProficiency } from '@/hooks/useProficiency';
import { mockModels } from '@/mocks/models';
import type { ModelSpec } from '@/mocks/models';

/**
 * Model Catalog: Three distinct render modes.
 *
 * Explorer: Task-first cards, cost in $/100 uses, model chosen for them
 * Builder: Model IDs visible with glosses, specs grouped and prioritized
 * Practitioner: Full density sortable table, raw specs, keyboard nav
 */
export function ModelCatalogPage() {
  const { tier } = useProficiency();
  const [filterText, setFilterText] = useState('');

  const filteredModels = mockModels.filter((m) => {
    const search = filterText.toLowerCase();
    return (
      m.name.toLowerCase().includes(search) ||
      m.taskDescription.toLowerCase().includes(search) ||
      m.bestFor.some((b) => b.toLowerCase().includes(search)) ||
      m.provider.toLowerCase().includes(search)
    );
  });

  if (tier === 'explorer') return <ExplorerView models={filteredModels} filterText={filterText} onFilterChange={setFilterText} />;
  if (tier === 'builder') return <BuilderView models={filteredModels} filterText={filterText} onFilterChange={setFilterText} />;
  return <PractitionerView models={filteredModels} filterText={filterText} onFilterChange={setFilterText} />;
}

// --- Explorer View ---
function ExplorerView({ models, filterText, onFilterChange }: { models: ModelSpec[]; filterText: string; onFilterChange: (v: string) => void }) {
  const { recordSignal } = useProficiency();

  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Choose a model based on what you want to do. We will recommend the best fit."
      >
        Model catalog
      </Header>

      <TextFilter
        filteringText={filterText}
        filteringPlaceholder="What do you want to do? (e.g., summarize, extract data, write code)"
        onChange={({ detail }) => onFilterChange(detail.filteringText)}
      />

      <Cards
        items={models}
        cardDefinition={{
          header: (item) => item.name,
          sections: [
            {
              id: 'task',
              header: 'Good for',
              content: (item) => item.taskDescription,
            },
            {
              id: 'strengths',
              header: 'Why this model',
              content: (item) => item.strengthsSummary,
            },
            {
              id: 'cost',
              header: 'Estimated cost',
              content: (item) => `$${item.costPer100Uses.toFixed(2)} per 100 uses`,
            },
            {
              id: 'tags',
              content: (item) => (
                <SpaceBetween size="xs" direction="horizontal">
                  {item.bestFor.map((tag) => (
                    <Badge key={tag} color="blue">{tag}</Badge>
                  ))}
                </SpaceBetween>
              ),
            },
            {
              id: 'details',
              content: (item) => (
                <ExpandableSection
                  headerText="Show technical details"
                  variant="footer"
                  onChange={() => recordSignal('glossaryExpansions')}
                >
                  <ColumnLayout columns={2}>
                    <div>
                      <Box variant="awsui-key-label">Model ID</Box>
                      <Box>{item.id}</Box>
                    </div>
                    <div>
                      <Box variant="awsui-key-label">Context window</Box>
                      <Box>{(item.contextWindow / 1000).toFixed(0)}K tokens</Box>
                    </div>
                    <div>
                      <Box variant="awsui-key-label">Provider</Box>
                      <Box>{item.provider}</Box>
                    </div>
                    <div>
                      <Box variant="awsui-key-label">Regions</Box>
                      <Box>{item.regions.join(', ')}</Box>
                    </div>
                  </ColumnLayout>
                </ExpandableSection>
              ),
            },
          ],
        }}
        empty={
          <Box textAlign="center" padding="xxl">
            <SpaceBetween size="s">
              <b>No models match your search</b>
              <Box>Try describing what you want to do in different words.</Box>
            </SpaceBetween>
          </Box>
        }
      />
    </SpaceBetween>
  );
}


// --- Builder View ---
function BuilderView({ models, filterText, onFilterChange }: { models: ModelSpec[]; filterText: string; onFilterChange: (v: string) => void }) {
  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Compare models by capability, pricing, and availability. Model IDs and endpoints included."
      >
        Model catalog
      </Header>

      <TextFilter
        filteringText={filterText}
        filteringPlaceholder="Search by model name, provider, or capability"
        onChange={({ detail }) => onFilterChange(detail.filteringText)}
      />

      <SpaceBetween size="m">
        {models.map((model) => (
          <Container
            key={model.id}
            header={
              <Header
                variant="h2"
                description={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Box color="text-body-secondary" fontSize="body-s">
                      {model.id}
                    </Box>
                    <Box color="text-body-secondary" fontSize="body-s">
                      (This is the model ID you use in API calls)
                    </Box>
                  </SpaceBetween>
                }
              >
                {model.name} <Badge>{model.provider}</Badge>
              </Header>
            }
          >
            <ColumnLayout columns={3} variant="text-grid">
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Context window</Box>
                <Box>{(model.contextWindow / 1000).toFixed(0)}K tokens</Box>
                <Box color="text-body-secondary" fontSize="body-s">
                  How much text the model can read at once
                </Box>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Pricing</Box>
                <Box>
                  ${model.inputPricePerMToken}/M input, ${model.outputPricePerMToken}/M output
                </Box>
                <Box color="text-body-secondary" fontSize="body-s">
                  Per million tokens. ~750 words per 1K tokens.
                </Box>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Quotas</Box>
                <Box>
                  {model.quotas.requestsPerMinute} req/min, {(model.quotas.tokensPerMinute / 1000).toFixed(0)}K tokens/min
                </Box>
                <Box color="text-body-secondary" fontSize="body-s">
                  Maximum throughput before throttling
                </Box>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Regions</Box>
                <Box>{model.regions.join(', ')}</Box>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Service tiers</Box>
                <SpaceBetween size="xs" direction="horizontal">
                  {model.serviceTiers.map((t) => (
                    <Badge key={t} color={t === 'priority' ? 'red' : t === 'standard' ? 'blue' : 'grey'}>
                      {t}
                    </Badge>
                  ))}
                </SpaceBetween>
                <Box color="text-body-secondary" fontSize="body-s">
                  Priority = fastest/costliest. Flexible = cheapest/may queue.
                </Box>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Modalities</Box>
                <Box>{model.modalities.join(', ')}</Box>
              </SpaceBetween>
            </ColumnLayout>
          </Container>
        ))}
      </SpaceBetween>

      {models.length === 0 && (
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="info">No models match your filter.</StatusIndicator>
        </Box>
      )}
    </SpaceBetween>
  );
}

// --- Practitioner View ---
function PractitionerView({ models, filterText, onFilterChange }: { models: ModelSpec[]; filterText: string; onFilterChange: (v: string) => void }) {
  return (
    <SpaceBetween size="l">
      <Header variant="h1">Model catalog</Header>

      <Table
        items={models}
        filter={
          <TextFilter
            filteringText={filterText}
            filteringPlaceholder="Filter models"
            onChange={({ detail }) => onFilterChange(detail.filteringText)}
          />
        }
        columnDefinitions={[
          {
            id: 'name',
            header: 'Model',
            cell: (item) => item.name,
            sortingField: 'name',
          },
          {
            id: 'id',
            header: 'Model ID',
            cell: (item) => <Box variant="code" fontSize="body-s">{item.id}</Box>,
          },
          {
            id: 'provider',
            header: 'Provider',
            cell: (item) => item.provider,
            sortingField: 'provider',
          },
          {
            id: 'context',
            header: 'Context',
            cell: (item) => `${(item.contextWindow / 1000).toFixed(0)}K`,
            sortingField: 'contextWindow',
          },
          {
            id: 'maxOutput',
            header: 'Max output',
            cell: (item) => `${(item.maxOutput / 1000).toFixed(1)}K`,
            sortingField: 'maxOutput',
          },
          {
            id: 'inputPrice',
            header: '$/M input',
            cell: (item) => `$${item.inputPricePerMToken}`,
            sortingField: 'inputPricePerMToken',
          },
          {
            id: 'outputPrice',
            header: '$/M output',
            cell: (item) => `$${item.outputPricePerMToken}`,
            sortingField: 'outputPricePerMToken',
          },
          {
            id: 'rpm',
            header: 'RPM',
            cell: (item) => item.quotas.requestsPerMinute,
          },
          {
            id: 'tpm',
            header: 'TPM',
            cell: (item) => `${(item.quotas.tokensPerMinute / 1000).toFixed(0)}K`,
          },
          {
            id: 'modalities',
            header: 'Modalities',
            cell: (item) => item.modalities.join(', '),
          },
          {
            id: 'regions',
            header: 'Regions',
            cell: (item) => item.regions.length,
          },
          {
            id: 'tiers',
            header: 'Tiers',
            cell: (item) => item.serviceTiers.join(', '),
          },
        ]}
        sortingDisabled={false}
        empty={
          <Box textAlign="center" padding="xxl">
            <b>No models found</b>
          </Box>
        }
        header={<Header counter={`(${models.length})`}>Models</Header>}
      />
    </SpaceBetween>
  );
}
