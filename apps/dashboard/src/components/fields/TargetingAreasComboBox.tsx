import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/outline';

import { SWEDISH_LOCATIONS } from '../../data/swedishLocations';

interface TargetingAreasComboBoxProps {
  value: string[];
  onChange: (areas: string[]) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  maxSelections?: number;
}

export function TargetingAreasComboBox({
  value = [],
  onChange,
  placeholder = "Sök och välj områden...",
  helperText,
  required,
  maxSelections = 10
}: TargetingAreasComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter locations based on search query
  const availableLocations = SWEDISH_LOCATIONS
    .filter(loc => loc.name !== 'Annan ort') // Remove fallback option
    .filter(loc => !value.includes(loc.name)); // Remove already selected

  const filteredLocations = searchQuery === ''
    ? availableLocations.slice(0, 8) // Show top 8 when no search
    : availableLocations.filter((location) => {
        const searchTerm = searchQuery.toLowerCase();
        return location.name.toLowerCase().includes(searchTerm) ||
               (location.county && location.county.toLowerCase().includes(searchTerm));
      }).slice(0, 12); // Show top 12 results when searching

  // Popular cities to show first when no search
  const popularCities = [
    'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 
    'Västerås', 'Örebro', 'Norrköping'
  ].filter(city => !value.includes(city));

  const displayLocations = searchQuery === '' 
    ? popularCities.map(city => availableLocations.find(loc => loc.name === city)).filter(Boolean)
    : filteredLocations;

  const handleSelect = (locationName: string) => {
    if (value.length < maxSelections && !value.includes(locationName)) {
      onChange([...value, locationName]);
      setSearchQuery('');
      setIsOpen(false);
      // Focus back to input for next selection
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleRemove = (locationName: string) => {
    onChange(value.filter(area => area !== locationName));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAllSweden = (checked: boolean) => {
    if (checked) {
      onChange(['Hela Sverige']);
      setSearchQuery('');
      setIsOpen(false);
    } else {
      onChange([]);
    }
  };

  const isAllSwedenSelected = value.length === 1 && value[0] === 'Hela Sverige';

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-neutral-700">
        <MapPinIcon className="w-4 h-4 inline mr-2 text-brand" />
        Målområden för dina annonser {required && <span className="text-red-500">*</span>}
      </label>

      {/* Hela Sverige Option */}
      <div className="bg-gradient-to-r from-brand/5 to-blue-50 p-4 rounded-xl border border-brand/20">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isAllSwedenSelected}
            onChange={(e) => handleSelectAllSweden(e.target.checked)}
            className="w-4 h-4 text-brand border-neutral-300 rounded focus:ring-brand"
          />
          <div className="flex-1">
            <span className="text-sm font-semibold text-brand-dark">
              Hela Sverige
            </span>
            <p className="text-xs text-neutral-600 mt-1">
              Visa dina annonser överallt i Sverige (rekommenderas för digitala tjänster)
            </p>
          </div>
        </label>
      </div>

      {/* Selected Areas (only show if not "Hela Sverige") */}
      {value.length > 0 && !isAllSwedenSelected && (
        <div className="flex flex-wrap gap-2">
          {value.map((area) => (
            <span
              key={area}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-brand/10 text-brand-dark border border-brand/20"
            >
              {area}
              <button
                type="button"
                onClick={() => handleRemove(area)}
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand/20 hover:bg-brand/30 transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ComboBox for adding new areas (only show if not "Hela Sverige" and under max) */}
      {!isAllSwedenSelected && value.length < maxSelections && (
        <div ref={dropdownRef} className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              className="input pl-10 pr-10"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <ChevronDownIcon 
                className={`h-4 w-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl border border-neutral-200 py-1 text-base overflow-auto focus:outline-none sm:text-sm">
              {displayLocations.length === 0 && searchQuery !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-neutral-700">
                  Ingen plats hittades.
                </div>
              ) : (
                displayLocations.map((location) => (
                  <div
                    key={location.name}
                    className="relative cursor-default select-none py-2 px-4 hover:bg-brand/10 hover:text-brand-dark text-neutral-900"
                    onClick={() => handleSelect(location.name)}
                  >
                    <span className="block truncate font-normal">
                      {location.name}
                      {location.county && (
                        <span className="ml-2 text-xs text-neutral-500">
                          {location.county}
                        </span>
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Helper text and selection counter */}
      <div className="flex justify-between items-center">
        {helperText && !isAllSwedenSelected && (
          <p className="text-sm text-neutral-500">{helperText}</p>
        )}
        {isAllSwedenSelected ? (
          <p className="text-sm text-green-600 font-medium">
            Hela Sverige valt - dina annonser visas överallt
          </p>
        ) : (
          <span className="text-xs text-neutral-400">
            {value.length}/{maxSelections} områden valda
          </span>
        )}
      </div>

      {!isAllSwedenSelected && value.length >= maxSelections && (
        <p className="text-sm text-amber-600">
          Du har valt max antal områden. Ta bort något för att lägga till fler.
        </p>
      )}
    </div>
  );
}