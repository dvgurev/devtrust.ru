"use client";

import React from 'react';
import { cn } from '../../utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down';
  };
  unit?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  unit,
  className
}) => {
  return (
    <div className={cn('border-2 border-border p-6 text-center', className)}>
      <div className="font-mono uppercase text-xs text-muted tracking-wider mb-2">{title}</div>
      <div className="font-display text-4xl mb-2">
        {value}
        {unit && <span className="text-xl opacity-75 ml-1">{unit}</span>}
      </div>
      {change && (
        <div className={cn(
          'text-sm font-mono',
          change.direction === 'up' ? 'text-[oklch(0.65_0.2_150)]' : 'text-[oklch(0.65_0.22_25)]'
        )}>
          {change.direction === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
        </div>
      )}
    </div>
  );
};

