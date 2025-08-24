/**
 * ContentStudioTestPage - Combined AI + Canva Test
 * 
 * Visar hela content creation pipeline:
 * AI Content Generator → Canva Design Tool → Färdig Annons
 * 
 * Detta demonstrerar full värdeproposition:
 * "AI skriver texten, Canva designar annonsen, färdigt på 2 minuter!"
 */

import React, { useState } from 'react';
import { AIContentGenerator, type AIGeneratedContent } from '../../components/ai/AIContentGenerator';
import { CanvaDesignTool, type DesignResult } from '../../components/design/CanvaDesignTool';
import type { CompanyProfile } from '../../features/campaign/types';
import { 
  ArrowLeftIcon, 
  SparklesIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const DEMO_COMPANIES: CompanyProfile[] = [
  {
    companyName: 'Stockholm Snickeri',
    industry: 'carpenter',
    location: 'Stockholm',
    radius: 35,
    goals: ['leads', 'calls'],
    ageRangeMin: 30,
    ageRangeMax: 60,
    interests: ['home-improvement', 'construction'],
    description: 'Professionell snickare med 20 års erfarenhet av kök och badrum'
  },
  {
    companyName: 'ElektrikerPro Göteborg',
    industry: 'electrician',
    location: 'Göteborg',
    radius: 30,
    goals: ['leads', 'website'],
    ageRangeMin: 25,
    ageRangeMax: 65,
    interests: ['smart-home', 'home-improvement'],
    description: 'Auktoriserad elektriker specialiserad på smart hem-installationer'
  }
];

type FlowStep = 'setup' | 'ai-content' | 'canva-design' | 'final-result';

interface CompleteCampaign {
  companyProfile: CompanyProfile;
  aiContent: {
    headline: string;
    description: string;
    cta: string;
  };
  designResult: DesignResult;
  createdAt: string;
}

export function ContentStudioTestPage() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('setup');
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile>(DEMO_COMPANIES[0]);
  const [aiGeneratedContent, setAIGeneratedContent] = useState<AIGeneratedContent | null>(null);
  const [selectedAIContent, setSelectedAIContent] = useState<{
    headline: string;
    description: string;
    cta: string;
  } | null>(null);
  const [finalCampaign, setFinalCampaign] = useState<CompleteCampaign | null>(null);
  const [campaignHistory, setCampaignHistory] = useState<CompleteCampaign[]>([]);

  const handleAIContentGenerated = (content: AIGeneratedContent) => {
    setAIGeneratedContent(content);
  };

  const handleAIContentSelected = (content: { headline: string; description: string; cta: string }) => {
    setSelectedAIContent(content);
    setCurrentStep('canva-design');
  };

  const handleCanvaDesignComplete = (design: DesignResult) => {
    if (selectedAIContent) {
      const completeCampaign: CompleteCampaign = {
        companyProfile: selectedCompany,
        aiContent: selectedAIContent,
        designResult: design,
        createdAt: new Date().toISOString()
      };
      
      setFinalCampaign(completeCampaign);
      setCampaignHistory(prev => [completeCampaign, ...prev]);
      setCurrentStep('final-result');
    }
  };

  const handleStartOver = () => {
    setCurrentStep('setup');
    setAIGeneratedContent(null);
    setSelectedAIContent(null);
    setFinalCampaign(null);
  };

  const handleBackToAI = () => {
    setCurrentStep('ai-content');
    setSelectedAIContent(null);
  };

  const getStepNumber = (step: FlowStep): number => {
    const steps = { setup: 1, 'ai-content': 2, 'canva-design': 3, 'final-result': 4 };
    return steps[step];
  };

  const isStepCompleted = (step: FlowStep): boolean => {
    const currentStepNum = getStepNumber(currentStep);
    const stepNum = getStepNumber(step);
    return stepNum < currentStepNum;
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <button 
              onClick={() => window.history.back()}
              className="btn-ghost btn-sm flex items-center space-x-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Tillbaka</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Content Studio
              </h1>
              <p className="text-neutral-600">
                Automatiserad annonsproduktion från text till design
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-6">
            {[
              { key: 'setup', label: 'Företagsprofil', number: 1 },
              { key: 'ai-content', label: 'Content Generation', number: 2 },
              { key: 'canva-design', label: 'Design Creation', number: 3 },
              { key: 'final-result', label: 'Publiceringsredo', number: 4 }
            ].map((step, index) => (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                    ${currentStep === step.key 
                      ? 'bg-brand text-white shadow-soft'
                      : isStepCompleted(step.key as FlowStep)
                        ? 'bg-brand text-white shadow-soft'
                        : 'bg-neutral-200 text-neutral-500'
                    }
                  `}>
                    {isStepCompleted(step.key as FlowStep) ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div className={`text-xs text-center mt-2 max-w-20 font-medium ${
                    currentStep === step.key || isStepCompleted(step.key as FlowStep)
                      ? 'text-brand' 
                      : 'text-neutral-500'
                  }`}>
                    {step.label}
                  </div>
                </div>
                {index < 3 && (
                  <div className={`w-8 h-px transition-colors duration-200 ${
                    isStepCompleted(['ai-content', 'canva-design', 'final-result'][index] as FlowStep)
                      ? 'bg-brand' 
                      : 'bg-neutral-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Step 1: Company Setup */}
        {currentStep === 'setup' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="heading-lg mb-2">🏢 Välj Testföretag</h2>
              <p className="body text-neutral-600">
                Välj ett företag för att demonstrera hela content creation-processen
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
              <div className="grid gap-4">
                {DEMO_COMPANIES.map((company, index) => (
                  <div
                    key={index}
                    className={`
                      p-6 rounded-xl border cursor-pointer transition-all duration-200
                      ${selectedCompany === company 
                        ? 'border-brand bg-brand-50 shadow-soft' 
                        : 'border-neutral-200 hover:border-brand hover:bg-brand-50/50'
                      }
                    `}
                    onClick={() => setSelectedCompany(company)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">
                          {company.companyName}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-neutral-600 mb-3">
                          <div>Bransch: {company.industry}</div>
                          <div>Plats: {company.location}</div>
                          <div>Radie: {company.radius}km</div>
                          <div>Mål: {company.goals.join(', ')}</div>
                        </div>
                        <p className="text-sm text-neutral-500">
                          {company.description}
                        </p>
                      </div>
                      {selectedCompany === company && (
                        <CheckCircleIcon className="w-6 h-6 text-brand ml-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentStep('ai-content')}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span>Starta Content Creation</span>
                </button>
              </div>
            </div>

            {/* Process Overview */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8">
              <h3 className="font-semibold text-slate-900 mb-6">Så här fungerar processen</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center mb-3">
                    <span className="text-white font-semibold text-sm">1</span>
                  </div>
                  <h4 className="font-medium text-slate-900 mb-2">AI Content Generation</h4>
                  <p className="text-neutral-600 text-sm">
                    AI analyserar din företagsprofil och skapar optimerade rubriker, beskrivningar och uppmaningar.
                  </p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center mb-3">
                    <span className="text-white font-semibold text-sm">2</span>
                  </div>
                  <h4 className="font-medium text-slate-900 mb-2">Design Automation</h4>
                  <p className="text-neutral-600 text-sm">
                    Canva integrerar texten automatiskt i branschspecifika designmallar för professionellt resultat.
                  </p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center mb-3">
                    <span className="text-white font-semibold text-sm">3</span>
                  </div>
                  <h4 className="font-medium text-slate-900 mb-2">Publiceringsredo</h4>
                  <p className="text-neutral-600 text-sm">
                    Färdig annons i rätt format för alla stora reklamplattformar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: AI Content Generation */}
        {currentStep === 'ai-content' && (
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
            <div className="text-center mb-6">
              <h2 className="heading-lg mb-2">🤖 AI Skapar Innehåll</h2>
              <p className="body text-neutral-600">
                AI:n analyserar {selectedCompany.companyName} och skapar professionellt annonsinnehåll
              </p>
            </div>

            <AIContentGenerator
              companyProfile={selectedCompany}
              onContentGenerated={handleAIContentGenerated}
              onContentSelect={handleAIContentSelected}
            />
          </div>
        )}

        {/* Step 3: Canva Design */}
        {currentStep === 'canva-design' && selectedAIContent && (
          <div className="space-y-6">
            {/* Selected Content Preview */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <h3 className="font-medium text-green-800">AI-innehåll klart</h3>
                <button
                  onClick={handleBackToAI}
                  className="btn-ghost btn-sm ml-auto"
                >
                  Ändra text
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs font-medium text-green-600 mb-1">RUBRIK</div>
                  <div className="font-semibold text-slate-900">{selectedAIContent.headline}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-green-600 mb-1">BESKRIVNING</div>
                  <div className="text-slate-700">{selectedAIContent.description}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-green-600 mb-1">CTA</div>
                  <div className="btn-primary btn-sm">{selectedAIContent.cta}</div>
                </div>
              </div>
            </div>

            {/* Canva Design Tool */}
            <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
              <div className="text-center mb-6">
                <h2 className="heading-lg mb-2">🎨 Canva Skapar Design</h2>
                <p className="body text-neutral-600">
                  Nu använder Canva AI-texten för att skapa en professionell annonsdesign
                </p>
              </div>

              <CanvaDesignTool
                companyProfile={selectedCompany}
                aiContent={selectedAIContent}
                onDesignComplete={handleCanvaDesignComplete}
                onCancel={handleBackToAI}
              />
            </div>
          </div>
        )}

        {/* Step 4: Final Result */}
        {currentStep === 'final-result' && finalCampaign && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="heading-xl mb-2">Färdig Annons!</h2>
              <p className="body text-neutral-600">
                AI + Canva har skapat en komplett annons på under 5 minuter
              </p>
            </div>

            {/* Final Campaign Result */}
            <div className="bg-white rounded-2xl shadow-strong border border-green-200 p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Design Preview */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Slutresultat</h3>
                  <div className="bg-neutral-100 rounded-xl p-4">
                    <img
                      src={finalCampaign.designResult.url}
                      alt={finalCampaign.designResult.title}
                      className="w-full h-auto rounded-lg shadow-medium"
                    />
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Kampanjdetaljer</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-neutral-600">Företag:</span>
                        <div>{finalCampaign.companyProfile.companyName}</div>
                      </div>
                      <div>
                        <span className="font-medium text-neutral-600">Rubrik:</span>
                        <div className="font-medium">{finalCampaign.aiContent.headline}</div>
                      </div>
                      <div>
                        <span className="font-medium text-neutral-600">Beskrivning:</span>
                        <div>{finalCampaign.aiContent.description}</div>
                      </div>
                      <div>
                        <span className="font-medium text-neutral-600">Uppmaning:</span>
                        <div className="btn-primary btn-sm inline-block">
                          {finalCampaign.aiContent.cta}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-neutral-600">Storlek:</span>
                        <div>
                          {finalCampaign.designResult.dimensions.width} × {finalCampaign.designResult.dimensions.height}px
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        const text = `${finalCampaign.companyProfile.companyName} - Kampanj\n\nRubrik: ${finalCampaign.aiContent.headline}\n\nBeskrivning: ${finalCampaign.aiContent.description}\n\nCTA: ${finalCampaign.aiContent.cta}\n\nBild: ${finalCampaign.designResult.url}`;
                        navigator.clipboard.writeText(text);
                        alert('Kampanjdata kopierat!');
                      }}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" />
                      <span>Kopiera Data</span>
                    </button>
                    <button
                      onClick={handleStartOver}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <RocketLaunchIcon className="w-4 h-4" />
                      <span>Skapa Ny Kampanj</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-900 mb-6">Resultat</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand mb-1">3-5min</div>
                  <div className="text-sm text-neutral-600">Total tid</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand mb-1">100%</div>
                  <div className="text-sm text-neutral-600">AI-genererat</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand mb-1">Pro</div>
                  <div className="text-sm text-neutral-600">Design-kvalitet</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand mb-1">Multi</div>
                  <div className="text-sm text-neutral-600">Format & kanaler</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaign History */}
        {campaignHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6">
            <h2 className="heading-md mb-4">
              📈 Skapade Kampanjer ({campaignHistory.length})
            </h2>
            <div className="grid gap-4">
              {campaignHistory.map((campaign, index) => (
                <div
                  key={campaign.createdAt}
                  className="border border-neutral-200 rounded-xl p-4 flex items-center space-x-4"
                >
                  <img
                    src={campaign.designResult.thumbnailUrl}
                    alt={campaign.designResult.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">
                      {campaign.companyProfile.companyName}
                    </h4>
                    <p className="text-sm text-neutral-600 mb-1">
                      {campaign.aiContent.headline}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(campaign.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">✅ Klar</div>
                    <div className="text-xs text-neutral-500">
                      {campaign.designResult.format.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}