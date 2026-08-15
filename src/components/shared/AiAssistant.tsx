import { useState, useRef, useEffect, useCallback } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';
import Header from '@cloudscape-design/components/header';
import { useProficiency } from '@/hooks/useProficiency';
import { generateAssistantResponse, mockFaqs } from '@/mocks/assistant';
import type { AssistantMessage } from '@/mocks/assistant';

/**
 * 24/7 AI Assistant for FAQs and help.
 *
 * Adapts to proficiency tier:
 * - Explorer: Shows suggested questions, simpler language, proactive tips
 * - Builder: Shows relevant FAQ topics, links to docs
 * - Practitioner: Minimal chrome, fast Q&A, keyboard-friendly
 */
export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { tier } = useProficiency();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Show a welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage(tier);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [isOpen, messages.length, tier]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate async response (would be a real bedrock-mantle call in production)
    setTimeout(() => {
      const response = generateAssistantResponse(userMessage.content, tier);
      const assistantMessage: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  }, [inputValue, tier]);

  const handleKeyDown = useCallback(
    (e: CustomEvent<{ key: string }>) => {
      if (e.detail.key === 'Enter') {
        handleSend();
      }
    },
    [handleSend]
  );

  const handleSuggestedQuestion = useCallback((question: string) => {
    setInputValue(question);
  }, []);

  if (!isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
        }}
      >
        <Button
          variant="primary"
          onClick={() => setIsOpen(true)}
          ariaLabel="Open AI Assistant"
          iconName="contact"
        >
          AI Assistant
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '400px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
        overflow: 'hidden',
        border: '1px solid #e9ebed',
      }}
      role="dialog"
      aria-label="AI Assistant chat"
      aria-modal="false"
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e9ebed',
          background: '#0972d3',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Header variant="h3">
          <span style={{ color: '#ffffff' }}>
            <Icon name="contact" /> AI Assistant
          </span>
        </Header>
        <Button
          variant="icon"
          iconName="close"
          onClick={() => setIsOpen(false)}
          ariaLabel="Close assistant"
        />
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          maxHeight: '400px',
          minHeight: '200px',
        }}
        role="log"
        aria-live="polite"
        aria-label="Conversation messages"
      >
        <SpaceBetween size="s">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <Box color="text-body-secondary" fontSize="body-s">
              Assistant is typing...
            </Box>
          )}
          <div ref={messagesEndRef} />
        </SpaceBetween>
      </div>

      {/* Suggested questions for Explorer tier */}
      {tier === 'explorer' && messages.length <= 1 && (
        <div style={{ padding: '0 16px 8px' }}>
          <Box fontSize="body-s" color="text-body-secondary" margin={{ bottom: 'xs' }}>
            Try asking:
          </Box>
          <SpaceBetween size="xs">
            {getSuggestedQuestions(tier).map((q) => (
              <button
                key={q}
                onClick={() => handleSuggestedQuestion(q)}
                style={{
                  background: '#f2f3f3',
                  border: '1px solid #e9ebed',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
                aria-label={`Ask: ${q}`}
              >
                {q}
              </button>
            ))}
          </SpaceBetween>
        </div>
      )}

      {/* Input area */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #e9ebed',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <Input
            value={inputValue}
            onChange={({ detail }) => setInputValue(detail.value)}
            onKeyDown={handleKeyDown}
            placeholder={getInputPlaceholder(tier)}
            ariaLabel="Type your question"
          />
        </div>
        <Button
          variant="primary"
          onClick={handleSend}
          disabled={!inputValue.trim()}
          iconName="angle-right-double"
          ariaLabel="Send message"
        />
      </div>

      {/* Availability note */}
      <div style={{ padding: '4px 16px 8px', textAlign: 'center' }}>
        <Box fontSize="body-s" color="text-body-secondary">
          Available 24/7. Ask about models, pricing, errors, or how to get started.
        </Box>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: AssistantMessage }) {
  const isUser = message.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: '10px 14px',
          borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          background: isUser ? '#0972d3' : '#f2f3f3',
          color: isUser ? '#ffffff' : '#000716',
          fontSize: '14px',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
        }}
        role="article"
        aria-label={`${isUser ? 'You' : 'Assistant'}: ${message.content}`}
      >
        {message.content}
      </div>
    </div>
  );
}

function getWelcomeMessage(tier: string): string {
  switch (tier) {
    case 'explorer':
      return "Hi! I'm here to help you get started with Amazon Bedrock. You can ask me anything about choosing models, understanding costs, or what to do when something goes wrong. No technical knowledge needed.";
    case 'builder':
      return "Hey! I can help with questions about APIs, model selection, pricing calculations, error handling, and configuration. What are you working on?";
    case 'practitioner':
      return 'Bedrock assistant ready. Ask about models, quotas, API formats, errors, or pricing.';
    default:
      return "Hi! How can I help you today?";
  }
}

function getInputPlaceholder(tier: string): string {
  switch (tier) {
    case 'explorer':
      return 'Ask me anything...';
    case 'builder':
      return 'Ask about APIs, models, pricing...';
    case 'practitioner':
      return 'Quick question...';
    default:
      return 'Type your question...';
  }
}

function getSuggestedQuestions(tier: string): string[] {
  const tierFaqs = mockFaqs.filter((f) => f.tier === 'all' || f.tier === tier);
  return tierFaqs.slice(0, 3).map((f) => f.question);
}
