/**
 * Campaign Studio
 * 
 * A dedicated 4-step campaign creation wizard:
 * 1. Ad Content - Headlines, descriptions, CTAs with AI suggestions
 * 2. Select Image - Upload custom or choose from stock photos
 * 3. Budget & Targeting - Daily budget, dates, audience targeting
 * 4. Review & Launch - Final review and campaign launch
 * 
 * This runs after onboarding is complete (profile + channels are set up)
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  EyeIcon,
  SparklesIcon,
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

import { Stepper } from '../../components/wizard/Stepper';
import { StepCard } from '../../components/wizard/StepCard';
import { WizardFooter } from '../../components/wizard/WizardFooter';
import { AdImagePicker } from '../../components/AdImagePicker';
import { TextInput, Select, ChipTags, RangeSlider } from '../../components/fields';

import { useCampaignWizard } from '../../features/campaign/store';
import { CALL_TO_ACTIONS, INDUSTRIES } from '../../features/campaign/types';
import type { Step } from '../../components/wizard/Stepper';

const CAMPAIGN_STEPS: Step[] = [
  { id: '1', title: 'Annonsinnehåll', description: 'Skapa attraktiva texter', completed: false, current: true },
  { id: '2', title: 'Välj bild', description: 'Ladda upp eller välj foto', completed: false, current: false },
  { id: '3', title: 'Budget & mål', description: 'Bestäm kostnad och målgrupp', completed: false, current: false },
  { id: '4', title: 'Granska & starta', description: 'Kontrollera och lansera', completed: false, current: false }
];

export function CampaignStudio() {
  const navigate = useNavigate();
  const {
    draft,
    isLoading,
    isSaving,
    updateContent,
    updateImage,
    updateBudget,
    saveDraft
  } = useCampaignWizard();

  const [currentStep, setCurrentStep] = React.useState(1);

  useEffect(() => {
    // Check if onboarding is complete
    if (!draft || !draft.isProfileComplete || !Object.values(draft.channels).some(ch => ch.connected)) {
      navigate('/onboarding');
      return;
    }
  }, [draft, navigate]);

  if (isLoading || !draft) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-4"></div>
          <p className="body text-neutral-600">Laddar Campaign Studio...</p>
        </div>
      </div>
    );
  }

  // Update steps based on current progress
  const steps = CAMPAIGN_STEPS.map((step, index) => ({
    ...step,
    completed: index < currentStep - 1,
    current: index === currentStep - 1
  }));

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Campaign complete - redirect to dashboard
      alert('🚀 Kampanj skapad! (Demo - ingen riktig kampanj skapades)');
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSaveDraft = async () => {
    await saveDraft();
    // TODO: Show toast notification "Utkast sparat ✓"
  };

  // Mock function for AI content generation
  const mockGenerateContent = () => {
    const industryLabel = INDUSTRIES.find(i => i.value === draft.profile.industry)?.label || '';
    
    updateContent({
      generatedSuggestions: {
        headlines: [
          `Professionell ${industryLabel.toLowerCase()} i ${draft.profile.location}`,
          `${draft.profile.companyName} - Din pålitliga partner`,
          `Kvalitet och erfarenhet sedan många år`
        ],
        descriptions: [
          `Vi hjälper dig med alla typer av ${industryLabel.toLowerCase()}-tjänster. Kontakta oss för en kostnadsfri offert!`,
          `Erfaret team med över 15 års branschexpertis. Vi garanterar kvalitet och pålitlig service.`,
          `Från mindre reparationer till stora projekt - vi fixar det med precision och omsorg.`
        ],
        ctas: ['Begär offert', 'Kontakta oss idag', 'Ring för rådgivning']
      }
    });
  };

  // Validation
  const canGoNext = () => {
    switch (currentStep) {
      case 1: // Content
        return !!(draft.content.headline && draft.content.description && draft.content.callToAction);
      case 2: // Image
        return !!draft.image;
      case 3: // Budget
        return !!(draft.budget.dailyBudget > 0 && draft.budget.startDate && draft.budget.endDate);
      case 4: // Review
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepCard
            title="Skapa annonsinnehåll"
            description="Skriv attraktiva texter som får kunder att kontakta dig."
            icon={<DocumentTextIcon className="w-6 h-6" />}
          >
            <div className="space-y-6">
              {/* AI Generate Button */}
              <div className="text-center">
                <button
                  onClick={mockGenerateContent}
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>Generera förslag med AI</span>
                </button>
                <p className="text-sm text-neutral-500 mt-2">
                  Vi skapar förslag baserat på din bransch och plats
                </p>
              </div>

              {/* Generated Suggestions */}
              {draft.content.generatedSuggestions && (
                <div className="bg-brand/5 border border-brand/20 rounded-xl p-6">
                  <h4 className="font-semibold text-brand mb-4">✨ AI-genererade förslag</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Rubriker:</label>
                      <div className="space-y-2">
                        {draft.content.generatedSuggestions.headlines.map((headline, index) => (
                          <button
                            key={index}
                            onClick={() => updateContent({ headline })}
                            className="block w-full text-left p-3 bg-white border border-neutral-200 rounded-xl hover:border-brand hover:bg-brand/5 transition-colors duration-200"
                          >
                            {headline}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Content Fields */}
              <div className="space-y-6">
                <TextInput
                  label="Rubrik"
                  value={draft.content.headline}
                  onChange={(value) => updateContent({ headline: value })}
                  placeholder="t.ex. Professionell snickare i Stockholm"
                  required
                  hint="Håll rubriken kort och tydlig - max 40 tecken rekommenderas"
                  icon={<DocumentTextIcon className="w-4 h-4" />}
                />

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    <DocumentTextIcon className="w-4 h-4 inline mr-2 text-brand" />
                    Beskrivning *
                  </label>
                  <textarea
                    value={draft.content.description}
                    onChange={(e) => updateContent({ description: e.target.value })}
                    placeholder="Beskriv vad du erbjuder och varför kunder ska välja dig. T.ex. 'Vi hjälper husägare med alla typer av snickeriarbeten - från mindre reparationer till stora renoveringsprojekt. Kontakta oss för kostnadsfri offert!'"
                    className="textarea"
                    rows={4}
                  />
                  <p className="text-sm text-neutral-500 mt-2">
                    Berätta kort vad du gör och vad som gör dig speciell
                  </p>
                </div>

                <Select
                  label="Uppmaning till handling (CTA)"
                  value={draft.content.callToAction}
                  onChange={(value) => updateContent({ callToAction: value })}
                  options={CALL_TO_ACTIONS.map(cta => ({ value: cta, label: cta }))}
                  placeholder="Välj vad kunder ska göra..."
                  required
                  hint="Detta blir knappen som kunder klickar på"
                />
              </div>

              {/* Preview */}
              {draft.content.headline && draft.content.description && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                  <h4 className="font-semibold text-neutral-900 mb-4">👁️ Förhandsgranskning</h4>
                  <div className="bg-white rounded-xl p-4 border border-neutral-200 max-w-md">
                    <h5 className="font-bold text-neutral-900 mb-2">{draft.content.headline}</h5>
                    <p className="text-sm text-neutral-600 mb-4">{draft.content.description}</p>
                    {draft.content.callToAction && (
                      <button className="btn-primary btn-sm pointer-events-none">
                        {draft.content.callToAction}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </StepCard>
        );

      case 2:
        return (
          <StepCard
            title="Välj bild för din annons"
            description="En bra bild ökar chansen att kunder klickar på din annons med upp till 65%."
            icon={<PhotoIcon className="w-6 h-6" />}
          >
            <AdImagePicker
              selectedImage={draft.image}
              onImageSelect={(image) => updateImage(image)}
            />
          </StepCard>
        );

      case 3:
        return (
          <StepCard
            title="Budget och målgrupp"
            description="Bestäm hur mycket du vill satsa och vilka kunder du vill nå."
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
          >
            <div className="space-y-8">
              {/* Budget Section */}
              <div className="space-y-6">
                <h4 className="heading-sm">💰 Budget</h4>
                
                <RangeSlider
                  label="Daglig budget"
                  value={draft.budget.dailyBudget}
                  onChange={(value) => updateBudget({ dailyBudget: value as number })}
                  min={50}
                  max={1000}
                  step={25}
                  unit="kr"
                  hint="Vi rekommenderar minst 200 kr/dag för bästa resultat"
                  icon={<CurrencyDollarIcon className="w-4 h-4" />}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <TextInput
                    label="Startdatum"
                    value={draft.budget.startDate}
                    onChange={(value) => updateBudget({ startDate: value })}
                    type="date"
                    required
                    icon={<CalendarIcon className="w-4 h-4" />}
                  />
                  
                  <TextInput
                    label="Slutdatum"
                    value={draft.budget.endDate}
                    onChange={(value) => updateBudget({ endDate: value })}
                    type="date"
                    required
                    icon={<CalendarIcon className="w-4 h-4" />}
                  />
                </div>

                {/* Budget Summary */}
                <div className="bg-brand/5 border border-brand/20 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">Daglig budget:</span>
                      <p className="font-semibold text-brand">{draft.budget.dailyBudget} kr</p>
                    </div>
                    <div>
                      <span className="text-neutral-600">Total budget:</span>
                      <p className="font-semibold text-brand">
                        {Math.round((new Date(draft.budget.endDate).getTime() - new Date(draft.budget.startDate).getTime()) / (1000 * 60 * 60 * 24) * draft.budget.dailyBudget)} kr
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Targeting Section */}
              <div className="space-y-6">
                <h4 className="heading-sm">🎯 Målgrupp</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <RangeSlider
                    label="Lägsta ålder"
                    value={draft.budget.targeting.ageMin}
                    onChange={(value) => updateBudget({ 
                      targeting: { ...draft.budget.targeting, ageMin: value as number }
                    })}
                    min={18}
                    max={75}
                    unit="år"
                    icon={<UserIcon className="w-4 h-4" />}
                  />
                  
                  <RangeSlider
                    label="Högsta ålder"
                    value={draft.budget.targeting.ageMax}
                    onChange={(value) => updateBudget({ 
                      targeting: { ...draft.budget.targeting, ageMax: value as number }
                    })}
                    min={draft.budget.targeting.ageMin + 1}
                    max={80}
                    unit="år"
                    icon={<UserIcon className="w-4 h-4" />}
                  />
                </div>

                <ChipTags
                  label="Ytterligare intressen (valfritt)"
                  selectedValues={draft.budget.targeting.interests}
                  onChange={(values) => updateBudget({ 
                    targeting: { ...draft.budget.targeting, interests: values }
                  })}
                  options={draft.profile.interests.map(interest => ({
                    value: interest,
                    label: interest
                  }))}
                  hint="Vi använder redan intressena från din profil, men du kan lägga till fler här"
                  allowCustom={true}
                />
              </div>
            </div>
          </StepCard>
        );

      case 4:
        return (
          <StepCard
            title="Granska och starta kampanj"
            description="Kontrollera att allt stämmer innan vi lanserar din annons."
            icon={<EyeIcon className="w-6 h-6" />}
          >
            <div className="space-y-8">
              {/* Campaign Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Content */}
                <div className="space-y-6">
                  <div className="card p-6">
                    <h4 className="font-semibold text-neutral-900 mb-4 flex items-center">
                      <DocumentTextIcon className="w-5 h-5 mr-2 text-brand" />
                      Annonsinnehåll
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-neutral-500">Rubrik:</span>
                        <p className="font-medium">{draft.content.headline}</p>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-500">Beskrivning:</span>
                        <p className="text-sm">{draft.content.description}</p>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-500">Uppmaning:</span>
                        <p className="font-medium">{draft.content.callToAction}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-semibold text-neutral-900 mb-4 flex items-center">
                      <CurrencyDollarIcon className="w-5 h-5 mr-2 text-brand" />
                      Budget & Målgrupp
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-neutral-500">Daglig budget:</span>
                        <p className="font-medium">{draft.budget.dailyBudget} kr</p>
                      </div>
                      <div>
                        <span className="text-neutral-500">Kampanjperiod:</span>
                        <p className="font-medium">
                          {new Date(draft.budget.startDate).toLocaleDateString('sv-SE')} - {new Date(draft.budget.endDate).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-500">Åldersgrupp:</span>
                        <p className="font-medium">{draft.budget.targeting.ageMin}-{draft.budget.targeting.ageMax} år</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Preview */}
                <div className="space-y-6">
                  {draft.image && (
                    <div className="card p-6">
                      <h4 className="font-semibold text-neutral-900 mb-4 flex items-center">
                        <PhotoIcon className="w-5 h-5 mr-2 text-brand" />
                        Vald bild
                      </h4>
                      <img
                        src={draft.image.url}
                        alt={draft.image.altText}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {/* Final Preview */}
                  <div className="card p-6">
                    <h4 className="font-semibold text-neutral-900 mb-4">👁️ Så här ser din annons ut</h4>
                    <div className="bg-neutral-50 p-4 rounded-xl">
                      {draft.image && (
                        <img
                          src={draft.image.url}
                          alt={draft.image.altText}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h5 className="font-bold text-neutral-900 mb-2">{draft.content.headline}</h5>
                      <p className="text-sm text-neutral-600 mb-4">{draft.content.description}</p>
                      <button className="btn-primary btn-sm pointer-events-none">
                        {draft.content.callToAction}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Confirmation */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="final-confirmation"
                    className="mt-1"
                  />
                  <label htmlFor="final-confirmation" className="text-sm text-neutral-700">
                    Jag bekräftar att all information stämmer och att jag vill starta denna kampanj. 
                    Jag förstår att kampanjen kommer att börja kosta pengar enligt den budget jag angett.
                  </label>
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
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToDashboard}
              className="btn-ghost flex items-center space-x-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Tillbaka till Dashboard</span>
            </button>
            
            <div className="text-center flex-1">
              <h1 className="heading-lg mb-2">Campaign Studio</h1>
              <p className="body text-neutral-600">
                Skapa din annons i 4 enkla steg
              </p>
            </div>
            
            <div className="w-32"></div> {/* Spacer for centered title */}
          </div>
          
          <Stepper 
            steps={steps} 
            variant="horizontal" 
            showProgress={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {renderStepContent()}
      </div>

      {/* Footer */}
      <WizardFooter
        onPrevious={currentStep > 1 ? handlePrevious : undefined}
        onNext={canGoNext() ? handleNext : undefined}
        onSaveDraft={handleSaveDraft}
        previousLabel="Tillbaka"
        nextLabel={currentStep === 4 ? "🚀 Starta kampanj" : "Nästa"}
        canGoBack={currentStep > 1}
        canProceed={canGoNext()}
        isSaving={isSaving}
        showSaveDraft={currentStep < 4}
      />
    </div>
  );
}