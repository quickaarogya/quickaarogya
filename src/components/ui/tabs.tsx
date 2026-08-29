import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string; count?: number; icon?: React.ReactNode }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: "underline" | "pills";
  accentColor?: "doctors" | "pharma" | "care" | "teal";
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
  const isDoctors = accentColor === "doctors";
  const isCare = accentColor === "care";
  const isPharma = accentColor === "pharma" || accentColor === "teal";

  const getActiveTextClass = () => {
    if (isDoctors) return "text-[#026dd9] dark:text-sky-400 font-black";
    if (isCare) return "text-[#ff645e] dark:text-rose-400 font-black";
    return "text-[#0F766E] dark:text-teal-400 font-black";
  };

  const getActiveBadgeClass = () => {
    if (isDoctors) return "bg-blue-50 text-[#026dd9] dark:bg-blue-950 dark:text-sky-300 font-black border border-blue-200/60";
    if (isCare) return "bg-rose-50 text-[#ff645e] dark:bg-rose-950 dark:text-rose-300 font-black border border-rose-200/60";
    return "bg-teal-50 text-[#0F766E] dark:bg-teal-950 dark:text-teal-300 font-black border border-teal-200/60";
  };

  const getUnderlineClass = () => {
    if (isDoctors) return "bg-[#026dd9] shadow-sm shadow-blue-500/40";
    if (isCare) return "bg-[#ff645e] shadow-sm shadow-rose-500/40";
    return "bg-[#0F766E] shadow-sm shadow-teal-500/40";
  };

  if (variant === "pills") {
    return (
      <div
        className={cn(
          "inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl gap-1",
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
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all select-none cursor-pointer",
                isActive
                  ? cn("bg-white dark:bg-slate-900 shadow-xs", getActiveTextClass())
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
                      ? getActiveBadgeClass()
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
        "flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto scrollbar-none",
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
              "relative pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap select-none cursor-pointer",
              isActive
                ? getActiveTextClass()
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-bold",
                  isActive
                    ? getActiveBadgeClass()
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all",
                  getUnderlineClass()
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
