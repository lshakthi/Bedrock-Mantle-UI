import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Link from '@cloudscape-design/components/link';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { useProficiency } from '@/hooks/useProficiency';
import { mockErrors } from '@/mocks/errors';

/**
 * Errors: Cause plus one concrete next step.
 *
 * Explorer: Plain-language what happened + what to do. No error codes unless expanded.
 * Builder: Error code, cause, technical detail, actionable next step.
 * Practitioner: Full table with raw messages, timestamps, sortable.
 */
export function ErrorsPage() {
  const { tier } = useProficiency();

  if (tier === 'explorer') return <ExplorerView />;
  if (tier === 'builder') return <BuilderView />;
  return <PractitionerView />;
}

// --- Explorer View ---
function ExplorerView() {
  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Recent issues and what to do about them. Each item tells you what happened and how to fix it."
      >
        Errors
      </Header>

      {mockErrors.length === 0 ? (
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="success">No recent errors. Everything is running smoothly.</StatusIndicator>
        </Box>
      ) : (
        mockErrors.map((err) => (
          <Container
            key={err.id}
            header={<Header variant="h3">{err.friendlyMessage}</Header>}
          >
            <SpaceBetween size="s">
              <Box>
                <Box variant="awsui-key-label">Why this happened</Box>
                <Box>{err.cause}</Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">What to do</Box>
                <Box>{err.nextStep}</Box>
              </Box>
              <Box fontSize="body-s" color="text-body-secondary">
                {new Date(err.timestamp).toLocaleString()}
              </Box>
              <ExpandableSection headerText="Show technical details" variant="footer">
                <ColumnLayout columns={2}>
                  <div>
                    <Box variant="awsui-key-label">Error code</Box>
                    <Box variant="code">{err.code}</Box>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">Raw message</Box>
                    <Box variant="code" fontSize="body-s">{err.rawMessage}</Box>
                  </div>
                </ColumnLayout>
              </ExpandableSection>
            </SpaceBetween>
          </Container>
        ))
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
        description="Errors with technical context and actionable resolution steps."
      >
        Errors
      </Header>

      {mockErrors.map((err) => (
        <Container
          key={err.id}
          header={
            <Header variant="h3">
              <Box variant="code" display="inline">{err.code}</Box>
              {' — '}
              {err.friendlyMessage}
            </Header>
          }
        >
          <ColumnLayout columns={2} variant="text-grid">
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Technical detail</Box>
              <Box>{err.technicalDetail}</Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Cause</Box>
              <Box>{err.cause}</Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Next step</Box>
              <Box>{err.nextStep}</Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Documentation</Box>
              <Link external href={err.relatedDocs}>View docs</Link>
            </SpaceBetween>
          </ColumnLayout>
          <Box margin={{ top: 's' }} fontSize="body-s" color="text-body-secondary">
            {new Date(err.timestamp).toLocaleString()}
          </Box>
        </Container>
      ))}
    </SpaceBetween>
  );
}

// --- Practitioner View ---
function PractitionerView() {
  return (
    <SpaceBetween size="l">
      <Header variant="h1">Errors</Header>

      <Table
        items={mockErrors}
        columnDefinitions={[
          { id: 'timestamp', header: 'Time', cell: (item) => new Date(item.timestamp).toLocaleString(), sortingField: 'timestamp' },
          { id: 'code', header: 'Error code', cell: (item) => <Box variant="code">{item.code}</Box>, sortingField: 'code' },
          { id: 'message', header: 'Message', cell: (item) => item.rawMessage },
          { id: 'cause', header: 'Cause', cell: (item) => item.cause },
          { id: 'nextStep', header: 'Action', cell: (item) => item.nextStep },
          { id: 'docs', header: 'Docs', cell: (item) => <Link external href={item.relatedDocs}>Link</Link> },
        ]}
        sortingDisabled={false}
        empty={<Box textAlign="center" padding="xxl"><StatusIndicator type="success">No errors</StatusIndicator></Box>}
        header={<Header counter={`(${mockErrors.length})`}>Recent errors</Header>}
      />
    </SpaceBetween>
  );
}
