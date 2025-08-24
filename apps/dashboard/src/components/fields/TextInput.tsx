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
  helperText?: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'number';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  min?: string | number;
  max?: string | number;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  hint,
  helperText,
  type = 'text',
  icon,
  disabled = false,
  className = '',
  multiline = false,
  rows = 3,
  maxLength,
  showCharCount = false,
  min,
  max
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
        {multiline ? (
          <textarea
            id={inputId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : (hint || helperText) ? `${inputId}-hint` : undefined}
            className={`
              textarea
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${disabled ? 'bg-neutral-100 cursor-not-allowed' : ''}
            `}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            min={min}
            max={max}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : (hint || helperText) ? `${inputId}-hint` : undefined}
            className={`
              input
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${disabled ? 'bg-neutral-100 cursor-not-allowed' : ''}
            `}
          />
        )}
        
        {showCharCount && maxLength && (
          <div className="absolute bottom-2 right-3 text-xs text-neutral-500">
            {value.length}/{maxLength}
          </div>
        )}
        
        {error && (
          <div className="absolute top-3 right-3 flex items-center pointer-events-none">
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
      
      {(hint || helperText) && !error && (
        <p id={`${inputId}-hint`} className="text-sm text-neutral-500">
          {hint || helperText}
        </p>
      )}
    </div>
  );
}