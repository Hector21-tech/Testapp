import React, { useState, useMemo } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { SWEDISH_LOCATIONS, LOCATIONS_BY_COUNTY } from '../../data/swedishLocations';
import { TextInput } from './TextInput';

interface LocationComboBoxProps {
  value: string;
  customLocation?: string;
  onLocationChange: (location: string) => void;
  onCustomLocationChange: (customLocation: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export function LocationComboBox({
  value,
  customLocation,
  onLocationChange,
  onCustomLocationChange,
  label = 'Stad eller ort',
  placeholder = 'Sök efter din ort...',
  required = false,
  error,
  helperText
}: LocationComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter locations based on search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return SWEDISH_LOCATIONS;
    
    const query = searchQuery.toLowerCase().trim();
    return SWEDISH_LOCATIONS.filter(location => 
      location.name.toLowerCase().includes(query) ||
      location.county.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group filtered locations by county
  const locationsByCounty = useMemo(() => {
    const groups: Record<string, typeof SWEDISH_LOCATIONS> = {};
    filteredLocations.forEach(location => {
      if (!groups[location.county]) {
        groups[location.county] = [];
      }
      groups[location.county].push(location);
    });
    return groups;
  }, [filteredLocations]);

  const selectedLocation = SWEDISH_LOCATIONS.find(loc => loc.name === value);
  const displayValue = value === 'Annan ort' && customLocation 
    ? customLocation 
    : selectedLocation?.name || '';

  const handleLocationSelect = (locationName: string) => {
    onLocationChange(locationName);
    setIsOpen(false);
    setSearchQuery('');
    
    // Clear custom location if not "Annan ort"
    if (locationName !== 'Annan ort') {
      onCustomLocationChange('');
    }
  };

  // Popular locations for quick access
  const popularLocations = [
    'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 
    'Västerås', 'Örebro', 'Norrköping', 'Helsingborg', 'Jönköping'
  ];

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
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-4 h-4 text-neutral-500" />
            <span className={displayValue ? 'text-neutral-900' : 'text-neutral-500'}>
              {displayValue || 'Välj stad eller ort'}
            </span>
          </div>
          <ChevronDownIcon className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-96 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-neutral-200">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filtrera orter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:border-brand focus:ring-2 focus:ring-brand-200 outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Popular Locations - show when no search query */}
            {!searchQuery.trim() && (
              <div className="p-2 border-b border-neutral-100">
                <div className="text-xs font-semibold text-neutral-500 px-3 py-2 uppercase tracking-wide">
                  Populära orter
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {popularLocations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => handleLocationSelect(location)}
                      className={`
                        text-left px-3 py-2 rounded-lg transition-colors duration-150 text-sm
                        ${value === location 
                          ? 'bg-brand text-white' 
                          : 'hover:bg-neutral-100 text-neutral-700'
                        }
                      `}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Locations by County */}
            <div className="max-h-64 overflow-y-auto">
              {Object.entries(locationsByCounty).map(([county, locations]) => (
                <div key={county} className="p-2">
                  <div className="text-xs font-semibold text-neutral-500 px-3 py-2 uppercase tracking-wide">
                    {county}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {locations.map((location) => (
                      <button
                        key={`${location.name}-${location.county}`}
                        type="button"
                        onClick={() => handleLocationSelect(location.name)}
                        className={`
                          text-left px-3 py-2 rounded-lg transition-colors duration-150 text-sm
                          ${value === location.name 
                            ? 'bg-brand text-white' 
                            : 'hover:bg-neutral-100 text-neutral-700'
                          }
                        `}
                      >
                        {location.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {filteredLocations.length === 0 && (
                <div className="p-4 text-center text-neutral-500 text-sm">
                  Ingen ort hittades. Välj "Annan ort" för att ange en egen.
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

      {/* Custom Location Input - appears when "Annan ort" is selected */}
      {value === 'Annan ort' && (
        <TextInput
          label="Ange din ort"
          placeholder="t.ex. Sandviken, Åhus, Torekov..."
          value={customLocation || ''}
          onChange={onCustomLocationChange}
          required
          helperText="Ange staden eller orten där ditt företag är baserat"
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