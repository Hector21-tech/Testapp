/**
 * Campaign Wizard - Complete 6-step flow for creating ad campaigns
 * 
 * Flow:
 * 1. Företagsprofil (8 sub-steps mini-wizard)
 * 2. Koppla kanaler (Facebook/Google/Instagram)
 * 3. Annonsinnehåll (headline, description, CTA)
 * 4. Välj bild (upload or stock photos)
 * 5. Budget & mål (budget, dates, targeting)
 * 6. Granska & starta (summary and launch)
 * 
 * Features:
 * - Progress tracking with stepper
 * - Auto-save to localStorage
 * - Validation and error handling
 * - Responsive design
 * - Microanimations
 * - Accessibility compliant
 */

import React, { useEffect } from 'react';
import { useCampaignWizard } from '../../features/campaign/store';
import { Stepper } from '../../components/wizard/Stepper';
import { StepCard } from '../../components/wizard/StepCard';
import { WizardFooter } from '../../components/wizard/WizardFooter';
import { ProfileWizard } from '../../components/profile/ProfileWizard';

// Step components
import { 
  ChannelStep, 
  PlatformSelectionStep,
  ContentStep, 
  ImageStep, 
  BudgetStep, 
  ReviewStep 
} from './steps';

const WIZARD_STEPS = [
  {
    id: 'setup',
    title: 'Företagsinformation',
    description: 'Företagsprofil och kanaler',
    icon: '🏢',
    component: ProfileWizard  // This will handle both profile AND channels
  },
  {
    id: 'platforms',
    title: 'Välj plattformar',
    description: 'Var vill du visa annonserna?',
    icon: '📱',
    component: PlatformSelectionStep
  },
  {
    id: 'content',
    title: 'Annonsinnehåll',
    description: 'Skapa din annonstext',
    icon: '✍️',
    component: ContentStep
  },
  {
    id: 'image',
    title: 'Välj bild',
    description: 'Ladda upp eller välj från biblioteket',
    icon: '📸',
    component: ImageStep
  },
  {
    id: 'budget',
    title: 'Budget & mål',
    description: 'Sätt budget och målgrupp',
    icon: '💰',
    component: BudgetStep
  },
  {
    id: 'review',
    title: 'Granska & starta',
    description: 'Kontrollera och lansera',
    icon: '🚀',
    component: ReviewStep
  }
];

export function NewWizard() {
  const {
    draft,
    currentStep,
    isLoading,
    isSaving,
    initializeDraft,
    nextStep,
    previousStep,
    validateCurrentStep,
    canProceedToStep,
    saveDraft,
    setCurrentStep
  } = useCampaignWizard();

  // Initialize draft on mount and check if user already has completed profile
  useEffect(() => {
    if (!draft) {
      initializeDraft();
    } else if (draft && draft.isProfileComplete && Object.values(draft.channels).some(ch => ch.connected)) {
      // User has completed onboarding, start from platform selection (step 2)
      if (currentStep === 1) {
        setCurrentStep(2);
      }
    }
  }, [draft, initializeDraft, currentStep, setCurrentStep]);

  // Auto-save draft periodically
  useEffect(() => {
    if (draft && !isSaving) {
      const interval = setInterval(() => {
        saveDraft();
      }, 30000); // Save every 30 seconds

      return () => clearInterval(interval);
    }
  }, [draft, isSaving, saveDraft]);

  if (isLoading || !draft) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  // Check if user has completed onboarding to determine which steps to show
  const hasCompletedOnboarding = draft?.isProfileComplete && Object.values(draft?.channels || {}).some(ch => ch.connected);
  
  // Filter steps based on onboarding completion
  const activeSteps = hasCompletedOnboarding 
    ? WIZARD_STEPS.slice(1) // Skip step 1 (company setup) if onboarding done
    : WIZARD_STEPS; // Show all steps if no onboarding
    
  const adjustedCurrentStep = hasCompletedOnboarding ? currentStep - 1 : currentStep;
  const currentStepData = activeSteps[adjustedCurrentStep - 1];
  const CurrentStepComponent = currentStepData?.component;

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleSaveDraft = async () => {
    await saveDraft();
    // TODO: Show toast notification
  };

  const canProceed = validateCurrentStep();
  const progressPercentage = ((adjustedCurrentStep - 1) / (activeSteps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header with progress */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">
              Skapa ny kampanj
            </h1>
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="text-sm text-neutral-600 hover:text-brand transition-colors"
            >
              {isSaving ? 'Sparar...' : 'Spara utkast'}
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2 mb-6">
            <div 
              className="bg-brand h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Desktop stepper */}
          <div className="hidden lg:block">
            <Stepper
              steps={activeSteps.map((step, index) => ({
                id: step.id,
                title: step.title,
                description: step.description,
                completed: index < adjustedCurrentStep - 1,
                current: index === adjustedCurrentStep - 1,
                disabled: false // All visible steps should be accessible
              }))}
              currentStep={adjustedCurrentStep}
              onStepClick={(stepIndex) => {
                const targetStep = hasCompletedOnboarding ? stepIndex + 2 : stepIndex + 1; // Adjust for skipped step 1
                if (canProceedToStep(targetStep)) {
                  useCampaignWizard.getState().setCurrentStep(targetStep);
                }
              }}
            />
          </div>

          {/* Mobile progress indicator */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>Steg {adjustedCurrentStep} av {activeSteps.length}</span>
              <span>{currentStepData?.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="animate-fade-in">
          {CurrentStepComponent ? (
            <StepCard
              title={currentStepData.title}
              description={currentStepData.description}
              icon={currentStepData.icon}
            >
              <CurrentStepComponent />
            </StepCard>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">Steg {currentStep} ej implementerat än</p>
              <p className="text-neutral-500 text-sm mt-2">
                CurrentStepData: {JSON.stringify(currentStepData)}
              </p>
              <p className="text-neutral-500 text-sm">
                Totalt {WIZARD_STEPS.length} steg definierade
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer navigation */}
      <WizardFooter
        canProceed={canProceed}
        canGoBack={currentStep > 1}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === WIZARD_STEPS.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSaveDraft={handleSaveDraft}
        isSaving={isSaving}
        currentStep={currentStep}
        totalSteps={WIZARD_STEPS.length}
        nextButtonText={currentStep === WIZARD_STEPS.length ? 'Starta kampanj' : 'Nästa'}
      />
    </div>
  );
}