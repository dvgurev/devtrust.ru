"use client";

import React from 'react';
import { cn } from '../../utils';
import { Badge } from '../Badge';

interface BlogTagsProps {
  tags: string[];
  activeTag?: string;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export const BlogTags: React.FC<BlogTagsProps> = ({
  tags,
  activeTag,
  onTagClick,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={activeTag === tag ? 'accent' : 'default'}
          className={cn(
            'cursor-pointer hover:border-accent transition-colors',
            onTagClick && 'cursor-pointer'
          )}
        >
          <span onClick={() => onTagClick?.(tag)}>#{tag}</span>
        </Badge>
      ))}
    </div>
  );
};
