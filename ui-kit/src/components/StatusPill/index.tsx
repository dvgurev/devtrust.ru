"use client";

import React from 'react';
import { cn } from '../../utils';

interface StatusPillProps {
  status: 'active' | 'trial' | 'cancelled';
  children?: React.ReactNode;
  className?: string;
}

const variants = {
  active: 'border-fg text-fg bg-fg/5',
  trial: 'border-muted text-muted bg-muted/5',
  cancelled: 'border-muted/50 text-muted/50 line-through bg-muted/5',
};

const labels = {
  active: 'Активен',
  trial: 'Триал 5 дней',
  cancelled: 'Отменён',
};

export const StatusPill: React.FC<StatusPillProps> = ({ status, children, className }) => {
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 border-2 rounded-full text-xs uppercase tracking-wider font-mono',
      variants[status],
      className
    )}>
      {children || labels[status]}
    </span>
  );
};

