import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = ''
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 ${className}`}>
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}