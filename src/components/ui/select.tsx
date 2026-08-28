import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-8 cursor-pointer dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700",
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-slate-300 hover:border-slate-400 dark:hover:border-slate-600",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
