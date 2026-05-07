import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';

interface AppCardProps {
  img?: string;
  category: string;
  title: string;
  description: string;
  price: string;
  rating: number;
  onAction?: () => void;
  actionText?: string;
  className?: string;
}

export const AppCard: React.FC<AppCardProps> = ({
  img, category, title, description, price, rating,
  onAction, actionText = 'Подробнее', className
}) => {
  return (
    <div className={cn(
      'border-2 border-border hover:border-fg/50 transition-all cursor-pointer group',
      'flex flex-col',
      className
    )}>
      <div className="w-full aspect-[16/9] bg-fg/5 flex items-center justify-center text-fg font-display text-2xl border-b-2 border-border">
        {img || title}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs uppercase tracking-[0.1em] text-muted mb-2">{category}</div>
        <div className="font-display text-lg mb-2 group-hover:text-accent transition-colors">{title}</div>
        <p className="text-xs text-muted mb-3 leading-relaxed flex-1">{description}</p>
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <span className="font-display text-xl">{price}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">★ {rating}</span>
            {onAction && (
              <Button size="sm" onClick={onAction}>{actionText}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

