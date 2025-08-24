import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

export interface Step {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  current: boolean;
  disabled?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep?: number;
  variant?: 'horizontal' | 'vertical';
  showProgress?: boolean;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({ 
  steps, 
  currentStep,
  variant = 'horizontal', 
  showProgress = true,
  onStepClick,
  className = ''
}: StepperProps) {
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  if (variant === 'vertical') {
    return (
      <div className={`space-y-6 ${className}`}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0 relative">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                ${step.completed 
                  ? 'bg-brand text-white shadow-soft' 
                  : step.current
                    ? 'bg-brand text-white shadow-soft animate-pulse-soft'
                    : step.disabled
                      ? 'bg-neutral-200 text-neutral-400'
                      : 'bg-white border-2 border-neutral-300 text-neutral-500'
                }
              `}>
                {step.completed ? (
                  <CheckIcon className="w-4 h-4 animate-bounce-soft" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-6
                  ${step.completed ? 'bg-brand' : 'bg-neutral-200'}
                  transition-colors duration-200
                `} />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className={`
                text-sm font-medium transition-colors duration-200
                ${step.current ? 'text-brand' : step.completed ? 'text-neutral-900' : 'text-neutral-500'}
              `}>
                {step.title}
              </h3>
              {step.description && (
                <p className="text-xs text-neutral-500 mt-1">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-700">
              {completedSteps} av {steps.length} klart
            </span>
            <span className="text-sm text-neutral-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand to-brand-light transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Horizontal Stepper */}
      <div className="flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-200">
          <div 
            className="h-full bg-brand transition-all duration-500 ease-out"
            style={{ width: `${(completedSteps / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 mb-2
                ${step.completed 
                  ? 'bg-brand text-white shadow-soft scale-110' 
                  : step.current
                    ? 'bg-brand text-white shadow-soft animate-pulse-soft'
                    : step.disabled
                      ? 'bg-neutral-200 text-neutral-400'
                      : 'bg-white border-2 border-neutral-300 text-neutral-500 hover:border-brand hover:text-brand cursor-pointer'
                }
              `}
              onClick={() => !step.disabled && onStepClick && onStepClick(index)}
            >
              {step.completed ? (
                <CheckIcon className="w-4 h-4 animate-bounce-soft" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            <div className="text-center">
              <h3 className={`
                text-sm font-medium transition-colors duration-200 max-w-20
                ${step.current ? 'text-brand' : step.completed ? 'text-neutral-900' : 'text-neutral-500'}
              `}>
                {step.title}
              </h3>
              {step.description && (
                <p className="text-xs text-neutral-500 mt-1 max-w-24">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}