export interface CodeAnnotation {
  line: number;
  text: string;
  tier: 'explorer' | 'builder'; // Practitioners see raw code
}

export interface CodeSample {
  id: string;
  title: string;
  description: string;
  // Explorer-friendly
  taskDescription: string;
  language: 'python' | 'javascript' | 'typescript';
  api: 'openai-responses' | 'openai-chat' | 'anthropic-messages';
  code: string;
  annotations: CodeAnnotation[];
}

export const mockCodeSamples: CodeSample[] = [
  {
    id: 'sample-openai-responses',
    title: 'OpenAI Responses API',
    description: 'Send a prompt using the OpenAI Responses API format via bedrock-mantle',
    taskDescription: 'Ask a model a question and get a text answer back',
    language: 'python',
    api: 'openai-responses',
    code: `import requests

# Your bedrock-mantle endpoint
endpoint = "https://bedrock-mantle.us-east-1.amazonaws.com/v1/responses"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}

payload = {
    "model": "anthropic.claude-sonnet-4-20250514-v1:0",
    "input": "Summarize the key points of this quarterly report.",
    "instructions": "You are a helpful business analyst."
}

response = requests.post(endpoint, json=payload, headers=headers)
result = response.json()
print(result["output"][0]["content"][0]["text"])`,
    annotations: [
      { line: 1, text: 'Import the requests library to make HTTP calls', tier: 'explorer' },
      { line: 3, text: 'This is where your requests go. Region can be changed (us-east-1, us-west-2, etc.)', tier: 'builder' },
      { line: 6, text: 'Every request needs these headers to identify format and credentials', tier: 'explorer' },
      { line: 7, text: 'Replace with your actual API key from IAM or Secrets Manager', tier: 'builder' },
      { line: 10, text: 'This section is the "what you want done"', tier: 'explorer' },
      { line: 11, text: 'Model ID determines which AI processes your request. Affects speed, cost, and capability.', tier: 'builder' },
      { line: 12, text: 'Your actual question or text goes here', tier: 'explorer' },
      { line: 13, text: 'Instructions shape how the model behaves, like giving it a role', tier: 'explorer' },
      { line: 16, text: 'Send the request and wait for the answer', tier: 'explorer' },
      { line: 18, text: 'Navigate the response structure to get the actual text answer', tier: 'builder' },
    ],
  },
  {
    id: 'sample-openai-chat',
    title: 'OpenAI Chat Completions API',
    description: 'Conversational request using OpenAI Chat Completions format',
    taskDescription: 'Have a back-and-forth conversation with a model',
    language: 'python',
    api: 'openai-chat',
    code: `import requests

endpoint = "https://bedrock-mantle.us-east-1.amazonaws.com/v1/chat/completions"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}

payload = {
    "model": "anthropic.claude-sonnet-4-20250514-v1:0",
    "messages": [
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "How do I read a CSV file in Python?"}
    ],
    "max_tokens": 1024,
    "temperature": 0.7
}

response = requests.post(endpoint, json=payload, headers=headers)
result = response.json()
print(result["choices"][0]["message"]["content"])`,
    annotations: [
      { line: 3, text: 'Chat completions endpoint, for conversation-style interactions', tier: 'builder' },
      { line: 12, text: 'Messages are a list of turns in the conversation', tier: 'explorer' },
      { line: 13, text: 'System message sets the personality and rules for the model', tier: 'explorer' },
      { line: 14, text: 'User message is what you are asking', tier: 'explorer' },
      { line: 16, text: 'Limits how long the response can be (in tokens, roughly 0.75 words each)', tier: 'builder' },
      { line: 17, text: 'Temperature controls creativity: 0 = focused/deterministic, 1 = more creative/varied', tier: 'builder' },
    ],
  },
  {
    id: 'sample-anthropic-messages',
    title: 'Anthropic Messages API',
    description: 'Native Anthropic Messages format via bedrock-mantle',
    taskDescription: 'Use the Anthropic-native format for precise control',
    language: 'python',
    api: 'anthropic-messages',
    code: `import requests

endpoint = "https://bedrock-mantle.us-east-1.amazonaws.com/v1/messages"

headers = {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_API_KEY",
    "anthropic-version": "2023-06-01"
}

payload = {
    "model": "anthropic.claude-sonnet-4-20250514-v1:0",
    "max_tokens": 1024,
    "system": "You extract structured data from unstructured text.",
    "messages": [
        {
            "role": "user",
            "content": "Extract the name, date, and amount from: 'Invoice from Acme Corp dated Jan 15 2025 for $3,400'"
        }
    ]
}

response = requests.post(endpoint, json=payload, headers=headers)
result = response.json()
print(result["content"][0]["text"])`,
    annotations: [
      { line: 3, text: 'Anthropic-native messages endpoint', tier: 'builder' },
      { line: 7, text: 'Anthropic format uses x-api-key header instead of Bearer token', tier: 'builder' },
      { line: 8, text: 'Version header locks the API behavior to a known version', tier: 'builder' },
      { line: 14, text: 'System prompt is a top-level field in Anthropic format (not in messages array)', tier: 'builder' },
      { line: 15, text: 'Messages contain the actual conversation', tier: 'explorer' },
      { line: 18, text: 'Your task described in plain language', tier: 'explorer' },
    ],
  },
];
