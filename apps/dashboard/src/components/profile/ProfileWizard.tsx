import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  WrenchScrewdriverIcon, 
  MapPinIcon, 
  GlobeAltIcon,
  FlagIcon as TargetIcon,
  UserGroupIcon,
  HeartIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  TrashIcon,
  LinkIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

import { StepCard } from '../wizard/StepCard';
import { WizardFooter } from '../wizard/WizardFooter';
import { Stepper } from '../wizard/Stepper';
import { TextInput, Select, RadioCards, ChipTags, RangeSlider } from '../fields';
import { IndustryComboBox } from '../fields/IndustryComboBox';
import { LocationComboBox } from '../fields/LocationComboBox';
import { TargetingAreasComboBox } from '../fields/TargetingAreasComboBox';
import { GoalsComboBox } from '../fields/GoalsComboBox';

import { useCampaignWizard } from '../../features/campaign/store';
import { INDUSTRIES, BUSINESS_GOALS, TARGET_GENDERS, CUSTOMER_NEEDS_BY_INDUSTRY } from '../../features/campaign/types';
import { SWEDISH_LOCATIONS } from '../../data/swedishLocations';
import { validateCompanyInfo, validateSwedishOrgNumber } from '../../utils/validation';
// import { useOnboardingIntegration } from '../../hooks/useOnboardingIntegration';
import type { Step } from '../wizard/Stepper';

const PROFILE_STEPS: Step[] = [
  { id: '1', title: 'Företag', completed: false, current: true },
  { id: '2', title: 'Bransch', completed: false, current: false },
  { id: '3', title: 'Områden', completed: false, current: false },
  { id: '4', title: 'Webb', completed: false, current: false },
  { id: '5', title: 'Mål', completed: false, current: false },
  { id: '6', title: 'Ålder', completed: false, current: false },
  { id: '7', title: 'Intressen', completed: false, current: false },
  { id: '8', title: 'Beskrivning', completed: false, current: false },
  { id: '9', title: 'Kanaler', completed: false, current: false }
];

