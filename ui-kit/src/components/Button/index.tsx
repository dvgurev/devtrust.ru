"use client";

import React from 'react';
import { cn } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', size = 'md', className, href, ...props }, ref) => {
    const base = 'font-mono text-xs uppercase tracking-widest border-2 inline-flex items-center justify-center cursor-pointer no-underline font-medium transition-all duration-200 hover:no-underline active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      default: 'border-border bg-surface text-fg hover:bg-fg hover:text-bg hover:border-fg',
      accent: 'border-accent bg-accent text-bg hover:bg-accent/90 hover:border-accent',
      ghost: 'border-transparent text-muted hover:text-fg hover:border-fg'
    };
    
    const sizes = {
      sm: 'px-4 py-1.5 text-xs',
      md: 'px-6 py-3',
      lg: 'px-8 py-4 text-sm'
    };

    const classes = cn(base, variants[variant], sizes[size], className);

    if (href) {
      return <a href={href} className={classes} {...props as any}>{children}</a>;
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

