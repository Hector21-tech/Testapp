import React, { useState, useCallback } from 'react';
import { useCampaignWizard } from '../../../features/campaign/store';
import { CALL_TO_ACTIONS } from '../../../features/campaign/types';
import { TextInput } from '../../../components/fields/TextInput';
import { Select } from '../../../components/fields/Select';
import { AIContentGenerator, type AIGeneratedContent } from '../../../components/ai/AIContentGenerator';
import { SparklesIcon, ClipboardDocumentIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export function ContentStep() {
  const { draft, updateContent } = useCampaignWizard();
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [aiContent, setAIContent] = useState<AIGeneratedContent | null>(null);

  if (!draft) return null;

  const { content } = draft;

  const handleAIContentGenerated = useCallback((generatedContent: AIGeneratedContent) => {
    setAIContent(generatedContent);
    // Store the generated content in wizard state for potential use
    updateContent({ 
      aiGeneratedContent: generatedContent
    });
  }, [updateContent]);

  const handleAIContentSelected = useCallback((selectedContent: { headline: string; description: string; cta: string }) => {
    // Apply selected AI content to the wizard
    updateContent({
      headline: selectedContent.headline,
      description: selectedContent.description,
      callToAction: selectedContent.cta,
      selectedAIContent: selectedContent
    });
  }, [updateContent]);

  const ctaOptions = CALL_TO_ACTIONS.map(cta => ({
    value: cta,
    label: cta
  }));

  return (
    <div className="space-y-8">
      {/* Mode Selection */}
      <div className="text-center">
        <p className="text-neutral-600 mb-6">
          Skapa övertygande annonsinnehåll som lockar kunder att kontakta dig.
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setMode('manual')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              mode === 'manual' 
                ? 'bg-brand text-white shadow-soft' 
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Skriv själv
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
              mode === 'ai' 
                ? 'bg-brand text-white shadow-soft' 
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>AI-assisterad</span>
          </button>
        </div>
      </div>

      {mode === 'ai' ? (
        /* AI Content Generator */
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <AIContentGenerator
            companyProfile={draft.profile}
            onContentGenerated={handleAIContentGenerated}
            onContentSelect={handleAIContentSelected}
          />
        </div>
      ) : (
        /* Manual Content Entry */
        <div className="space-y-6">
          <TextInput
            label="Rubrik"
            placeholder="Skriv en fängslande rubrik..."
            value={content.headline || ''}
            onChange={(value) => updateContent({ headline: value })}
            maxLength={60}
            showCharCount
            helperText="Håll rubriken kort och engagerande"
            required
          />

          <TextInput
            label="Beskrivning"
            placeholder="Beskriv dina tjänster och vad som gör dig unik..."
            value={content.description || ''}
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
            value={content.callToAction || ''}
            onValueChange={(value) => updateContent({ callToAction: value })}
            options={ctaOptions}
            helperText="Detta är knappen som kunder klickar på i din annons"
            required
          />
        </div>
      )}

      {/* Preview */}
      {(content.headline || content.description || content.callToAction) && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
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

      {/* Switch to Manual Edit */}
      {mode === 'ai' && (content.headline || content.description || content.callToAction) && (
        <div className="text-center">
          <button
            onClick={() => setMode('manual')}
            className="btn-ghost flex items-center space-x-2 mx-auto"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Redigera manuellt</span>
          </button>
        </div>
      )}
    </div>
  );
}