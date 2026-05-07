import * as React from "react"
import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "accent" | "ghost"
  size?: "sm" | "md" | "lg"
  href?: string
}

export function Button({
  className,
  variant = "default",
  size = "md",
  href,
  ...props
}: ButtonProps) {
  const base = "font-mono text-xs uppercase tracking-widest border-2 inline-flex items-center justify-center cursor-pointer no-underline font-medium transition-all duration-200 hover:no-underline active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    default: "border-border bg-surface text-fg hover:bg-fg hover:text-bg hover:border-fg",
    accent: "border-accent bg-accent text-bg hover:bg-accent/90 hover:border-accent",
    ghost: "border-transparent text-muted hover:text-fg hover:border-fg"
  }

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-sm"
  }

  const classes = cn(base, variants[variant], sizes[size], className)

  if (href) {
    return <a href={href} className={classes} {...props as any}>{props.children}</a>
  }

  return (
    <button
      className={classes}
      {...props}
    />
  )
}

export const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "font-mono text-sm border-2 border-border bg-surface text-fg placeholder:text-muted focus:outline-none focus:border-accent px-4 py-3 w-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export const Label = React.forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export const Select = React.forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

// 👇 ЭКСПОРТ ВСЕХ КОМПОНЕНТОВ (можно не писать, если уже использовали export перед каждым)
// Но для ясности и порядка можно добавить:
// export { Button, Input, Textarea, Label, Select }