import React from 'react';

export interface StepCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode | string;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function StepCard({ 
  title, 
  description, 
  icon, 
  children, 
  className = '',
  animate = true
}: StepCardProps) {
  return (
    <div className={`
      card p-8 max-w-2xl mx-auto
      ${animate ? 'animate-in slide-in' : ''}
      ${className}
    `}>
      {/* Header */}
      <div className="text-center mb-8">
        {icon && (
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
              {typeof icon === 'string' ? (
                <span className="text-2xl">{icon}</span>
              ) : (
                icon
              )}
            </div>
          </div>
        )}
        <h2 className="heading-lg mb-2">{title}</h2>
        {description && (
          <p className="body text-neutral-600">{description}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}