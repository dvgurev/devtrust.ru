"use client";

import React from 'react';
import { cn } from '../../utils';
import { Table, TableColumn } from '../Table';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { StatusPill } from '../StatusPill';

interface AdminTableAction {
  label: string;
  variant?: 'default' | 'accent' | 'ghost';
  onClick: (row: any) => void;
}

interface AdminTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: AdminTableAction[];
  keyField?: keyof T;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyText?: string;
}

export function AdminTable<T extends Record<string, any>>(props: AdminTableProps<T>) {
  const {
    columns,
    data,
    actions,
    keyField = 'id' as keyof T,
    onRowClick,
    className,
    emptyText = 'Нет данных',
  } = props;

  const columnsWithActions = actions
    ? [
        ...columns,
        {
          key: 'actions' as any,
          title: 'Действия',
          render: (_: any, row: T) => (
            <div className="flex gap-2">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant={action.variant || 'ghost'}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(row);
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ),
        },
      ]
    : columns;

  return (
    <Table
      columns={columnsWithActions}
      data={data}
      keyField={keyField as string}
      onRowClick={onRowClick as any}
      className={className}
      emptyText={emptyText}
    />
  );
}
