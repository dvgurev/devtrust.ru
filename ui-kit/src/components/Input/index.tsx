"use client";

import React from 'react';
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block font-mono text-xs uppercase tracking-wider text-muted">
            {label}
          </label>
        )}
        <input 
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border-2 border-border bg-surface text-fg font-mono transition-all',
            'focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20',
            error && 'border-[oklch(0.65_0.22_25)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[oklch(0.65_0.22_25)] font-mono">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

