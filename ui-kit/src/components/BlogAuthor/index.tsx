"use client";

import React from 'react';
import { cn } from '../../utils';
import { Badge } from '../Badge';

interface BlogAuthorProps {
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
  postsCount?: number;
  className?: string;
}

export const BlogAuthor: React.FC<BlogAuthorProps> = ({
  name,
  avatar,
  bio,
  role,
  postsCount,
  className,
}) => {
  return (
    <div className={cn('border-2 border-border p-6', className)}>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-fg/10 rounded-full flex items-center justify-center font-display text-2xl text-muted flex-shrink-0">
          {avatar || name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl mb-1">{name}</h3>
          {role && <Badge variant="accent">{role}</Badge>}
          {bio && <p className="text-sm text-muted mt-3 leading-relaxed">{bio}</p>}
          {postsCount !== undefined && (
            <div className="font-mono text-xs text-muted mt-3">
              Публикаций: {postsCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
