"use client";

import React from 'react';
import { cn } from '../../utils';
import { Badge } from '../Badge';
import { Button } from '../Button';

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  tags?: string[];
  image?: string;
  href?: string;
  onReadMore?: () => void;
  className?: string;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  title,
  excerpt,
  author,
  date,
  tags = [],
  image,
  href,
  onReadMore,
  className,
}) => {
  return (
    <div className={cn('border-2 border-border overflow-hidden', className)}>
      {image && (
        <div className="w-full aspect-[16/9] bg-fg/5 flex items-center justify-center text-muted font-mono text-sm">
          {image}
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="accent">{tag}</Badge>
          ))}
        </div>
        <h3 className="font-display text-2xl mb-2 hover:text-accent transition-colors">
          {href ? (
            <a href={href} className="no-underline hover:no-underline">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-4">{excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="font-mono text-xs text-muted">
            <span>{author}</span>
            <span className="mx-2">·</span>
            <span>{date}</span>
          </div>
          {onReadMore && (
            <Button size="sm" variant="ghost" onClick={onReadMore}>
              Читать →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
