/**
 * AITestPage - Isolerad testsida för AI Content Generator
 * 
 * Används för att testa AI-innehållsgenerering separat
 * Perfekt för att utveckla och debugga AI-funktionalitet
 */

import React, { useState } from 'react';
import { AIContentGenerator, type AIGeneratedContent } from '../../components/ai/AIContentGenerator';
import type { CompanyProfile } from '../../features/campaign/types';
import { ArrowLeftIcon, SparklesIcon, ClipboardDocumentIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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
    description: 'Professionell snickare med 15 års erfarenhet av kvalitetsarbete i köks- och badrumsinredning'
  },
  {
    companyName: 'Göteborgs El-Expert',
    industry: 'electrician',
    location: 'Göteborg',
    radius: 25,
    goals: ['leads', 'website'],
    ageRangeMin: 25,
    ageRangeMax: 60,
    interests: ['home-improvement', 'smart-home'],
    description: 'Auktoriserad elektriker med specialisering på smart hem-installationer och säkra elinstallationer'
  },
  {
    companyName: 'Malmö VVS & Badrum',
    industry: 'plumber',
    location: 'Malmö',
    radius: 20,
    goals: ['calls', 'awareness'],
    ageRangeMin: 35,
    ageRangeMax: 70,
    interests: ['home-improvement', 'maintenance'],
    description: 'Erfaren VVS-specialist med snabb service och expertis inom badrumsrenovering och akuta reparationer'
  },
  {
    companyName: 'Nordic Paint Pro',
    industry: 'painter',
    location: 'Uppsala',
    radius: 40,
    goals: ['leads'],
    ageRangeMin: 28,
    ageRangeMax: 65,
    interests: ['interior-design', 'home-improvement'],
    description: 'Professionell målare specialiserad på fasadmålning och exklusiva inomhusprojekt'
  }
];

const TARGET_AUDIENCE_OPTIONS = [
  {
    name: 'Unga Familjer',
    ageMin: 25,
    ageMax: 45,
    interests: ['home-improvement', 'diy', 'family'],
    goals: ['leads', 'calls']
  },
  {
    name: 'Medelålders Villaägare', 
    ageMin: 40,
    ageMax: 65,
    interests: ['home-improvement', 'renovation', 'quality'],
    goals: ['leads', 'website']
  },
  {
    name: 'Seniorer',
    ageMin: 55,
    ageMax: 80,
    interests: ['maintenance', 'safety', 'reliability'],
    goals: ['calls', 'awareness']
  }
];

