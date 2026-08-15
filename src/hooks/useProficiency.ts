/**
 * Central proficiency hook. ALL tier logic lives here.
 * Components read the tier and render accordingly. Never scatter tier checks.
 *
 * Rules:
 * - Onboarding asks three behavioral questions. Never a self-rating slider.
 * - Promotion is suggested and dismissible, never silent.
 * - Never auto-demote. Dropping someone to a simpler view uninvited reads as condescending.
 * - Tier switcher always visible in the header, persists across sessions.
 */
import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import type { ProficiencyTier, ProficiencyState, ProficiencySignals, OnboardingAnswers } from '@/types/proficiency';

const STORAGE_KEY = 'bedrock-mantle-proficiency';

const DEFAULT_SIGNALS: ProficiencySignals = {
  glossaryExpansions: 0,
  codePanelOpens: 0,
  repeatedErrors: 0,
  unassistedTaskCompletions: 0,
  apiCallsMade: false,
  codeSnippetsCopied: 0,
};

const DEFAULT_STATE: ProficiencyState = {
  tier: 'explorer',
  signals: DEFAULT_SIGNALS,
  onboardingComplete: false,
  onboardingAnswers: null,
  promotionSuggested: null,
  promotionDismissed: false,
};

function determineTierFromOnboarding(answers: OnboardingAnswers): ProficiencyTier {
  const score = [answers.hasCalledApi, answers.hasUsedLlm, answers.hasReadDocs].filter(Boolean).length;
  if (score >= 3) return 'practitioner';
  if (score >= 1) return 'builder';
  return 'explorer';
}

function shouldSuggestPromotion(
  currentTier: ProficiencyTier,
  signals: ProficiencySignals
): ProficiencyTier | null {
  if (currentTier === 'practitioner') return null;

  if (currentTier === 'explorer') {
    // Suggest builder if they're opening code panels and expanding glossaries
    if (signals.codePanelOpens >= 5 || signals.codeSnippetsCopied >= 3) {
      return 'builder';
    }
  }

  if (currentTier === 'builder') {
    // Suggest practitioner if they're completing tasks unassisted
    if (signals.unassistedTaskCompletions >= 3 && signals.apiCallsMade) {
      return 'practitioner';
    }
  }

  return null;
}

function loadState(): ProficiencyState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Fall through to default
  }
  return DEFAULT_STATE;
}

function saveState(state: ProficiencyState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable, non-critical
  }
}

export interface ProficiencyContext {
  tier: ProficiencyTier;
  state: ProficiencyState;
  setTier: (tier: ProficiencyTier) => void;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  recordSignal: (signal: keyof ProficiencySignals, value?: number | boolean) => void;
  dismissPromotion: () => void;
  acceptPromotion: () => void;
  resetOnboarding: () => void;
}

export function useProficiencyProvider(): ProficiencyContext {
  const [state, setState] = useState<ProficiencyState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Check for promotion suggestions when signals change
  useEffect(() => {
    if (state.promotionDismissed) return;
    const suggestion = shouldSuggestPromotion(state.tier, state.signals);
    if (suggestion && suggestion !== state.promotionSuggested) {
      setState(prev => ({ ...prev, promotionSuggested: suggestion }));
    }
  }, [state.signals, state.tier, state.promotionDismissed, state.promotionSuggested]);

  const setTier = useCallback((tier: ProficiencyTier) => {
    setState(prev => ({
      ...prev,
      tier,
      promotionSuggested: null,
      promotionDismissed: false,
    }));
  }, []);

  const completeOnboarding = useCallback((answers: OnboardingAnswers) => {
    const tier = determineTierFromOnboarding(answers);
    setState(prev => ({
      ...prev,
      tier,
      onboardingComplete: true,
      onboardingAnswers: answers,
    }));
  }, []);

  const recordSignal = useCallback((signal: keyof ProficiencySignals, value?: number | boolean) => {
    setState(prev => {
      const signals = { ...prev.signals };
      if (typeof value === 'boolean') {
        (signals as Record<string, unknown>)[signal] = value;
      } else {
        (signals as Record<string, unknown>)[signal] = (signals[signal] as number) + (value ?? 1);
      }
      return { ...prev, signals };
    });
  }, []);

  const dismissPromotion = useCallback(() => {
    setState(prev => ({
      ...prev,
      promotionSuggested: null,
      promotionDismissed: true,
    }));
  }, []);

  const acceptPromotion = useCallback(() => {
    setState(prev => ({
      ...prev,
      tier: prev.promotionSuggested ?? prev.tier,
      promotionSuggested: null,
      promotionDismissed: false,
    }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    tier: state.tier,
    state,
    setTier,
    completeOnboarding,
    recordSignal,
    dismissPromotion,
    acceptPromotion,
    resetOnboarding,
  };
}

// Context for providing proficiency throughout the app
export const ProficiencyCtx = createContext<ProficiencyContext | null>(null);

export function useProficiency(): ProficiencyContext {
  const ctx = useContext(ProficiencyCtx);
  if (!ctx) throw new Error('useProficiency must be used within ProficiencyProvider');
  return ctx;
}
