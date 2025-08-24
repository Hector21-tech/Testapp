/**
 * Platform Selection Step - Välj vilka plattformar som ska användas för denna kampanj
 * 
 * Låter användaren välja vilka av sina kopplade kanaler som ska användas för den specifika kampanjen.
 * Bara kanaler som redan är kopplade i onboarding visas som alternativ.
 */

import React from 'react';
import { useCampaignWizard } from '../../../features/campaign/store';
import { 
  CheckBadgeIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  CameraIcon 
} from '@heroicons/react/24/outline';

interface PlatformOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  strengths: string[];
}

const PLATFORMS: PlatformOption[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Nå en bred målgrupp med visuella annonser',
    icon: (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'blue',
    strengths: ['Bred målgrupp', 'Detaljerad targeting', 'Visuella annonser']
  },
  {
    id: 'google',
    name: 'Google Ads',
    description: 'Fånga kunder som aktivt söker efter dina tjänster',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    color: 'red',
    strengths: ['Sökintention', 'Hög konvertering', 'Lokalt fokus']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Visuell marknadsföring för yngre målgrupper',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"/>
        <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: 'pink',
    strengths: ['Yngre målgrupp', 'Visuellt innehåll', 'Stories & Reels']
  }
];

export function PlatformSelectionStep() {
  const { draft, updateChannels } = useCampaignWizard();

  if (!draft) return null;

  const { channels } = draft;

  // Filtrera till endast kopplade kanaler
  const availablePlatforms = PLATFORMS.filter(platform => {
    return channels[platform.id as keyof typeof channels]?.connected;
  });

  const handlePlatformToggle = (platformId: string) => {
    const currentChannel = channels[platformId as keyof typeof channels];
    if (!currentChannel) return;

    // Togglea "activeForCampaign" status för kampanjen (inte "connected" status)
    updateChannels({
      [platformId]: {
        ...currentChannel,
        activeForCampaign: !currentChannel.activeForCampaign
      }
    });
  };

  const selectedPlatforms = availablePlatforms.filter(platform => 
    channels[platform.id as keyof typeof channels]?.activeForCampaign
  );

  if (availablePlatforms.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DevicePhoneMobileIcon className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Inga kanaler kopplade</h3>
        <p className="text-neutral-600 mb-4">
          Du behöver koppla minst en kanal innan du kan skapa kampanjer.
        </p>
        <p className="text-sm text-neutral-500">
          Gå tillbaka till föregående steg för att koppla dina annonskanaler.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-neutral-600">
          Välj vilka plattformar du vill använda för denna kampanj. Du kan ändra detta senare.
        </p>
      </div>

      <div className="space-y-4">
        {availablePlatforms.map(platform => {
          const channel = channels[platform.id as keyof typeof channels];
          const isActive = channel?.activeForCampaign || false;
          
          return (
            <div
              key={platform.id}
              className={`
                border-2 rounded-xl p-4 cursor-pointer transition-all duration-200
                ${isActive 
                  ? platform.id === 'facebook' 
                    ? 'border-blue-200 bg-blue-50 ring-2 ring-blue-100'
                    : platform.id === 'google'
                    ? 'border-red-200 bg-red-50 ring-2 ring-red-100'
                    : 'border-pink-200 bg-pink-50 ring-2 ring-pink-100'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
                }
              `}
              onClick={() => handlePlatformToggle(platform.id)}
            >
              <div className="flex items-start space-x-4">
                {/* Platform Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${platform.id === 'facebook' ? 'bg-blue-600' : ''}
                  ${platform.id === 'google' ? 'bg-white border border-neutral-200' : ''}
                  ${platform.id === 'instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : ''}
                `}>
                  {platform.icon}
                </div>

                {/* Platform Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-neutral-900">{platform.name}</h3>
                    {isActive && (
                      <CheckBadgeIcon className={`w-5 h-5 ${
                        platform.id === 'facebook' ? 'text-blue-600' :
                        platform.id === 'google' ? 'text-red-600' : 'text-pink-600'
                      }`} />
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">{platform.description}</p>
                  
                  {/* Connected Account Info */}
                  {channel?.accountName && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Kopplad till: {channel.accountName}
                    </p>
                  )}

                  {/* Platform Strengths */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {platform.strengths.map(strength => (
                      <span 
                        key={strength}
                        className={`
                          px-2 py-1 text-xs rounded-full
                          ${isActive 
                            ? platform.id === 'facebook' 
                              ? 'bg-blue-100 text-blue-700'
                              : platform.id === 'google'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-pink-100 text-pink-700'
                            : 'bg-neutral-100 text-neutral-600'
                          }
                        `}
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Checkbox */}
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center
                  ${isActive 
                    ? platform.id === 'facebook' 
                      ? 'border-blue-500 bg-blue-500'
                      : platform.id === 'google'
                      ? 'border-red-500 bg-red-500'
                      : 'border-pink-500 bg-pink-500'
                    : 'border-neutral-300'
                  }
                `}>
                  {isActive && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Selection Summary */}
        {selectedPlatforms.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
            <div className="flex items-center space-x-2">
              <CheckBadgeIcon className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">
                {selectedPlatforms.length} plattform{selectedPlatforms.length > 1 ? 'ar' : ''} vald{selectedPlatforms.length > 1 ? 'a' : ''}
              </h4>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Dina annonser kommer att visas på: {selectedPlatforms.map(p => p.name).join(', ')}
            </p>
          </div>
        )}

        {/* Recommendation */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Rekommendation</h4>
          <p className="text-sm text-blue-700">
            För bästa resultat rekommenderar vi att börja med 1-2 plattformar och sedan utöka baserat på prestanda. 
            Du kan alltid lägga till fler plattformar senare.
          </p>
        </div>
      </div>
    </div>
  );
}