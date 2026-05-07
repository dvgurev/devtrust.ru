"use client";

import React from 'react';
import { cn } from '../../utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div 
      role="status"
      className={cn('animate-spin rounded-full border-b-2 border-fg', sizes[size], className)}
    >
      <span className="sr-only">Загрузка...</span>
    </div>
  );
};

