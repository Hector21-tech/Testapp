import React from 'react';

export interface RangeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  showValue?: boolean;
  className?: string;
}

export function RangeSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  formatValue,
  required = false,
  error,
  hint,
  icon,
  showValue = true,
  className = ''
}: RangeSliderProps) {
  const sliderId = `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const percentage = ((value - min) / (max - min)) * 100;
  
  const displayValue = formatValue 
    ? formatValue(value)
    : `${value}${unit ? ` ${unit}` : ''}`;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label 
          htmlFor={sliderId}
          className="block text-sm font-semibold text-neutral-700"
        >
          {icon && <span className="inline-block mr-2 text-brand">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {showValue && (
          <span className="text-sm font-semibold text-brand">
            {displayValue}
          </span>
        )}
      </div>
      
      <div className="relative">
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-invalid={!!error}
          aria-describedby={error ? `${sliderId}-error` : hint ? `${sliderId}-hint` : undefined}
          className={`
            w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer
            slider-thumb:appearance-none slider-thumb:w-6 slider-thumb:h-6 
            slider-thumb:rounded-full slider-thumb:bg-brand slider-thumb:shadow-soft
            slider-thumb:cursor-pointer slider-thumb:transition-all slider-thumb:duration-200
            hover:slider-thumb:scale-110 focus:outline-none focus:ring-4 focus:ring-brand/20
            ${error ? 'bg-red-200' : ''}
          `}
          style={{
            background: `linear-gradient(to right, var(--brand-color) 0%, var(--brand-color) ${percentage}%, #e5e5e5 ${percentage}%, #e5e5e5 100%)`
          }}
        />
        
        {/* Range Labels */}
        <div className="flex justify-between text-xs text-neutral-500 mt-2">
          <span>{formatValue ? formatValue(min) : `${min}${unit ? ` ${unit}` : ''}`}</span>
          <span>{formatValue ? formatValue(max) : `${max}${unit ? ` ${unit}` : ''}`}</span>
        </div>
      </div>
      
      {error && (
        <p id={`${sliderId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p id={`${sliderId}-hint`} className="text-sm text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  );
}