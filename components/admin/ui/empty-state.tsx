import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-admin-border bg-admin-surface px-6 py-12 text-center",
        className
      )}
    >
      {icon ? <div className="text-admin-fg-subtle">{icon}</div> : null}
      <p className="text-[13px] font-semibold text-admin-fg">{title}</p>
      {description ? <p className="max-w-sm text-[12px] text-admin-fg-subtle">{description}</p> : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
