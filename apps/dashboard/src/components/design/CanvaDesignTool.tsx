/**
 * CanvaDesignTool - Separat komponent för Canva integration
 * 
 * Features:
 * - Canva embed integration
 * - Template selection based on industry
 * - Brand kit sync from company profile
 * - Design export and preview
 * - Helt isolerad från wizard - kan användas var som helst
 * 
 * TODO: 
 * - Canva Connect API integration
 * - Real template filtering
 * - Brand color sync
 * - Design export functionality
 */

import React, { useState, useCallback } from 'react';
import { 
  SparklesIcon, 
  SwatchIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import type { CompanyProfile } from '../../features/campaign/types';

export interface DesignResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
}

export interface CanvaDesignToolProps {
  companyProfile?: CompanyProfile;
  designType?: 'facebook_ad' | 'instagram_post' | 'google_ad' | 'banner';
  aiContent?: {
    headline: string;
    description: string;
    cta: string;
  };
  onDesignComplete: (design: DesignResult) => void;
  onCancel?: () => void;
  className?: string;
}

// Mock templates based on industry - Industry-specific images for better demo
const MOCK_TEMPLATES_BY_INDUSTRY = {
  carpenter: [
    { id: 'carp-1', title: 'Professionell Snickare', thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop&overlay=text&text=Professionell%20Snickare&color=9B4521' },
    { id: 'carp-2', title: 'Träarbeten Premium', thumbnail: 'https://images.unsplash.com/photo-1581092918484-8313de64ce2d?w=300&h=200&fit=crop&overlay=text&text=Kvalitetstr%C3%A4&color=8B4513' },
    { id: 'carp-3', title: 'Hantverk & Kvalitet', thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop&overlay=text&text=25%20%C3%85rs%20Erfarenhet&color=654321' }
  ],
  electrician: [
    { id: 'elec-1', title: 'Elektriker Expert', thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop&overlay=text&text=Auktoriserad%20Elektriker&color=1E40AF' },
    { id: 'elec-2', title: 'Säker Installation', thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop&overlay=text&text=S%C3%A4ker%20Installation&color=2563EB' },
    { id: 'elec-3', title: '24/7 Service', thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&overlay=text&text=24%2F7%20Jour&color=3B82F6' }
  ],
  plumber: [
    { id: 'plumb-1', title: 'Rörmokare Pro', thumbnail: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=200&fit=crop&overlay=text&text=VVS%20Expert&color=0891B2' },
    { id: 'plumb-2', title: 'VVS Specialist', thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop&overlay=text&text=Snabb%20Service&color=0E7490' },
    { id: 'plumb-3', title: 'Akut Reparation', thumbnail: 'https://images.unsplash.com/photo-1621905252472-e1c7668c0102?w=300&h=200&fit=crop&overlay=text&text=Akut%20Hj%C3%A4lp&color=155E75' }
  ],
  other: [
    { id: 'gen-1', title: 'Professionell Service', thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&overlay=text&text=Professionell%20Service&color=374151' },
    { id: 'gen-2', title: 'Kvalitet & Trygghet', thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop&overlay=text&text=Kvalitet%20%26%20Trygghet&color=4B5563' }
  ]
};

export function CanvaDesignTool({
  companyProfile,
  designType = 'facebook_ad',
  aiContent,
  onDesignComplete,
  onCancel,
  className = ''
}: CanvaDesignToolProps) {
  const [currentStep, setCurrentStep] = useState<'templates' | 'editing' | 'preview'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCanvaLoading, setIsCanvaLoading] = useState(false);
  const [designResult, setDesignResult] = useState<DesignResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get templates for user's industry
  const industryTemplates = companyProfile?.industry 
    ? MOCK_TEMPLATES_BY_INDUSTRY[companyProfile.industry as keyof typeof MOCK_TEMPLATES_BY_INDUSTRY] || MOCK_TEMPLATES_BY_INDUSTRY.other
    : MOCK_TEMPLATES_BY_INDUSTRY.other;

  const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep('editing');
    setIsCanvaLoading(true);
    
    // TODO: Initialize Canva with selected template
    // canvaAPI.createDesignFromTemplate(templateId, companyProfile)
    
    // Mock loading
    setTimeout(() => {
      setIsCanvaLoading(false);
      // Mock: Canva editor would be loaded here
    }, 2000);
  }, [companyProfile]);

  const handleCanvaDesignComplete = useCallback((mockDesignId: string) => {
    setIsCanvaLoading(true);
    
    // TODO: Export design from Canva
    // const design = await canvaAPI.exportDesign(mockDesignId);
    
    // Mock export
    setTimeout(() => {
      const mockDesign: DesignResult = {
        id: mockDesignId,
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=630&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop',
        title: aiContent ? `${aiContent.headline}` : `${companyProfile?.companyName || 'Min'} Annons`,
        dimensions: { width: 1200, height: 630 },
        format: 'png'
      };
      
      setDesignResult(mockDesign);
      setCurrentStep('preview');
      setIsCanvaLoading(false);
    }, 3000);
  }, [companyProfile]);

  const handleUseDesign = useCallback(() => {
    if (designResult) {
      onDesignComplete(designResult);
    }
  }, [designResult, onDesignComplete]);

  const getBrandColors = () => {
    // Extract brand colors from company profile or use defaults
    return {
      primary: '#9B4521',
      secondary: '#C7683A',
      accent: '#7F361B'
    };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="heading-lg mb-2">Designa med Canva</h2>
        <p className="body text-neutral-600">
          Skapa professionella annonser med tusentals templates
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800">Något gick fel</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Template Selection */}
      {currentStep === 'templates' && (
        <div className="space-y-6">
          {/* Brand Info */}
          {companyProfile && (
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <SwatchIcon className="w-5 h-5 text-brand-600" />
                <h4 className="font-medium text-brand-800">
                  Anpassat för {companyProfile.companyName}
                </h4>
              </div>
              <div className="flex items-center space-x-4 text-sm text-brand-700">
                <span>Bransch: {companyProfile.industry}</span>
                {companyProfile.location && <span>Plats: {companyProfile.location}</span>}
              </div>
            </div>
          )}

          {/* AI Content Preview */}
          {aiContent && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-800">AI-innehåll som kommer användas</h4>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-green-600 mb-1">RUBRIK</div>
                  <div className="text-green-800">{aiContent.headline}</div>
                </div>
                <div>
                  <div className="font-medium text-green-600 mb-1">BESKRIVNING</div>
                  <div className="text-green-700">{aiContent.description}</div>
                </div>
                <div>
                  <div className="font-medium text-green-600 mb-1">CTA</div>
                  <div className="btn-primary btn-xs inline-block">{aiContent.cta}</div>
                </div>
              </div>
            </div>
          )}

          {/* Template Grid */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">
              Välj en mall att börja med
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {industryTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group cursor-pointer bg-white rounded-2xl shadow-soft border border-neutral-200 overflow-hidden hover:shadow-medium transition-all duration-200"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="aspect-video bg-neutral-100 relative overflow-hidden">
                    <img 
                      src={template.thumbnail}
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="btn-primary btn-sm">
                        Använd denna mall
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-slate-900">{template.title}</h4>
                    <p className="text-sm text-neutral-600 mt-1">
                      Anpassad för {companyProfile?.industry || 'din bransch'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Canva Editor (Mock) */}
      {currentStep === 'editing' && (
        <div className="space-y-6">
          {isCanvaLoading ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-neutral-200 p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <ArrowPathIcon className="w-8 h-8 text-brand animate-spin" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Förbereder Canva Editor
                  </h3>
                  <p className="text-neutral-600">
                    Vi laddar din mall med företagsinformation och AI-genererat innehåll...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* AI Content Integration Status */}
              {aiContent && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <SparklesIcon className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-800">🔄 Synkroniserar AI-innehåll</h4>
                  </div>
                  <div className="text-sm text-blue-700">
                    ✅ Rubrik tillagd i design<br/>
                    ✅ Beskrivning integrerad<br/>
                    ✅ CTA-knapp uppdaterad<br/>
                    ✅ Företagsinformation tillagd
                  </div>
                </div>
              )}

              {/* Mock Canva Interface */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">
                    Canva Editor (Demo)
                  </h3>
                  <div className="text-sm text-neutral-500">
                    Mall: {selectedTemplate}
                  </div>
                </div>
                
                <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <PhotoIcon className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600 mb-4">
                      Här skulle Canva editor visas
                    </p>
                    <button
                      onClick={() => handleCanvaDesignComplete(selectedTemplate || 'mock')}
                      className="btn-primary"
                      disabled={isCanvaLoading}
                    >
                      {isCanvaLoading ? 'Exporterar...' : 'Simulera Klar Design'}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-neutral-500">
                  I produktionsversionen öppnas Canva's editor här där du kan redigera din design.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Preview & Confirm */}
      {currentStep === 'preview' && designResult && (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="heading-md mb-2">Design Klar!</h3>
            <p className="body text-neutral-600">
              Din professionella annons är redo att användas
            </p>
          </div>

          {/* Design Preview */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="text-center mb-4">
              <img
                src={designResult.url}
                alt={designResult.title}
                className="max-w-full h-auto rounded-xl shadow-medium mx-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-slate-900 mb-1">
                {designResult.title}
              </h4>
              <p className="text-sm text-neutral-600">
                {designResult.dimensions.width} × {designResult.dimensions.height}px • {designResult.format.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentStep('templates')}
              className="btn-secondary flex-1"
            >
              Välj Annan Mall
            </button>
            <button
              onClick={() => setCurrentStep('editing')}
              className="btn-secondary flex-1"
            >
              Redigera Mer
            </button>
            <button
              onClick={handleUseDesign}
              className="btn-primary flex-1"
            >
              Använd Design
            </button>
          </div>
        </div>
      )}

      {/* Cancel Button (always visible) */}
      {onCancel && (
        <div className="text-center pt-4 border-t border-neutral-200">
          <button onClick={onCancel} className="btn-ghost">
            Avbryt och stäng
          </button>
        </div>
      )}
    </div>
  );
}