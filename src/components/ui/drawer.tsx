import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DrawerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          "relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 max-h-[85vh] overflow-y-auto dark:border-slate-800 dark:bg-slate-900",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile */}
        <div className="w-12 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-50">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </p>
            )}
          </div>

          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
