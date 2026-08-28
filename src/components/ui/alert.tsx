import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-md border p-3.5 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-3.5 [&>svg]:top-3.5 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default:
          "bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800",
        info:
          "bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-800 [&>svg]:text-sky-600 dark:[&>svg]:text-sky-400",
        success:
          "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400",
        warning:
          "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
        destructive:
          "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
        teal:
          "bg-teal-50 text-teal-900 border-teal-200 dark:bg-teal-950/40 dark:text-teal-200 dark:border-teal-800 [&>svg]:text-teal-600 dark:[&>svg]:text-teal-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, children, onDismiss, ...props }, ref) => {
    const getIcon = () => {
      switch (variant) {
        case "info": return <Info className="h-4 w-4" />;
        case "success": return <CheckCircle2 className="h-4 w-4" />;
        case "warning": return <AlertTriangle className="h-4 w-4" />;
        case "destructive": return <AlertCircle className="h-4 w-4" />;
        case "teal": return <Info className="h-4 w-4" />;
        default: return <Info className="h-4 w-4" />;
      }
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {getIcon()}
        <div>{children}</div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className="absolute right-2.5 top-2.5 rounded-sm p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs leading-relaxed opacity-90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