export function ProfileWizard() {
  const navigate = useNavigate();
  const {
    draft,
    profileSubStep,
    updateProfile,
    nextProfileStep,
    previousProfileStep,
    setProfileSubStep,
    isSaving,
    initializeDraft,
    updateChannels,
    markProfileComplete
  } = useCampaignWizard();
  
  const [validationErrors, setValidationErrors] = React.useState<{ field: string; message: string }[]>([]);
  const [validationWarnings, setValidationWarnings] = React.useState<{ field: string; message: string }[]>([]);

  // URL validation helper
  const validateWebsite = (url: string): { isValid: boolean; warning?: string; suggestion?: string } => {
    if (!url.trim()) return { isValid: true }; // Empty is OK
    
    // Basic URL pattern check
    const hasProtocol = url.includes('://');
    const hasDomain = url.includes('.');
    
    if (!hasProtocol && !hasDomain) {
      return { 
        isValid: true, 
        warning: 'Kontrollera att detta är rätt webbadress',
        suggestion: `Menade du: https://www.${url}.se?`
      };
    }
    
    if (!hasProtocol && hasDomain) {
      return { 
        isValid: true, 
        warning: 'Saknar protokoll (https://)',
        suggestion: `Förslag: https://${url}`
      };
    }
    
    return { isValid: true };
  };

  // Profile-specific validation function
  const validateCurrentProfileStep = () => {
    if (!draft) return false;
    
    const { profile } = draft;
    switch (profileSubStep) {
      case 1: // Company - requires both name and org number
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
      case 9: // Channel connection (optional for profile completion)
        return true;
      default:
        return false;
    }
  };

  // Initialize draft on mount
  React.useEffect(() => {
    if (!draft) {
      initializeDraft();
    }
  }, [draft, initializeDraft]);

  // Initialize onboarding integration
  // useOnboardingIntegration();

  if (!draft) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  const { profile } = draft;

  // Temporarily disable validation to debug blank page
  // React.useEffect(() => {
  //   try {
  //     if (profileSubStep === 1 && (profile.companyName || profile.orgNumber)) {
  //       const validation = validateCompanyInfo(profile.companyName || '', profile.orgNumber || '');
  //       setValidationErrors(validation.errors);
  //       setValidationWarnings(validation.warnings);
  //     } else if (profileSubStep !== 1) {
  //       setValidationErrors([]);
  //       setValidationWarnings([]);
  //     }
  //   } catch (error) {
  //     console.error('Validation error:', error);
  //     setValidationErrors([]);
  //     setValidationWarnings([]);
  //   }
  // }, [profile.companyName, profile.orgNumber, profileSubStep]);
  
  // Update steps based on current progress
  const steps = PROFILE_STEPS.map((step, index) => {
    const stepNumber = index + 1;
    const isCompleted = stepNumber < profileSubStep;
    const isCurrent = stepNumber === profileSubStep;
    const canGoToStep = stepNumber <= profileSubStep || 
                       (stepNumber === profileSubStep + 1 && validateCurrentProfileStep());
    
    return {
      ...step,
      completed: isCompleted,
      current: isCurrent,
      disabled: !canGoToStep
    };
  });

  const canGoNext = validateCurrentProfileStep();
  const canGoBack = profileSubStep > 1;

  const handleNext = () => {
    if (canGoNext) {
      if (profileSubStep === 9) {
        // Special handling for final step - mark profile as complete
        console.log('ProfileWizard: Marking profile as complete');
        console.log('Current draft:', draft);
        markProfileComplete();
      } else {
        nextProfileStep();
      }
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      previousProfileStep();
    }
  };

  const handleStepClick = (stepIndex: number) => {
    const targetStep = stepIndex + 1; // Convert from 0-based index to 1-based step
    
    // Allow clicking on:
    // 1. Completed steps (can go back to any completed step)
    // 2. Current step (no-op but allowed)
    // 3. Next step only if current step is valid (can go forward one step)
    const canGoToStep = targetStep <= profileSubStep || 
                        (targetStep === profileSubStep + 1 && validateCurrentProfileStep());
    
    if (canGoToStep && targetStep <= 9) { // Max 9 steps in profile wizard
      setProfileSubStep(targetStep);
    }
  };

  const handleSaveDraft = async () => {
    const { saveDraft } = useCampaignWizard.getState();
    await saveDraft();
    // TODO: Show toast notification
  };

  const handleReset = () => {
    if (window.confirm('Är du säker på att du vill nollställa all företagsinformation? Detta går inte att ångra.')) {
      initializeDraft();
      setValidationErrors([]);
      setValidationWarnings([]);
    }
  };

  // Step-specific content
  const renderStepContent = () => {
    switch (profileSubStep) {
      case 1:
        const companyNameError = validationErrors.find(e => e.field === 'companyName');
        const orgNumberError = validationErrors.find(e => e.field === 'orgNumber');
        const companyNameWarning = validationWarnings.find(w => w.field === 'companyName');
        const orgNumberWarning = validationWarnings.find(w => w.field === 'orgNumber');

        return (
          <StepCard
            title="Grundläggande information"
            description="Vi behöver korrekt företagsinformation för fakturering och verifiering."
            icon={<BuildingOfficeIcon className="w-6 h-6" />}
          >
            <div className="space-y-6">
              <TextInput
                label="Företagsnamn"
                value={profile.companyName}
                onChange={(value) => {
                  updateProfile({ companyName: value });
                }}
                placeholder="t.ex. Johanssons Snickeri AB"
                required
                icon={<BuildingOfficeIcon className="w-4 h-4" />}
                error={companyNameError?.message}
                hint={companyNameWarning?.message || "Ange företagets officiella namn som det står i företagsregistret"}
              />
              <TextInput
                label="Organisationsnummer"
                value={profile.orgNumber || ''}
                onChange={(value) => {
                  // Auto-format org number as user types
                  const digitsOnly = value.replace(/\D/g, '');
                  let formatted = value;
                  if (digitsOnly.length >= 6) {
                    formatted = `${digitsOnly.slice(0, 6)}-${digitsOnly.slice(6, 10)}`;
                  }
                  updateProfile({ orgNumber: formatted });
                }}
                placeholder="YYMMDD-XXXX"
                required
                icon={<BuildingOfficeIcon className="w-4 h-4" />}
                error={orgNumberError?.message}
                hint={orgNumberWarning?.message || "Krävs för fakturering. Format: YYMMDD-XXXX (10 siffror)"}
              />

              {/* Validation Summary */}
              {validationErrors.length === 0 && profile.companyName && profile.orgNumber && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-sm text-green-700">
                    ✅ <strong>Företagsinformation validerad</strong> - redo för fakturering
                  </p>
                </div>
              )}
            </div>
          </StepCard>
        );

      case 2:
        return (
          <StepCard
            title="Vilken bransch arbetar du inom?"
            description="Vi använder detta för att skapa branschspecifika annonser."
            icon={<WrenchScrewdriverIcon className="w-6 h-6" />}
          >
            <IndustryComboBox
              value={profile.industry}
              customIndustry={profile.customIndustry}
              onIndustryChange={(industry) => updateProfile({ 
                industry, 
                interests: [] // Clear interests when industry changes
              })}
              onCustomIndustryChange={(customIndustry) => updateProfile({ customIndustry })}
              placeholder="Sök efter din bransch..."
              helperText="Skriv några bokstäver för att söka bland hundratals branscher"
              required
            />
          </StepCard>
        );

      case 3:
        return (
          <StepCard
            title="Vilka områden vill du nå?"
            description="Välj de städer och orter där du vill visa dina annonser."
            icon={<MapPinIcon className="w-6 h-6" />}
          >
            <div className="space-y-6">
              <TargetingAreasComboBox
                value={profile.targetingAreas || []}
                onChange={(areas) => updateProfile({ targetingAreas: areas })}
                placeholder="Sök och välj områden..."
                helperText="Välj de städer och orter där du vill visa dina annonser"
                maxSelections={10}
                required
              />
              
              {/* Radius options - only show if not "Hela Sverige" */}
              {!(profile.targetingAreas?.length === 1 && profile.targetingAreas[0] === 'Hela Sverige') && (
                <div className="bg-brand/5 p-4 rounded-xl">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.radius > 0}
                      onChange={(e) => updateProfile({ radius: e.target.checked ? 25 : 0 })}
                      className="w-4 h-4 text-brand border-neutral-300 rounded focus:ring-brand"
                    />
                    <span className="text-sm font-medium text-brand-dark">
                      Inkludera områden runt dessa orter
                    </span>
                  </label>
                  {profile.radius > 0 && (
                    <div className="mt-4">
                      <RangeSlider
                        label="Radie runt valda orter"
                        value={profile.radius}
                        onChange={(value) => updateProfile({ radius: value as number })}
                        min={5}
                        max={50}
                        unit="km"
                        hint="Inkludera närliggande områden inom denna radie"
                        icon={<MapPinIcon className="w-4 h-4" />}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Info message when "Hela Sverige" is selected */}
              {profile.targetingAreas?.length === 1 && profile.targetingAreas[0] === 'Hela Sverige' && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-sm text-green-700">
                    <strong>Perfect!</strong> Med "Hela Sverige" når du alla potentiella kunder i landet. 
                    Inga ytterligare inställningar behövs.
                  </p>
                </div>
              )}
            </div>
          </StepCard>
        );

      case 4: {
        const websiteValidation = validateWebsite(profile.website || '');
        
        return (
          <StepCard
            title="Har du en webbplats?"
            description="Vi kan länka till din webbplats i annonserna för att visa mer information."
            icon={<GlobeAltIcon className="w-6 h-6" />}
          >
            <div className="space-y-4">
              <TextInput
                label="Webbplats"
                value={profile.website || ''}
                onChange={(value) => updateProfile({ website: value })}
                placeholder="t.ex. www.dittforetag.se (valfritt)"
                type="text"
                hint="Lämna tomt om du inte har en webbplats"
                icon={<GlobeAltIcon className="w-4 h-4" />}
              />
              
              {/* URL validation feedback */}
              {websiteValidation.warning && profile.website && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-600">⚠️</span>
                    <div className="flex-1">
                      <p className="text-sm text-amber-800 font-medium">{websiteValidation.warning}</p>
                      {websiteValidation.suggestion && (
                        <div className="mt-2 flex items-center space-x-2">
                          <p className="text-sm text-amber-700">{websiteValidation.suggestion}</p>
                          <button
                            onClick={() => updateProfile({ website: websiteValidation.suggestion?.split(': ')[1] || websiteValidation.suggestion })}
                            className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded transition-colors"
                          >
                            Använd detta
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </StepCard>
        );
      }

      case 5:
        return (
          <StepCard
            title="Vad är ditt huvudmål?"
            description="Vi anpassar annonstyp, målgrupp och budskap efter ditt specifika mål."
            icon={<TargetIcon className="w-6 h-6" />}
          >
            <div className="space-y-6">
              <GoalsComboBox
                value={profile.goals[0] || ''}
                onChange={(value) => updateProfile({ goals: [value] })}
                placeholder="Sök efter ditt huvudmål..."
                helperText="Välj det mål som är viktigast för ditt företag just nu"
                industry={profile.industry}
                required
              />

              {/* Additional goal-specific questions */}
              {profile.goals[0] && (
                <div className="bg-neutral-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-neutral-900 mb-3">
                    Berätta mer om ditt mål
                  </h4>
                  
                  {profile.goals[0] === 'leads' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Vad är ett vanligt uppdrag värt för dig?
                        </label>
                        <select className="select w-full">
                          <option value="">Välj prisintervall</option>
                          <option value="under-5000">Under 5 000 kr</option>
                          <option value="5000-15000">5 000 - 15 000 kr</option>
                          <option value="15000-50000">15 000 - 50 000 kr</option>
                          <option value="over-50000">Över 50 000 kr</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Hur många nya uppdrag vill du ha per månad?
                        </label>
                        <select className="select w-full">
                          <option value="">Välj antal</option>
                          <option value="1-2">1-2 uppdrag</option>
                          <option value="3-5">3-5 uppdrag</option>
                          <option value="6-10">6-10 uppdrag</option>
                          <option value="over-10">Fler än 10 uppdrag</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {profile.goals[0] === 'calls' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Vilken typ av samtal föredrar du?
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Akuta uppdrag (samma dag)</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Planerade uppdrag (inom veckan)</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Större projekt (offertförfrågan)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.goals[0] === 'website' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Vad vill du att besökarna ska göra på din webbplats?
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Läsa om mina tjänster</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Se exempel på mitt arbete</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Kontakta mig för offert</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Ladda ner prislista/broschyr</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.goals[0] === 'awareness' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Vad vill du bli känd för?
                        </label>
                        <textarea 
                          className="textarea w-full"
                          placeholder="t.ex. Snabb service, hög kvalitet, miljövänliga lösningar..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Hur mäter du framgång för kännedomsbyggande?
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Fler som känner till mitt företag</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Fler besökare på sociala medier</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Fler rekommendationer från kunder</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </StepCard>
        );

      case 6:
        return (
          <StepCard
            title="Vilken målgrupp vill du nå?"
            description="Berätta om ålder och kön för de kunder som vanligtvis köper dina tjänster."
            icon={<UserGroupIcon className="w-6 h-6" />}
          >
            <div className="space-y-6">
              {/* Gender Selection */}
              <RadioCards
                label="Kön"
                value={profile.targetGender || 'all'}
                onChange={(value) => updateProfile({ targetGender: value })}
                options={TARGET_GENDERS.map(gender => ({
                  value: gender.value,
                  label: gender.label,
                  description: gender.description,
                  icon: <span className="text-xl">{gender.icon}</span>
                }))}
                required
                columns={2}
              />

              {/* Age Range */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-neutral-700">Åldersgrupp</h4>
                <RangeSlider
                  label="Lägsta ålder"
                  value={profile.ageRangeMin}
                  onChange={(value) => updateProfile({ ageRangeMin: value as number })}
                  min={18}
                  max={75}
                  unit="år"
                  icon={<UserGroupIcon className="w-4 h-4" />}
                />
                <RangeSlider
                  label="Högsta ålder"
                  value={profile.ageRangeMax}
                  onChange={(value) => updateProfile({ ageRangeMax: value as number })}
                  min={profile.ageRangeMin + 1}
                  max={80}
                  unit="år"
                  icon={<UserGroupIcon className="w-4 h-4" />}
                />
              </div>

              {/* Summary */}
              <div className="bg-brand/5 p-4 rounded-xl">
                <p className="text-sm text-brand-dark">
                  <strong>Målgrupp:</strong> {
                    TARGET_GENDERS.find(g => g.value === profile.targetGender)?.label || 'Alla kön'
                  }, {profile.ageRangeMin}-{profile.ageRangeMax} år
                </p>
              </div>
            </div>
          </StepCard>
        );

      case 7:
        // Get industry-specific customer needs
        const selectedIndustry = profile.industry || 'other';
        const customerNeeds = CUSTOMER_NEEDS_BY_INDUSTRY[selectedIndustry] || CUSTOMER_NEEDS_BY_INDUSTRY.other;
        
        return (
          <StepCard
            title="Vad behöver dina kunder hjälp med?"
            description="Vi visar dina annonser för personer som söker efter dessa lösningar."
            icon={<HeartIcon className="w-6 h-6" />}
          >
            <ChipTags
              label="Välj de behov dina kunder har"
              selectedValues={profile.interests}
              onChange={(values) => updateProfile({ interests: values })}
              options={customerNeeds.map(need => ({
                value: need.value,
                label: need.label,
                description: need.description
              }))}
              maxSelections={5}
              allowCustom={true}
              customPlaceholder="Lägg till annat kundbehov..."
              hint="Välj upp till 5 områden där du hjälper dina kunder"
              icon={<HeartIcon className="w-4 h-4" />}
              required
            />

            {/* Show examples based on industry */}
            <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
              <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                💡 Exempel för din bransch:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-neutral-600">
                {customerNeeds.slice(0, 4).map(need => (
                  <div key={need.value} className="flex items-start space-x-2">
                    <span className="text-brand">•</span>
                    <div>
                      <span className="font-medium">{need.label}</span>
                      {need.description && (
                        <div className="text-xs text-neutral-500">{need.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StepCard>
        );

      case 8:
        return (
          <StepCard
            title="Beskriv ditt företag"
            description="En kort beskrivning som vi kan använda i annonserna."
            icon={<DocumentTextIcon className="w-6 h-6" />}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <DocumentTextIcon className="w-4 h-4 inline mr-2 text-brand" />
                  Företagsbeskrivning (valfritt)
                </label>
                <textarea
                  value={profile.description || ''}
                  onChange={(e) => updateProfile({ description: e.target.value })}
                  placeholder="t.ex. Vi är ett erfaret snickeriföretag som hjälper husägare med allt från mindre reparationer till stora renoveringsprojekt. Med över 15 års erfarenhet garanterar vi kvalitet och pålitlighet."
                  className="textarea"
                  rows={4}
                />
                <p className="text-sm text-neutral-500 mt-2">
                  Detta hjälper oss skapa mer personliga annonstexter.
                </p>
              </div>
              
              {/* Profile Summary */}
              <div className="bg-neutral-50 p-6 rounded-xl">
                <h4 className="font-semibold text-neutral-900 mb-4">
                  📋 Sammanfattning av din profil
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">Företag:</span>
                    <p className="font-medium">{profile.companyName || 'Ej angivet'}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Bransch:</span>
                    <p className="font-medium">
                      {profile.industry === 'other' && profile.customIndustry 
                        ? profile.customIndustry
                        : INDUSTRIES.find(i => i.value === profile.industry)?.label || 'Ej valt'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Målområden:</span>
                    <p className="font-medium">
                      {profile.targetingAreas?.length > 0 
                        ? profile.targetingAreas[0] === 'Hela Sverige' 
                          ? 'Hela Sverige'
                          : `${profile.targetingAreas.length} områden valda`
                        : 'Ej angivet'
                      }
                    </p>
                  </div>
                  {profile.radius > 0 && (
                    <div>
                      <span className="text-neutral-500">Radie:</span>
                      <p className="font-medium">{profile.radius} km runt valda orter</p>
                    </div>
                  )}
                  <div>
                    <span className="text-neutral-500">Målgrupp:</span>
                    <p className="font-medium">
                      {TARGET_GENDERS.find(g => g.value === profile.targetGender)?.label || 'Alla kön'}, {profile.ageRangeMin}-{profile.ageRangeMax} år
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Intressen:</span>
                    <p className="font-medium">{profile.interests.length} valda</p>
                  </div>
                </div>
              </div>
            </div>
          </StepCard>
        );

      case 9:
        // Channel connection step - integrated into ProfileWizard for campaign creation
        return (
          <StepCard
            title="Koppla dina annonskanaler"
            description="Anslut dina Facebook och Google-konton så kan vi hjälpa dig publicera annonser."
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
                        {draft?.channels.facebook.connected 
                          ? `Ansluten: ${draft.channels.facebook.accountName}`
                          : 'Koppla ditt Facebook Business Manager-konto'
                        }
                      </p>
                    </div>
                  </div>
                  <div>
                    {draft?.channels.facebook.connected ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckBadgeIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold">Ansluten</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => updateChannels({
                          facebook: { connected: true, accountId: 'mock-123', accountName: 'Mock Business Account' }
                        })}
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
                        {draft?.channels.google.connected 
                          ? `Ansluten: ${draft.channels.google.accountName}`
                          : 'Koppla ditt Google Ads-konto'
                        }
                      </p>
                    </div>
                  </div>
                  <div>
                    {draft?.channels.google.connected ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckBadgeIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold">Ansluten</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => updateChannels({
                          google: { connected: true, accountId: 'mock-456', accountName: 'Mock Google Ads Account' }
                        })}
                        className="btn-primary btn-sm"
                      >
                        Koppla Google
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {Object.values(draft?.channels || {}).some(ch => ch.connected) ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-800">
                    <strong>Perfekt!</strong> Nu kan vi hjälpa dig skapa annonser på de plattformar du valt.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Tips:</strong> Du behöver koppla minst en kanal för att kunna skapa kampanjer.
                  </p>
                </div>
              )}
            </div>
          </StepCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header with Mini Stepper */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="text-center mb-6">
            <button 
              onClick={() => navigate('/')}
              className="heading-lg mb-2 hover:opacity-80 transition-opacity cursor-pointer inline-block" 
              style={{color: '#CC785C'}}
            >
              AnnonsHjälpen
            </button>
            <p className="body text-neutral-600 mt-2">
              {profileSubStep} av 9 klart - berätta om ditt företag och koppla kanaler så vi kan skapa perfekta annonser
            </p>
          </div>
          
          <Stepper 
            steps={steps} 
            variant="horizontal" 
            showProgress={true}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {renderStepContent()}
      </div>

      {/* Custom Footer with Reset */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Left Side - Back Button + Save Draft + Reset */}
          <div className="flex items-center space-x-4">
            {canGoBack && (
              <button
                onClick={handlePrevious}
                className="btn-ghost btn-sm flex items-center space-x-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Tillbaka</span>
              </button>
            )}
            
            {/* Save Draft */}
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="btn-ghost btn-sm flex items-center space-x-2 text-neutral-500 hover:text-brand disabled:opacity-50"
            >
              <BookmarkIcon className="w-4 h-4" />
              <span>{isSaving ? 'Sparar...' : 'Spara utkast'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="btn-ghost btn-sm flex items-center space-x-2 text-neutral-400 hover:text-red-600 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              <span className="text-xs">Rensa allt</span>
            </button>
          </div>

          {/* Right Side - Next Button */}
          <div>
            <button
              onClick={handleNext}
              disabled={!canGoNext || isSaving}
              className={`
                btn-primary btn-sm flex items-center space-x-2
                ${!canGoNext || isSaving ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sparar...</span>
                </>
              ) : (
                <>
                  <span>{profileSubStep === 9 ? "Slutför profil" : "Nästa"}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}