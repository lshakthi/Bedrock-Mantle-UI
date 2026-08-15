import SegmentedControl from '@cloudscape-design/components/segmented-control';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { useProficiency } from '@/hooks/useProficiency';
import type { ProficiencyTier } from '@/types/proficiency';

const TIER_LABELS: Record<ProficiencyTier, string> = {
  explorer: 'Explorer',
  builder: 'Builder',
  practitioner: 'Practitioner',
};

const TIER_DESCRIPTIONS: Record<ProficiencyTier, string> = {
  explorer: 'Task-focused view with plain language. All technical details are one click away.',
  builder: 'Model IDs, code, and specs visible with helpful annotations.',
  practitioner: 'Full density. Raw specs, sortable tables, keyboard shortcuts.',
};

/**
 * Always visible in the header. Persists across sessions.
 * Includes a "Why this view?" link.
 */
export function TierSwitcher() {
  const { tier, setTier, resetOnboarding } = useProficiency();

  return (
    <Box margin={{ bottom: 's' }}>
      <SpaceBetween size="xs" direction="horizontal" alignItems="center">
        <SegmentedControl
          selectedId={tier}
          onChange={({ detail }) => setTier(detail.selectedId as ProficiencyTier)}
          label="Console view mode"
          options={[
            { id: 'explorer', text: 'Explorer' },
            { id: 'builder', text: 'Builder' },
            { id: 'practitioner', text: 'Practitioner' },
          ]}
        />
        <Link
          variant="info"
          onFollow={(e) => {
            e.preventDefault();
            alert(
              `You are in ${TIER_LABELS[tier]} view.\n\n${TIER_DESCRIPTIONS[tier]}\n\nYou can switch anytime. No features are removed, only the level of detail shown by default.`
            );
          }}
        >
          Why this view?
        </Link>
        <Button
          variant="link"
          onClick={resetOnboarding}
          ariaLabel="Reset onboarding and choose your experience level again"
        >
          Reset onboarding
        </Button>
      </SpaceBetween>
    </Box>
  );
}
