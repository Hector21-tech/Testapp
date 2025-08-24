import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type { CampaignDraft, CompanyProfile, ConnectedChannels, AdContent, AdImage, BudgetAndTargeting, WizardStep } from './types';

interface CampaignWizardState {
  // Current draft
  draft: CampaignDraft | null;
  
  // Wizard navigation
  currentStep: number;
  profileSubStep: number;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  
  // Actions
  initializeDraft: () => void;
  loadDraft: (draftId: string) => void;
  updateProfile: (profile: Partial<CompanyProfile>) => void;
  updateChannels: (channels: Partial<ConnectedChannels>) => void;
  updateContent: (content: Partial<AdContent>) => void;
  updateImage: (image: AdImage | null) => void;
  updateBudget: (budget: Partial<BudgetAndTargeting>) => void;
  
  // Navigation
  setCurrentStep: (step: number) => void;
  setProfileSubStep: (subStep: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  nextProfileStep: () => void;
  previousProfileStep: () => void;
  
  // Profile completion
  markProfileComplete: () => void;
  
  // Persistence
  saveDraft: () => Promise<void>;
  deleteDraft: () => void;
  
  // Validation
  validateCurrentStep: () => boolean;
  canProceedToStep: (step: number) => boolean;
  
  // Utilities
  reset: () => void;
}

const createEmptyDraft = (): CampaignDraft => ({
  profile: {
    companyName: '',
    orgNumber: '',
    industry: '',
    customIndustry: '',
    targetingAreas: [],
    customTargetingAreas: [],
    radius: 0,  // Default to no radius
    website: '',
    goals: [],
    ageRangeMin: 25,
    ageRangeMax: 65,
    targetGender: 'all',
    interests: [],
    description: ''
  },
  channels: {
    facebook: { connected: false },
    google: { connected: false },
    instagram: { connected: false }
  },
  content: {
    headline: '',
    description: '',
    callToAction: ''
  },
  budget: {
    dailyBudget: 200,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    targeting: {
      locations: [],
      interests: [],
      ageMin: 25,
      ageMax: 65
    }
  },
  currentStep: 1,
  profileSubStep: 1,
  isProfileComplete: false,
  lastSaved: new Date().toISOString(),
  version: 1
});

export const useCampaignWizard = create<CampaignWizardState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        draft: null,
        currentStep: 1,
        profileSubStep: 1,
        isLoading: false,
        isSaving: false,

        initializeDraft: () => {
          set({ 
            draft: createEmptyDraft(),
            currentStep: 1,
            profileSubStep: 1
          });
        },

