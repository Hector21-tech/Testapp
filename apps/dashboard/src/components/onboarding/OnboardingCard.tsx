import React from 'react';
import { ChevronRightIcon, LockClosedIcon, CheckIcon } from '@heroicons/react/24/outline';
import type { OnboardingStep } from '../../features/onboarding/types';

interface OnboardingCardProps {
  step: OnboardingStep;
  onClick?: () => void;
  stepNumber: number;
}

export function OnboardingCard({ step, onClick, stepNumber }: OnboardingCardProps) {
  const { id, title, description, icon, completed, locked, estimatedTime, progress = 0 } = step;

  const handleClick = () => {
    if (!locked && onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200
        ${completed 
          ? 'bg-green-50 border-green-200 shadow-sm' 
          : locked 
            ? 'bg-neutral-50 border-neutral-200 opacity-60 cursor-not-allowed'
            : 'bg-white border-brand/20 hover:border-brand/40 hover:shadow-md cursor-pointer'
        }
      `}
      onClick={handleClick}
    >
      {/* Step number badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center text-sm font-bold">
        {completed ? (
          <CheckIcon className="w-4 h-4 text-green-500" />
        ) : (
          <span className={locked ? 'text-neutral-400' : 'text-brand'}>{stepNumber}</span>
        )}
      </div>

      {/* Lock icon for locked steps */}
      {locked && !completed && (
        <div className="absolute top-4 right-4">
          <LockClosedIcon className="w-5 h-5 text-neutral-400" />
        </div>
      )}

      {/* Progress indicator for active steps */}
      {!completed && !locked && progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-200 rounded-t-xl overflow-hidden">
          <div 
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <span className="text-3xl">{icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-2 ${
            completed ? 'text-green-700' : locked ? 'text-neutral-500' : 'text-neutral-900'
          }`}>
            {title}
          </h3>
          
          <p className={`text-sm mb-3 ${
            completed ? 'text-green-600' : locked ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            {description}
          </p>

          <div className="flex items-center justify-between">
            {/* Estimated time */}
            {estimatedTime && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                completed ? 'bg-green-100 text-green-700' : locked ? 'bg-neutral-100 text-neutral-500' : 'bg-brand/10 text-brand-dark'
              }`}>
                {completed ? 'Slutfört' : `⏱️ ${estimatedTime}`}
              </span>
            )}

            {/* Action indicator */}
            {!locked && (
              <div className="flex items-center text-sm">
                {completed ? (
                  <span className="text-green-600 font-medium">Redigera</span>
                ) : (
                  <span className="text-brand font-medium flex items-center">
                    {progress > 0 ? 'Fortsätt' : 'Starta'}
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Locked overlay message */}
      {locked && !completed && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 italic">
            Slutför föregående steg för att låsa upp
          </p>
        </div>
      )}
    </div>
  );
}