import { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import FormField from '@cloudscape-design/components/form-field';
import RadioGroup from '@cloudscape-design/components/radio-group';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import { useProficiency } from '@/hooks/useProficiency';

/**
 * Onboarding asks three behavioral questions. Never a self-rating slider.
 */
export function OnboardingPage() {
  const { completeOnboarding } = useProficiency();
  const [hasCalledApi, setHasCalledApi] = useState<string | null>(null);
  const [hasUsedLlm, setHasUsedLlm] = useState<string | null>(null);
  const [hasReadDocs, setHasReadDocs] = useState<string | null>(null);

  const canSubmit = hasCalledApi !== null && hasUsedLlm !== null && hasReadDocs !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    completeOnboarding({
      hasCalledApi: hasCalledApi === 'yes',
      hasUsedLlm: hasUsedLlm === 'yes',
      hasReadDocs: hasReadDocs === 'yes',
    });
  };

  return (
    <Box padding="xxl">
      <SpaceBetween size="l">
        <Container
          header={
            <Header
              variant="h1"
              description="We will tailor the console to match your experience. You can change this anytime."
            >
              Welcome to Amazon Bedrock
            </Header>
          }
        >
          <SpaceBetween size="l">
            <FormField
              label="Have you called a web API before?"
              description="For example, using fetch, curl, or an SDK to send a request to a service."
            >
              <RadioGroup
                value={hasCalledApi}
                onChange={({ detail }) => setHasCalledApi(detail.value)}
                items={[
                  { value: 'yes', label: 'Yes, I have called APIs before' },
                  { value: 'no', label: 'No, or I am not sure what that means' },
                ]}
              />
            </FormField>

            <FormField
              label="Have you used a large language model (like ChatGPT, Claude, or similar)?"
              description="Either through a chat interface or programmatically."
            >
              <RadioGroup
                value={hasUsedLlm}
                onChange={({ detail }) => setHasUsedLlm(detail.value)}
                items={[
                  { value: 'yes', label: 'Yes, I have used LLMs' },
                  { value: 'no', label: 'No, this is new to me' },
                ]}
              />
            </FormField>

            <FormField
              label="Have you read API documentation to build something?"
              description="Like AWS docs, Stripe docs, or any technical reference."
            >
              <RadioGroup
                value={hasReadDocs}
                onChange={({ detail }) => setHasReadDocs(detail.value)}
                items={[
                  { value: 'yes', label: 'Yes, I have used technical docs' },
                  { value: 'no', label: 'No, or rarely' },
                ]}
              />
            </FormField>

            <Button variant="primary" disabled={!canSubmit} onClick={handleSubmit}>
              Get started
            </Button>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Box>
  );
}
