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
  ContentStep, 
  ImageStep, 
  BudgetStep, 
  ReviewStep 
} from './steps';

const WIZARD_STEPS = [
  {
    id: 'profile',
    title: 'Företagsprofil',
    description: 'Berätta om ditt företag',
    icon: '🏢',
    component: ProfileWizard
  },
  {
    id: 'channels',
    title: 'Koppla kanaler', 
    description: 'Välj var du vill annonsera',
    icon: '📱',
    component: ChannelStep
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
    saveDraft
  } = useCampaignWizard();

  // Initialize draft on mount
  useEffect(() => {
    if (!draft) {
      initializeDraft();
    }
  }, [draft, initializeDraft]);

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

  const currentStepData = WIZARD_STEPS[currentStep - 1];
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
  const progressPercentage = ((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100;

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
              steps={WIZARD_STEPS.map((step, index) => ({
                id: step.id,
                title: step.title,
                description: step.description,
                completed: index < currentStep - 1,
                current: index === currentStep - 1,
                disabled: !canProceedToStep(index + 1)
              }))}
              currentStep={currentStep}
              onStepClick={(stepIndex) => {
                const targetStep = stepIndex + 1;
                if (canProceedToStep(targetStep)) {
                  useCampaignWizard.getState().setCurrentStep(targetStep);
                }
              }}
            />
          </div>

          {/* Mobile progress indicator */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>Steg {currentStep} av {WIZARD_STEPS.length}</span>
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
              <p className="text-neutral-600">Steg ej implementerat än</p>
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