export function AITestPage() {
  const [selectedProfile, setSelectedProfile] = useState<CompanyProfile>(MOCK_COMPANY_PROFILES[0]);
  const [selectedAudience, setSelectedAudience] = useState(TARGET_AUDIENCE_OPTIONS[0]);
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);

  const handleContentGenerated = (content: AIGeneratedContent) => {
    setGeneratedContent(prev => [content, ...prev]);
    setShowGenerator(false);
    console.log('✅ AI Content generated:', content);
  };

  const handleContentSelect = (content: { headline: string; description: string; cta: string }) => {
    console.log('✅ Content selected:', content);
    // TODO: Here we could pass to Canva or save to clipboard
    navigator.clipboard.writeText(
      `Rubrik: ${content.headline}\nBeskrivning: ${content.description}\nCTA: ${content.cta}`
    );
    alert('Content kopierat till clipboard!');
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
                🤖 AI Content Generator - Test
              </h1>
              <p className="text-neutral-600">
                Testa AI-driven innehållsgenerering för annonser
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {!showGenerator ? (
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
                          <p className="text-xs text-neutral-500 mt-2 max-w-2xl">
                            {profile.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-neutral-500">
                          <span>Mål: {profile.goals.join(', ')}</span>
                          <span>Ålder: {profile.ageRangeMin}-{profile.ageRangeMax}år</span>
                        </div>
                      </div>
                      {selectedProfile === profile && (
                        <CheckCircleIcon className="w-5 h-5 text-brand" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience Selector */}
            <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
              <h2 className="heading-md mb-4">Välj Målgrupp</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {TARGET_AUDIENCE_OPTIONS.map((audience, index) => (
                  <div
                    key={index}
                    className={`
                      p-4 rounded-xl border cursor-pointer transition-all duration-200
                      ${selectedAudience === audience 
                        ? 'border-purple-300 bg-purple-50' 
                        : 'border-neutral-200 hover:border-purple-300 hover:bg-purple-50/50'
                      }
                    `}
                    onClick={() => setSelectedAudience(audience)}
                  >
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {audience.name}
                    </h3>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <div>Ålder: {audience.ageMin}-{audience.ageMax} år</div>
                      <div>Intressen: {audience.interests.join(', ')}</div>
                      <div>Mål: {audience.goals.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Controls */}
            <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
              <h2 className="heading-md mb-4">AI Content Generation</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Testinformation</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• AI-prompts optimerade för svenska hantverkare</li>
                    <li>• 3 tonaliteter: Professionell, Vänlig, Angelägen</li>
                    <li>• Branschspecifika nyckelord och värdepropositioner</li>
                    <li>• Genererar rubriker, beskrivningar och CTA:er</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-medium text-purple-800 mb-2">🤖 Med Riktiga OpenAI API:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• GPT-4 med branschspecifika prompts</li>
                    <li>• Dynamisk anpassning till företagsprofil</li>
                    <li>• A/B-testing av olika variationer</li>
                    <li>• Automatisk kvalitetsbedömning</li>
                    <li>• Kontinuerlig förbättring via machine learning</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowGenerator(true)}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span>🤖 Starta AI Content Generator</span>
                </button>
              </div>
            </div>

            {/* Previous Results */}
            {generatedContent.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
                <h2 className="heading-md mb-4">
                  Genererat Innehåll ({generatedContent.length} sessioner)
                </h2>
                <div className="space-y-6">
                  {generatedContent.map((content, index) => (
                    <div
                      key={content.generatedAt}
                      className="border border-neutral-200 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-slate-900">
                            Session {generatedContent.length - index}
                          </h4>
                          <p className="text-sm text-neutral-600">
                            {content.tone} ton • {content.industry} • {new Date(content.generatedAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const text = `RUBRIKER:\n${content.headlines.join('\n')}\n\nBESKRIVNINGAR:\n${content.descriptions.join('\n')}\n\nCTA:\n${content.ctas.join('\n')}`;
                            navigator.clipboard.writeText(text);
                            alert('Allt innehåll kopierat!');
                          }}
                          className="btn-ghost btn-sm flex items-center space-x-1"
                        >
                          <ClipboardDocumentIcon className="w-4 h-4" />
                          <span>Kopiera</span>
                        </button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h5 className="font-medium text-slate-700 mb-2">Rubriker</h5>
                          <div className="space-y-2">
                            {content.headlines.map((headline, i) => (
                              <div key={i} className="text-sm p-2 bg-neutral-50 rounded-lg">
                                {headline}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-slate-700 mb-2">Beskrivningar</h5>
                          <div className="space-y-2">
                            {content.descriptions.map((desc, i) => (
                              <div key={i} className="text-sm p-2 bg-neutral-50 rounded-lg">
                                {desc}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-slate-700 mb-2">CTA:er</h5>
                          <div className="space-y-2">
                            {content.ctas.map((cta, i) => (
                              <div key={i} className="text-sm p-2 bg-neutral-50 rounded-lg text-center">
                                {cta}
                              </div>
                            ))}
                          </div>
                        </div>
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
                  <span className="text-sm text-neutral-700">OpenAI API</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
                    Mock Mode
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">GPT-4 Model</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                    Ready
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Swedish Prompts</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                    Optimized
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Industry Context</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                    4 Industries
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
            <AIContentGenerator
              companyProfile={selectedProfile}
              targetAudience={selectedAudience}
              onContentGenerated={handleContentGenerated}
              onContentSelect={handleContentSelect}
            />
            
            <div className="mt-6 text-center border-t border-neutral-200 pt-6">
              <button
                onClick={() => setShowGenerator(false)}
                className="btn-ghost"
              >
                Stäng och återgå till test-översikt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}