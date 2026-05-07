"use client";

import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaText, ctaHref, className }) => {
  return (
    <div className={cn('py-20 md:py-32 border-b-2 border-border', className)}>
      <div className="text-xs uppercase tracking-[0.12em] text-accent mb-3 font-mono">Платформа бизнес-приложений</div>
      <h1 className="font-display text-6xl md:text-[10rem] leading-tight tracking-[-0.04em]">{title}</h1>
      <p className="max-w-md text-lg leading-7 mt-8 mb-12 text-muted">{subtitle}</p>
      <Button variant="accent" size="lg" href={ctaHref}>{ctaText}</Button>
    </div>
  );
};

