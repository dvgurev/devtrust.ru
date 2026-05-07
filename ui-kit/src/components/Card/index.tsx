"use client";

import React from 'react';
import { cn } from '../../utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('border-2 border-border p-6', className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

