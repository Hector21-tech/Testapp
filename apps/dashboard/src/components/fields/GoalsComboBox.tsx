import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FlagIcon as TargetIcon } from '@heroicons/react/24/outline';

import { CORE_BUSINESS_GOALS, ADVANCED_BUSINESS_GOALS, BUSINESS_GOALS } from '../../features/campaign/types';

interface GoalsComboBoxProps {
  value: string;
  onChange: (goal: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export function GoalsComboBox({
  value,
  onChange,
  label = 'Primärt mål',
  placeholder = 'Sök efter ditt huvudmål...',
  required = false,
  error,
  helperText
}: GoalsComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedGoal = BUSINESS_GOALS.find(goal => goal.value === value);

  // Show advanced goals if user searches or if advanced is toggled
  const goalsToShow = searchQuery !== '' || showAdvanced 
    ? BUSINESS_GOALS 
    : CORE_BUSINESS_GOALS;

  const filteredGoals = searchQuery === ''
    ? goalsToShow
    : BUSINESS_GOALS.filter((goal) => {
        const searchTerm = searchQuery.toLowerCase();
        return goal.label.toLowerCase().includes(searchTerm) ||
               goal.description.toLowerCase().includes(searchTerm);
      });

  const displayValue = selectedGoal ? selectedGoal.label : '';

  const handleSelect = (goalValue: string) => {
    onChange(goalValue);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsOpen(true);
    
    // Clear selection if user is typing and current selection doesn't match
    if (query && selectedGoal && !selectedGoal.label.toLowerCase().includes(query.toLowerCase())) {
      onChange('');
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange('');
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-neutral-700">
        <TargetIcon className="w-4 h-4 inline mr-2 text-brand" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div ref={dropdownRef} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className={`input pl-10 pr-10 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder={placeholder}
            value={isOpen && searchQuery !== '' ? searchQuery : displayValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onFocus={() => setIsOpen(true)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 mr-1 text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            )}
            <div className="pr-3">
              <ChevronDownIcon 
                className={`h-4 w-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl border border-neutral-200 py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            {filteredGoals.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-neutral-700">
                Inget mål hittades.
              </div>
            ) : (
              <>
                {/* Core goals */}
                {searchQuery === '' && !showAdvanced && (
                  <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wide border-b border-neutral-100">
                    Kärnmål (rekommenderat)
                  </div>
                )}
                
                {/* Show core goals or filtered results */}
                {filteredGoals.map((goal) => (
                  <div
                    key={goal.value}
                    className={`relative cursor-pointer select-none py-3 px-4 hover:bg-brand/10 hover:text-brand-dark ${
                      goal.value === value ? 'bg-brand/5 text-brand-dark' : 'text-neutral-900'
                    }`}
                    onClick={() => handleSelect(goal.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{goal.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{goal.label}</div>
                        <div className="text-xs text-neutral-500 mt-1">{goal.description}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show "Visa fler mål" button if not showing advanced and no search */}
                {searchQuery === '' && !showAdvanced && (
                  <div className="border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(true)}
                      className="w-full px-4 py-3 text-left text-sm text-brand hover:bg-brand/5 flex items-center space-x-2"
                    >
                      <span>⚡</span>
                      <span className="font-medium">Visa fler mål (avancerat)</span>
                    </button>
                  </div>
                )}

                {/* Advanced goals section header */}
                {showAdvanced && searchQuery === '' && (
                  <div className="px-3 py-2 text-xs font-semibold text-brand uppercase tracking-wide border-t border-neutral-100 bg-brand/5">
                    Avancerade mål
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <p className="text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}