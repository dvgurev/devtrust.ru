"use client";

import React from 'react';
import { cn } from '../../utils';
import { BlogPostCard } from '../BlogPostCard';

interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  tags?: string[];
  image?: string;
}

interface BlogListProps {
  posts: BlogPost[];
  onPostClick?: (post: BlogPost) => void;
  className?: string;
}

export const BlogList: React.FC<BlogListProps> = ({ posts, onPostClick, className }) => {
  return (
    <div className={cn('space-y-6', className)}>
      {posts.map((post) => (
        <BlogPostCard
          key={post.id}
          title={post.title}
          excerpt={post.excerpt}
          author={post.author}
          date={post.date}
          tags={post.tags}
          image={post.image}
          onReadMore={() => onPostClick?.(post)}
        />
      ))}
      {posts.length === 0 && (
        <div className="text-center py-12 text-muted font-mono text-sm">
          Посты не найдены
        </div>
      )}
    </div>
  );
};
