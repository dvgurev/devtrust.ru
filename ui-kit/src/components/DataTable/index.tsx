"use client";

import React, { useState } from 'react';
import { cn } from '../../utils';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  className
}: DataTableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      })
    : data;

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  return (
    <div className={cn('border-2 border-border rounded overflow-hidden', className)}>
      <div className="border-b-2 border-border bg-muted/50">
        <div 
          className="grid gap-4 p-4"
          style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
        >
          {columns.map(col => (
            <div 
              key={String(col.key)} 
              className={cn(
                'font-mono uppercase text-xs tracking-wider',
                col.sortable && 'cursor-pointer hover:text-accent transition-colors'
              )}
              onClick={() => handleSort(col)}
            >
              {col.label}
              {col.sortable && sortKey === col.key && (
                <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {sortedData.map((row, idx) => (
          <div 
            key={idx}
            className={cn(
              'grid gap-4 p-4 transition-colors',
              onRowClick && 'cursor-pointer hover:bg-muted/30'
            )}
            style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map(col => (
              <div key={String(col.key)} className={cn('font-mono text-sm', col.className)}>
                {String(row[col.key])}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

