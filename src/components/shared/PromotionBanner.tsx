import Flashbar from '@cloudscape-design/components/flashbar';
import { useProficiency } from '@/hooks/useProficiency';

const TIER_LABELS = {
  explorer: 'Explorer',
  builder: 'Builder',
  practitioner: 'Practitioner',
};

/**
 * Promotion is suggested and dismissible, never silent.
 * Never auto-demote.
 */
export function PromotionBanner() {
  const { state, acceptPromotion, dismissPromotion } = useProficiency();

  if (!state.promotionSuggested) return null;

  return (
    <Flashbar
      items={[
        {
          type: 'info',
          dismissible: true,
          dismissLabel: 'Dismiss suggestion',
          onDismiss: dismissPromotion,
          content: `Based on how you have been using the console, the ${TIER_LABELS[state.promotionSuggested]} view might suit you better. It shows more technical detail while keeping the same layout.`,
          action: (
            <button onClick={acceptPromotion}>
              Switch to {TIER_LABELS[state.promotionSuggested]}
            </button>
          ),
          id: 'promotion-suggestion',
        },
      ]}
    />
  );
}
