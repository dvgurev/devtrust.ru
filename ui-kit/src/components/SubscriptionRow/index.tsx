"use client";

import React from 'react';
import { cn } from '../../utils';
import { StatusPill } from '../StatusPill';
import { UsageBar } from '../UsageBar';
import { Button } from '../Button';

interface SubscriptionRowProps {
  appName: string;
  plan: string;
  price: string;
  status: 'active' | 'trial' | 'cancelled';
  usageCurrent: number;
  usageMax: number;
  updatedAt?: string;
  onManage?: () => void;
  className?: string;
}

export const SubscriptionRow: React.FC<SubscriptionRowProps> = ({
  appName, plan, price, status, usageCurrent, usageMax,
  updatedAt, onManage, className
}) => {
  const percentage = Math.round((usageCurrent / usageMax) * 100);
  
  return (
    <div className={cn(
      'grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 py-4 border-b border-border items-center',
      className
    )}>
      <div>
        <div className="font-display text-lg">{appName}</div>
        <div className="text-xs text-muted">{updatedAt || 'Обновление: недавно'}</div>
      </div>
      <div>
        <div className="font-display">{plan}</div>
        <div className="text-xs text-muted">{price}</div>
      </div>
      <StatusPill status={status} />
      <div className="min-w-[120px]">
        <UsageBar percentage={percentage} showLabel />
      </div>
      <Button size="sm" onClick={onManage}>Управление</Button>
    </div>
  );
};

