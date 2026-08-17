import { useState, useCallback } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Textarea from '@cloudscape-design/components/textarea';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import Input from '@cloudscape-design/components/input';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Tabs from '@cloudscape-design/components/tabs';
import Badge from '@cloudscape-design/components/badge';
import Alert from '@cloudscape-design/components/alert';
import Cards from '@cloudscape-design/components/cards';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { useProficiency } from '@/hooks/useProficiency';
import { mockModels } from '@/mocks/models';
import {
  defaultConfigs,
  promptTemplates,
  simulateResponse,
} from '@/mocks/playground';
import type { PlaygroundMessage, PlaygroundConfig } from '@/mocks/playground';

/**
 * Prompt Playground: Test models, optimize prompts, see results.
 *
 * Explorer: Pick a template, type your text, hit run. Sensible defaults, no config needed.
 * Builder: Full config visible with glosses. Compare outputs. Token/cost info shown.
 * Practitioner: Raw parameter control, API format selection, response metadata, keyboard-driven.
 */
export function PlaygroundPage() {
  const { tier } = useProficiency();

  if (tier === 'explorer') return <ExplorerPlayground />;
  if (tier === 'builder') return <BuilderPlayground />;
  return <PractitionerPlayground />;
}

// ============================================================
// EXPLORER: Template-first, sensible defaults, minimal config
// ============================================================
function ExplorerPlayground() {
  const [selectedTemplate, setSelectedTemplate] = useState(promptTemplates[0]);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const config = defaultConfigs.explorer;

  const handleRun = useCallback(async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);

    const userMsg: PlaygroundMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const configWithTemplate = { ...config, systemPrompt: selectedTemplate.systemPrompt };
    const response = await simulateResponse(userInput, configWithTemplate);
    setMessages((prev) => [...prev, response]);
    setIsLoading(false);
  }, [userInput, config, selectedTemplate]);

  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Try out AI models with pre-built templates. Pick what you want to do, type your text, and see the result."
      >
        Playground
      </Header>

      <Container header={<Header variant="h2">1. What do you want to do?</Header>}>
        <Cards
          items={promptTemplates.filter((t) => t.id !== 'custom')}
          cardDefinition={{
            header: (item) => (
              <span style={{ fontWeight: selectedTemplate.id === item.id ? 'bold' : 'normal' }}>
                {item.name} {selectedTemplate.id === item.id && '✓'}
              </span>
            ),
            sections: [{ id: 'desc', content: (item) => item.description }],
          }}
          cardsPerRow={[{ cards: 2 }, { minWidth: 600, cards: 4 }]}
          onSelectionChange={({ detail }) => {
            const selected = detail.selectedItems[0];
            if (selected) setSelectedTemplate(selected);
          }}
          selectedItems={[selectedTemplate]}
          selectionType="single"
          trackBy="id"
        />
      </Container>

      <Container header={<Header variant="h2">2. Type your text</Header>}>
        <SpaceBetween size="m">
          {selectedTemplate.exampleUserMessage && (
            <Alert type="info">
              Example: "{selectedTemplate.exampleUserMessage}"
            </Alert>
          )}
          <Textarea
            value={userInput}
            onChange={({ detail }) => setUserInput(detail.value)}
            placeholder="Paste or type your text here..."
            rows={4}
            ariaLabel="Your input text"
          />
          <Button variant="primary" onClick={handleRun} loading={isLoading} disabled={!userInput.trim()}>
            Run
          </Button>
        </SpaceBetween>
      </Container>

      {messages.length > 0 && (
        <Container header={<Header variant="h2">3. Result</Header>}>
          <SpaceBetween size="m">
            {messages.filter((m) => m.role === 'assistant').map((msg) => (
              <Box key={msg.id}>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {msg.content}
                </pre>
                {msg.latencyMs && (
                  <Box margin={{ top: 's' }} fontSize="body-s" color="text-body-secondary">
                    Response time: {(msg.latencyMs / 1000).toFixed(1)}s
                  </Box>
                )}
              </Box>
            ))}
          </SpaceBetween>
        </Container>
      )}

      <ExpandableSection headerText="Show model details">
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Model</Box>
            <Box>{config.modelName}</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Why this model</Box>
            <Box>Best balance of quality and speed for most tasks.</Box>
          </div>
        </ColumnLayout>
      </ExpandableSection>
    </SpaceBetween>
  );
}


