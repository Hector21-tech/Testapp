/**
 * AIContentGenerator - AI-powered content creation for ads
 * 
 * Features:
 * - Industry-specific content generation
 * - Multiple variations for headlines, descriptions, CTAs
 * - Swedish language focus for hantverkare
 * - OpenAI integration (mockad for utveckling)
 * - Tone adjustment (professional, friendly, urgent)
 * - Content refinement and regeneration
 * 
 * TODO:
 * - Real OpenAI API integration
 * - Advanced prompt engineering
 * - Content quality scoring
 * - A/B testing suggestions
 */

import React, { useState, useCallback } from 'react';
import { 
  SparklesIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import type { CompanyProfile } from '../../features/campaign/types';

export interface AIGeneratedContent {
  headlines: string[];
  descriptions: string[];
  ctas: string[];
  tone: 'professional' | 'friendly' | 'urgent';
  industry: string;
  generatedAt: string;
}

export interface ContentVariation {
  text: string;
  score: number;
  reasoning: string;
}

export interface AIContentGeneratorProps {
  companyProfile?: CompanyProfile;
  targetAudience?: {
    ageMin: number;
    ageMax: number;
    interests: string[];
    goals: string[];
  };
  onContentGenerated: (content: AIGeneratedContent) => void;
  onContentSelect?: (content: { headline: string; description: string; cta: string }) => void;
  className?: string;
}

const TONE_OPTIONS = [
  {
    value: 'professional' as const,
    label: 'Professionell',
    description: 'Seriös och trovärdig ton',
    icon: '🎯',
    example: '"Erfaren snickare med 15 års branschexpertis"'
  },
  {
    value: 'friendly' as const,
    label: 'Vänlig',
    description: 'Personlig och tillmötesgående',
    icon: '😊',
    example: '"Vi hjälper gärna till med ditt projekt!"'
  },
  {
    value: 'urgent' as const,
    label: 'Angelägen',
    description: 'Skapar brådska och handling',
    icon: '⚡',
    example: '"Ring nu - lediga tider tar snabbt slut!"'
  }
];

export function AIContentGenerator({
  companyProfile,
  targetAudience,
  onContentGenerated,
  onContentSelect,
  className = ''
}: AIContentGeneratorProps) {
  const [selectedTone, setSelectedTone] = useState<'professional' | 'friendly' | 'urgent'>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent | null>(null);
  const [selectedContent, setSelectedContent] = useState<{
    headline: string;
    description: string; 
    cta: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateContent = useCallback(async () => {
    if (!companyProfile) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // TODO: Real OpenAI API call
      // const content = await openaiAPI.generateAdContent(companyProfile, selectedTone, targetAudience);
      
      // Mock generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockContent = generateMockContent(companyProfile, selectedTone);
      setGeneratedContent(mockContent);
      onContentGenerated(mockContent);
      
    } catch (err) {
      setError('Kunde inte generera innehåll. Försök igen.');
      console.error('AI content generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [companyProfile, selectedTone, targetAudience, onContentGenerated]);

  const handleContentSelection = useCallback((type: 'headline' | 'description' | 'cta', text: string) => {
    const newSelection = {
      headline: type === 'headline' ? text : selectedContent?.headline || '',
      description: type === 'description' ? text : selectedContent?.description || '',
      cta: type === 'cta' ? text : selectedContent?.cta || ''
    };
    
    setSelectedContent(newSelection);
    
    // If all parts are selected, trigger callback
    if (newSelection.headline && newSelection.description && newSelection.cta) {
      onContentSelect?.(newSelection);
    }
  }, [selectedContent, onContentSelect]);

  const handleRegenerateSection = useCallback(async (section: 'headlines' | 'descriptions' | 'ctas') => {
    if (!companyProfile || !generatedContent) return;
    
    setIsGenerating(true);
    
    // Mock regeneration
    setTimeout(() => {
      const newContent = generateMockContent(companyProfile, selectedTone);
      setGeneratedContent({
        ...generatedContent,
        [section]: newContent[section]
      });
      setIsGenerating(false);
    }, 2000);
  }, [companyProfile, generatedContent, selectedTone]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="heading-lg mb-2">AI Innehållsassistent</h2>
        <p className="body text-neutral-600">
          Låt AI:n skriva professionellt annonsinnehåll åt dig
        </p>
      </div>

      {/* Company Profile Display */}
      {companyProfile && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
          <h4 className="font-medium text-brand-800 mb-2">
            📋 Skapar innehåll för: {companyProfile.companyName}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-brand-700">
            <div>Bransch: {companyProfile.industry}</div>
            <div>Plats: {companyProfile.location}</div>
            {companyProfile.goals.length > 0 && (
              <div className="col-span-2">
                Mål: {companyProfile.goals.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tone Selection */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Välj tonalitet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TONE_OPTIONS.map((tone) => (
            <div
              key={tone.value}
              className={`
                p-4 rounded-xl border cursor-pointer transition-all duration-200
                ${selectedTone === tone.value
                  ? 'border-brand bg-brand-50 shadow-soft'
                  : 'border-neutral-200 hover:border-brand hover:bg-brand-50/50'
                }
              `}
              onClick={() => setSelectedTone(tone.value)}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{tone.icon}</span>
                <div>
                  <h4 className="font-medium text-slate-900">{tone.label}</h4>
                  <p className="text-xs text-neutral-600">{tone.description}</p>
                </div>
              </div>
              <div className="text-xs text-neutral-500 italic">
                {tone.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={handleGenerateContent}
          disabled={isGenerating || !companyProfile}
          className="btn-primary flex items-center space-x-2 mx-auto"
        >
          {isGenerating ? (
            <>
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
              <span>Genererar innehåll...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4" />
              <span>Generera AI-innehåll</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800">Kunde inte generera innehåll</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="heading-md text-green-800 mb-2">
              ✨ AI-genererat innehåll
            </h3>
            <p className="text-sm text-green-600">
              Klicka på alternativ för att välja dem
            </p>
          </div>

          {/* Headlines */}
          <ContentSection
            title="Rubriker"
            items={generatedContent.headlines}
            selectedItem={selectedContent?.headline}
            onItemSelect={(item) => handleContentSelection('headline', item)}
            onRegenerate={() => handleRegenerateSection('headlines')}
            isRegenerating={isGenerating}
          />

          {/* Descriptions */}
          <ContentSection
            title="Beskrivningar"
            items={generatedContent.descriptions}
            selectedItem={selectedContent?.description}
            onItemSelect={(item) => handleContentSelection('description', item)}
            onRegenerate={() => handleRegenerateSection('descriptions')}
            isRegenerating={isGenerating}
          />

          {/* CTAs */}
          <ContentSection
            title="Uppmaningar (CTA)"
            items={generatedContent.ctas}
            selectedItem={selectedContent?.cta}
            onItemSelect={(item) => handleContentSelection('cta', item)}
            onRegenerate={() => handleRegenerateSection('ctas')}
            isRegenerating={isGenerating}
          />

          {/* Selected Content Preview */}
          {selectedContent?.headline && selectedContent?.description && selectedContent?.cta && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <h4 className="font-medium text-green-800">Valt innehåll</h4>
              </div>
              <div className="bg-white rounded-xl p-4 space-y-3">
                <div>
                  <div className="text-xs font-medium text-neutral-500 mb-1">RUBRIK</div>
                  <div className="font-bold text-lg text-slate-900">{selectedContent.headline}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-neutral-500 mb-1">BESKRIVNING</div>
                  <div className="text-neutral-700">{selectedContent.description}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-neutral-500 mb-1">UPPMANING</div>
                  <div className="btn-primary btn-sm">{selectedContent.cta}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper component for content sections
interface ContentSectionProps {
  title: string;
  items: string[];
  selectedItem?: string;
  onItemSelect: (item: string) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

function ContentSection({ 
  title, 
  items, 
  selectedItem, 
  onItemSelect, 
  onRegenerate, 
  isRegenerating 
}: ContentSectionProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-slate-900">{title}</h4>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="btn-ghost btn-sm flex items-center space-x-1"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>Förnya</span>
        </button>
      </div>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className={`
              p-3 rounded-xl cursor-pointer transition-all duration-200 group
              ${selectedItem === item
                ? 'bg-brand-50 border border-brand-200'
                : 'bg-neutral-50 hover:bg-brand-50/50 border border-transparent hover:border-brand-200'
              }
            `}
            onClick={() => onItemSelect(item)}
          >
            <div className="flex items-start justify-between">
              <span className="text-sm flex-1 pr-2">{item}</span>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {selectedItem === item ? (
                  <CheckCircleIcon className="w-4 h-4 text-brand-500" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4 text-neutral-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mock content generation based on company profile
function generateMockContent(
  profile: CompanyProfile, 
  tone: 'professional' | 'friendly' | 'urgent'
): AIGeneratedContent {
  const industry = profile.industry;
  const company = profile.companyName;
  const location = profile.location;
  
  const headlines = generateHeadlines(company, industry, location, tone);
  const descriptions = generateDescriptions(company, industry, location, tone);
  const ctas = generateCTAs(tone);
  
  return {
    headlines,
    descriptions,
    ctas,
    tone,
    industry,
    generatedAt: new Date().toISOString()
  };
}

function generateHeadlines(company: string, industry: string, location: string, tone: string): string[] {
  const base = [
    `Professionell ${industry} i ${location}`,
    `${company} - Din pålitliga ${industry}`,
    `Kvalitet och erfarenhet - ${company}`
  ];
  
  if (tone === 'friendly') {
    return [
      `Hej ${location}! Vi hjälper er gärna`,
      `${company} - Vi löser dina problem`,
      `Lokala ${industry}-experter i ${location}`
    ];
  } else if (tone === 'urgent') {
    return [
      `Ring nu! ${industry} med snabb service`,
      `Akut hjälp? ${company} finns här`,
      `Lediga tider - boka idag!`
    ];
  }
  
  return base;
}

function generateDescriptions(company: string, industry: string, location: string, tone: string): string[] {
  if (tone === 'friendly') {
    return [
      `Vi på ${company} har lång erfarenhet av ${industry.toLowerCase()} i ${location}. Vi tar alltid hand om våra kunder med ett leende!`,
      `Behöver du hjälp med ${industry.toLowerCase()}? Ring oss på ${company} så löser vi det tillsammans. Vi finns i ${location}.`,
      `${company} erbjuder personlig service inom ${industry.toLowerCase()}. Vi ser fram emot att träffa dig i ${location}!`
    ];
  } else if (tone === 'urgent') {
    return [
      `${company} - snabb service inom ${industry.toLowerCase()} i ${location}. Ring nu och få hjälp samma dag!`,
      `Akut problem? ${company} löser det snabbt! Tillgänglig dygnet runt i ${location}.`,
      `Begränsade tider kvar denna månad. Boka ${company} nu för professionell ${industry.toLowerCase()}.`
    ];
  }
  
  return [
    `${company} erbjuder professionell ${industry.toLowerCase()} med många års erfarenhet i ${location}. Kontakta oss för kvalitetsarbete.`,
    `Vi på ${company} utför ${industry.toLowerCase()} med hösta kvalitet i ${location}. Certifierade och försäkrade.`,
    `Välj ${company} för pålitlig ${industry.toLowerCase()} i ${location}. Vi garanterar vårt arbete.`
  ];
}

function generateCTAs(tone: string): string[] {
  if (tone === 'friendly') {
    return ['Hör av dig!', 'Vi hjälper gärna', 'Kontakta oss', 'Ring och fråga', 'Få en offert'];
  } else if (tone === 'urgent') {
    return ['Ring nu!', 'Boka idag', 'Få hjälp direkt', 'Akut service', 'Ring 24/7'];
  }
  
  return ['Begär offert', 'Kontakta oss', 'Boka konsultation', 'Läs mer', 'Ring för mer info'];
}