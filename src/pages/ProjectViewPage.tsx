import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Badge from '@cloudscape-design/components/badge';
import { useProficiency } from '@/hooks/useProficiency';
import { mockProjects } from '@/mocks/projects';
import type { Project } from '@/mocks/projects';

/**
 * Project View: Evaluation and usage interpretation.
 *
 * Explorer: Health status cards with plain-language what-to-do-next
 * Builder: Metrics visible with context, errors explained
 * Practitioner: Full metrics table, raw numbers, sortable
 */
export function ProjectViewPage() {
  const { tier } = useProficiency();

  if (tier === 'explorer') return <ExplorerView />;
  if (tier === 'builder') return <BuilderView />;
  return <PractitionerView />;
}

function HealthBadge({ status }: { status: Project['healthStatus'] }) {
  if (status === 'healthy') return <StatusIndicator type="success">Healthy</StatusIndicator>;
  if (status === 'needs-attention') return <StatusIndicator type="warning">Needs attention</StatusIndicator>;
  return <StatusIndicator type="error">Degraded</StatusIndicator>;
}

// --- Explorer View ---
function ExplorerView() {
  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Your active projects and how they are performing."
      >
        Projects
      </Header>

      {mockProjects.map((project) => (
        <Container
          key={project.id}
          header={
            <Header variant="h2" info={<HealthBadge status={project.healthStatus} />}>
              {project.name}
            </Header>
          }
        >
          <SpaceBetween size="m">
            <Box>{project.description}</Box>

            <ColumnLayout columns={2}>
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Status</Box>
                <Box>{project.healthSummary}</Box>
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Cost this month</Box>
                <Box>${project.metrics.costLast30Days.toFixed(2)}</Box>
              </SpaceBetween>
            </ColumnLayout>

            <Box variant="awsui-key-label">What to do next</Box>
            <Box>{project.nextAction}</Box>

            <ExpandableSection headerText="Show details" variant="footer">
              <ColumnLayout columns={3} variant="text-grid">
                <div>
                  <Box variant="awsui-key-label">Model</Box>
                  <Box>{project.modelName}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Total requests</Box>
                  <Box>{project.metrics.totalRequests.toLocaleString()}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Success rate</Box>
                  <Box>{(project.metrics.successRate * 100).toFixed(1)}%</Box>
                </div>
              </ColumnLayout>
            </ExpandableSection>
          </SpaceBetween>
        </Container>
      ))}

      {mockProjects.length === 0 && (
        <Box textAlign="center" padding="xxl">
          <SpaceBetween size="s">
            <b>No projects yet</b>
            <Box>Create your first project to start using AI models.</Box>
          </SpaceBetween>
        </Box>
      )}
    </SpaceBetween>
  );
}

// --- Builder View ---
function BuilderView() {
  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Project metrics with context. Errors include explanations and next steps."
      >
        Projects
      </Header>

      {mockProjects.map((project) => (
        <Container
          key={project.id}
          header={
            <Header
              variant="h2"
              description={
                <Box fontSize="body-s" color="text-body-secondary">
                  Model: {project.modelId}
                </Box>
              }
              info={<HealthBadge status={project.healthStatus} />}
            >
              {project.name}
            </Header>
          }
        >
          <SpaceBetween size="m">
            <ColumnLayout columns={4} variant="text-grid">
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Total requests</Box>
                <Box fontSize="heading-l">{project.metrics.totalRequests.toLocaleString()}</Box>
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Success rate</Box>
                <Box fontSize="heading-l">{(project.metrics.successRate * 100).toFixed(1)}%</Box>
                <Box fontSize="body-s" color="text-body-secondary">
                  {project.metrics.successRate >= 0.99 ? 'Excellent' : project.metrics.successRate >= 0.95 ? 'Good, some errors worth reviewing' : 'Below target, action recommended'}
                </Box>
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Avg latency</Box>
                <Box fontSize="heading-l">{project.metrics.averageLatencyMs}ms</Box>
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Cost (30 days)</Box>
                <Box fontSize="heading-l">${project.metrics.costLast30Days.toFixed(2)}</Box>
                <Badge color={project.metrics.costTrend === 'up' ? 'red' : project.metrics.costTrend === 'down' ? 'green' : 'grey'}>
                  {project.metrics.costTrend}
                </Badge>
              </SpaceBetween>
            </ColumnLayout>

            {project.metrics.topErrors.length > 0 && (
              <ExpandableSection headerText={`Top errors (${project.metrics.topErrors.length})`}>
                <SpaceBetween size="s">
                  {project.metrics.topErrors.map((err) => (
                    <Box key={err.code}>
                      <Badge>{err.code}</Badge> x{err.count} — {err.friendlyMessage}
                    </Box>
                  ))}
                </SpaceBetween>
              </ExpandableSection>
            )}

            <Box variant="awsui-key-label">Recommendation</Box>
            <Box>{project.nextAction}</Box>
          </SpaceBetween>
        </Container>
      ))}
    </SpaceBetween>
  );
}

// --- Practitioner View ---
function PractitionerView() {
  return (
    <SpaceBetween size="l">
      <Header variant="h1">Projects</Header>

      <Table
        items={mockProjects}
        columnDefinitions={[
          { id: 'name', header: 'Project', cell: (item) => item.name, sortingField: 'name' },
          { id: 'model', header: 'Model', cell: (item) => item.modelId },
          { id: 'requests', header: 'Requests', cell: (item) => item.metrics.totalRequests.toLocaleString(), sortingField: 'metrics.totalRequests' },
          { id: 'success', header: 'Success %', cell: (item) => `${(item.metrics.successRate * 100).toFixed(1)}%` },
          { id: 'latency', header: 'Avg latency', cell: (item) => `${item.metrics.averageLatencyMs}ms` },
          { id: 'cost', header: 'Cost (30d)', cell: (item) => `$${item.metrics.costLast30Days.toFixed(2)}` },
          { id: 'trend', header: 'Trend', cell: (item) => item.metrics.costTrend },
          { id: 'errors', header: 'Top error', cell: (item) => item.metrics.topErrors[0]?.code ?? '—' },
          { id: 'lastActivity', header: 'Last active', cell: (item) => new Date(item.lastActivity).toLocaleDateString() },
        ]}
        sortingDisabled={false}
        empty={<Box textAlign="center" padding="xxl"><b>No projects</b></Box>}
        header={<Header counter={`(${mockProjects.length})`}>All projects</Header>}
      />
    </SpaceBetween>
  );
}
