/**
 * Mock data for the prompt playground / model testing screen.
 */

export interface PlaygroundMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
  tokenCount?: number;
  latencyMs?: number;
}

export interface PlaygroundConfig {
  modelId: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  api: 'openai-responses' | 'openai-chat' | 'anthropic-messages';
}

export const defaultConfigs: Record<string, PlaygroundConfig> = {
  explorer: {
    modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
    modelName: 'Claude Sonnet 4',
    temperature: 0.7,
    maxTokens: 1024,
    topP: 1.0,
    systemPrompt: 'You are a helpful assistant.',
    api: 'openai-chat',
  },
  builder: {
    modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
    modelName: 'Claude Sonnet 4',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.95,
    systemPrompt: 'You are a helpful assistant.',
    api: 'openai-chat',
  },
  practitioner: {
    modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
    modelName: 'Claude Sonnet 4',
    temperature: 0.7,
    maxTokens: 4096,
    topP: 0.95,
    systemPrompt: '',
    api: 'anthropic-messages',
  },
};

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  exampleUserMessage: string;
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: 'summarize',
    name: 'Summarizer',
    description: 'Summarize text into key points',
    systemPrompt: 'You summarize text clearly and concisely. Focus on key facts, decisions, and action items. Use bullet points.',
    exampleUserMessage: 'Summarize the following report: [paste your text here]',
  },
  {
    id: 'extract',
    name: 'Data extractor',
    description: 'Pull structured data from unstructured text',
    systemPrompt: 'You extract structured data from unstructured text. Return data as JSON. If information is unclear or missing, use null.',
    exampleUserMessage: 'Extract name, date, and amount from: "Invoice from Acme Corp dated Jan 15 2025 for $3,400"',
  },
  {
    id: 'rewrite',
    name: 'Tone rewriter',
    description: 'Rewrite text in a different tone or style',
    systemPrompt: 'You rewrite text in the requested tone while preserving the original meaning. Do not add information that was not in the original.',
    exampleUserMessage: 'Rewrite this in a more professional tone: "Hey, the thing you asked about is done, let me know if you need anything else"',
  },
  {
    id: 'classify',
    name: 'Classifier',
    description: 'Categorize text into predefined labels',
    systemPrompt: 'You classify text into one of the provided categories. Return only the category label and a confidence score (high/medium/low).',
    exampleUserMessage: 'Categories: [Bug Report, Feature Request, Question, Complaint]\n\nText: "The export button crashes when I click it with more than 100 rows selected"',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Start with a blank system prompt',
    systemPrompt: '',
    exampleUserMessage: '',
  },
];

/**
 * Simulates a model response with realistic latency and token counts.
 */
export function simulateResponse(userMessage: string, config: PlaygroundConfig): Promise<PlaygroundMessage> {
  const responses: Record<string, string> = {
    summarize: `Here are the key points:\n\n• Main finding: The quarterly revenue increased by 12% compared to last quarter\n• Key decision: The team approved expanding into two new regions\n• Action item: Product team to deliver prototype by March 15\n• Risk noted: Supply chain delays may impact Q2 targets`,
    extract: `{\n  "vendor": "Acme Corp",\n  "date": "2025-01-15",\n  "amount": 3400,\n  "currency": "USD",\n  "description": "consulting services"\n}`,
    rewrite: `Dear [Name],\n\nI wanted to let you know that the item you inquired about has been completed. Please don't hesitate to reach out if there's anything else I can assist you with.\n\nBest regards`,
    classify: `Category: Bug Report\nConfidence: High\n\nReasoning: The text describes unexpected behavior ("crashes") triggered by a specific user action ("click it with more than 100 rows"), which is characteristic of a bug report rather than a feature request or general question.`,
    default: `I'd be happy to help with that. Based on your input, here's my response:\n\nThe text you provided discusses several important points. Let me break them down:\n\n1. The main topic relates to ${userMessage.slice(0, 50)}...\n2. Key considerations include context, accuracy, and clarity\n3. I'd recommend reviewing the specific requirements before proceeding\n\nWould you like me to elaborate on any of these points?`,
  };

  const matchedKey = Object.keys(responses).find((key) =>
    config.systemPrompt.toLowerCase().includes(key)
  ) || 'default';

  const responseText = responses[matchedKey];
  const latency = 400 + Math.random() * 1200;
  const tokenCount = Math.round(responseText.length / 4);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
        tokenCount,
        latencyMs: Math.round(latency),
      });
    }, latency);
  });
}
