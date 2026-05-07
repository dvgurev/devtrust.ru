"use client";

import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface SidebarItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

interface SidebarProps {
  items: SidebarItem[];
  brand?: string;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, brand = 'Dashboard', className }) => {
  return (
    <div className={cn('w-64 border-r-2 border-border h-screen p-6 flex flex-col', className)}>
      <div className="font-display text-2xl mb-12 pb-4 border-b-2 border-border">{brand}</div>
      <nav className="flex-1 space-y-2">
        {items.map((item, idx) => (
          <Button 
            key={idx} 
            variant={item.active ? 'accent' : 'ghost'} 
            size="lg" 
            className="w-full justify-start h-14 px-4 font-mono text-sm uppercase tracking-wider"
            href={item.href}
          >
            <span className="w-5 mr-3">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge !== undefined && (
              <Badge>{item.badge}</Badge>
            )}
          </Button>
        ))}
      </nav>
    </div>
  );
};

