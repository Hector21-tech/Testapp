import React from 'react';
import { useCampaignWizard } from '../../../features/campaign/store';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const CHANNELS = [
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Nå kunder på Facebook och Instagram',
    icon: '👥',
    color: 'bg-blue-500'
  },
  {
    id: 'google',
    name: 'Google Ads',
    description: 'Visa annonser i Google sökning och nätverk',
    icon: '🔍',
    color: 'bg-green-500'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Visuella annonser på Instagram',
    icon: '📷',
    color: 'bg-pink-500'
  }
];

export function ChannelStep() {
  const { draft, updateChannels } = useCampaignWizard();
  
  if (!draft) return null;

  const { channels } = draft;
  const hasConnectedChannel = Object.values(channels).some(channel => channel.connected);

  const handleConnectChannel = (channelId: string) => {
    // TODO: Implement actual connection logic
    const isCurrentlyConnected = channels[channelId as keyof typeof channels]?.connected;
    
    updateChannels({
      [channelId]: {
        connected: !isCurrentlyConnected,
        accountId: !isCurrentlyConnected ? `demo-${channelId}-account` : undefined,
        accountName: !isCurrentlyConnected ? `Demo ${channelId} Account` : undefined,
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="text-neutral-600">
          Koppla minst en kanal för att kunna publicera dina annonser.
        </p>
      </div>

      {!hasConnectedChannel && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-800">Koppla en kanal för att fortsätta</h4>
            <p className="text-sm text-amber-700 mt-1">
              Du behöver koppla minst en annonskanal för att kunna skapa din kampanj.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {CHANNELS.map((channel) => {
          const channelData = channels[channel.id as keyof typeof channels];
          const isConnected = channelData?.connected || false;

          return (
            <div
              key={channel.id}
              className={`
                border rounded-2xl p-6 transition-all duration-200 cursor-pointer
                ${isConnected 
                  ? 'bg-green-50 border-green-200 shadow-soft' 
                  : 'bg-white border-neutral-200 hover:border-brand hover:shadow-soft'
                }
              `}
              onClick={() => handleConnectChannel(channel.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center text-2xl
                    ${isConnected ? 'bg-green-100' : 'bg-neutral-100'}
                  `}>
                    {channel.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {channel.name}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {channel.description}
                    </p>
                    {isConnected && channelData.accountName && (
                      <p className="text-xs text-green-700 mt-1">
                        Kopplad till: {channelData.accountName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {isConnected ? (
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Kopplad</span>
                    </div>
                  ) : (
                    <button className="btn-primary btn-sm">
                      Koppla
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasConnectedChannel && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
          <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-800">Bra jobbat!</h4>
            <p className="text-sm text-green-700 mt-1">
              Du har kopplat {Object.values(channels).filter(c => c.connected).length} kanal(er). 
              Du kan nu fortsätta till nästa steg.
            </p>
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-sm text-neutral-500">
          I produktionsversionen kopplar du dina riktiga annonkonton här.
        </p>
      </div>
    </div>
  );
}