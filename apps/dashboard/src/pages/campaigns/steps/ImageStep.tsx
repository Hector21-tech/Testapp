import React from 'react';
import { useCampaignWizard } from '../../../features/campaign/store';
import { AdImagePicker } from '../../../components/AdImagePicker';

export function ImageStep() {
  const { draft, updateImage } = useCampaignWizard();
  
  if (!draft) return null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="text-neutral-600">
          Välj eller ladda upp en bild som representerar ditt företag och tjänster.
        </p>
      </div>

      <AdImagePicker
        selectedImage={draft.image}
        onImageSelect={(image) => updateImage(image)}
        onImageClear={() => updateImage(null)}
        industryContext={draft.profile.industry}
        companyName={draft.profile.companyName}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 mb-2">Tips för bra annonsbilder</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Använd högkvalitativa bilder (minst 1200x1200 pixlar)</li>
          <li>• Välj bilder som visar ditt arbete eller tjänster</li>
          <li>• Undvik text i bilden - den kan vara svår att läsa</li>
          <li>• Se till att bilden är relevant för din bransch</li>
        </ul>
      </div>
    </div>
  );
}