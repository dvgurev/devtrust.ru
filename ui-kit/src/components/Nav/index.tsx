"use client";

import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';

interface NavItem {
  href: string;
  label: string;
  active?: boolean;
}

interface NavProps {
  items: NavItem[];
  brand: string;
  className?: string;
}

export const Nav: React.FC<NavProps> = ({ items, brand, className }) => {
  return (
    <nav className={cn(
      'sticky top-0 bg-bg border-b-2 border-border px-6 py-3 flex items-center justify-between z-10',
      className
    )}>
      <Button 
        variant="ghost" 
        className="font-display text-2xl font-bold tracking-tight p-0 h-auto no-underline text-fg"
        href="/"
      >
        {brand}
      </Button>
      <div className="flex gap-1">
        {items.map((item, i) => (
          <Button
            key={i}
            variant={item.active ? 'default' : 'ghost'}
            size="sm"
            className="font-mono text-xs uppercase tracking-[0.08em]"
            href={item.href}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </nav>
  );
};

