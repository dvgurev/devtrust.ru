"use client";

import React from 'react';
import { cn } from '../../utils';

interface FeatureItemProps {
  number: number;
  title: string;
  description: string;
  className?: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ number, title, description, className }) => {
  return (
    <div className={cn(
      'grid grid-cols-[80px_1fr] gap-6 py-6 border-b border-border items-start',
      className
    )}>
      <div className="font-display text-6xl leading-none text-muted">0{number}</div>
      <div>
        <h3 className="font-display text-3xl md:text-4xl leading-tight mb-2">{title}</h3>
        <p className="text-lg leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
};

