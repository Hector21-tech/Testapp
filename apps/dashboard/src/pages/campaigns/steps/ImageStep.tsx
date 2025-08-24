import React, { useCallback } from 'react';
import { useCampaignWizard } from '../../../features/campaign/store';
import { CanvaDesignTool, type DesignResult } from '../../../components/design/CanvaDesignTool';

export function ImageStep() {
  const { draft, updateImage, updateContent } = useCampaignWizard();
  
  if (!draft) return null;

  const handleDesignComplete = useCallback((design: DesignResult) => {
    // Save the design result to wizard state
    updateImage({
      url: design.url,
      thumbnailUrl: design.thumbnailUrl,
      alt: design.title,
      source: 'canva',
      canvaDesign: design
    });
  }, [updateImage]);

  // Get AI content if available to pass to Canva
  const aiContent = draft.content.selectedAIContent ? {
    headline: draft.content.selectedAIContent.headline,
    description: draft.content.selectedAIContent.description,
    cta: draft.content.selectedAIContent.cta
  } : undefined;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="text-neutral-600">
          Skapa professionella annonsbilder med Canva eller välj från bibliotek.
        </p>
      </div>

      <CanvaDesignTool
        companyProfile={draft.profile}
        aiContent={aiContent}
        onDesignComplete={handleDesignComplete}
        designType="facebook_ad"
      />

      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <h4 className="font-medium text-slate-900 mb-2">Automatisk integration</h4>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>• Branschspecifika templates baserat på ditt företag</li>
          <li>• AI-innehåll integreras automatiskt i designen</li>
          <li>• Professionella resultat optimerade för annonser</li>
          <li>• Export i rätt format för alla plattformar</li>
        </ul>
      </div>
    </div>
  );
}