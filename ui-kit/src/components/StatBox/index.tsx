"use client";

import React from 'react';
import { cn } from '../../utils';

interface StatBoxProps {
  value: string | number;
  label: string;
  className?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ value, label, className }) => {
  return (
    <div className={cn('border-2 border-border p-4 text-center', className)}>
      <div className="font-display text-5xl leading-none tracking-[-0.03em]">{value}</div>
      <div className="text-xs uppercase tracking-[0.1em] text-muted mt-1">{label}</div>
    </div>
  );
};

