"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className={cn('bg-surface border-2 border-border max-w-md w-full max-h-[90vh] overflow-y-auto', className)}
        onClick={e => e.stopPropagation()}
      >
        <div className="border-b-2 border-border p-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-2xl">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-2xl hover:text-accent transition-colors w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

