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

  const handleStartCampaign = () => {
    navigate('/campaign-studio');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  // Mock data for dashboard with more realistic numbers
  const mockStats = {
    activeCampaigns: 3,
    totalSpent: 4580,
    totalClicks: 234,
    totalContacts: 17
  };

  const mockCampaigns = [
    {
      id: 1,
      title: 'Snickartjänster i Stockholm',
      status: 'active',
      clicks: 67,
      contacts: 12,
      spent: 2340,
      progress: 78,
      trend: '+23%'
    },
    {
      id: 2,
      title: 'Badrumsrenovering Malmö',
      status: 'optimizing',
      clicks: 23,
      contacts: 3,
      spent: 890,
      progress: 45,
      trend: 'AI'
    },
    {
      id: 3,
      title: 'Elinstallationer Göteborg',
      status: 'active',
      clicks: 144,
      contacts: 2,
      spent: 1350,
      progress: 92,
      trend: '+12%'
    }
  ];

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
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #FDFCFB 0%, #F4EDE4 100%)'
    }}>
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-32 h-32 rounded-full opacity-[0.02]" style={{
          background: 'linear-gradient(135deg, #CC785C 0%, #8B4513 100%)',
          top: '10%',
          right: '20%',
          animation: 'float 25s infinite ease-in-out'
        }}></div>
        <div className="absolute w-20 h-20 rounded-full opacity-[0.02]" style={{
          background: 'linear-gradient(135deg, #CC785C 0%, #8B4513 100%)',
          top: '60%',
          left: '5%',
          animation: 'float 25s infinite ease-in-out -8s'
        }}></div>
        <div className="absolute w-24 h-24 rounded-full opacity-[0.02]" style={{
          background: 'linear-gradient(135deg, #CC785C 0%, #8B4513 100%)',
          top: '30%',
          left: '10%',
          animation: 'float 25s infinite ease-in-out -15s'
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/90 border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="font-bold text-2xl hover:opacity-80 transition-opacity cursor-pointer" 
                style={{color: '#CC785C'}}
              >
                AnnonsHjälpen
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
                <BellIcon className="w-5 h-5" style={{color: '#4A4A4A'}} />
              </button>
              <button 
                onClick={handleSettings}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5" style={{color: '#4A4A4A'}} />
              </button>
              <div className="flex items-center space-x-2 pl-4 border-l border-white/30">
                <UserCircleIcon className="w-6 h-6" style={{color: '#757575'}} />
                <span className="text-sm font-medium" style={{color: '#4A4A4A'}}>
                  {draft?.profile.companyName || 'Användare'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Hej {draft?.profile.companyName || 'där'}! 👋
          </h1>
          <p className="text-lg mb-8 text-gray-600">
            Redo att börja få fler kunder? Skapa din första annons på bara några minuter.
          </p>
          
          {/* Hero Stats */}
          <div className="flex justify-center space-x-12 mb-12">
            <div className="text-center">
              <span className="text-3xl font-bold block text-gray-900">{mockStats.activeCampaigns}</span>
              <span className="text-sm text-gray-600">Aktiva kampanjer</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold block text-gray-900">{mockStats.totalClicks}</span>
              <span className="text-sm text-gray-600">Totala klick</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold block text-gray-900">{mockStats.totalContacts}</span>
              <span className="text-sm text-gray-600">Nya kontakter</span>
            </div>
          </div>
        </div>

        {/* Primary CTA Section - Glass Card */}
        <div className="mb-16">
          <div className="backdrop-blur-md rounded-3xl p-12 text-center relative overflow-hidden" style={{
            background: 'rgba(253, 252, 251, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(204, 120, 92, 0.15)'
          }}>
            <div className="absolute inset-0 rounded-3xl" style={{
              background: 'linear-gradient(135deg, rgba(204, 120, 92, 0.05) 0%, rgba(244, 237, 228, 0.1) 100%)'
            }}></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8" style={{
                background: 'linear-gradient(135deg, #CC785C 0%, #8B4513 100%)'
              }}>
                <RocketLaunchIcon className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Dags att starta din första annons!
              </h2>
              
              <p className="text-lg mb-8 text-gray-600">
                Vi har din profil och dina kanaler redo. Nu kan vi skapa en professionell annons 
                som hjälper dig nå nya kunder i {draft?.profile.targetingAreas?.[0] || 'ditt område'}.
              </p>
              
              <button 
                onClick={handleStartCampaign}
                className="inline-flex items-center space-x-3 px-8 py-4 rounded-full text-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #CC785C 0%, #8B4513 100%)'
                }}
              >
                <RocketLaunchIcon className="w-6 h-6" />
                <span>Starta Din Annons</span>
              </button>
              
              <p className="text-sm mt-6" style={{color: '#757575'}}>
                ⚡ Tar bara 5-10 minuter • 💡 AI hjälper dig med allt
              </p>
            </div>
          </div>
        </div>

        {/* Campaign Cards - Preview Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {mockCampaigns.map((campaign) => (
            <div 
              key={campaign.id}
              className="backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
              style={{
                background: 'rgba(253, 252, 251, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(204, 120, 92, 0.08)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {campaign.status === 'active' ? 'Aktiv' : 'Optimerar'}
                </span>
                <div className="flex items-center space-x-1 text-sm font-medium" style={{
                  color: campaign.trend.includes('+') ? '#10B981' : '#CC785C'
                }}>
                  {campaign.trend.includes('+') && <span>↗</span>}
                  {campaign.trend.includes('AI') && <span>🧠</span>}
                  <span>{campaign.trend}</span>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                {campaign.title}
              </h4>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <span className="text-xl font-bold block text-gray-900">{campaign.clicks}</span>
                  <span className="text-xs text-gray-600">klick</span>
                </div>
                <div className="text-center">
                  <span className="text-xl font-bold block text-gray-900">{campaign.contacts}</span>
                  <span className="text-xs text-gray-600">kontakter</span>
                </div>
                <div className="text-center">
                  <span className="text-xl font-bold block text-gray-900">{campaign.spent} kr</span>
                  <span className="text-xs text-gray-600">kostnad</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${campaign.progress}%`,
                    background: 'linear-gradient(135deg, #CC785C 0%, #8B4513 100%)'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

      </div>
      
      {/* Add floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }
      `}</style>
    </div>
  );
}