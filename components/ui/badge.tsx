import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "dark";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const styles = {
    default: "bg-surface-strong text-ink",
    outline: "border border-hairline-strong text-ink",
    dark: "bg-surface-dark text-on-dark",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
