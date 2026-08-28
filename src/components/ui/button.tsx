import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "bg-teal-600 text-white shadow-xs hover:bg-teal-700 active:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500",
        secondary:
          "bg-slate-100 text-slate-800 border border-slate-200 shadow-xs hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700",
        outline:
          "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        destructive:
          "bg-red-600 text-white shadow-xs hover:bg-red-700 active:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500",
        emergency:
          "bg-red-600 text-white font-bold shadow-md hover:bg-red-700 active:bg-red-800 animate-pulse-glow",
        teal:
          "bg-teal-50 text-teal-800 border border-teal-200 shadow-xs hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800 dark:hover:bg-teal-900/60",
        care:
          "bg-[#ff645e] text-white shadow-xs hover:bg-[#e84f49] active:bg-[#cf3832] font-bold",
        link:
          "text-teal-600 underline-offset-4 hover:underline p-0 h-auto font-semibold dark:text-teal-400",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs rounded-sm",
        lg: "h-12 px-6 text-base rounded-lg",
        icon: "h-10 w-10 p-0 rounded-md",
        iconSm: "h-8 w-8 p-0 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const combinedClassName = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(combinedClassName, (children.props as any)?.className),
        ...props,
      });
    }

    return (
      <button
        className={combinedClassName}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
