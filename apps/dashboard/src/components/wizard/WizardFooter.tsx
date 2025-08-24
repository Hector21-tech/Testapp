import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, BookmarkIcon } from '@heroicons/react/24/outline';

export interface WizardFooterProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  nextButtonText?: string;
  canGoBack?: boolean;
  canProceed?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSaving?: boolean;
  showSaveDraft?: boolean;
  currentStep?: number;
  totalSteps?: number;
  className?: string;
}

export function WizardFooter({
  onPrevious,
  onNext,
  onSaveDraft,
  previousLabel = 'Tillbaka',
  nextLabel = 'Nästa',
  nextButtonText,
  canGoBack = true,
  canProceed = true,
  isFirstStep = false,
  isLastStep = false,
  isSaving = false,
  showSaveDraft = true,
  currentStep,
  totalSteps,
  className = ''
}: WizardFooterProps) {
  return (
    <div className={`
      sticky bottom-0 bg-white border-t border-neutral-200 p-6 
      ${className}
    `}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left Side - Back Button */}
        <div className="flex items-center space-x-4">
          {onPrevious && !isFirstStep && (
            <button
              onClick={onPrevious}
              disabled={!canGoBack}
              className={`
                btn-secondary btn-sm flex items-center space-x-2
                ${!canGoBack ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>{previousLabel}</span>
            </button>
          )}
          
          {/* Save Draft Link */}
          {showSaveDraft && onSaveDraft && (
            <button
              onClick={onSaveDraft}
              disabled={isSaving}
              className="btn-ghost btn-sm flex items-center space-x-2 text-neutral-500 hover:text-brand disabled:opacity-50"
            >
              <BookmarkIcon className="w-4 h-4" />
              <span>{isSaving ? 'Sparar...' : 'Spara utkast'}</span>
            </button>
          )}
        </div>

        {/* Center - Step indicator for mobile */}
        {currentStep && totalSteps && (
          <div className="lg:hidden text-sm text-neutral-500">
            {currentStep} av {totalSteps}
          </div>
        )}

        {/* Right Side - Next Button */}
        <div>
          {onNext && (
            <button
              onClick={onNext}
              disabled={!canProceed || isSaving}
              className={`
                ${isLastStep ? 'btn-primary' : 'btn-primary'} btn-sm flex items-center space-x-2
                ${!canProceed || isSaving ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sparar...</span>
                </>
              ) : (
                <>
                  <span>{nextButtonText || nextLabel}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}