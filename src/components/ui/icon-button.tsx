import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "secondary" | "outline" | "teal" | "destructive";
  label: string; // Mandatory for accessibility
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "default", variant = "ghost", label, children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-xs rounded-sm",
      default: "h-10 w-10 text-sm rounded-md",
      lg: "h-12 w-12 text-base rounded-lg",
    };

    const variantClasses = {
      ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
      secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700",
      outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
      teal: "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
      destructive: "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50",
    };

    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:translate-y-[1px]",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";
