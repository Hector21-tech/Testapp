/**
 * Onboarding Wizard
 * 
 * A streamlined 2-step onboarding wizard:
 * 1. Company Profile (8 sub-steps) - Business info, industry, location, goals
 * 2. Connect Channels - Facebook, Google, Instagram integration
 * 
 * After completion, user is redirected to Dashboard with "Starta Din Annons" CTA
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LinkIcon, 
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

import { Stepper } from '../../components/wizard/Stepper';
import { StepCard } from '../../components/wizard/StepCard';
import { WizardFooter } from '../../components/wizard/WizardFooter';
import { ProfileWizard } from '../../components/profile/ProfileWizard';

import { useCampaignWizard } from '../../features/campaign/store';
import type { Step } from '../../components/wizard/Stepper';

const ONBOARDING_STEPS: Step[] = [
  { id: '1', title: 'Företagsprofil', description: 'Berätta om ditt företag', completed: false, current: true },
  { id: '2', title: 'Koppla kanaler', description: 'Anslut Facebook & Google', completed: false, current: false }
];

export function OnboardingWizard() {
  const navigate = useNavigate();
  const {
    draft,
    currentStep,
    isLoading,
    isSaving,
    initializeDraft,
    updateChannels,
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

  // Auto-advance to step 2 when profile is complete
  useEffect(() => {
    console.log('OnboardingWizard: Auto-advance check');
    console.log('Current step:', currentStep);
    console.log('Profile complete:', draft?.isProfileComplete);
    
    if (draft && currentStep === 1 && draft.isProfileComplete) {
      console.log('OnboardingWizard: Profile complete, advancing to step 2');
      nextStep();
    }
  }, [draft, currentStep, nextStep]);

  if (isLoading || !draft) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-4"></div>
          <p className="body text-neutral-600">Laddar onboarding...</p>
        </div>
      </div>
    );
  }

  // If we're in profile step, show the dedicated ProfileWizard
  if (currentStep === 1 && !draft.isProfileComplete) {
    return <ProfileWizard />;
  }

  // Update steps based on current progress
  const steps = ONBOARDING_STEPS.map((step, index) => ({
    ...step,
    completed: index < currentStep - 1 || (index === 0 && draft.isProfileComplete),
    current: index === currentStep - 1,
    disabled: !canProceedToStep(index + 1)
  }));

  // Custom validation for onboarding (different from campaign wizard)
  const canGoNext = currentStep === 1 
    ? draft.isProfileComplete 
    : Object.values(draft.channels).some(ch => ch.connected);
  
  console.log('OnboardingWizard state:');
  console.log('Current step:', currentStep);
  console.log('Profile complete:', draft.isProfileComplete);
  console.log('Channels:', draft.channels);
  console.log('Can go next:', canGoNext);
  const canGoBack = currentStep > 1;

  const handleNext = () => {
    if (canGoNext) {
      if (currentStep === 2) {
        // Onboarding complete - redirect to dashboard
        navigate('/dashboard');
      } else {
        nextStep();
      }
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      previousStep();
    }
  };

  const handleSaveDraft = async () => {
    await saveDraft();
    // TODO: Show toast notification "Utkast sparat ✓"
  };

  // Mock functions for v1 - replace with real API calls
  const mockConnectFacebook = () => {
    updateChannels({
      facebook: { connected: true, accountId: 'mock-123', accountName: 'Mock Business Account' }
    });
  };

  const mockConnectGoogle = () => {
    updateChannels({
      google: { connected: true, accountId: 'mock-456', accountName: 'Mock Google Ads Account' }
    });
  };

  // Step-specific content
  const renderStepContent = () => {
    // Only render step 2 (Channels) - Profile is handled by ProfileWizard
    if (currentStep === 2) {
      return (
        <StepCard
          title="Koppla dina annonskanaler"
          description="Anslut dina Facebook och Google-konton så kan vi hjälpa dig publicera annonser senare."
          icon={<LinkIcon className="w-6 h-6" />}
        >
          <div className="space-y-6">
            {/* Facebook */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">f</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Facebook & Instagram</h3>
                    <p className="text-sm text-neutral-600">
                      {draft.channels.facebook.connected 
                        ? `Ansluten: ${draft.channels.facebook.accountName}`
                        : 'Koppla ditt Facebook Business Manager-konto'
                      }
                    </p>
                  </div>
                </div>
                <div>
                  {draft.channels.facebook.connected ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckBadgeIcon className="w-5 h-5" />
                      <span className="text-sm font-semibold">Ansluten</span>
                    </div>
                  ) : (
                    <button 
                      onClick={mockConnectFacebook}
                      className="btn-primary btn-sm"
                    >
                      Koppla Facebook
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Google */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Google Ads</h3>
                    <p className="text-sm text-neutral-600">
                      {draft.channels.google.connected 
                        ? `Ansluten: ${draft.channels.google.accountName}`
                        : 'Koppla ditt Google Ads-konto'
                      }
                    </p>
                  </div>
                </div>
                <div>
                  {draft.channels.google.connected ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckBadgeIcon className="w-5 h-5" />
                      <span className="text-sm font-semibold">Ansluten</span>
                    </div>
                  ) : (
                    <button 
                      onClick={mockConnectGoogle}
                      className="btn-primary btn-sm"
                    >
                      Koppla Google
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Success Message */}
            {Object.values(draft.channels).some(ch => ch.connected) ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-sm text-green-800">
                  <strong>Perfekt!</strong> Nu kan vi hjälpa dig skapa annonser. Klicka på "Gå till Dashboard" för att komma igång.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>Tips:</strong> Du behöver koppla minst en kanal för att kunna fortsätta till Dashboard.
                </p>
              </div>
            )}
          </div>
        </StepCard>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="text-center mb-6">
            <h1 className="heading-xl mb-2">Välkommen till AnnonsHjälpen!</h1>
            <p className="body text-neutral-600">
              Låt oss sätta upp ditt konto så vi kan hjälpa dig skapa fantastiska annonser
            </p>
          </div>
          
          <Stepper 
            steps={steps} 
            variant="horizontal" 
            showProgress={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {renderStepContent()}
      </div>

      {/* Footer */}
      <WizardFooter
        onPrevious={canGoBack ? handlePrevious : undefined}
        onNext={canGoNext ? handleNext : undefined}
        onSaveDraft={handleSaveDraft}
        previousLabel="Tillbaka"
        nextLabel={currentStep === 2 ? "Gå till Dashboard" : "Nästa"}
        canGoBack={canGoBack}
        canProceed={canGoNext}
        isSaving={isSaving}
        showSaveDraft={true}
      />
    </div>
  );
}