import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../features/onboarding/store';
import { OnboardingCard } from './OnboardingCard';
import { ONBOARDING_STEP_IDS } from '../../features/onboarding/types';

export function OnboardingDashboard() {
  const navigate = useNavigate();
  const { 
    steps, 
    currentStep, 
    setCurrentStep, 
    getOverallProgress, 
    getNextStep 
  } = useOnboardingStore();

  const overallProgress = getOverallProgress();
  const nextStep = getNextStep();

  const handleStepClick = (stepId: string) => {
    switch (stepId) {
      case ONBOARDING_STEP_IDS.PROFILE:
        setCurrentStep(ONBOARDING_STEP_IDS.PROFILE);
        navigate('/campaigns/wizard/profile');
        break;
      case ONBOARDING_STEP_IDS.CAMPAIGN:
        setCurrentStep(ONBOARDING_STEP_IDS.CAMPAIGN);
        navigate('/campaigns/new');
        break;
      case ONBOARDING_STEP_IDS.ACCOUNTS:
        setCurrentStep(ONBOARDING_STEP_IDS.ACCOUNTS);
        navigate('/campaigns/wizard/channels');
        break;
      case ONBOARDING_STEP_IDS.LAUNCH:
        setCurrentStep(ONBOARDING_STEP_IDS.LAUNCH);
        navigate('/campaigns/wizard/review');
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 rounded-full mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Välkommen till din reklamplattform!
        </h1>
        <p className="text-lg text-neutral-600 mb-6">
          Låt oss sätta upp allt så du kan börja få fler kunder inom 10 minuter
        </p>

        {/* Overall Progress */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
            <span>Övergripande framsteg</span>
            <span className="font-semibold">{overallProgress}% klart</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-brand to-brand-dark h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Next Step Highlight */}
      {nextStep && (
        <div className="bg-gradient-to-r from-brand/5 to-blue-50 p-6 rounded-xl mb-8 border border-brand/20">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">{nextStep.icon}</span>
            <div>
              <h3 className="font-semibold text-brand-dark">Nästa steg:</h3>
              <p className="text-brand">{nextStep.title}</p>
            </div>
          </div>
          <button
            onClick={() => handleStepClick(nextStep.id)}
            className="btn-primary"
          >
            Fortsätt där du slutade
          </button>
        </div>
      )}

      {/* Onboarding Steps */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Din väg till första kampanjen
        </h2>
        
        {steps.map((step, index) => (
          <OnboardingCard
            key={step.id}
            step={step}
            stepNumber={index + 1}
            onClick={() => handleStepClick(step.id)}
          />
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-12 p-6 bg-neutral-50 rounded-xl text-center">
        <h3 className="font-semibold text-neutral-900 mb-2">Behöver du hjälp?</h3>
        <p className="text-sm text-neutral-600 mb-4">
          Vi finns här för att hjälpa dig komma igång. Kontakta oss om du fastnar.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <a href="mailto:support@example.com" className="text-brand hover:text-brand-dark">
            📧 Email support
          </a>
          <span className="text-neutral-300">|</span>
          <a href="/help" className="text-brand hover:text-brand-dark">
            📚 Hjälpcenter
          </a>
        </div>
      </div>
    </div>
  );
}