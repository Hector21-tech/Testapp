import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RocketLaunchIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  BellIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

import { useCampaignWizard } from '../../features/campaign/store';
import { INDUSTRIES } from '../../features/campaign/types';
// import { useOnboardingStore } from '../../features/onboarding/store';
// import { OnboardingDashboard } from '../../components/onboarding/OnboardingDashboard';

export function Dashboard() {
  const navigate = useNavigate();
  const { draft } = useCampaignWizard();
  // const { isComplete, getOverallProgress } = useOnboardingStore();

  // Show onboarding if not complete
  // if (!isComplete) {
  //   return (
  //     <div className="min-h-screen bg-neutral-100">
  //       <div className="container mx-auto px-6 py-8">
  //         <OnboardingDashboard />
  //       </div>
  //     </div>
  //   );
  // }

  const handleStartCampaign = () => {
    navigate('/campaign-studio');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  // Mock data for dashboard
  const mockStats = {
    activeCampaigns: 0,
    totalSpent: 0,
    totalClicks: 0,
    totalContacts: 0
  };

  const recentActivity = [
    {
      id: 1,
      type: 'onboarding_completed',
      message: 'Välkommen! Du har slutfört din profil och kopplat dina kanaler.',
      timestamp: 'Just nu',
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Logo - text only, no icon */}
              <div className="logo">
                <span className="font-bold text-neutral-900 text-xl">AnnonsHjälpen</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn-ghost btn-sm p-2">
                <BellIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSettings}
                className="btn-ghost btn-sm p-2"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 pl-4 border-l border-neutral-200">
                <UserCircleIcon className="w-6 h-6 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-700">
                  {draft?.profile.companyName || 'Användare'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="heading-xl mb-2">
            Hej {draft?.profile.companyName ? `${draft.profile.companyName}` : 'där'}! 👋
          </h1>
          <p className="body text-neutral-600">
            Redo att börja få fler kunder? Skapa din första annons på bara några minuter.
          </p>
        </div>

        {/* Primary CTA Section */}
        <div className="mb-12">
          <div className="card p-8 text-center bg-gradient-to-r from-brand/5 to-brand-light/5 border-brand/20">
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center mx-auto mb-6">
                <RocketLaunchIcon className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="heading-lg mb-4 text-brand-dark">
                Dags att starta din första annons!
              </h2>
              
              <p className="body text-neutral-600 mb-6">
                Vi har din profil och dina kanaler redo. Nu kan vi skapa en professionell annons 
                som hjälper dig nå nya kunder i {draft?.profile.location || 'ditt område'}.
              </p>
              
              <button 
                onClick={handleStartCampaign}
                className="btn-primary btn-lg inline-flex items-center space-x-3"
              >
                <RocketLaunchIcon className="w-5 h-5" />
                <span>Starta Din Annons</span>
              </button>
              
              <p className="text-sm text-neutral-500 mt-4">
                ⚡ Tar bara 5-10 minuter • 💡 AI hjälper dig med allt
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Aktiva Kampanjer
              </h3>
              <ChartBarIcon className="w-5 h-5 text-neutral-400" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-2">
              {mockStats.activeCampaigns}
            </p>
            <p className="text-sm text-neutral-500">
              Ingen kampanj igång än
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Total Spenderad
              </h3>
              <ChartBarIcon className="w-5 h-5 text-neutral-400" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-2">
              {mockStats.totalSpent} kr
            </p>
            <p className="text-sm text-neutral-500">
              Denna månad
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Totala Klick
              </h3>
              <EyeIcon className="w-5 h-5 text-neutral-400" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-2">
              {mockStats.totalClicks}
            </p>
            <p className="text-sm text-neutral-500">
              Alla kampanjer
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Kontakter
              </h3>
              <UserCircleIcon className="w-5 h-5 text-neutral-400" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-2">
              {mockStats.totalContacts}
            </p>
            <p className="text-sm text-neutral-500">
              Potentiella kunder
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading-sm">Senaste aktivitet</h3>
                <button className="btn-ghost btn-sm">
                  Se alla
                </button>
              </div>

              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-xl">
                      <div className="flex-shrink-0 mt-0.5">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-900">
                          {activity.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <ClockIcon className="w-4 h-4 text-neutral-400" />
                          <span className="text-xs text-neutral-500">
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-500">Ingen aktivitet än</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="card p-6">
              <h3 className="heading-sm mb-6">Snabbåtgärder</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={handleStartCampaign}
                  className="w-full btn-primary flex items-center space-x-3"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Ny kampanj</span>
                </button>

                <button 
                  onClick={handleSettings}
                  className="w-full btn-secondary flex items-center space-x-3"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Inställningar</span>
                </button>
              </div>

              {/* Company Profile Summary */}
              {draft?.profile && (
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <h4 className="font-semibold text-neutral-900 mb-4">Din profil</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-neutral-500">Bransch:</span>
                      <p className="font-medium">
                        {INDUSTRIES.find(i => i.value === draft.profile.industry)?.label || 'Ej valt'}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Plats:</span>
                      <p className="font-medium">
                        {draft.profile.location || 'Ej angivet'}
                        {draft.profile.radius && ` (${draft.profile.radius} km)`}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Kanaler:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {draft.channels.facebook.connected && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            Facebook
                          </span>
                        )}
                        {draft.channels.google.connected && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            Google
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}