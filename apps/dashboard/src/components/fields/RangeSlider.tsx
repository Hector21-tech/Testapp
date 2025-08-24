import React from 'react';

export interface RangeSliderProps {
  label: string;
  value: number | number[];
  onChange: (value: number | number[]) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
  required?: boolean;
  error?: string;
  hint?: string;
  helperText?: string;
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
  helperText,
  icon,
  showValue = true,
  className = ''
}: RangeSliderProps) {
  const sliderId = `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const isRange = Array.isArray(value);
  
  if (isRange) {
    // Dual range slider implementation
    const [minVal, maxVal] = value;
    const minPercentage = ((minVal - min) / (max - min)) * 100;
    const maxPercentage = ((maxVal - min) / (max - min)) * 100;
    
    const displayValue = formatValue 
      ? `${formatValue(minVal)} - ${formatValue(maxVal)}`
      : `${minVal} - ${maxVal}${unit ? ` ${unit}` : ''}`;

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
          <div className="flex space-x-4">
            <input
              id={`${sliderId}-min`}
              type="range"
              min={min}
              max={max}
              step={step}
              value={minVal}
              onChange={(e) => {
                const newMin = Number(e.target.value);
                if (newMin <= maxVal) {
                  onChange([newMin, maxVal]);
                }
              }}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              id={`${sliderId}-max`}
              type="range"
              min={min}
              max={max}
              step={step}
              value={maxVal}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                if (newMax >= minVal) {
                  onChange([minVal, newMax]);
                }
              }}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* Range Labels */}
          <div className="flex justify-between text-xs text-neutral-500 mt-2">
            <span>{formatValue ? formatValue(min) : `${min}${unit ? ` ${unit}` : ''}`}</span>
            <span>{formatValue ? formatValue(max) : `${max}${unit ? ` ${unit}` : ''}`}</span>
          </div>
        </div>
      </div>
    );
  }

  // Single range slider (original implementation)
  const percentage = ((value as number - min) / (max - min)) * 100;
  const displayValue = formatValue 
    ? formatValue(value as number)
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
          value={value as number}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-invalid={!!error}
          aria-describedby={error ? `${sliderId}-error` : (hint || helperText) ? `${sliderId}-hint` : undefined}
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
      
      {(hint || helperText) && !error && (
        <p id={`${sliderId}-hint`} className="text-sm text-neutral-500">
          {hint || helperText}
        </p>
      )}
    </div>
  );
}