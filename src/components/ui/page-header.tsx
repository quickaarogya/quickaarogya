import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-slate-800",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs border border-teal-200/50 dark:border-teal-900">
            <Icon size={20} />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center mt-1 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
