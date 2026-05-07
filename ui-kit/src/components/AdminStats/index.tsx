"use client";

import React from 'react';
import { cn } from '../../utils';
import { MetricCard } from '../MetricCard';
import { StatBox } from '../StatBox';

interface StatItem {
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down';
  };
  type?: 'metric' | 'stat';
}

interface AdminStatsProps {
  stats: StatItem[];
  columns?: number;
  className?: string;
}

export const AdminStats: React.FC<AdminStatsProps> = ({
  stats,
  columns = 4,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid gap-6',
        `grid-cols-1 md:grid-cols-${columns}`,
        className
      )}
    >
      {stats.map((stat, idx) => {
        if (stat.type === 'stat') {
          return (
            <StatBox
              key={idx}
              value={stat.value}
              label={stat.label}
            />
          );
        }
        return (
          <MetricCard
            key={idx}
            title={stat.label}
            value={stat.value}
            change={stat.change}
          />
        );
      })}
    </div>
  );
};
