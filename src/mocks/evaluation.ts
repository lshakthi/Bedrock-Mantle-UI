/**
 * Model evaluation data and recommendation engine.
 * Uses industry benchmarks to suggest models based on user priorities.
 */

export type TaskType =
  | 'summarization'
  | 'extraction'
  | 'classification'
  | 'generation'
  | 'conversation'
  | 'translation'
  | 'code'
  | 'reasoning';

export type Priority = 'cost' | 'accuracy' | 'speed' | 'privacy' | 'multilingual';

export interface BenchmarkScores {
  accuracy: number; // 0-100
  speed: number; // 0-100 (higher = faster)
  costEfficiency: number; // 0-100 (higher = cheaper)
  privacyScore: number; // 0-100 (higher = more private/controlled)
  multilingualScore: number; // 0-100
}

export interface ModelBenchmark {
  modelId: string;
  modelName: string;
  provider: string;
  scores: BenchmarkScores;
  taskStrengths: TaskType[];
  notes: string;
}

export const modelBenchmarks: ModelBenchmark[] = [
  {
    modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
    modelName: 'Claude Sonnet 4',
    provider: 'Anthropic',
    scores: {
      accuracy: 92,
      speed: 70,
      costEfficiency: 55,
      privacyScore: 85,
      multilingualScore: 80,
    },
    taskStrengths: ['extraction', 'generation', 'conversation', 'reasoning', 'code'],
    notes: 'Top performer on complex tasks. Best choice when accuracy matters most.',
  },
  {
    modelId: 'anthropic.claude-haiku-3-20240307-v1:0',
    modelName: 'Claude Haiku 3',
    provider: 'Anthropic',
    scores: {
      accuracy: 78,
      speed: 95,
      costEfficiency: 90,
      privacyScore: 85,
      multilingualScore: 70,
    },
    taskStrengths: ['classification', 'summarization', 'extraction'],
    notes: 'Fastest response times. Best for high-volume, simpler tasks.',
  },
  {
    modelId: 'meta.llama3-70b-instruct-v1:0',
    modelName: 'Llama 3 70B',
    provider: 'Meta',
    scores: {
      accuracy: 82,
      speed: 65,
      costEfficiency: 60,
      privacyScore: 95,
      multilingualScore: 65,
    },
    taskStrengths: ['generation', 'reasoning', 'conversation'],
    notes: 'Open-source model. Highest privacy score since weights are open and auditable.',
  },
  {
    modelId: 'amazon.titan-text-express-v1',
    modelName: 'Amazon Titan Text Express',
    provider: 'Amazon',
    scores: {
      accuracy: 72,
      speed: 90,
      costEfficiency: 95,
      privacyScore: 90,
      multilingualScore: 60,
    },
    taskStrengths: ['classification', 'summarization'],
    notes: 'Most cost-effective. AWS-native with strong data residency guarantees.',
  },
  {
    modelId: 'mistral.mistral-large-2402-v1:0',
    modelName: 'Mistral Large',
    provider: 'Mistral AI',
    scores: {
      accuracy: 85,
      speed: 68,
      costEfficiency: 50,
      privacyScore: 80,
      multilingualScore: 95,
    },
    taskStrengths: ['translation', 'reasoning', 'code', 'generation'],
    notes: 'Strongest multilingual performance. European-developed with strong EU compliance.',
  },
];

export interface EvaluationQuestion {
  id: string;
  question: string;
  description: string;
  options: { value: string; label: string; description?: string }[];
}

export const evaluationQuestions: EvaluationQuestion[] = [
  {
    id: 'task',
    question: 'What do you want the AI to do?',
    description: 'Pick the closest match to your use case.',
    options: [
      { value: 'summarization', label: 'Summarize or shorten text', description: 'Turn long content into short summaries' },
      { value: 'extraction', label: 'Pull out specific information', description: 'Extract names, dates, numbers from text' },
      { value: 'classification', label: 'Sort or categorize things', description: 'Label items by type or category' },
      { value: 'generation', label: 'Write new content', description: 'Create marketing copy, emails, descriptions' },
      { value: 'conversation', label: 'Answer questions or chat', description: 'Customer support, Q&A, chatbots' },
      { value: 'translation', label: 'Translate between languages', description: 'Convert text from one language to another' },
      { value: 'code', label: 'Help with code', description: 'Write, review, or explain code' },
      { value: 'reasoning', label: 'Analyze and reason', description: 'Complex analysis, decision support, problem solving' },
    ],
  },
  {
    id: 'priority',
    question: 'What matters most to you?',
    description: 'We will weight our recommendation based on this.',
    options: [
      { value: 'cost', label: 'Keep costs low', description: 'I need the most affordable option' },
      { value: 'accuracy', label: 'Get the best results', description: 'Quality matters more than price' },
      { value: 'speed', label: 'Get fast responses', description: 'Low latency is critical for my use case' },
      { value: 'privacy', label: 'Maximize data control', description: 'I want the most control over my data' },
      { value: 'multilingual', label: 'Work across languages', description: 'I need strong non-English support' },
    ],
  },
  {
    id: 'volume',
    question: 'How many requests do you expect?',
    description: 'This helps us estimate costs and check quota fit.',
    options: [
      { value: 'low', label: 'A few per day', description: 'Under 100 requests daily' },
      { value: 'medium', label: 'Hundreds per day', description: '100 to 5,000 requests daily' },
      { value: 'high', label: 'Thousands or more', description: 'Over 5,000 requests daily' },
    ],
  },
  {
    id: 'inputSize',
    question: 'How long are your typical inputs?',
    description: 'The text you send to the model each time.',
    options: [
      { value: 'short', label: 'Short (a sentence or paragraph)', description: 'Under 500 words' },
      { value: 'medium', label: 'Medium (a page or two)', description: '500 to 3,000 words' },
      { value: 'long', label: 'Long (full documents)', description: 'Over 3,000 words' },
    ],
  },
];

