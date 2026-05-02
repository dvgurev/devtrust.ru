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
    default: "bg-gray-100 text-gray-700",
    secondary: "bg-gray-100 text-gray-700",
    destructive: "bg-red-100 text-red-700",
    outline: "border border-gray-300",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
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
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}

export function Avatar({ src, fallback }: { src?: string | null; fallback?: string }) {
  if (src) {
    return <img src={src} className="w-10 h-10 rounded-full" alt="" />
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
      <span className="text-sm text-gray-500">{fallback?.[0]?.toUpperCase() || "?"}</span>
    </div>
  )
}

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("h-px bg-gray-200 w-full", className)} {...props} />
}