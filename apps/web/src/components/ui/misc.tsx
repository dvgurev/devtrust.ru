import * as React from "react"
import { cn } from "@/lib/utils"

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
  className?: string
}) {
  const variants = {
    default: "bg-fg/10 text-fg",
    secondary: "bg-fg/5 text-muted",
    destructive: "bg-accent/10 text-accent",
    outline: "border-2 border-border text-fg",
    success: "bg-accent-success/10 text-accent-success",
    warning: "bg-accent-warning/10 text-accent-warning",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 font-mono text-xs uppercase tracking-widest",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-fg/10", className)}
      {...props}
    />
  )
}

export function Avatar({ src, fallback }: { src?: string | null; fallback?: string }) {
  if (src) {
    return <img src={src} className="w-10 h-10 border-2 border-border" alt="" />
  }
  return (
    <div className="w-10 h-10 border-2 border-border bg-fg/5 flex items-center justify-center">
      <span className="font-mono text-sm text-muted">{fallback?.[0]?.toUpperCase() || "?"}</span>
    </div>
  )
}

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("h-px bg-border w-full", className)} {...props} />
}