import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface ChipOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ChipTagsProps {
  label: string;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  options: ChipOption[];
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  maxSelections?: number;
  allowCustom?: boolean;
  customPlaceholder?: string;
  className?: string;
}

export function ChipTags({
  label,
  selectedValues,
  onChange,
  options,
  required = false,
  error,
  hint,
  icon,
  maxSelections,
  allowCustom = false,
  customPlaceholder = 'Lägg till...',
  className = ''
}: ChipTagsProps) {
  const [customInput, setCustomInput] = React.useState('');
  const fieldId = `chipTags-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  const toggleSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else if (!maxSelections || selectedValues.length < maxSelections) {
      onChange([...selectedValues, value]);
    }
  };

  const addCustomTag = () => {
    if (customInput.trim() && !selectedValues.includes(customInput.trim())) {
      onChange([...selectedValues, customInput.trim()]);
      setCustomInput('');
    }
  };

  const handleCustomInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const removeTag = (value: string) => {
    onChange(selectedValues.filter(v => v !== value));
  };

  const canAddMore = !maxSelections || selectedValues.length < maxSelections;

  return (
    <div className={`space-y-4 ${className}`}>
      <label 
        htmlFor={fieldId}
        className="block text-sm font-semibold text-neutral-700"
      >
        {icon && <span className="inline-block mr-2 text-brand">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {maxSelections && (
          <span className="text-xs text-neutral-500 ml-2">
            ({selectedValues.length}/{maxSelections})
          </span>
        )}
      </label>
      
      {/* Selected Tags */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((value) => {
            const isCustom = !options.find(opt => opt.value === value);
            return (
              <span
                key={value}
                className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                  ${isCustom 
                    ? 'bg-neutral-100 text-neutral-700 border border-neutral-300' 
                    : 'bg-brand/10 text-brand border border-brand/20'
                  }
                `}
              >
                {options.find(opt => opt.value === value)?.label || value}
                <button
                  type="button"
                  onClick={() => removeTag(value)}
                  className="ml-2 hover:text-red-500 transition-colors duration-200"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            );
          })}
        </div>
      )}
      
      {/* Available Options */}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const isDisabled = option.disabled || (isSelected ? false : !canAddMore);
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => !isDisabled && toggleSelection(option.value)}
              disabled={isDisabled}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                ${isSelected
                  ? 'bg-brand text-white border-brand shadow-soft'
                  : isDisabled
                    ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-brand hover:text-brand hover:shadow-soft'
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      
      {/* Custom Input */}
      {allowCustom && canAddMore && (
        <div className="flex space-x-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleCustomInputKeyDown}
            placeholder={customPlaceholder}
            className="input flex-1"
          />
          <button
            type="button"
            onClick={addCustomTag}
            disabled={!customInput.trim()}
            className="btn-secondary btn-sm"
          >
            Lägg till
          </button>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  );
}