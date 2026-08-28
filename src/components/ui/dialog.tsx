import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-0">
      <div
        className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-5 w-5 text-slate-500" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-left mb-4", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-50",
      className
    )}
    {...props}
  />
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p
    className={cn("text-sm text-slate-500 dark:text-slate-400 mt-1", className)}
    {...props}
  />
);
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogHeader, DialogTitle, DialogDescription };
