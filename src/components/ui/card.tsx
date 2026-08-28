import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-white/75 backdrop-blur-xl border-white/80 shadow-[0_8px_24px_rgba(15,23,42,0.05)] hover:bg-white/90 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] dark:bg-slate-900/75 dark:border-slate-800",
        interactive:
          "bg-white/75 backdrop-blur-xl border-white/80 shadow-[0_8px_24px_rgba(15,23,42,0.05)] hover:bg-white/90 hover:border-blue-300 hover:shadow-[0_14px_36px_rgba(2,109,217,0.12)] cursor-pointer active:scale-[0.99] dark:bg-slate-900/75 dark:border-slate-800",
        glass:
          "bg-white/60 backdrop-blur-2xl border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:bg-white/75 dark:bg-slate-900/60 dark:border-white/10",
        highlight:
          "border-blue-200/80 bg-blue-50/50 backdrop-blur-xl shadow-xs dark:bg-blue-950/20 dark:border-blue-800/80",
        alert:
          "border-red-200/80 bg-red-50/50 backdrop-blur-xl shadow-xs dark:bg-red-950/20 dark:border-red-900/80",
        summary:
          "border-white/60 bg-slate-50/70 backdrop-blur-xl shadow-xs dark:bg-slate-800/40 dark:border-slate-700",
      },
      padding: {
        none: "p-0",
        sm: "p-3 sm:p-4",
        default: "p-4 sm:p-5",
        lg: "p-6 sm:p-7",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 mb-3", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display font-bold text-base tracking-tight text-slate-900 dark:text-slate-50",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-slate-500 dark:text-slate-400 mt-0.5", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-3 mt-3 border-t border-slate-100 dark:border-slate-800", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
