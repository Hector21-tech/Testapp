import React, { useState, useMemo } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { INDUSTRIES } from '../../features/campaign/types';
import { TextInput } from './TextInput';

interface IndustryComboBoxProps {
  value: string;
  customIndustry?: string;
  onIndustryChange: (industry: string) => void;
  onCustomIndustryChange: (customIndustry: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export function IndustryComboBox({
  value,
  customIndustry,
  onIndustryChange,
  onCustomIndustryChange,
  label = 'Bransch',
  placeholder = 'Sök efter din bransch...',
  required = false,
  error,
  helperText
}: IndustryComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter industries based on search query
  const filteredIndustries = useMemo(() => {
    if (!searchQuery.trim()) return INDUSTRIES;
    
    const query = searchQuery.toLowerCase().trim();
    return INDUSTRIES.filter(industry => 
      industry.label.toLowerCase().includes(query) ||
      industry.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group industries by category
  const industriesByCategory = useMemo(() => {
    const groups: Record<string, typeof INDUSTRIES> = {};
    filteredIndustries.forEach(industry => {
      if (!groups[industry.category]) {
        groups[industry.category] = [];
      }
      groups[industry.category].push(industry);
    });
    return groups;
  }, [filteredIndustries]);

  const selectedIndustry = INDUSTRIES.find(ind => ind.value === value);
  const displayValue = value === 'other' && customIndustry 
    ? customIndustry 
    : selectedIndustry?.label || '';

  const handleIndustrySelect = (industryValue: string) => {
    onIndustryChange(industryValue);
    setIsOpen(false);
    setSearchQuery('');
    
    // Clear custom industry if not "other"
    if (industryValue !== 'other') {
      onCustomIndustryChange('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className={`block text-sm font-medium mb-2 ${
          error ? 'text-red-700' : 'text-neutral-700'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Main Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3 text-left rounded-xl border transition-all duration-200 
            flex items-center justify-between
            ${error 
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
              : isOpen
                ? 'border-brand bg-brand-50 ring-2 ring-brand-200'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }
          `}
        >
          <span className={displayValue ? 'text-neutral-900' : 'text-neutral-500'}>
            {displayValue || placeholder}
          </span>
          <ChevronDownIcon className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-neutral-200">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Sök bransch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:border-brand focus:ring-2 focus:ring-brand-200 outline-none"
                />
              </div>
            </div>

            {/* Industries List */}
            <div className="max-h-60 overflow-y-auto">
              {Object.entries(industriesByCategory).map(([category, industries]) => (
                <div key={category} className="p-2">
                  <div className="text-xs font-semibold text-neutral-500 px-3 py-2 uppercase tracking-wide">
                    {category}
                  </div>
                  {industries.map((industry) => (
                    <button
                      key={industry.value}
                      type="button"
                      onClick={() => handleIndustrySelect(industry.value)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg transition-colors duration-150
                        ${value === industry.value 
                          ? 'bg-brand text-white' 
                          : 'hover:bg-neutral-100 text-neutral-700'
                        }
                      `}
                    >
                      {industry.label}
                    </button>
                  ))}
                </div>
              ))}
              
              {filteredIndustries.length === 0 && (
                <div className="p-4 text-center text-neutral-500 text-sm">
                  Ingen bransch hittades. Välj "Annan bransch" för att ange en egen.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Click outside overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Custom Industry Input - appears when "other" is selected */}
      {value === 'other' && (
        <TextInput
          label="Ange din bransch"
          placeholder="t.ex. Hunddagis, Massage, Snöröjning..."
          value={customIndustry || ''}
          onChange={onCustomIndustryChange}
          required
          helperText="Beskriv din bransch så specifikt som möjligt"
        />
      )}

      {/* Helper Text & Error */}
      {(helperText || error) && (
        <div className="text-sm">
          {error ? (
            <span className="text-red-600">{error}</span>
          ) : (
            <span className="text-neutral-600">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
}