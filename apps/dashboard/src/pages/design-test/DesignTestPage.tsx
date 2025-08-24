/**
 * DesignTestPage - Isolerad testsida för Canva integration
 * 
 * Används för att testa CanvaDesignTool separat från wizard-flödet
 * Perfekt för utveckling och debugging utan dependencies
 */

import React, { useState } from 'react';
import { CanvaDesignTool, type DesignResult } from '../../components/design/CanvaDesignTool';
import type { CompanyProfile } from '../../features/campaign/types';
import { ArrowLeftIcon, CheckCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';

const MOCK_COMPANY_PROFILES: CompanyProfile[] = [
  {
    companyName: 'Stockholms Snickeri AB',
    orgNumber: '556789-1234',
    industry: 'carpenter',
    location: 'Stockholm',
    radius: 30,
    website: 'https://stockholmssnickeri.se',
    goals: ['leads', 'calls'],
    ageRangeMin: 30,
    ageRangeMax: 65,
    interests: ['home-improvement', 'construction'],
    description: 'Professionell snickare med 15 års erfarenhet av kvalitetsarbete'
  },
  {
    companyName: 'Göteborg Elektriker',
    industry: 'electrician',
    location: 'Göteborg',
    radius: 25,
    goals: ['leads'],
    ageRangeMin: 25,
    ageRangeMax: 60,
    interests: ['home-improvement', 'smart-home'],
    description: 'Auktoriserad elektriker för hem och företag'
  },
  {
    companyName: 'Malmö VVS Expert',
    industry: 'plumber',
    location: 'Malmö',
    radius: 20,
    goals: ['calls', 'website'],
    ageRangeMin: 35,
    ageRangeMax: 70,
    interests: ['home-improvement', 'maintenance'],
    description: 'Erfaren rörmokare med snabb service'
  }
];

export function DesignTestPage() {
  const [selectedProfile, setSelectedProfile] = useState<CompanyProfile>(MOCK_COMPANY_PROFILES[0]);
  const [designResults, setDesignResults] = useState<DesignResult[]>([]);
  const [showDesignTool, setShowDesignTool] = useState(false);

  const handleDesignComplete = (design: DesignResult) => {
    setDesignResults(prev => [...prev, design]);
    setShowDesignTool(false);
    console.log('✅ Design completed:', design);
  };

  const handleStartDesign = () => {
    setShowDesignTool(true);
  };

  const handleCancel = () => {
    setShowDesignTool(false);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="btn-ghost btn-sm flex items-center space-x-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Tillbaka</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                🎨 Canva Design Tool - Test
              </h1>
              <p className="text-neutral-600">
                Isolerad testning av Canva integration
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {!showDesignTool ? (
          <div className="space-y-8">
            {/* Company Profile Selector */}
            <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
              <h2 className="heading-md mb-4">Välj Testföretag</h2>
              <div className="grid gap-4">
                {MOCK_COMPANY_PROFILES.map((profile, index) => (
                  <div
                    key={index}
                    className={`
                      p-4 rounded-xl border cursor-pointer transition-all duration-200
                      ${selectedProfile === profile 
                        ? 'border-brand bg-brand-50' 
                        : 'border-neutral-200 hover:border-brand hover:bg-brand-50/50'
                      }
                    `}
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {profile.companyName}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {profile.industry} • {profile.location} • {profile.radius}km radie
                        </p>
                        {profile.description && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {profile.description}
                          </p>
                        )}
                      </div>
                      {selectedProfile === profile && (
                        <CheckCircleIcon className="w-5 h-5 text-brand" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Controls */}
            <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
              <h2 className="heading-md mb-4">Test Canva Integration</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Test Information</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Alla API-anrop är mockade för utveckling</li>
                    <li>• Templates filtreras baserat på bransch (olika för snickare/elektriker/vvs)</li>
                    <li>• Brand kit skapas automatiskt från företagsprofil</li>
                    <li>• Export simuleras med 3 sekunders delay</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-medium text-amber-800 mb-2">🎨 Med Riktiga Canva API:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• 10,000+ professionella templates per bransch</li>
                    <li>• Automatisk brand-färg applicering på templates</li>
                    <li>• Företagsinformation pre-fylld i designs</li>
                    <li>• Riktigt Canva editor för full anpassning</li>
                    <li>• Export i alla format (PNG, JPG, PDF, olika storlekar)</li>
                  </ul>
                </div>

                <button
                  onClick={handleStartDesign}
                  className="btn-primary w-full"
                >
                  🎨 Starta Canva Design Tool
                </button>
              </div>
            </div>

            {/* Previous Results */}
            {designResults.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
                <h2 className="heading-md mb-4">Skapade Designer ({designResults.length})</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {designResults.map((design, index) => (
                    <div
                      key={design.id}
                      className="border border-neutral-200 rounded-xl p-4"
                    >
                      <div className="aspect-video bg-neutral-100 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={design.thumbnailUrl}
                          alt={design.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-slate-900 mb-1">
                        {design.title}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {design.dimensions.width} × {design.dimensions.height}px • {design.format}
                      </p>
                      <div className="mt-3">
                        <button
                          onClick={() => window.open(design.url, '_blank')}
                          className="btn-ghost btn-sm w-full"
                        >
                          Visa Fullstorlek
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API Status */}
            <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
              <h2 className="heading-md mb-4">API Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Canva Connect API</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
                    Mock Mode
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Templates</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                    Available
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Brand Kit</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                    Auto-Generated
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Export</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                    Simulated
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
            <CanvaDesignTool
              companyProfile={selectedProfile}
              designType="facebook_ad"
              onDesignComplete={handleDesignComplete}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
}