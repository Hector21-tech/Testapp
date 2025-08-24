export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  locked: boolean;
  estimatedTime?: string;
  progress?: number;
}

export interface OnboardingState {
  currentStep: string;
  steps: OnboardingStep[];
  isComplete: boolean;
  completedAt?: string;
}

export const ONBOARDING_STEP_IDS = {
  PROFILE: 'profile',
  CAMPAIGN: 'campaign', 
  ACCOUNTS: 'accounts',
  LAUNCH: 'launch'
} as const;

export type OnboardingStepId = typeof ONBOARDING_STEP_IDS[keyof typeof ONBOARDING_STEP_IDS];