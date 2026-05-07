"use client";

import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';

interface BlogCommentProps {
  author: string;
  avatar?: string;
  content: string;
  date: string;
  likes?: number;
  onReply?: () => void;
  className?: string;
}

export const BlogComment: React.FC<BlogCommentProps> = ({
  author,
  avatar,
  content,
  date,
  likes = 0,
  onReply,
  className,
}) => {
  return (
    <div className={cn('border-b border-border py-4', className)}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-fg/10 rounded-full flex items-center justify-center font-mono text-xs text-muted flex-shrink-0">
          {avatar || author.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-mono text-sm font-medium">{author}</div>
              <div className="font-mono text-xs text-muted">{date}</div>
            </div>
            <div className="font-mono text-xs text-muted flex items-center gap-1">
              <span>♥</span> {likes}
            </div>
          </div>
          <p className="text-sm text-muted leading-relaxed mb-3">{content}</p>
          {onReply && (
            <Button size="sm" variant="ghost" onClick={onReply}>
              Ответить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
