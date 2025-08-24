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

import { useCampaignWizard } from '../../features/campaign/store';
import { INDUSTRIES, BUSINESS_GOALS, TARGET_INTERESTS } from '../../features/campaign/types';
import type { Step } from '../wizard/Stepper';

const PROFILE_STEPS: Step[] = [
  { id: '1', title: 'Företag', completed: false, current: true },
  { id: '2', title: 'Bransch', completed: false, current: false },
  { id: '3', title: 'Plats', completed: false, current: false },
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

  if (!draft) return null;

  const { profile } = draft;
  
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
        return (
          <StepCard
            title="Berätta om ditt företag"
            description="Detta hjälper oss skapa relevanta annonser för dig."
            icon={<BuildingOfficeIcon className="w-6 h-6" />}
          >
            <div className="space-y-6">
              <TextInput
                label="Företagsnamn"
                value={profile.companyName}
                onChange={(value) => updateProfile({ companyName: value })}
                placeholder="t.ex. Johanssons Snickeri AB"
                required
                icon={<BuildingOfficeIcon className="w-4 h-4" />}
              />
              <TextInput
                label="Organisationsnummer"
                value={profile.orgNumber || ''}
                onChange={(value) => updateProfile({ orgNumber: value })}
                placeholder="t.ex. 556123-4567 (valfritt)"
                hint="Gör det lättare för kunder att verifiera ditt företag"
              />
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
            <RadioCards
              label="Välj din huvudsakliga bransch"
              value={profile.industry}
              onChange={(value) => updateProfile({ industry: value })}
              options={INDUSTRIES.map(industry => ({
                value: industry.value,
                label: industry.label,
                icon: <span className="text-2xl">{industry.icon}</span>
              }))}
              required
              columns={2}
            />
          </StepCard>
        );

      case 3:
        return (
          <StepCard
            title="Var arbetar du?"
            description="Detta hjälper oss visa dina annonser för rätt geografiska område."
            icon={<MapPinIcon className="w-6 h-6" />}
          >
            <div className="space-y-6">
              <TextInput
                label="Stad eller ort"
                value={profile.location}
                onChange={(value) => updateProfile({ location: value })}
                placeholder="t.ex. Stockholm, Göteborg, Malmö"
                required
                icon={<MapPinIcon className="w-4 h-4" />}
              />
              <RangeSlider
                label="Arbetsradie"
                value={profile.radius}
                onChange={(value) => updateProfile({ radius: value })}
                min={5}
                max={100}
                unit="km"
                hint="Hur långt är du villig att resa för uppdrag?"
                icon={<MapPinIcon className="w-4 h-4" />}
              />
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
            description="Detta hjälper oss optimera annonserna för bästa resultat."
            icon={<TargetIcon className="w-6 h-6" />}
          >
            <RadioCards
              label="Välj ditt primära mål med annonserna"
              value={profile.goals[0] || ''}
              onChange={(value) => updateProfile({ goals: [value] })}
              options={BUSINESS_GOALS.map(goal => ({
                value: goal.value,
                label: goal.label,
                description: goal.description,
                icon: <span className="text-2xl">{goal.icon}</span>
              }))}
              required
              columns={1}
            />
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
                onChange={(value) => updateProfile({ ageRangeMin: value })}
                min={18}
                max={75}
                unit="år"
                icon={<UserGroupIcon className="w-4 h-4" />}
              />
              <RangeSlider
                label="Högsta ålder"
                value={profile.ageRangeMax}
                onChange={(value) => updateProfile({ ageRangeMax: value })}
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
                      {INDUSTRIES.find(i => i.value === profile.industry)?.label || 'Ej valt'}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Plats:</span>
                    <p className="font-medium">{profile.location || 'Ej angivet'}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Radie:</span>
                    <p className="font-medium">{profile.radius} km</p>
                  </div>
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
            <h1 className="heading-lg mb-2">Företagsprofil</h1>
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
        canGoNext={canGoNext}
        isNextLoading={isSaving}
        showSaveDraft={true}
      />
    </div>
  );
}