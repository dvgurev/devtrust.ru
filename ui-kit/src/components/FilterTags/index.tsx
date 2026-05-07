"use client";

import React from 'react';
import { Button } from '../Button';

interface FilterTagsProps {
  tags: string[];
  activeTag: string;
  onTagClick: (tag: string) => void;
}

export const FilterTags: React.FC<FilterTagsProps> = ({ tags, activeTag, onTagClick }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Button
          key={tag}
          variant={activeTag === tag ? 'accent' : 'default'}
          size="sm"
          className="font-mono text-xs px-4 py-2 h-auto"
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

