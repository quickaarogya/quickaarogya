import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-3.5 shadow-xs">
        <Icon size={24} />
      </div>

      <h4 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
        {title}
      </h4>

      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        actionHref ? (
          <Button asChild variant="default" size="sm">
            <a href={actionHref}>{actionLabel}</a>
          </Button>
        ) : (
          <Button onClick={onAction} variant="default" size="sm">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
