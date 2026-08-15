export interface FaqEntry {
  question: string;
  answer: string;
  tier: 'all' | 'explorer' | 'builder' | 'practitioner';
  tags: string[];
}

export const mockFaqs: FaqEntry[] = [
  {
    question: 'What is Amazon Bedrock?',
    answer: 'Amazon Bedrock is a managed service that gives you access to foundation models (large AI models) from multiple providers through a single API. You can use it to build AI-powered applications without managing infrastructure.',
    tier: 'all',
    tags: ['getting-started', 'overview'],
  },
  {
    question: 'How do I choose the right model?',
    answer: 'Start with what you want to do. For complex analysis or coding, use Claude Sonnet. For quick, high-volume tasks like classification, use Claude Haiku or Titan Express. The Model Catalog page helps you compare options by task, cost, and speed.',
    tier: 'all',
    tags: ['models', 'getting-started'],
  },
  {
    question: 'What does "tokens" mean?',
    answer: 'Tokens are how AI models measure text length. One token is roughly 0.75 words. So 1,000 tokens is about 750 words. Pricing and limits are measured in tokens because that is how models actually process text.',
    tier: 'explorer',
    tags: ['pricing', 'concepts'],
  },
  {
    question: 'Why am I getting throttled?',
    answer: 'Throttling happens when you send more requests per minute than your quota allows. You can fix this by adding delays between requests, batching smaller payloads, or requesting a quota increase through AWS Service Quotas.',
    tier: 'all',
    tags: ['errors', 'quotas'],
  },
  {
    question: 'What is the difference between the three APIs?',
    answer: 'Bedrock Mantle supports three API formats: OpenAI Responses (simplest, single-turn), OpenAI Chat Completions (conversation-style, widely compatible), and Anthropic Messages (native Anthropic format, most control). All three reach the same models. Choose based on what your existing code uses or what feels most natural.',
    tier: 'builder',
    tags: ['api', 'code'],
  },
  {
    question: 'How much will this cost me?',
    answer: 'Cost depends on the model and how much text you send and receive. Use the cost calculator on the Quotas and Pricing page to estimate. Enter your expected number of items and it will show you the dollar amount. Most simple tasks cost fractions of a cent per request.',
    tier: 'all',
    tags: ['pricing'],
  },
  {
    question: 'What are service tiers (priority, standard, flexible)?',
    answer: 'Service tiers control the speed and cost tradeoff. Priority gives you the fastest responses at the highest cost. Standard is the default balance. Flexible is the cheapest but may queue your requests during high-demand periods.',
    tier: 'builder',
    tags: ['models', 'pricing'],
  },
  {
    question: 'How do I handle errors in my application?',
    answer: 'Implement exponential backoff for ThrottlingException (retry with increasing delays). For ValidationException, check your input size against the model context window. For AccessDenied, verify your IAM permissions include bedrock:InvokeModel. The Errors page shows your recent errors with specific fix instructions.',
    tier: 'practitioner',
    tags: ['errors', 'code'],
  },
  {
    question: 'Can I use this without writing code?',
    answer: 'The console itself does not require coding. You can explore models, understand pricing, and monitor projects entirely through this interface. When you are ready to integrate AI into your application, the Code Samples page provides copy-ready examples with explanations.',
    tier: 'explorer',
    tags: ['getting-started'],
  },
  {
    question: 'What regions are available?',
    answer: 'Model availability varies by region. Most models are available in us-east-1 and us-west-2. Check the Model Catalog for per-model region availability. Choose the region closest to your users for lower latency.',
    tier: 'all',
    tags: ['regions', 'models'],
  },
  {
    question: 'How do I increase my quotas?',
    answer: 'Go to the AWS Service Quotas console, find Amazon Bedrock, and request an increase for the specific model and limit you need. Increases are typically approved within a few business days.',
    tier: 'all',
    tags: ['quotas'],
  },
  {
    question: 'What does the context window mean?',
    answer: 'The context window is the maximum amount of text a model can read in a single request. A 200K context window means the model can process about 150,000 words at once. If your input exceeds this, you need to split it into smaller chunks.',
    tier: 'all',
    tags: ['models', 'concepts'],
  },
];

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Simple keyword-based FAQ matching for the mock assistant.
 * In production this would call a real model via bedrock-mantle.
 */
export function findRelevantFaqs(query: string, tier: string): FaqEntry[] {
  const lower = query.toLowerCase();
  const words = lower.split(/\s+/).filter((w) => w.length > 2);

  return mockFaqs
    .filter((faq) => faq.tier === 'all' || faq.tier === tier)
    .map((faq) => {
      const text = `${faq.question} ${faq.answer} ${faq.tags.join(' ')}`.toLowerCase();
      const score = words.filter((w) => text.includes(w)).length;
      return { faq, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ faq }) => faq);
}

/**
 * Generate a mock assistant response.
 * Simulates what a real bedrock-mantle call would return.
 */
export function generateAssistantResponse(query: string, tier: string): string {
  const relevant = findRelevantFaqs(query, tier);

  if (relevant.length === 0) {
    return "I don't have a specific answer for that, but I can help with questions about models, pricing, quotas, errors, APIs, and getting started. Try rephrasing your question or ask about one of those topics.";
  }

  if (relevant.length === 1) {
    return relevant[0].answer;
  }

  // Combine multiple relevant answers
  const intro = "Here's what I found that might help:";
  const answers = relevant.map((faq, i) => `${i + 1}. ${faq.answer}`).join('\n\n');
  return `${intro}\n\n${answers}`;
}
