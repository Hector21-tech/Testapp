import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, BookmarkIcon } from '@heroicons/react/24/outline';

export interface WizardFooterProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isNextLoading?: boolean;
  showSaveDraft?: boolean;
  className?: string;
}

export function WizardFooter({
  onPrevious,
  onNext,
  onSaveDraft,
  previousLabel = 'Tillbaka',
  nextLabel = 'Nästa',
  canGoBack = true,
  canGoNext = true,
  isNextLoading = false,
  showSaveDraft = true,
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
          {onPrevious && (
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
              className="btn-ghost btn-sm flex items-center space-x-2 text-neutral-500 hover:text-brand"
            >
              <BookmarkIcon className="w-4 h-4" />
              <span>Spara utkast</span>
            </button>
          )}
        </div>

        {/* Right Side - Next Button */}
        <div>
          {onNext && (
            <button
              onClick={onNext}
              disabled={!canGoNext || isNextLoading}
              className={`
                btn-primary btn-sm flex items-center space-x-2
                ${!canGoNext || isNextLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isNextLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sparar...</span>
                </>
              ) : (
                <>
                  <span>{nextLabel}</span>
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