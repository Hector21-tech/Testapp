import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'date';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  hint,
  type = 'text',
  icon,
  disabled = false,
  className = ''
}: TextInputProps) {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-semibold text-neutral-700"
      >
        {icon && <span className="inline-block mr-2 text-brand">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={`
            input
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${disabled ? 'bg-neutral-100 cursor-not-allowed' : ''}
          `}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600 flex items-center space-x-1">
          <ExclamationCircleIcon className="h-4 w-4" />
          <span>{error}</span>
        </p>
      )}
      
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-sm text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  );
}