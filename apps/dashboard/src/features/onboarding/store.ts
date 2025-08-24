import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingState, OnboardingStep, OnboardingStepId } from './types';
import { ONBOARDING_STEP_IDS } from './types';

interface OnboardingStore extends OnboardingState {
  // Actions
  initializeOnboarding: () => void;
  completeStep: (stepId: OnboardingStepId) => void;
  setCurrentStep: (stepId: OnboardingStepId) => void;
  updateStepProgress: (stepId: OnboardingStepId, progress: number) => void;
  resetOnboarding: () => void;
  
  // Computed
  getNextStep: () => OnboardingStep | null;
  canAccessStep: (stepId: OnboardingStepId) => boolean;
  getOverallProgress: () => number;
}

const createInitialSteps = (): OnboardingStep[] => [
  {
    id: ONBOARDING_STEP_IDS.PROFILE,
    title: 'Slutför din företagsprofil',
    description: 'Berätta om ditt företag så vi kan skapa relevanta annonser',
    icon: '🏢',
    completed: false,
    locked: false,
    estimatedTime: '5 min',
    progress: 0
  },
  {
    id: ONBOARDING_STEP_IDS.CAMPAIGN,
    title: 'Skapa din första kampanj',
    description: 'Designa annonser som når rätt kunder',
    icon: '🎯',
    completed: false,
    locked: true,
    estimatedTime: '3 min',
    progress: 0
  },
  {
    id: ONBOARDING_STEP_IDS.ACCOUNTS,
    title: 'Koppla dina reklamkonton',
    description: 'Anslut Facebook och Google Ads för att publicera',
    icon: '🔗',
    completed: false,
    locked: true,
    estimatedTime: '2 min',
    progress: 0
  },
  {
    id: ONBOARDING_STEP_IDS.LAUNCH,
    title: 'Lansera din första kampanj',
    description: 'Granska och starta dina annonser',
    icon: '🚀',
    completed: false,
    locked: true,
    estimatedTime: '1 min',
    progress: 0
  }
];

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      currentStep: ONBOARDING_STEP_IDS.PROFILE,
      steps: createInitialSteps(),
      isComplete: false,
      
      initializeOnboarding: () => {
        set({
          currentStep: ONBOARDING_STEP_IDS.PROFILE,
          steps: createInitialSteps(),
          isComplete: false,
          completedAt: undefined
        });
      },
      
      completeStep: (stepId: OnboardingStepId) => {
        const { steps } = get();
        const stepIndex = steps.findIndex(step => step.id === stepId);
        
        if (stepIndex === -1) return;
        
        const updatedSteps = [...steps];
        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          completed: true,
          progress: 100
        };
        
        // Unlock next step
        if (stepIndex + 1 < updatedSteps.length) {
          updatedSteps[stepIndex + 1].locked = false;
        }
        
        // Check if all steps are complete
        const isComplete = updatedSteps.every(step => step.completed);
        
        set({
          steps: updatedSteps,
          isComplete,
          completedAt: isComplete ? new Date().toISOString() : undefined
        });
        
        // Auto-advance to next step if not complete
        if (!isComplete && stepIndex + 1 < updatedSteps.length) {
          get().setCurrentStep(updatedSteps[stepIndex + 1].id as OnboardingStepId);
        }
      },
      
      setCurrentStep: (stepId: OnboardingStepId) => {
        const { steps } = get();
        const step = steps.find(s => s.id === stepId);
        
        if (step && !step.locked) {
          set({ currentStep: stepId });
        }
      },
      
      updateStepProgress: (stepId: OnboardingStepId, progress: number) => {
        const { steps } = get();
        const updatedSteps = steps.map(step => 
          step.id === stepId 
            ? { ...step, progress: Math.min(100, Math.max(0, progress)) }
            : step
        );
        
        set({ steps: updatedSteps });
      },
      
      resetOnboarding: () => {
        get().initializeOnboarding();
      },
      
      getNextStep: () => {
        const { steps } = get();
        return steps.find(step => !step.completed && !step.locked) || null;
      },
      
      canAccessStep: (stepId: OnboardingStepId) => {
        const { steps } = get();
        const step = steps.find(s => s.id === stepId);
        return step ? !step.locked : false;
      },
      
      getOverallProgress: () => {
        const { steps } = get();
        const completedSteps = steps.filter(step => step.completed).length;
        return Math.round((completedSteps / steps.length) * 100);
      }
    }),
    {
      name: 'onboarding-storage',
      version: 1
    }
  )
);