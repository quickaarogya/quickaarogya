import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "default" | "lg" | "xl";
  status?: "online" | "emergency" | "offline";
  className?: string;
}

export function Avatar({
  name,
  src,
  size = "default",
  status,
  className,
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    default: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold font-display select-none overflow-hidden border border-slate-200 bg-slate-100 text-teal-800 dark:bg-slate-800 dark:text-teal-300 dark:border-slate-700 shadow-xs",
          sizeClasses[size],
          className
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={name}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-900",
            size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5",
            status === "online" && "bg-emerald-500",
            status === "emergency" && "bg-red-500 animate-pulse",
            status === "offline" && "bg-slate-400"
          )}
        />
      )}
    </div>
  );
}
