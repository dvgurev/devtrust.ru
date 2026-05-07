import React from 'react';
import { Button } from '../Button';
import { cn } from '../../utils';

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  isRecommended?: boolean;
  className?: string;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  name, price, period, features, isRecommended = false, className
}) => {
  return (
    <div className={cn(
      'border-2 border-border p-6',
      isRecommended && 'border-accent ring-2 ring-accent/20 ring-offset-2 ring-offset-bg',
      className
    )}>
      {isRecommended && (
        <div className="font-mono text-xs uppercase tracking-wider text-accent mb-2">Рекомендуемый</div>
      )}
      <div className="font-display text-2xl mb-3">{name}</div>
      <div className="font-display text-5xl mb-1 leading-none">{price}</div>
      <div className="text-xs text-muted mb-4 uppercase tracking-wider">{period}</div>
      <ul className="mb-6 space-y-2 border-t border-border pt-4">
        {features.map((feature, i) => (
          <li key={i} className="text-sm py-1 flex items-center gap-2">
            <span className="text-accent">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button variant="accent" className="w-full text-center">{isRecommended ? 'Текущий план' : 'Подключить'}</Button>
    </div>
  );
};