// ============================================================
// BUILDER: Full config with glosses, token info, compare mode
// ============================================================
function BuilderPlayground() {
  const [config, setConfig] = useState<PlaygroundConfig>(defaultConfigs.builder);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = useCallback(async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);

    const userMsg: PlaygroundMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
      tokenCount: Math.round(userInput.length / 4),
    };
    setMessages((prev) => [...prev, userMsg]);

    const response = await simulateResponse(userInput, config);
    setMessages((prev) => [...prev, response]);
    setIsLoading(false);
  }, [userInput, config]);

  const handleClear = () => {
    setMessages([]);
    setUserInput('');
  };

  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Test models with full parameter control. See token counts, latency, and response metadata."
      >
        Playground
      </Header>

      <ColumnLayout columns={2}>
        {/* Left: Config panel */}
        <Container header={<Header variant="h3">Configuration</Header>}>
          <SpaceBetween size="m">
            <FormField label="Model" description="Which model processes your request">
              <Select
                selectedOption={{ value: config.modelId, label: config.modelName }}
                onChange={({ detail }) => {
                  const model = mockModels.find((m) => m.id === detail.selectedOption.value);
                  if (model) setConfig((c) => ({ ...c, modelId: model.id, modelName: model.name }));
                }}
                options={mockModels.map((m) => ({ value: m.id, label: m.name, description: `$${m.inputPricePerMToken}/M in, ${m.contextWindow / 1000}K context` }))}
              />
            </FormField>

            <FormField label="System prompt" description="Instructions that shape model behavior">
              <Textarea
                value={config.systemPrompt}
                onChange={({ detail }) => setConfig((c) => ({ ...c, systemPrompt: detail.value }))}
                rows={3}
                placeholder="You are a helpful assistant..."
              />
            </FormField>

            <FormField label="Prompt templates" description="Load a pre-built system prompt">
              <Select
                selectedOption={null}
                onChange={({ detail }) => {
                  const tpl = promptTemplates.find((t) => t.id === detail.selectedOption.value);
                  if (tpl) {
                    setConfig((c) => ({ ...c, systemPrompt: tpl.systemPrompt }));
                    if (tpl.exampleUserMessage) setUserInput(tpl.exampleUserMessage);
                  }
                }}
                options={promptTemplates.map((t) => ({ value: t.id, label: t.name, description: t.description }))}
                placeholder="Load a template..."
              />
            </FormField>

            <ColumnLayout columns={2}>
              <FormField label="Temperature" description="0 = focused, 1 = creative">
                <Input
                  type="number"
                  value={String(config.temperature)}
                  onChange={({ detail }) => setConfig((c) => ({ ...c, temperature: parseFloat(detail.value) || 0 }))}
                  inputMode="decimal"
                />
              </FormField>
              <FormField label="Max tokens" description="Maximum response length">
                <Input
                  type="number"
                  value={String(config.maxTokens)}
                  onChange={({ detail }) => setConfig((c) => ({ ...c, maxTokens: parseInt(detail.value) || 1024 }))}
                />
              </FormField>
            </ColumnLayout>

            <FormField label="Top P" description="Nucleus sampling threshold">
              <Input
                type="number"
                value={String(config.topP)}
                onChange={({ detail }) => setConfig((c) => ({ ...c, topP: parseFloat(detail.value) || 1 }))}
                inputMode="decimal"
              />
            </FormField>

            <FormField label="API format">
              <Select
                selectedOption={{ value: config.api, label: config.api }}
                onChange={({ detail }) => setConfig((c) => ({ ...c, api: detail.selectedOption.value as PlaygroundConfig['api'] }))}
                options={[
                  { value: 'openai-chat', label: 'OpenAI Chat Completions' },
                  { value: 'openai-responses', label: 'OpenAI Responses' },
                  { value: 'anthropic-messages', label: 'Anthropic Messages' },
                ]}
              />
            </FormField>
          </SpaceBetween>
        </Container>

        {/* Right: Input/Output */}
        <SpaceBetween size="m">
          <Container header={<Header variant="h3">Input</Header>}>
            <SpaceBetween size="s">
              <Textarea
                value={userInput}
                onChange={({ detail }) => setUserInput(detail.value)}
                placeholder="Type your prompt..."
                rows={5}
                ariaLabel="User prompt"
              />
              <SpaceBetween size="xs" direction="horizontal">
                <Button variant="primary" onClick={handleRun} loading={isLoading} disabled={!userInput.trim()}>
                  Run
                </Button>
                <Button variant="normal" onClick={handleClear}>Clear</Button>
              </SpaceBetween>
              <Box fontSize="body-s" color="text-body-secondary">
                ~{Math.round(userInput.length / 4)} input tokens
              </Box>
            </SpaceBetween>
          </Container>

          {messages.filter((m) => m.role === 'assistant').length > 0 && (
            <Container header={<Header variant="h3">Output</Header>}>
              <SpaceBetween size="m">
                {messages.filter((m) => m.role === 'assistant').map((msg) => (
                  <Box key={msg.id}>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                      {msg.content}
                    </pre>
                    <Box margin={{ top: 's' }}>
                      <SpaceBetween size="xs" direction="horizontal">
                        <Badge color="blue">{msg.tokenCount} tokens output</Badge>
                        <Badge color="grey">{msg.latencyMs}ms latency</Badge>
                        <Badge color="green">~${((msg.tokenCount || 0) * 0.000015).toFixed(4)} cost</Badge>
                      </SpaceBetween>
                    </Box>
                  </Box>
                ))}
              </SpaceBetween>
            </Container>
          )}
        </SpaceBetween>
      </ColumnLayout>
    </SpaceBetween>
  );
}