export interface ModelRecommendation {
  modelId: string;
  modelName: string;
  provider: string;
  score: number;
  reasoning: string;
  monthlyCostEstimate: number;
  strengths: string[];
  tradeoffs: string[];
}

/**
 * Score and rank models based on user answers.
 */
export function evaluateModels(
  task: TaskType,
  priority: Priority,
  volume: 'low' | 'medium' | 'high',
  _inputSize: 'short' | 'medium' | 'long'
): ModelRecommendation[] {
  const volumeMultiplier = volume === 'low' ? 50 : volume === 'medium' ? 2500 : 15000;

  return modelBenchmarks
    .map((model) => {
      let score = 0;

      // Task fit (0-40 points)
      if (model.taskStrengths.includes(task)) {
        score += 40;
      } else {
        score += 15;
      }

      // Priority alignment (0-40 points)
      const priorityMap: Record<Priority, keyof BenchmarkScores> = {
        cost: 'costEfficiency',
        accuracy: 'accuracy',
        speed: 'speed',
        privacy: 'privacyScore',
        multilingual: 'multilingualScore',
      };
      score += (model.scores[priorityMap[priority]] / 100) * 40;

      // Secondary scores (0-20 points)
      const avgOtherScores =
        Object.values(model.scores).reduce((a, b) => a + b, 0) / 5;
      score += (avgOtherScores / 100) * 20;

      // Use actual pricing from benchmarks inversely
      const actualCostPerReq = (100 - model.scores.costEfficiency) * 0.00005;
      const monthlyCostEstimate = Math.round(actualCostPerReq * volumeMultiplier * 30 * 100) / 100;

      const strengths: string[] = [];
      const tradeoffs: string[] = [];

      if (model.scores.accuracy >= 85) strengths.push('High accuracy');
      if (model.scores.speed >= 85) strengths.push('Very fast responses');
      if (model.scores.costEfficiency >= 85) strengths.push('Very affordable');
      if (model.scores.privacyScore >= 90) strengths.push('Strong data control');
      if (model.scores.multilingualScore >= 85) strengths.push('Excellent multilingual support');

      if (model.scores.costEfficiency < 60) tradeoffs.push('Higher cost per request');
      if (model.scores.speed < 70) tradeoffs.push('Slower response times');
      if (model.scores.accuracy < 80) tradeoffs.push('May be less accurate on complex tasks');
      if (model.scores.multilingualScore < 70) tradeoffs.push('Limited non-English support');

      const reasoning = generateReasoning(model, task, priority);

      return {
        modelId: model.modelId,
        modelName: model.modelName,
        provider: model.provider,
        score: Math.round(score),
        reasoning,
        monthlyCostEstimate,
        strengths,
        tradeoffs,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function generateReasoning(model: ModelBenchmark, task: TaskType, priority: Priority): string {
  const taskFit = model.taskStrengths.includes(task);
  const taskLabel = task.charAt(0).toUpperCase() + task.slice(1);

  let reason = '';

  if (taskFit) {
    reason += `Strong at ${taskLabel.toLowerCase()} tasks. `;
  } else {
    reason += `Capable of ${taskLabel.toLowerCase()}, though not its primary strength. `;
  }

  switch (priority) {
    case 'cost':
      reason += model.scores.costEfficiency >= 80
        ? 'One of the most cost-effective options available.'
        : 'Not the cheapest option, but may justify cost with better results.';
      break;
    case 'accuracy':
      reason += model.scores.accuracy >= 85
        ? 'Top-tier accuracy on benchmarks.'
        : 'Solid accuracy for most use cases.';
      break;
    case 'speed':
      reason += model.scores.speed >= 85
        ? 'Among the fastest response times.'
        : 'Moderate response speed.';
      break;
    case 'privacy':
      reason += model.scores.privacyScore >= 85
        ? 'Strong data control and residency guarantees.'
        : 'Standard data handling practices.';
      break;
    case 'multilingual':
      reason += model.scores.multilingualScore >= 85
        ? 'Excellent across multiple languages.'
        : 'Best suited for English-primary workloads.';
      break;
  }

  return reason;
}
