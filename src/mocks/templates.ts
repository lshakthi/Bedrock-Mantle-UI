/**
 * Opinionated templates for Explorer users.
 * Each template maps a business problem to a pre-configured model + settings.
 */
export interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'content' | 'data' | 'customer' | 'code' | 'creative';
  recommendedModelId: string;
  recommendedModelName: string;
  whyThisModel: string;
  estimatedCostPer100: number;
  prefilledConfig: {
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
  };
  exampleInput: string;
  exampleOutput: string;
}

export const mockTemplates: Template[] = [
  {
    id: 'tpl-summarize',
    title: 'Summarize documents',
    description: 'Turn long reports, articles, or emails into short summaries',
    icon: '📄',
    category: 'content',
    recommendedModelId: 'anthropic.claude-haiku-3-20240307-v1:0',
    recommendedModelName: 'Claude Haiku 3',
    whyThisModel: 'Fast and affordable. Great at pulling key points from text without losing meaning.',
    estimatedCostPer100: 0.04,
    prefilledConfig: {
      temperature: 0.3,
      maxTokens: 512,
      systemPrompt: 'You summarize documents clearly and concisely. Focus on key facts, decisions, and action items.',
    },
    exampleInput: 'A 10-page quarterly business report',
    exampleOutput: 'A 3-paragraph summary with key metrics, decisions made, and next steps',
  },
  {
    id: 'tpl-extract',
    title: 'Extract data from messy notes',
    description: 'Pull structured information (names, dates, amounts) from unstructured text',
    icon: '🔍',
    category: 'data',
    recommendedModelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
    recommendedModelName: 'Claude Sonnet 4',
    whyThisModel: 'Best accuracy for complex extraction tasks. Understands context and handles ambiguity well.',
    estimatedCostPer100: 0.45,
    prefilledConfig: {
      temperature: 0.1,
      maxTokens: 1024,
      systemPrompt: 'You extract structured data from unstructured text. Return data in a clean, consistent format. If information is unclear or missing, say so rather than guessing.',
    },
    exampleInput: 'Invoice from Acme Corp dated Jan 15 2025 for $3,400 - consulting services',
    exampleOutput: '{ vendor: "Acme Corp", date: "2025-01-15", amount: 3400, description: "consulting services" }',
  },
  {
    id: 'tpl-customer-support',
    title: 'Answer customer questions',
    description: 'Respond to customer inquiries using your knowledge base or FAQ',
    icon: '💬',
    category: 'customer',
    recommendedModelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
    recommendedModelName: 'Claude Sonnet 4',
    whyThisModel: 'Balances helpfulness with accuracy. Good at following tone guidelines and staying on-topic.',
    estimatedCostPer100: 0.45,
    prefilledConfig: {
      temperature: 0.5,
      maxTokens: 1024,
      systemPrompt: 'You are a helpful customer support agent. Be friendly, accurate, and concise. If you do not know the answer, say so and suggest contacting a human agent.',
    },
    exampleInput: 'How do I reset my password?',
    exampleOutput: 'A step-by-step answer in friendly, clear language',
  },
  {
    id: 'tpl-classify',
    title: 'Sort and categorize items',
    description: 'Automatically label emails, tickets, products, or feedback by category',
    icon: '🏷️',
    category: 'data',
    recommendedModelId: 'amazon.titan-text-express-v1',
    recommendedModelName: 'Amazon Titan Text Express',
    whyThisModel: 'Lowest cost option. Classification is a straightforward task that does not need the most powerful model.',
    estimatedCostPer100: 0.03,
    prefilledConfig: {
      temperature: 0.0,
      maxTokens: 64,
      systemPrompt: 'You classify text into categories. Return only the category label, nothing else.',
    },
    exampleInput: 'Customer email about a broken product',
    exampleOutput: 'Category: Product Issue',
  },
  {
    id: 'tpl-write',
    title: 'Write marketing copy',
    description: 'Generate product descriptions, social posts, or email campaigns',
    icon: '✍️',
    category: 'creative',
    recommendedModelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
    recommendedModelName: 'Claude Sonnet 4',
    whyThisModel: 'Best creative output. Adapts to brand voice and produces varied, engaging copy.',
    estimatedCostPer100: 0.45,
    prefilledConfig: {
      temperature: 0.8,
      maxTokens: 2048,
      systemPrompt: 'You write compelling marketing copy. Match the brand voice provided. Be creative but accurate. Never make claims that cannot be verified.',
    },
    exampleInput: 'Write a product description for wireless noise-canceling headphones',
    exampleOutput: 'A 100-word engaging description highlighting key benefits',
  },
  {
    id: 'tpl-translate',
    title: 'Translate content',
    description: 'Translate text between languages while preserving meaning and tone',
    icon: '🌐',
    category: 'content',
    recommendedModelId: 'mistral.mistral-large-2402-v1:0',
    recommendedModelName: 'Mistral Large',
    whyThisModel: 'Strongest multilingual capability. Handles nuance and idioms better than alternatives.',
    estimatedCostPer100: 0.55,
    prefilledConfig: {
      temperature: 0.3,
      maxTokens: 2048,
      systemPrompt: 'You translate text accurately while preserving the original tone, style, and meaning. If a phrase has no direct equivalent, provide the closest natural expression.',
    },
    exampleInput: 'Business email in English to translate to Spanish',
    exampleOutput: 'Natural, professional Spanish translation',
  },
];
