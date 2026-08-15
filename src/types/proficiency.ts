/**
 * Proficiency tiers for the adaptive console.
 * These are render modes, not access levels. All capabilities remain available.
 */
export type ProficiencyTier = 'explorer' | 'builder' | 'practitioner';

export interface ProficiencySignals {
  glossaryExpansions: number;
  codePanelOpens: number;
  repeatedErrors: number;
  unassistedTaskCompletions: number;
  apiCallsMade: boolean;
  codeSnippetsCopied: number;
}

export interface OnboardingAnswers {
  hasCalledApi: boolean;
  hasUsedLlm: boolean;
  hasReadDocs: boolean;
}

export interface ProficiencyState {
  tier: ProficiencyTier;
  signals: ProficiencySignals;
  onboardingComplete: boolean;
  onboardingAnswers: OnboardingAnswers | null;
  promotionSuggested: ProficiencyTier | null;
  promotionDismissed: boolean;
}
