import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string; count?: number; icon?: React.ReactNode }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: "underline" | "pills";
  accentColor?: "teal" | "care";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "underline",
  accentColor = "teal",
  className,
}: TabsProps) {
  const isCare = accentColor === "care";

  if (variant === "pills") {
    return (
      <div
        className={cn(
          "inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg gap-1",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all select-none",
                isActive
                  ? isCare
                    ? "bg-white dark:bg-slate-900 text-[#ff645e] shadow-xs font-bold"
                    : "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    isActive
                      ? isCare
                        ? "bg-rose-50 text-[#ff645e] dark:bg-rose-950 dark:text-rose-300 font-bold"
                        : "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 font-bold"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap select-none",
              isActive
                ? isCare
                  ? "text-[#ff645e] font-bold"
                  : "text-teal-700 dark:text-teal-400 font-bold"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                  isActive
                    ? isCare
                      ? "bg-rose-100 text-[#ff645e] dark:bg-rose-950 dark:text-rose-300"
                      : "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
                  isCare ? "bg-[#ff645e]" : "bg-teal-600 dark:bg-teal-400"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
