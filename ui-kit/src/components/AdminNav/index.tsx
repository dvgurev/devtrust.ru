"use client";

import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface AdminNavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

interface AdminNavProps {
  items: AdminNavItem[];
  brand?: string;
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
  className?: string;
}

export const AdminNav: React.FC<AdminNavProps> = ({
  items,
  brand = 'Admin',
  user,
  onLogout,
  className,
}) => {
  return (
    <div className={cn('border-b-2 border-border bg-surface', className)}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="font-display text-2xl">{brand}</div>
          <nav className="flex gap-1">
            {items.map((item, idx) => (
              <Button
                key={idx}
                variant={item.active ? 'accent' : 'ghost'}
                size="sm"
                className="font-mono text-xs uppercase tracking-wider"
                href={item.href}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.badge !== undefined && (
                  <Badge className="ml-2">{item.badge}</Badge>
                )}
              </Button>
            ))}
          </nav>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-mono text-sm">{user.name}</div>
              <div className="font-mono text-xs text-muted">{user.role}</div>
            </div>
            {onLogout && (
              <Button size="sm" variant="ghost" onClick={onLogout}>
                Выйти
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
