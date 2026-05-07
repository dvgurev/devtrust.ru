"use client";

import React from 'react';
import { cn } from '../../utils';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface AdminCardProps {
  title: string;
  description?: string;
  status?: 'active' | 'inactive' | 'pending';
  badge?: string;
  actions?: Array<{
    label: string;
    variant?: 'default' | 'accent' | 'ghost';
    onClick: () => void;
  }>;
  children?: React.ReactNode;
  className?: string;
}

const statusColors = {
  active: 'border-accent',
  inactive: 'border-muted/50',
  pending: 'border-[oklch(0.75_0.15_80)]',
};

export const AdminCard: React.FC<AdminCardProps> = ({
  title,
  description,
  status = 'active',
  badge,
  actions,
  children,
  className,
}) => {
  return (
    <Card
      className={cn(
        'border-2',
        statusColors[status],
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-xl mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-muted">{description}</p>
          )}
        </div>
        {badge && <Badge variant="accent">{badge}</Badge>}
      </div>
      {children && <div className="mb-4">{children}</div>}
      {actions && actions.length > 0 && (
        <div className="flex gap-2 pt-4 border-t border-border">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={action.variant || 'ghost'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};
