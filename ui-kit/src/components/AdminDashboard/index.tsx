"use client";

import React from 'react';
import { cn } from '../../utils';
import { AdminStats } from '../AdminStats';
import { AdminTable } from '../AdminTable';
import { AdminCard } from '../AdminCard';
import { AdminNav } from '../AdminNav';
import { Button } from '../Button';

interface DashboardWidget {
  id: string;
  title: string;
  type: 'stats' | 'table' | 'card';
  data: any;
  className?: string;
}

interface AdminDashboardProps {
  navItems: Array<{
    icon: string;
    label: string;
    href: string;
    active?: boolean;
    badge?: number;
  }>;
  user?: {
    name: string;
    role: string;
  };
  widgets: DashboardWidget[];
  onLogout?: () => void;
  className?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  navItems,
  user,
  widgets,
  onLogout,
  className,
}) => {
  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'stats':
        return (
          <AdminStats
            key={widget.id}
            stats={widget.data}
            className={widget.className}
          />
        );
      case 'table':
        return (
          <div key={widget.id} className={cn('border-2 border-border p-6', widget.className)}>
            <h3 className="font-display text-xl mb-4">{widget.title}</h3>
            {AdminTable({
              columns: widget.data.columns,
              data: widget.data.rows,
              actions: widget.data.actions,
            } as any)}
          </div>
        );
      case 'card':
        return (
          <AdminCard
            key={widget.id}
            title={widget.title}
            {...widget.data}
            className={widget.className}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('min-h-screen bg-bg', className)}>
      <AdminNav items={navItems} user={user} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {widgets.map(renderWidget)}
      </main>
    </div>
  );
};
