"use client";

import React from 'react';
import { cn } from '../../utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning';
  className?: string;
}

const variants = {
  default: 'border-border text-fg',
  accent: 'border-accent text-accent',
  success: 'border-[oklch(0.65_0.2_150)] text-[oklch(0.65_0.2_150)]',
  warning: 'border-[oklch(0.75_0.15_80)] text-[oklch(0.75_0.15_80)]',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 border text-xs font-mono tracking-wider rounded-full',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

