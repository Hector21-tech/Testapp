import { useEffect } from 'react';
import { useOnboardingStore } from '../features/onboarding/store';
import { useCampaignWizard } from '../features/campaign/store';
import { ONBOARDING_STEP_IDS } from '../features/onboarding/types';

/**
 * Hook that integrates onboarding progress with campaign wizard state
 * Automatically updates onboarding when user completes steps
 */
export function useOnboardingIntegration() {
  const { completeStep, updateStepProgress } = useOnboardingStore();
  const { draft } = useCampaignWizard();

  // Monitor profile completion
  useEffect(() => {
    if (!draft) return;

    const { profile, isProfileComplete } = draft;
    
    // Calculate profile progress
    let profileProgress = 0;
    if (profile.companyName) profileProgress += 25;
    if (profile.orgNumber) profileProgress += 25;
    if (profile.industry) profileProgress += 15;
    if (profile.targetingAreas?.length > 0) profileProgress += 15;
    if (profile.goals?.length > 0) profileProgress += 10;
    if (profile.interests?.length > 0) profileProgress += 10;

    // Update profile step progress
    updateStepProgress(ONBOARDING_STEP_IDS.PROFILE, profileProgress);

    // Complete profile step when done
    if (isProfileComplete) {
      completeStep(ONBOARDING_STEP_IDS.PROFILE);
    }
  }, [draft, completeStep, updateStepProgress]);

  // Monitor campaign creation
  useEffect(() => {
    if (!draft) return;

    const { content, image } = draft;
    
    // Calculate campaign progress
    let campaignProgress = 0;
    if (content.headline) campaignProgress += 30;
    if (content.description) campaignProgress += 30;
    if (content.callToAction) campaignProgress += 20;
    if (image) campaignProgress += 20;

    updateStepProgress(ONBOARDING_STEP_IDS.CAMPAIGN, campaignProgress);

    // Complete campaign step when content is ready
    if (content.headline && content.description && content.callToAction && image) {
      completeStep(ONBOARDING_STEP_IDS.CAMPAIGN);
    }
  }, [draft, completeStep, updateStepProgress]);

  // Monitor channel connections
  useEffect(() => {
    if (!draft) return;

    const { channels } = draft;
    const connectedChannels = Object.values(channels).filter(channel => channel.connected);
    const channelProgress = (connectedChannels.length / Object.keys(channels).length) * 100;

    updateStepProgress(ONBOARDING_STEP_IDS.ACCOUNTS, channelProgress);

    if (connectedChannels.length > 0) {
      completeStep(ONBOARDING_STEP_IDS.ACCOUNTS);
    }
  }, [draft, completeStep, updateStepProgress]);

  // Monitor campaign launch
  useEffect(() => {
    if (!draft) return;

    const { budget } = draft;
    
    // Calculate launch readiness
    let launchProgress = 0;
    if (budget.dailyBudget >= 50) launchProgress += 40;
    if (budget.startDate) launchProgress += 30;
    if (budget.endDate) launchProgress += 30;

    updateStepProgress(ONBOARDING_STEP_IDS.LAUNCH, launchProgress);

    // Ready to launch when budget is set
    if (budget.dailyBudget >= 50 && budget.startDate && budget.endDate) {
      // Don't auto-complete launch - user should manually launch
      updateStepProgress(ONBOARDING_STEP_IDS.LAUNCH, 90);
    }
  }, [draft, updateStepProgress]);

  return {
    markLaunchComplete: () => completeStep(ONBOARDING_STEP_IDS.LAUNCH)
  };
}