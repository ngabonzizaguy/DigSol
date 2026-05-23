import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent focus-visible:ring-offset-1 focus-visible:ring-offset-admin-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-admin-accent text-admin-accent-fg hover:opacity-90",
        secondary: "bg-admin-surface text-admin-fg border border-admin-border hover:bg-admin-hover",
        ghost: "text-admin-fg hover:bg-admin-hover",
        danger: "bg-error text-white hover:bg-red-700",
        outline: "border border-admin-border bg-transparent text-admin-fg hover:bg-admin-hover",
        link: "text-admin-fg underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-2",
        sm: "h-8 px-3",
        md: "h-9 px-3.5",
        lg: "h-10 px-4 text-sm",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: { variant: "secondary", size: "sm" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "AdminButton";

export { Button, buttonVariants };
