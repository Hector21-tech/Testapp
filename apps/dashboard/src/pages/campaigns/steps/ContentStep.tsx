import React, { useState } from 'react';
import { useCampaignWizard } from '../../../features/campaign/store';
import { CALL_TO_ACTIONS } from '../../../features/campaign/types';
import { TextInput } from '../../../components/fields/TextInput';
import { Select } from '../../../components/fields/Select';
import { SparklesIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export function ContentStep() {
  const { draft, updateContent } = useCampaignWizard();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (!draft) return null;

  const { content } = draft;

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    
    // Mock API call
    setTimeout(() => {
      const mockSuggestions = {
        headlines: [
          `Professionell ${draft.profile.industry} i ${draft.profile.location}`,
          `Kvalitet och trygghet - ${draft.profile.companyName}`,
          `Erfaren ${draft.profile.industry} - Begär offert idag!`
        ],
        descriptions: [
          `Vi på ${draft.profile.companyName} har lång erfarenhet av ${draft.profile.industry.toLowerCase()} i ${draft.profile.location}. Kontakta oss för en kostnadsfri konsultation.`,
          `Behöver du hjälp med ${draft.profile.industry.toLowerCase()}? Vi erbjuder professionella tjänster i ${draft.profile.location} och omgivning.`,
          `Välj ${draft.profile.companyName} för ${draft.profile.industry.toLowerCase()}. Vi garanterar kvalitet och kundbemötande i toppklass.`
        ],
        ctas: ['Begär offert', 'Kontakta oss', 'Ring nu']
      };

      updateContent({ 
        generatedSuggestions: mockSuggestions 
      });
      setShowSuggestions(true);
      setIsGenerating(false);
    }, 2000);
  };

  const applySuggestion = (type: 'headline' | 'description' | 'cta', suggestion: string) => {
    if (type === 'headline') {
      updateContent({ headline: suggestion });
    } else if (type === 'description') {
      updateContent({ description: suggestion });
    } else if (type === 'cta') {
      updateContent({ callToAction: suggestion });
    }
  };

  const ctaOptions = CALL_TO_ACTIONS.map(cta => ({
    value: cta,
    label: cta
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-neutral-600 mb-6">
          Skapa övertygande annonsinnehåll som lockar kunder att kontakta dig.
        </p>
        
        <button
          onClick={handleGenerateSuggestions}
          disabled={isGenerating}
          className="btn-secondary flex items-center space-x-2 mx-auto"
        >
          <SparklesIcon className="w-4 h-4" />
          <span>{isGenerating ? 'Genererar förslag...' : 'Generera förslag med AI'}</span>
        </button>
      </div>

      {showSuggestions && content.generatedSuggestions && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
          <h3 className="font-semibold text-brand-800 mb-4 flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2" />
            AI-genererade förslag
          </h3>
          
          <div className="space-y-4">
            {/* Headlines */}
            <div>
              <h4 className="text-sm font-medium text-brand-700 mb-2">Rubriker</h4>
              <div className="space-y-2">
                {content.generatedSuggestions.headlines.map((headline, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-soft border border-brand-100 hover:border-brand-200 transition-all"
                    onClick={() => applySuggestion('headline', headline)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{headline}</span>
                      <ClipboardDocumentIcon className="w-4 h-4 text-brand-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <h4 className="text-sm font-medium text-brand-700 mb-2">Beskrivningar</h4>
              <div className="space-y-2">
                {content.generatedSuggestions.descriptions.map((description, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-soft border border-brand-100 hover:border-brand-200 transition-all"
                    onClick={() => applySuggestion('description', description)}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-sm flex-1">{description}</span>
                      <ClipboardDocumentIcon className="w-4 h-4 text-brand-500 ml-2 mt-0.5 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <TextInput
          label="Rubrik"
          placeholder="Skriv en fängslande rubrik..."
          value={content.headline}
          onChange={(value) => updateContent({ headline: value })}
          maxLength={60}
          showCharCount
          helperText="Håll rubriken kort och engagerande"
          required
        />

        <TextInput
          label="Beskrivning"
          placeholder="Beskriv dina tjänster och vad som gör dig unik..."
          value={content.description}
          onChange={(value) => updateContent({ description: value })}
          multiline
          rows={4}
          maxLength={200}
          showCharCount
          helperText="Förklara värdet du erbjuder dina kunder"
          required
        />

        <Select
          label="Uppmaning (CTA)"
          placeholder="Välj vad kunder ska göra"
          value={content.callToAction}
          onValueChange={(value) => updateContent({ callToAction: value })}
          options={ctaOptions}
          helperText="Detta är knappen som kunder klickar på i din annons"
          required
        />
      </div>

      {/* Preview */}
      {(content.headline || content.description || content.callToAction) && (
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Förhandsvisning av annons</h3>
          <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
            {content.headline && (
              <h4 className="font-bold text-lg text-slate-900">
                {content.headline}
              </h4>
            )}
            {content.description && (
              <p className="text-neutral-700">
                {content.description}
              </p>
            )}
            {content.callToAction && (
              <div className="pt-2">
                <button className="btn-primary btn-sm">
                  {content.callToAction}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}