import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  className = ''
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size} ${className}`}
    >
      {children}
    </button>
  );
}