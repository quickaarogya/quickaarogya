import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an issue loading your health data. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-3 shadow-xs">
        <AlertCircle size={24} />
      </div>

      <h4 className="font-display font-bold text-base text-red-950 dark:text-red-200">
        {title}
      </h4>

      <p className="text-xs text-red-700/80 dark:text-red-400 max-w-sm mt-1 mb-4 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
          <RotateCcw size={14} className="mr-1.5" /> Retry
        </Button>
      )}
    </div>
  );
}
