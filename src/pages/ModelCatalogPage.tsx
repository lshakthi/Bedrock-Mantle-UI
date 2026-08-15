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
import Tabs from '@cloudscape-design/components/tabs';
import Button from '@cloudscape-design/components/button';
import Wizard from '@cloudscape-design/components/wizard';
import RadioGroup from '@cloudscape-design/components/radio-group';
import Alert from '@cloudscape-design/components/alert';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import Toggle from '@cloudscape-design/components/toggle';
import { useProficiency } from '@/hooks/useProficiency';
import { mockModels } from '@/mocks/models';
import { mockTemplates } from '@/mocks/templates';
import { evaluationQuestions, evaluateModels, modelBenchmarks as modelBenchmarksData } from '@/mocks/evaluation';
import type { ModelSpec } from '@/mocks/models';
import type { Template } from '@/mocks/templates';
import type { TaskType, Priority, ModelRecommendation } from '@/mocks/evaluation';

/**
 * Model Catalog: Three distinct flows for model selection and evaluation.
 *
 * Explorer: Template-first with opinionated recommendations, guided evaluation wizard
 * Builder: Guided comparison with technical details, benchmark scores, evaluation with control
 * Practitioner: Full-density sortable table, raw specs, complete control
 */
export function ModelCatalogPage() {
  const { tier } = useProficiency();

  if (tier === 'explorer') return <ExplorerFlow />;
  if (tier === 'builder') return <BuilderFlow />;
  return <PractitionerFlow />;
}

// ============================================================
// EXPLORER FLOW: Templates + Guided Evaluation Wizard
// ============================================================
function ExplorerFlow() {
  const [activeTab, setActiveTab] = useState('templates');
  const { recordSignal } = useProficiency();

  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Pick a template for your task, or let us help you find the right model."
      >
        Get started with AI
      </Header>

      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={[
          {
            id: 'templates',
            label: 'Start from a template',
            content: <TemplateGallery onSignal={recordSignal} />,
          },
          {
            id: 'evaluate',
            label: 'Help me choose',
            content: <ExplorerEvaluationWizard />,
          },
        ]}
      />
    </SpaceBetween>
  );
}

