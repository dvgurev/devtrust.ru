"use client";

import React from 'react';
import { cn } from '../../utils';

interface UsageBarProps {
  percentage: number;
  showLabel?: boolean;
  className?: string;
}

export const UsageBar: React.FC<UsageBarProps> = ({ percentage, showLabel = false, className }) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const isHigh = clampedPercentage > 80;
  
  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-mono text-muted">
          <span>Использование</span>
          <span className={isHigh ? 'text-[oklch(0.65_0.22_25)]' : ''}>{clampedPercentage}%</span>
        </div>
      )}
      <div className="h-2 bg-border/50 rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isHigh ? 'bg-[oklch(0.65_0.22_25)]' : 'bg-fg'
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};

