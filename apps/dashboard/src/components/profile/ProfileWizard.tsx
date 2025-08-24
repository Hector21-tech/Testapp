import React from 'react';
import { 
  BuildingOfficeIcon, 
  WrenchScrewdriverIcon, 
  MapPinIcon, 
  GlobeAltIcon,
  FlagIcon as TargetIcon,
  UserGroupIcon,
  HeartIcon,
  DocumentTextIcon
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
import { INDUSTRIES, BUSINESS_GOALS, TARGET_INTERESTS } from '../../features/campaign/types';
import { SWEDISH_LOCATIONS } from '../../data/swedishLocations';
import { validateCompanyInfo, validateSwedishOrgNumber } from '../../utils/validation';
import type { Step } from '../wizard/Stepper';

const PROFILE_STEPS: Step[] = [
  { id: '1', title: 'Företag', completed: false, current: true },
  { id: '2', title: 'Bransch', completed: false, current: false },
  { id: '3', title: 'Områden', completed: false, current: false },
  { id: '4', title: 'Webb', completed: false, current: false },
  { id: '5', title: 'Mål', completed: false, current: false },
  { id: '6', title: 'Ålder', completed: false, current: false },
  { id: '7', title: 'Intressen', completed: false, current: false },
  { id: '8', title: 'Beskrivning', completed: false, current: false }
];

export function ProfileWizard() {
  const {
    draft,
    profileSubStep,
    updateProfile,
    nextProfileStep,
    previousProfileStep,
    validateCurrentStep,
    isSaving
  } = useCampaignWizard();
  
  const [validationErrors, setValidationErrors] = React.useState<{ field: string; message: string }[]>([]);
  const [validationWarnings, setValidationWarnings] = React.useState<{ field: string; message: string }[]>([]);

  if (!draft) return null;

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
  const steps = PROFILE_STEPS.map((step, index) => ({
    ...step,
    completed: index < profileSubStep - 1,
    current: index === profileSubStep - 1
  }));

  const canGoNext = validateCurrentStep();
  const canGoBack = profileSubStep > 1;

  const handleNext = () => {
    if (canGoNext) {
      nextProfileStep();
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      previousProfileStep();
    }
  };

  const handleSaveDraft = async () => {
    const { saveDraft } = useCampaignWizard.getState();
    await saveDraft();
    // TODO: Show toast notification
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
              onIndustryChange={(industry) => updateProfile({ industry })}
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

      case 4:
        return (
          <StepCard
            title="Har du en webbplats?"
            description="Vi kan länka till din webbplats i annonserna för att visa mer information."
            icon={<GlobeAltIcon className="w-6 h-6" />}
          >
            <TextInput
              label="Webbplats"
              value={profile.website || ''}
              onChange={(value) => updateProfile({ website: value })}
              placeholder="t.ex. www.dittforetag.se (valfritt)"
              type="url"
              hint="Lämna tomt om du inte har en webbplats"
              icon={<GlobeAltIcon className="w-4 h-4" />}
            />
          </StepCard>
        );

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
            title="Vilken åldersgrupp vill du nå?"
            description="Berätta vilka kunder som vanligtvis köper dina tjänster."
            icon={<UserGroupIcon className="w-6 h-6" />}
          >
            <div className="space-y-6">
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
              <div className="bg-brand/5 p-4 rounded-xl">
                <p className="text-sm text-brand-dark">
                  <strong>Målgrupp:</strong> {profile.ageRangeMin}-{profile.ageRangeMax} år
                </p>
              </div>
            </div>
          </StepCard>
        );

      case 7:
        return (
          <StepCard
            title="Vilka intressen har dina kunder?"
            description="Detta hjälper oss visa annonserna för personer som är intresserade av dina tjänster."
            icon={<HeartIcon className="w-6 h-6" />}
          >
            <ChipTags
              label="Välj relevanta intressen"
              selectedValues={profile.interests}
              onChange={(values) => updateProfile({ interests: values })}
              options={TARGET_INTERESTS.map(interest => ({
                value: interest.value,
                label: interest.label
              }))}
              maxSelections={5}
              allowCustom={true}
              customPlaceholder="Lägg till annat intresse..."
              hint="Välj upp till 5 intressen som passar dina kunder bäst"
              icon={<HeartIcon className="w-4 h-4" />}
              required
            />
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
                    <p className="font-medium">{profile.ageRangeMin}-{profile.ageRangeMax} år</p>
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
            <h1 className="heading-lg mb-2">Skapa din företagsprofil</h1>
            <p className="body text-neutral-600">
              {profileSubStep} av 8 klart - berätta om ditt företag så vi kan skapa perfekta annonser
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
        onNext={handleNext}
        onSaveDraft={handleSaveDraft}
        previousLabel="Tillbaka"
        nextLabel={profileSubStep === 8 ? "Slutför profil" : "Nästa"}
        canGoBack={canGoBack}
        canProceed={canGoNext}
        isSaving={isSaving}
        showSaveDraft={true}
      />
    </div>
  );
}