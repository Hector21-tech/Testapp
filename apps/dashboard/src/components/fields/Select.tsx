import React from 'react';
import { ChevronDownIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Välj ett alternativ...',
  required = false,
  error,
  hint,
  icon,
  disabled = false,
  className = ''
}: SelectProps) {
  const selectId = `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={selectId}
        className="block text-sm font-semibold text-neutral-700"
      >
        {icon && <span className="inline-block mr-2 text-brand">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          className={`
            select appearance-none pr-10
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${disabled ? 'bg-neutral-100 cursor-not-allowed' : ''}
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {error ? (
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-neutral-400" />
          )}
        </div>
      </div>
      
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-red-600 flex items-center space-x-1">
          <ExclamationCircleIcon className="h-4 w-4" />
          <span>{error}</span>
        </p>
      )}
      
      {hint && !error && (
        <p id={`${selectId}-hint`} className="text-sm text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  );
}