function TemplateGallery({ onSignal }: { onSignal: (s: 'glossaryExpansions') => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  if (selectedTemplate) {
    return <TemplateDetail template={selectedTemplate} onBack={() => setSelectedTemplate(null)} onSignal={onSignal} />;
  }

  return (
    <SpaceBetween size="m">
      <Box>
        <Box fontSize="heading-s" fontWeight="bold">What do you want to do?</Box>
        <Box color="text-body-secondary">Each template comes pre-configured with the best model and settings for the job.</Box>
      </Box>

      <Cards
        items={mockTemplates}
        cardDefinition={{
          header: (item) => (
            <span>
              {item.icon} {item.title}
            </span>
          ),
          sections: [
            {
              id: 'desc',
              content: (item) => item.description,
            },
            {
              id: 'cost',
              content: (item) => (
                <Box fontSize="body-s" color="text-body-secondary">
                  ~${item.estimatedCostPer100.toFixed(2)} per 100 uses using {item.recommendedModelName}
                </Box>
              ),
            },
            {
              id: 'action',
              content: (item) => (
                <Button variant="link" onClick={() => setSelectedTemplate(item)}>
                  Use this template →
                </Button>
              ),
            },
          ],
        }}
        cardsPerRow={[{ cards: 1 }, { minWidth: 400, cards: 2 }, { minWidth: 700, cards: 3 }]}
        empty={<Box>No templates available.</Box>}
      />
    </SpaceBetween>
  );
}

function TemplateDetail({ template, onBack, onSignal }: { template: Template; onBack: () => void; onSignal: (s: 'glossaryExpansions') => void }) {
  return (
    <SpaceBetween size="l">
      <Button variant="link" onClick={onBack}>← Back to templates</Button>

      <Container
        header={
          <Header variant="h2" description={template.description}>
            {template.icon} {template.title}
          </Header>
        }
      >
        <SpaceBetween size="l">
          <Alert type="info">
            We have pre-selected the best model and settings for this task. You can use this as-is or customize it later.
          </Alert>

          <ColumnLayout columns={2} variant="text-grid">
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Recommended model</Box>
              <Box fontSize="heading-m">{template.recommendedModelName}</Box>
              <Box color="text-body-secondary">{template.whyThisModel}</Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Estimated cost</Box>
              <Box fontSize="heading-m">${template.estimatedCostPer100.toFixed(2)} per 100 uses</Box>
              <Box color="text-body-secondary">Based on typical input and output sizes for this task</Box>
            </SpaceBetween>
          </ColumnLayout>

          <ColumnLayout columns={2} variant="text-grid">
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Example input</Box>
              <Box>{template.exampleInput}</Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">What you get back</Box>
              <Box>{template.exampleOutput}</Box>
            </SpaceBetween>
          </ColumnLayout>

          <ExpandableSection
            headerText="View technical configuration"
            variant="footer"
            onChange={() => onSignal('glossaryExpansions')}
          >
            <ColumnLayout columns={2} variant="text-grid">
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Model ID</Box>
                <Box variant="code">{template.recommendedModelId}</Box>
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Temperature</Box>
                <Box>{template.prefilledConfig.temperature} (lower = more consistent, higher = more creative)</Box>
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Max response length</Box>
                <Box>{template.prefilledConfig.maxTokens} tokens (~{Math.round(template.prefilledConfig.maxTokens * 0.75)} words)</Box>
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">System instructions</Box>
                <Box fontSize="body-s">{template.prefilledConfig.systemPrompt}</Box>
              </SpaceBetween>
            </ColumnLayout>
          </ExpandableSection>

          <Button variant="primary">Deploy this template</Button>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}

function ExplorerEvaluationWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ModelRecommendation[] | null>(null);

  const handleSubmit = () => {
    const recs = evaluateModels(
      (answers.task || 'summarization') as TaskType,
      (answers.priority || 'cost') as Priority,
      (answers.volume || 'low') as 'low' | 'medium' | 'high',
      (answers.inputSize || 'short') as 'short' | 'medium' | 'long'
    );
    setResults(recs);
  };

  if (results) {
    return <ExplorerResults results={results} onReset={() => { setResults(null); setAnswers({}); setActiveStep(0); }} />;
  }

  return (
    <Wizard
      i18nStrings={{
        stepNumberLabel: (n) => `Step ${n}`,
        collapsedStepsLabel: (step, total) => `Step ${step} of ${total}`,
        submitButton: 'Find my model',
        previousButton: 'Back',
        nextButton: 'Next',
        cancelButton: 'Cancel',
        optional: 'optional',
      }}
      activeStepIndex={activeStep}
      onNavigate={({ detail }) => setActiveStep(detail.requestedStepIndex)}
      onSubmit={handleSubmit}
      onCancel={() => { setAnswers({}); setActiveStep(0); }}
      steps={evaluationQuestions.map((q) => ({
        title: q.question,
        description: q.description,
        content: (
          <FormField label={q.question}>
            <RadioGroup
              value={answers[q.id] || null}
              onChange={({ detail }) => setAnswers((prev) => ({ ...prev, [q.id]: detail.value }))}
              items={q.options.map((opt) => ({
                value: opt.value,
                label: opt.label,
                description: opt.description,
              }))}
            />
          </FormField>
        ),
      }))}
    />
  );
}

function ExplorerResults({ results, onReset }: { results: ModelRecommendation[]; onReset: () => void }) {
  const top = results[0];

  return (
    <SpaceBetween size="l">
      <Alert type="success">
        Based on your answers, we recommend <strong>{top.modelName}</strong>.
      </Alert>

      <Container
        header={
          <Header variant="h2" description="Our top pick for your use case">
            🏆 {top.modelName}
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box>{top.reasoning}</Box>

          <ColumnLayout columns={2} variant="text-grid">
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Estimated monthly cost</Box>
              <Box fontSize="heading-m">${top.monthlyCostEstimate}</Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Match score</Box>
              <Box fontSize="heading-m">{top.score}/100</Box>
            </SpaceBetween>
          </ColumnLayout>

          {top.strengths.length > 0 && (
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Strengths</Box>
              <SpaceBetween size="xs" direction="horizontal">
                {top.strengths.map((s) => <Badge key={s} color="green">{s}</Badge>)}
              </SpaceBetween>
            </SpaceBetween>
          )}

          {top.tradeoffs.length > 0 && (
            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Tradeoffs</Box>
              <SpaceBetween size="xs" direction="horizontal">
                {top.tradeoffs.map((t) => <Badge key={t} color="grey">{t}</Badge>)}
              </SpaceBetween>
            </SpaceBetween>
          )}

          <Button variant="primary">Use this model</Button>
        </SpaceBetween>
      </Container>

      {results.length > 1 && (
        <ExpandableSection headerText={`Other options (${results.length - 1})`}>
          <SpaceBetween size="m">
            {results.slice(1).map((rec) => (
              <Container key={rec.modelId}>
                <SpaceBetween size="xs">
                  <Box fontWeight="bold">{rec.modelName} <Badge>{rec.provider}</Badge></Box>
                  <Box>{rec.reasoning}</Box>
                  <Box fontSize="body-s" color="text-body-secondary">
                    Score: {rec.score}/100 | Est. ${rec.monthlyCostEstimate}/month
                  </Box>
                </SpaceBetween>
              </Container>
            ))}
          </SpaceBetween>
        </ExpandableSection>
      )}

      <Button variant="link" onClick={onReset}>Start over with different answers</Button>
    </SpaceBetween>
  );
}


// ============================================================
// BUILDER FLOW: Guided comparison + Evaluation with control
// ============================================================
function BuilderFlow() {
  const [activeTab, setActiveTab] = useState('browse');
  const [filterText, setFilterText] = useState('');

  const filteredModels = mockModels.filter((m) => {
    const search = filterText.toLowerCase();
    return (
      m.name.toLowerCase().includes(search) ||
      m.id.toLowerCase().includes(search) ||
      m.provider.toLowerCase().includes(search) ||
      m.bestFor.some((b) => b.toLowerCase().includes(search))
    );
  });

  return (
    <SpaceBetween size="l">
      <Header
        variant="h1"
        description="Compare models, evaluate benchmarks, and choose the right fit for your project."
      >
        Model catalog
      </Header>

      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={[
          {
            id: 'browse',
            label: 'Browse models',
            content: <BuilderBrowse models={filteredModels} filterText={filterText} onFilterChange={setFilterText} />,
          },
          {
            id: 'evaluate',
            label: 'Evaluate and compare',
            content: <BuilderEvaluation />,
          },
          {
            id: 'benchmarks',
            label: 'Benchmarks',
            content: <BuilderBenchmarks />,
          },
        ]}
      />
    </SpaceBetween>
  );
}

function BuilderBrowse({ models, filterText, onFilterChange }: { models: ModelSpec[]; filterText: string; onFilterChange: (v: string) => void }) {
  return (
    <SpaceBetween size="m">
      <TextFilter
        filteringText={filterText}
        filteringPlaceholder="Search by model name, ID, provider, or capability"
        onChange={({ detail }) => onFilterChange(detail.filteringText)}
      />

      {models.map((model) => (
        <Container
          key={model.id}
          header={
            <Header
              variant="h2"
              description={
                <SpaceBetween size="xs" direction="horizontal">
                  <Box variant="code" fontSize="body-s">{model.id}</Box>
                  <Box color="text-body-secondary" fontSize="body-s">(Model ID for API calls)</Box>
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
                How much text the model processes at once (~{Math.round(model.contextWindow * 0.75).toLocaleString()} words)
              </Box>
            </SpaceBetween>

            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Pricing</Box>
              <Box>${model.inputPricePerMToken}/M input, ${model.outputPricePerMToken}/M output</Box>
              <Box color="text-body-secondary" fontSize="body-s">
                ~${model.costPer100Uses.toFixed(2)} per 100 typical requests
              </Box>
            </SpaceBetween>

            <SpaceBetween size="xs">
              <Box variant="awsui-key-label">Quotas</Box>
              <Box>{model.quotas.requestsPerMinute} req/min, {(model.quotas.tokensPerMinute / 1000).toFixed(0)}K tokens/min</Box>
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
              <Box variant="awsui-key-label">Best for</Box>
              <SpaceBetween size="xs" direction="horizontal">
                {model.bestFor.map((tag) => <Badge key={tag}>{tag}</Badge>)}
              </SpaceBetween>
            </SpaceBetween>
          </ColumnLayout>
        </Container>
      ))}

      {models.length === 0 && (
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="info">No models match your filter.</StatusIndicator>
        </Box>
      )}
    </SpaceBetween>
  );
}

function BuilderEvaluation() {
  const [task, setTask] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [volume, setVolume] = useState<string | null>(null);
  const [inputSize, setInputSize] = useState<string | null>(null);
  const [results, setResults] = useState<ModelRecommendation[] | null>(null);
  const [showAllMetrics, setShowAllMetrics] = useState(false);

  const handleEvaluate = () => {
    if (!task || !priority || !volume || !inputSize) return;
    const recs = evaluateModels(
      task as TaskType,
      priority as Priority,
      volume as 'low' | 'medium' | 'high',
      inputSize as 'short' | 'medium' | 'long'
    );
    setResults(recs);
  };

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Configure evaluation criteria</Header>}>
        <ColumnLayout columns={2}>
          <FormField label="Task type" description="What will the model do?">
            <Select
              selectedOption={task ? { value: task, label: evaluationQuestions[0].options.find((o) => o.value === task)?.label || task } : null}
              onChange={({ detail }) => setTask(detail.selectedOption.value || null)}
              options={evaluationQuestions[0].options.map((o) => ({ value: o.value, label: o.label, description: o.description }))}
              placeholder="Select a task"
            />
          </FormField>

          <FormField label="Top priority" description="What to optimize for">
            <Select
              selectedOption={priority ? { value: priority, label: evaluationQuestions[1].options.find((o) => o.value === priority)?.label || priority } : null}
              onChange={({ detail }) => setPriority(detail.selectedOption.value || null)}
              options={evaluationQuestions[1].options.map((o) => ({ value: o.value, label: o.label, description: o.description }))}
              placeholder="Select priority"
            />
          </FormField>

          <FormField label="Expected volume" description="Daily request count">
            <Select
              selectedOption={volume ? { value: volume, label: evaluationQuestions[2].options.find((o) => o.value === volume)?.label || volume } : null}
              onChange={({ detail }) => setVolume(detail.selectedOption.value || null)}
              options={evaluationQuestions[2].options.map((o) => ({ value: o.value, label: o.label, description: o.description }))}
              placeholder="Select volume"
            />
          </FormField>

          <FormField label="Input size" description="Typical text length per request">
            <Select
              selectedOption={inputSize ? { value: inputSize, label: evaluationQuestions[3].options.find((o) => o.value === inputSize)?.label || inputSize } : null}
              onChange={({ detail }) => setInputSize(detail.selectedOption.value || null)}
              options={evaluationQuestions[3].options.map((o) => ({ value: o.value, label: o.label, description: o.description }))}
              placeholder="Select input size"
            />
          </FormField>
        </ColumnLayout>

        <Box margin={{ top: 'm' }}>
          <Button variant="primary" onClick={handleEvaluate} disabled={!task || !priority || !volume || !inputSize}>
            Evaluate models
          </Button>
        </Box>
      </Container>

      {results && (
        <SpaceBetween size="m">
          <SpaceBetween size="xs" direction="horizontal" alignItems="center">
            <Header variant="h2">Evaluation results</Header>
            <Toggle checked={showAllMetrics} onChange={({ detail }) => setShowAllMetrics(detail.checked)}>
              Show all metrics
            </Toggle>
          </SpaceBetween>

          {results.map((rec, idx) => (
            <Container
              key={rec.modelId}
              header={
                <Header variant="h3">
                  {idx === 0 && '🏆 '}{rec.modelName}
                  <Badge color={idx === 0 ? 'green' : 'grey'}>{rec.score}/100</Badge>
                </Header>
              }
            >
              <SpaceBetween size="s">
                <Box>{rec.reasoning}</Box>

                <ColumnLayout columns={showAllMetrics ? 4 : 2} variant="text-grid">
                  <SpaceBetween size="xs">
                    <Box variant="awsui-key-label">Monthly cost estimate</Box>
                    <Box>${rec.monthlyCostEstimate}</Box>
                  </SpaceBetween>
                  <SpaceBetween size="xs">
                    <Box variant="awsui-key-label">Provider</Box>
                    <Box>{rec.provider}</Box>
                  </SpaceBetween>
                  {showAllMetrics && (
                    <>
                      <SpaceBetween size="xs">
                        <Box variant="awsui-key-label">Strengths</Box>
                        <Box>{rec.strengths.join(', ') || 'Balanced'}</Box>
                      </SpaceBetween>
                      <SpaceBetween size="xs">
                        <Box variant="awsui-key-label">Tradeoffs</Box>
                        <Box>{rec.tradeoffs.join(', ') || 'None notable'}</Box>
                      </SpaceBetween>
                    </>
                  )}
                </ColumnLayout>
              </SpaceBetween>
            </Container>
          ))}
        </SpaceBetween>
      )}
    </SpaceBetween>
  );
}

function BuilderBenchmarks() {
  return (
    <Table
      items={modelBenchmarksData}
      columnDefinitions={[
        { id: 'name', header: 'Model', cell: (item) => item.modelName, sortingField: 'modelName' },
        { id: 'provider', header: 'Provider', cell: (item) => item.provider },
        { id: 'accuracy', header: 'Accuracy', cell: (item) => <ScoreIndicator score={item.scores.accuracy} /> },
        { id: 'speed', header: 'Speed', cell: (item) => <ScoreIndicator score={item.scores.speed} /> },
        { id: 'cost', header: 'Cost efficiency', cell: (item) => <ScoreIndicator score={item.scores.costEfficiency} /> },
        { id: 'privacy', header: 'Privacy', cell: (item) => <ScoreIndicator score={item.scores.privacyScore} /> },
        { id: 'multilingual', header: 'Multilingual', cell: (item) => <ScoreIndicator score={item.scores.multilingualScore} /> },
        { id: 'tasks', header: 'Strong at', cell: (item) => item.taskStrengths.join(', ') },
      ]}
      sortingDisabled={false}
      header={<Header description="Industry benchmark scores (0-100). Higher is better.">Model benchmarks</Header>}
      empty={<Box>No data</Box>}
    />
  );
}

function ScoreIndicator({ score }: { score: number }) {
  const type = score >= 85 ? 'success' : score >= 70 ? 'info' : 'warning';
  return <StatusIndicator type={type}>{score}</StatusIndicator>;
}


// ============================================================
// PRACTITIONER FLOW: Full control, raw specs, everything visible
// ============================================================
function PractitionerFlow() {
  const [filterText, setFilterText] = useState('');
  const [activeTab, setActiveTab] = useState('models');

  const filteredModels = mockModels.filter((m) => {
    const search = filterText.toLowerCase();
    return (
      m.name.toLowerCase().includes(search) ||
      m.id.toLowerCase().includes(search) ||
      m.provider.toLowerCase().includes(search) ||
      m.modalities.some((mod) => mod.toLowerCase().includes(search))
    );
  });

  return (
    <SpaceBetween size="l">
      <Header variant="h1">Model catalog</Header>

      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={[
          {
            id: 'models',
            label: 'All models',
            content: (
              <Table
                items={filteredModels}
                filter={
                  <TextFilter
                    filteringText={filterText}
                    filteringPlaceholder="Filter models"
                    onChange={({ detail }) => setFilterText(detail.filteringText)}
                  />
                }
                columnDefinitions={[
                  { id: 'name', header: 'Model', cell: (item) => item.name, sortingField: 'name' },
                  { id: 'id', header: 'Model ID', cell: (item) => <Box variant="code" fontSize="body-s">{item.id}</Box> },
                  { id: 'provider', header: 'Provider', cell: (item) => item.provider, sortingField: 'provider' },
                  { id: 'context', header: 'Context', cell: (item) => `${(item.contextWindow / 1000).toFixed(0)}K`, sortingField: 'contextWindow' },
                  { id: 'maxOutput', header: 'Max output', cell: (item) => `${(item.maxOutput / 1000).toFixed(1)}K`, sortingField: 'maxOutput' },
                  { id: 'inputPrice', header: '$/M input', cell: (item) => `$${item.inputPricePerMToken}`, sortingField: 'inputPricePerMToken' },
                  { id: 'outputPrice', header: '$/M output', cell: (item) => `$${item.outputPricePerMToken}`, sortingField: 'outputPricePerMToken' },
                  { id: 'rpm', header: 'RPM', cell: (item) => item.quotas.requestsPerMinute },
                  { id: 'tpm', header: 'TPM', cell: (item) => `${(item.quotas.tokensPerMinute / 1000).toFixed(0)}K` },
                  { id: 'modalities', header: 'Modalities', cell: (item) => item.modalities.join(', ') },
                  { id: 'regions', header: 'Regions', cell: (item) => item.regions.length },
                  { id: 'tiers', header: 'Tiers', cell: (item) => item.serviceTiers.join(', ') },
                ]}
                sortingDisabled={false}
                empty={<Box textAlign="center" padding="xxl"><b>No models found</b></Box>}
                header={<Header counter={`(${filteredModels.length})`}>Models</Header>}
              />
            ),
          },
          {
            id: 'evaluate',
            label: 'Evaluate',
            content: <PractitionerEvaluation />,
          },
        ]}
      />
    </SpaceBetween>
  );
}

function PractitionerEvaluation() {
  const [task, setTask] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [volume, setVolume] = useState<string | null>(null);
  const [inputSize, setInputSize] = useState<string | null>(null);
  const [results, setResults] = useState<ModelRecommendation[] | null>(null);

  const handleEvaluate = () => {
    if (!task || !priority || !volume || !inputSize) return;
    setResults(
      evaluateModels(
        task as TaskType,
        priority as Priority,
        volume as 'low' | 'medium' | 'high',
        inputSize as 'short' | 'medium' | 'long'
      )
    );
  };

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Model evaluation</Header>}>
        <ColumnLayout columns={4}>
          <FormField label="Task">
            <Select
              selectedOption={task ? { value: task, label: task } : null}
              onChange={({ detail }) => setTask(detail.selectedOption.value || null)}
              options={evaluationQuestions[0].options.map((o) => ({ value: o.value, label: o.label }))}
              placeholder="Task type"
            />
          </FormField>
          <FormField label="Priority">
            <Select
              selectedOption={priority ? { value: priority, label: priority } : null}
              onChange={({ detail }) => setPriority(detail.selectedOption.value || null)}
              options={evaluationQuestions[1].options.map((o) => ({ value: o.value, label: o.label }))}
              placeholder="Priority"
            />
          </FormField>
          <FormField label="Volume">
            <Select
              selectedOption={volume ? { value: volume, label: volume } : null}
              onChange={({ detail }) => setVolume(detail.selectedOption.value || null)}
              options={evaluationQuestions[2].options.map((o) => ({ value: o.value, label: o.label }))}
              placeholder="Volume"
            />
          </FormField>
          <FormField label="Input size">
            <Select
              selectedOption={inputSize ? { value: inputSize, label: inputSize } : null}
              onChange={({ detail }) => setInputSize(detail.selectedOption.value || null)}
              options={evaluationQuestions[3].options.map((o) => ({ value: o.value, label: o.label }))}
              placeholder="Size"
            />
          </FormField>
        </ColumnLayout>
        <Box margin={{ top: 's' }}>
          <Button variant="primary" onClick={handleEvaluate} disabled={!task || !priority || !volume || !inputSize}>
            Run evaluation
          </Button>
        </Box>
      </Container>

      {results && (
        <Table
          items={results}
          columnDefinitions={[
            { id: 'rank', header: '#', cell: (_item) => { void _item; return results.indexOf(_item) + 1; } },
            { id: 'model', header: 'Model', cell: (item) => item.modelName },
            { id: 'provider', header: 'Provider', cell: (item) => item.provider },
            { id: 'score', header: 'Score', cell: (item) => `${item.score}/100`, sortingField: 'score' },
            { id: 'cost', header: 'Est. monthly', cell: (item) => `$${item.monthlyCostEstimate}` },
            { id: 'strengths', header: 'Strengths', cell: (item) => item.strengths.join(', ') || '—' },
            { id: 'tradeoffs', header: 'Tradeoffs', cell: (item) => item.tradeoffs.join(', ') || '—' },
            { id: 'reasoning', header: 'Reasoning', cell: (item) => item.reasoning },
          ]}
          sortingDisabled={false}
          header={<Header counter={`(${results.length})`}>Evaluation results</Header>}
          empty={<Box>No results</Box>}
        />
      )}
    </SpaceBetween>
  );
}
