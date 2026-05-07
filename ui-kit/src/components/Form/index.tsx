"use client";

import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { Input } from '../Input';

interface FormFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  fields: FormFieldProps[];
  onSubmit: (data: Record<string, string>) => void;
  submitText?: string;
  loading?: boolean;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitText = 'Отправить',
  loading = false,
  className,
  ...props
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fields.forEach(field => {
      data[field.name] = formData.get(field.name) as string || '';
    });
    onSubmit(data);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn('space-y-4', className)}
      {...props}
    >
      {fields.map(field => (
        <Input
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type || 'text'}
          placeholder={field.placeholder}
          error={field.error}
          className={field.className}
        />
      ))}
      <Button 
        type="submit" 
        variant="accent" 
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Загрузка...' : submitText}
      </Button>
    </form>
  );
};
