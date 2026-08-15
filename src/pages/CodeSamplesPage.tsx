import { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Tabs from '@cloudscape-design/components/tabs';
import Toggle from '@cloudscape-design/components/toggle';
import Badge from '@cloudscape-design/components/badge';
import { useProficiency } from '@/hooks/useProficiency';
import { mockCodeSamples } from '@/mocks/codeSamples';
import type { CodeSample } from '@/mocks/codeSamples';

/**
 * Code Samples: Per-line annotation at lower tiers, raw at Practitioner.
 *
 * Explorer: Code hidden by default. "Show me the code" toggle. Task-first language.
 * Builder: Code visible with per-block annotations.
 * Practitioner: Raw code, copy button, no annotations.
 */
export function CodeSamplesPage() {
  const { tier } = useProficiency();

  if (tier === 'explorer') return <ExplorerView />;
  if (tier === 'builder') return <BuilderView />;
  return <PractitionerView />;
}

// --- Explorer View ---
function ExplorerView() {
  const [showCode, setShowCode] = useState(false);
  const { recordSignal } = useProficiency();

  const handleToggle = (checked: boolean) => {
    setShowCode(checked);
    if (checked) recordSignal('codePanelOpens');
  };

  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Ready-to-use examples for common tasks. No coding experience required to understand what they do."
      >
        Code samples
      </Header>

      <Toggle
        checked={showCode}
        onChange={({ detail }) => handleToggle(detail.checked)}
        ariaLabel="Show code examples"
      >
        Show me the code
      </Toggle>

      {mockCodeSamples.map((sample) => (
        <Container key={sample.id} header={<Header variant="h2">{sample.taskDescription}</Header>}>
          <SpaceBetween size="s">
            <Box>
              <Badge>{sample.api.replace(/-/g, ' ')}</Badge>
            </Box>
            <Box>{sample.description}</Box>

            {showCode && (
              <AnnotatedCode sample={sample} showTier="explorer" />
            )}
          </SpaceBetween>
        </Container>
      ))}
    </SpaceBetween>
  );
}

// --- Builder View ---
function BuilderView() {
  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Code examples with annotations explaining each section. Copy and adapt for your project."
      >
        Code samples
      </Header>

      <Tabs
        tabs={mockCodeSamples.map((sample) => ({
          id: sample.id,
          label: sample.title,
          content: (
            <Container header={<Header variant="h3">{sample.description}</Header>}>
              <AnnotatedCode sample={sample} showTier="builder" />
            </Container>
          ),
        }))}
      />
    </SpaceBetween>
  );
}

// --- Practitioner View ---
function PractitionerView() {
  return (
    <SpaceBetween size="l">
      <Header variant="h1">Code samples</Header>

      <Tabs
        tabs={mockCodeSamples.map((sample) => ({
          id: sample.id,
          label: sample.title,
          content: (
            <Container header={<Header variant="h3">{sample.title}</Header>}>
              <Box>
                <pre
                  style={{
                    background: '#1a1a2e',
                    color: '#e0e0e0',
                    padding: '16px',
                    borderRadius: '8px',
                    overflow: 'auto',
                    fontSize: '13px',
                    lineHeight: '1.5',
                  }}
                >
                  <code>{sample.code}</code>
                </pre>
              </Box>
            </Container>
          ),
        }))}
      />
    </SpaceBetween>
  );
}

// --- Shared Annotated Code Component ---
function AnnotatedCode({ sample, showTier }: { sample: CodeSample; showTier: 'explorer' | 'builder' }) {
  const lines = sample.code.split('\n');
  const relevantAnnotations = sample.annotations.filter(
    (a) => a.tier === showTier || (showTier === 'builder')
  );

  return (
    <Box>
      <pre
        style={{
          background: '#1a1a2e',
          color: '#e0e0e0',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '13px',
          lineHeight: '1.8',
        }}
        role="region"
        aria-label={`Code sample: ${sample.title}`}
      >
        <code>
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const annotation = relevantAnnotations.find((a) => a.line === lineNum);
            return (
              <span key={idx}>
                {line}
                {annotation && (
                  <span
                    style={{
                      color: '#7ecfff',
                      fontStyle: 'italic',
                      marginLeft: '16px',
                      fontSize: '12px',
                    }}
                    role="note"
                  >
                    ← {annotation.text}
                  </span>
                )}
                {'\n'}
              </span>
            );
          })}
        </code>
      </pre>
    </Box>
  );
}