        loadDraft: (draftId: string) => {
          set({ isLoading: true });
          // TODO: Load from API
          const savedDraft = localStorage.getItem(`campaign-draft-${draftId}`);
          if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            set({ 
              draft,
              currentStep: draft.currentStep,
              profileSubStep: draft.profileSubStep,
              isLoading: false
            });
          } else {
            get().initializeDraft();
            set({ isLoading: false });
          }
        },

        updateProfile: (profileUpdate) => {
          const { draft } = get();
          if (!draft) return;
          
          set({
            draft: {
              ...draft,
              profile: { ...draft.profile, ...profileUpdate },
              lastSaved: new Date().toISOString()
            }
          });
        },

        updateChannels: (channelsUpdate) => {
          const { draft } = get();
          if (!draft) return;
          
          set({
            draft: {
              ...draft,
              channels: { ...draft.channels, ...channelsUpdate },
              lastSaved: new Date().toISOString()
            }
          });
        },

        updateContent: (contentUpdate) => {
          const { draft } = get();
          if (!draft) return;
          
          set({
            draft: {
              ...draft,
              content: { ...draft.content, ...contentUpdate },
              lastSaved: new Date().toISOString()
            }
          });
        },

        updateImage: (image: AdImage | null) => {
          const { draft } = get();
          if (!draft) return;
          
          set({
            draft: {
              ...draft,
              image,
              lastSaved: new Date().toISOString()
            }
          });
        },

        updateBudget: (budgetUpdate) => {
          const { draft } = get();
          if (!draft) return;
          
          set({
            draft: {
              ...draft,
              budget: { ...draft.budget, ...budgetUpdate },
              lastSaved: new Date().toISOString()
            }
          });
        },

        setCurrentStep: (step) => {
          const { draft } = get();
          if (!draft) return;
          
          set({
            currentStep: step,
            draft: { ...draft, currentStep: step }
          });
        },

        setProfileSubStep: (subStep) => {
          const { draft } = get();
          if (!draft) return;
          
          set({
            profileSubStep: subStep,
            draft: { ...draft, profileSubStep: subStep }
          });
        },

        nextStep: () => {
          const { currentStep } = get();
          if (currentStep < 6 && get().canProceedToStep(currentStep + 1)) {
            get().setCurrentStep(currentStep + 1);
          }
        },

        previousStep: () => {
          const { currentStep } = get();
          if (currentStep > 1) {
            get().setCurrentStep(currentStep - 1);
          }
        },

        nextProfileStep: () => {
          const { profileSubStep } = get();
          if (profileSubStep < 8) {
            get().setProfileSubStep(profileSubStep + 1);
          } else if (profileSubStep === 8) {
            // Go to channel connection step (step 9) for campaign creation
            get().setProfileSubStep(9);
          } else {
            get().markProfileComplete();
          }
        },

        previousProfileStep: () => {
          const { profileSubStep } = get();
          if (profileSubStep > 1) {
            get().setProfileSubStep(profileSubStep - 1);
          }
        },

        markProfileComplete: () => {
          const { draft } = get();
          if (!draft) return;
          
          set({
            draft: { ...draft, isProfileComplete: true },
            currentStep: 2,
            profileSubStep: 9  // Keep at step 9 to show completed state
          });
        },

        saveDraft: async () => {
          const { draft } = get();
          if (!draft) return;
          
          set({ isSaving: true });
          
          try {
            // TODO: Save to API
            const draftId = draft.id || `draft-${Date.now()}`;
            localStorage.setItem(`campaign-draft-${draftId}`, JSON.stringify({
              ...draft,
              id: draftId,
              lastSaved: new Date().toISOString()
            }));
            
            set({
              draft: { ...draft, id: draftId, lastSaved: new Date().toISOString() },
              isSaving: false
            });
          } catch (error) {
            console.error('Failed to save draft:', error);
            set({ isSaving: false });
          }
        },

        deleteDraft: () => {
          const { draft } = get();
          if (!draft?.id) return;
          
          localStorage.removeItem(`campaign-draft-${draft.id}`);
          set({ draft: null, currentStep: 1, profileSubStep: 1 });
        },

        validateCurrentStep: () => {
          const { draft, currentStep, profileSubStep } = get();
          if (!draft) return false;
          
          // For 6-step campaign wizard
          switch (currentStep) {
            case 1: // Company Setup - validate profile completed AND at least one channel connected
              return (draft.isProfileComplete || validateProfileSubStep(draft.profile, profileSubStep)) && 
                     Object.values(draft.channels).some(channel => channel.connected);
            case 2: // Platform Selection - require at least one platform selected for campaign
              return Object.values(draft.channels).some(channel => channel.activeForCampaign);
            case 3: // Content - require headline, description, and CTA
              return !!(draft.content.headline && draft.content.description && draft.content.callToAction);
            case 4: // Image - optional but let's require it for completeness
              return !!draft.image;
            case 5: // Budget - validate budget and dates
              return draft.budget.dailyBudget >= 50 && 
                     !!draft.budget.startDate && 
                     !!draft.budget.endDate &&
                     new Date(draft.budget.endDate) > new Date(draft.budget.startDate);
            case 6: // Review - always valid (user just reviews)
              return true;
            default:
              return false;
          }
        },

        canProceedToStep: (step) => {
          const { draft } = get();
          if (!draft) return false;
          
          // For 6-step campaign wizard:
          if (step <= 1) return true;
          
          // Step 2 (Platform Selection) requires completed profile AND connected channels
          if (step === 2) return draft.isProfileComplete && Object.values(draft.channels).some(channel => channel.connected);
          
          // Step 3 (Content) requires at least one platform selected for campaign
          if (step === 3) return Object.values(draft.channels).some(channel => channel.activeForCampaign);
          
          // Step 4 (Image) requires content to be filled
          if (step === 4) return !!(draft.content.headline && draft.content.description && draft.content.callToAction);
          
          // Step 5 (Budget) requires image
          if (step === 5) return !!draft.image;
          
          // Step 6 (Review) requires valid budget
          if (step === 6) return draft.budget.dailyBudget >= 50 && 
                                 !!draft.budget.startDate && 
                                 !!draft.budget.endDate &&
                                 new Date(draft.budget.endDate) > new Date(draft.budget.startDate);
          
          return false;
        },

        reset: () => {
          set({
            draft: null,
            currentStep: 1,
            profileSubStep: 1,
            isLoading: false,
            isSaving: false
          });
        }
      }),
      {
        name: 'campaign-wizard-storage',
        partialize: (state) => ({ 
          draft: state.draft,
          currentStep: state.currentStep,
          profileSubStep: state.profileSubStep
        })
      }
    )
  )
);

// Helper function to validate profile substeps
function validateProfileSubStep(profile: CompanyProfile, subStep: number): boolean {
  switch (subStep) {
    case 1: // Company - requires both name and org number for billing and security
      return !!profile.companyName && !!profile.orgNumber;
    case 2: // Industry
      return !!profile.industry;
    case 3: // Targeting Areas
      return profile.targetingAreas?.length > 0;
    case 4: // Website (optional)
      return true;
    case 5: // Goals
      return profile.goals.length > 0;
    case 6: // Age range
      return profile.ageRangeMin > 0 && profile.ageRangeMax > profile.ageRangeMin;
    case 7: // Interests
      return profile.interests.length > 0;
    case 8: // Description (optional)
      return true;
    default:
      return false;
  }
}

// Auto-save functionality
useCampaignWizard.subscribe(
  (state) => state.draft,
  (draft) => {
    if (draft) {
      // Debounced auto-save every 3 seconds
      const timeoutId = setTimeout(() => {
        useCampaignWizard.getState().saveDraft();
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
  }
);