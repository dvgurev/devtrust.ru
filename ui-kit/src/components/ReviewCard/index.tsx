"use client";

import React from 'react';
import { cn } from '../../utils';

interface ReviewCardProps {
  author: string;
  rating: number;
  text: string;
  date?: string;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ author, rating, text, date, className }) => {
  const stars = '★'.repeat(Math.min(5, Math.max(0, rating))).padEnd(5, '☆');

  return (
    <div className={cn('border-2 border-border p-6', className)}>
      <div className="flex justify-between items-baseline mb-3">
        <div className="font-display text-lg">{author}</div>
        <div className="text-lg leading-none tracking-wider text-accent">{stars}</div>
      </div>
      <p className="leading-relaxed text-muted mb-3">{text}</p>
      {date && <div className="text-xs text-muted font-mono">{date}</div>}
    </div>
  );
};

