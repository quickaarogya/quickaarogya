import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required,
  helperText,
  errorMessage,
  id,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 select-none flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      {children}

      {errorMessage ? (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium animate-in fade-in-50">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
