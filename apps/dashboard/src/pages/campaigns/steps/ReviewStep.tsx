import React, { useState } from 'react';
import { useCampaignWizard } from '../../../features/campaign/store';
import { INDUSTRIES, BUSINESS_GOALS } from '../../../features/campaign/types';
import { 
  PencilIcon, 
  CheckIcon, 
  ExclamationTriangleIcon,
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

export function ReviewStep() {
  const { draft, setCurrentStep } = useCampaignWizard();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  if (!draft) return null;

  const { profile, channels, content, image, budget } = draft;

  const handleLaunchCampaign = async () => {
    if (!isConfirmed) return;
    
    setIsLaunching(true);
    
    // Mock API call
    setTimeout(() => {
      // TODO: Redirect to campaign dashboard or success page
      alert('Kampanj startad! (Detta är en mockad demo)');
      setIsLaunching(false);
    }, 3000);
  };

  const connectedChannels = Object.entries(channels)
    .filter(([_, channel]) => channel.connected)
    .map(([key, _]) => key);

  const industryLabel = INDUSTRIES.find(i => i.value === profile.industry)?.label || profile.industry;
  const goalLabels = profile.goals
    .map(goal => BUSINESS_GOALS.find(g => g.value === goal)?.label)
    .filter(Boolean);

  const campaignDays = Math.ceil(
    (new Date(budget.endDate).getTime() - new Date(budget.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalBudget = budget.dailyBudget * Math.max(1, campaignDays);

  const sections = [
    {
      title: 'Företagsprofil',
      stepNumber: 1,
      content: (
        <div className="space-y-3">
          <div><span className="font-medium">Företag:</span> {profile.companyName}</div>
          {profile.orgNumber && <div><span className="font-medium">Org.nr:</span> {profile.orgNumber}</div>}
          <div><span className="font-medium">Bransch:</span> {industryLabel}</div>
          <div><span className="font-medium">Plats:</span> {profile.location} ({profile.radius} km radie)</div>
          {profile.website && <div><span className="font-medium">Webb:</span> {profile.website}</div>}
          <div><span className="font-medium">Mål:</span> {goalLabels.join(', ')}</div>
          <div><span className="font-medium">Ålder:</span> {profile.ageRangeMin}-{profile.ageRangeMax} år</div>
          <div><span className="font-medium">Intressen:</span> {profile.interests.join(', ')}</div>
          {profile.description && <div><span className="font-medium">Beskrivning:</span> {profile.description}</div>}
        </div>
      )
    },
    {
      title: 'Anslutna kanaler',
      stepNumber: 2,
      content: (
        <div className="space-y-2">
          {connectedChannels.map(channel => (
            <div key={channel} className="flex items-center space-x-2">
              <CheckIcon className="w-4 h-4 text-green-500" />
              <span className="capitalize">{channel}</span>
              {channels[channel as keyof typeof channels].accountName && (
                <span className="text-sm text-neutral-500">
                  ({channels[channel as keyof typeof channels].accountName})
                </span>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Annonsinnehåll',
      stepNumber: 3,
      content: (
        <div className="space-y-3">
          <div><span className="font-medium">Rubrik:</span> {content.headline}</div>
          <div><span className="font-medium">Beskrivning:</span> {content.description}</div>
          <div><span className="font-medium">Uppmaning:</span> {content.callToAction}</div>
        </div>
      )
    },
    {
      title: 'Bild',
      stepNumber: 4,
      content: (
        <div>
          {image ? (
            <div className="flex items-center space-x-4">
              <img 
                src={image.url} 
                alt={image.altText}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div>
                <div className="font-medium">
                  {image.isCustom ? 'Egen bild' : 'Stockfoto'}
                </div>
                <div className="text-sm text-neutral-600">{image.altText}</div>
                {image.attribution && (
                  <div className="text-xs text-neutral-500">{image.attribution}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-neutral-500">Ingen bild vald</div>
          )}
        </div>
      )
    },
    {
      title: 'Budget & mål',
      stepNumber: 5,
      content: (
        <div className="space-y-3">
          <div><span className="font-medium">Daglig budget:</span> {budget.dailyBudget} kr</div>
          <div><span className="font-medium">Kampanjperiod:</span> {budget.startDate} till {budget.endDate} ({campaignDays} dagar)</div>
          <div><span className="font-medium">Total budget:</span> {totalBudget.toLocaleString()} kr</div>
          <div><span className="font-medium">Åldersgrupp:</span> {budget.targeting.ageMin}-{budget.targeting.ageMax} år</div>
          {budget.targeting.interests.length > 0 && (
            <div><span className="font-medium">Intressen:</span> {budget.targeting.interests.join(', ')}</div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Granska din kampanj
        </h2>
        <p className="text-neutral-600">
          Kontrollera alla detaljer innan du startar kampanjen.
        </p>
      </div>

      {/* Campaign Summary Cards */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.stepNumber} className="bg-white border-2 border-neutral-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 flex items-center">
                <span className="w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center text-sm mr-3">
                  {section.stepNumber}
                </span>
                {section.title}
              </h3>
              <button
                onClick={() => setCurrentStep(section.stepNumber)}
                className="btn-ghost btn-sm flex items-center space-x-1"
              >
                <PencilIcon className="w-4 h-4" />
                <span>Redigera</span>
              </button>
            </div>
            <div className="text-sm text-neutral-700 pl-9">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Preview */}
      <div className="bg-neutral-100 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Så kommer din annons att se ut</h3>
        <div className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-soft">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {profile.companyName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{profile.companyName}</div>
              <div className="text-xs text-neutral-500">Sponsrad</div>
            </div>
          </div>
          
          {image && (
            <img 
              src={image.url} 
              alt={image.altText}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
          )}
          
          <div className="space-y-2">
            <h4 className="font-bold text-lg">{content.headline}</h4>
            <p className="text-neutral-700 text-sm">{content.description}</p>
            <div className="pt-2">
              <button className="btn-primary btn-sm w-full">
                {content.callToAction}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation and Launch */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="confirm-launch"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="w-4 h-4 text-brand focus:ring-brand border-neutral-300 rounded"
            />
            <label htmlFor="confirm-launch" className="text-sm font-medium text-green-800">
              Jag bekräftar att all information stämmer och vill starta kampanjen
            </label>
          </div>
        </div>

        {!isConfirmed && (
          <div className="flex items-start space-x-3 mb-4">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              Du måste bekräfta att informationen stämmer för att kunna starta kampanjen.
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleLaunchCampaign}
            disabled={!isConfirmed || isLaunching}
            className={`
              btn-primary flex items-center space-x-2 px-8 py-3
              ${!isConfirmed || isLaunching ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLaunching ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Startar kampanj...</span>
              </>
            ) : (
              <>
                <RocketLaunchIcon className="w-5 h-5" />
                <span>Starta kampanj</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-neutral-500">
          Efter att du startat kampanjen kan du följa resultatet i kampanjöversikten.
        </p>
      </div>
    </div>
  );
}