import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  variant?: "teal" | "care" | "doctor" | "default";
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  id,
  className,
  variant = "default",
}: CheckboxProps) {
  const getCheckedStyles = () => {
    if (variant === "care") return "bg-[#ff645e] text-white border-[#ff645e]";
    if (variant === "doctor") return "bg-[#026dd9] text-white border-[#026dd9]";
    return "bg-teal-600 text-white border-teal-600 dark:bg-teal-600 dark:border-teal-600";
  };

  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-md border border-slate-300 dark:border-slate-700 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff645e] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-colors cursor-pointer",
        checked
          ? getCheckedStyles()
          : "bg-white dark:bg-slate-900",
        className
      )}
    >
      {checked && <Check className="h-3 w-3 stroke-[3]" />}
    </button>
  );
}
