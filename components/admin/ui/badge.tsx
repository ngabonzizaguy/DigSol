import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-admin-border-soft text-admin-fg-muted",
        accent: "bg-admin-accent text-admin-accent-fg",
        success: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
        danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        info: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        outline: "border border-admin-border text-admin-fg-muted",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "published"
      ? "success"
      : status === "draft"
        ? "warning"
        : status === "archived"
          ? "danger"
          : status === "new"
            ? "info"
            : status === "in_progress"
              ? "warning"
              : status === "replied"
                ? "accent"
                : status === "closed"
                  ? "neutral"
                  : status === "won"
                    ? "success"
                    : status === "lost"
                      ? "danger"
                      : "neutral";
  return (
    <Badge tone={tone as "success" | "warning" | "danger" | "info" | "neutral"}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </Badge>
  );
}
