"use client";

import React from 'react';
import { cn } from '../../utils';

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField?: keyof T;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyText?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id' as keyof T,
  onRowClick,
  className,
  emptyText = 'Нет данных'
}: TableProps<T>) {
  return (
    <div className={cn('border-2 border-border overflow-hidden', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-border bg-muted/30">
            {columns.map(col => (
              <th 
                key={String(col.key)}
                className={cn(
                  'text-left p-3 font-mono uppercase text-xs tracking-wider text-muted',
                  col.className
                )}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length}
                className="p-6 text-center text-muted font-mono text-sm"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr 
                key={String(row[keyField]) || idx}
                className={cn(
                  'border-b border-border transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-muted/20'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td 
                    key={String(col.key)}
                    className={cn('p-3 font-mono text-sm', col.className)}
                  >
                    {col.render 
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