// ============================================================
// PRACTITIONER: Full raw control, all parameters, response metadata
// ============================================================
function PractitionerPlayground() {
  const [config, setConfig] = useState<PlaygroundConfig>(defaultConfigs.practitioner);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('single');

  const handleRun = useCallback(async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);

    const userMsg: PlaygroundMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
      tokenCount: Math.round(userInput.length / 4),
    };
    setMessages((prev) => [...prev, userMsg]);

    const response = await simulateResponse(userInput, config);
    setMessages((prev) => [...prev, response]);
    setIsLoading(false);
  }, [userInput, config]);

  return (
    <SpaceBetween size="l">
      <Header variant="h1">Playground</Header>

      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={[
          {
            id: 'single',
            label: 'Single request',
            content: (
              <ColumnLayout columns={2}>
                {/* Config */}
                <Container header={<Header variant="h3">Parameters</Header>}>
                  <SpaceBetween size="s">
                    <FormField label="Model">
                      <Select
                        selectedOption={{ value: config.modelId, label: config.modelId }}
                        onChange={({ detail }) => {
                          const model = mockModels.find((m) => m.id === detail.selectedOption.value);
                          if (model) setConfig((c) => ({ ...c, modelId: model.id, modelName: model.name }));
                        }}
                        options={mockModels.map((m) => ({ value: m.id, label: m.id }))}
                      />
                    </FormField>

                    <FormField label="API">
                      <Select
                        selectedOption={{ value: config.api, label: config.api }}
                        onChange={({ detail }) => setConfig((c) => ({ ...c, api: detail.selectedOption.value as PlaygroundConfig['api'] }))}
                        options={[
                          { value: 'openai-chat', label: 'openai-chat' },
                          { value: 'openai-responses', label: 'openai-responses' },
                          { value: 'anthropic-messages', label: 'anthropic-messages' },
                        ]}
                      />
                    </FormField>

                    <FormField label="System">
                      <Textarea
                        value={config.systemPrompt}
                        onChange={({ detail }) => setConfig((c) => ({ ...c, systemPrompt: detail.value }))}
                        rows={3}
                      />
                    </FormField>

                    <ColumnLayout columns={3}>
                      <FormField label="temp">
                        <Input
                          type="number"
                          value={String(config.temperature)}
                          onChange={({ detail }) => setConfig((c) => ({ ...c, temperature: parseFloat(detail.value) || 0 }))}
                        />
                      </FormField>
                      <FormField label="max_tokens">
                        <Input
                          type="number"
                          value={String(config.maxTokens)}
                          onChange={({ detail }) => setConfig((c) => ({ ...c, maxTokens: parseInt(detail.value) || 4096 }))}
                        />
                      </FormField>
                      <FormField label="top_p">
                        <Input
                          type="number"
                          value={String(config.topP)}
                          onChange={({ detail }) => setConfig((c) => ({ ...c, topP: parseFloat(detail.value) || 1 }))}
                        />
                      </FormField>
                    </ColumnLayout>
                  </SpaceBetween>
                </Container>

                {/* Request/Response */}
                <SpaceBetween size="m">
                  <Container header={<Header variant="h3">Request</Header>}>
                    <SpaceBetween size="s">
                      <Textarea
                        value={userInput}
                        onChange={({ detail }) => setUserInput(detail.value)}
                        rows={6}
                        placeholder="Enter prompt..."
                        ariaLabel="Prompt input"
                      />
                      <SpaceBetween size="xs" direction="horizontal">
                        <Button variant="primary" onClick={handleRun} loading={isLoading}>
                          Send
                        </Button>
                        <Button onClick={() => { setMessages([]); setUserInput(''); }}>Clear</Button>
                        <Box fontSize="body-s" color="text-body-secondary" padding={{ top: 'xs' }}>
                          {Math.round(userInput.length / 4)} tokens
                        </Box>
                      </SpaceBetween>
                    </SpaceBetween>
                  </Container>

                  {messages.filter((m) => m.role === 'assistant').map((msg) => (
                    <Container
                      key={msg.id}
                      header={
                        <Header variant="h3">
                          Response
                          <Box fontSize="body-s" display="inline" margin={{ left: 's' }}>
                            <Badge>{msg.tokenCount} tok</Badge>{' '}
                            <Badge>{msg.latencyMs}ms</Badge>{' '}
                            <Badge>${((msg.tokenCount || 0) * 0.000015).toFixed(5)}</Badge>
                          </Box>
                        </Header>
                      }
                    >
                      <pre style={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        lineHeight: '1.4',
                        margin: 0,
                        background: '#fafafa',
                        padding: '12px',
                        borderRadius: '4px',
                      }}>
                        {msg.content}
                      </pre>
                    </Container>
                  ))}
                </SpaceBetween>
              </ColumnLayout>
            ),
          },
          {
            id: 'compare',
            label: 'Compare models',
            content: (
              <Box padding="l" textAlign="center">
                <StatusIndicator type="info">
                  Compare mode: run the same prompt against multiple models side-by-side. Select models and configure parameters above, then send.
                </StatusIndicator>
                <Box margin={{ top: 'm' }} color="text-body-secondary">
                  (Side-by-side comparison would render here with parallel API calls to different models)
                </Box>
              </Box>
            ),
          },
        ]}
      />
    </SpaceBetween>
  );
}
