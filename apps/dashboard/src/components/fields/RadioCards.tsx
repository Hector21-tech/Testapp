import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioCardsProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function RadioCards({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  hint,
  icon,
  columns = 2,
  className = ''
}: RadioCardsProps) {
  const fieldsetId = `radioCards-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <fieldset className={`space-y-4 ${className}`}>
      <legend className="block text-sm font-semibold text-neutral-700">
        {icon && <span className="inline-block mr-2 text-brand">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </legend>
      
      <div className={`grid gap-3 ${gridCols[columns]}`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          const inputId = `${fieldsetId}-${option.value}`;
          
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={`
                relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-brand bg-brand/5 shadow-soft' 
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-soft'
                }
                ${option.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-102'
                }
              `}
            >
              <input
                id={inputId}
                type="radio"
                name={fieldsetId}
                value={option.value}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                disabled={option.disabled}
                className="sr-only"
                aria-describedby={option.description ? `${inputId}-desc` : undefined}
              />
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {option.icon ? (
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${isSelected ? 'text-brand' : 'text-neutral-400'}
                    `}>
                      {option.icon}
                    </div>
                  ) : null}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`
                      text-sm font-medium
                      ${isSelected ? 'text-brand' : 'text-neutral-900'}
                    `}>
                      {option.label}
                    </h3>
                    {isSelected && (
                      <CheckCircleIcon className="w-5 h-5 text-brand animate-scale-in" />
                    )}
                  </div>
                  
                  {option.description && (
                    <p 
                      id={`${inputId}-desc`}
                      className="text-sm text-neutral-500 mt-1"
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <span>{error}</span>
        </p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-neutral-500">
          {hint}
        </p>
      )}
    </fieldset>
  );
}