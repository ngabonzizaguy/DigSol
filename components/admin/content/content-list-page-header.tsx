import type { ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/admin/ui/button";

export function ContentListPageHeader({
  title,
  description,
  newHref,
  newLabel,
}: {
  title: string;
  description: string;
  newHref: string;
  newLabel: string;
}) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">{title}</h1>
        <p className="mt-0.5 text-[13px] text-admin-fg-subtle">{description}</p>
      </div>
      <Link href={newHref} className="shrink-0 self-start sm:self-auto">
        <Button variant="primary" size="sm">
          <Plus className="size-3.5" />
          {newLabel}
        </Button>
      </Link>
    </header>
  );
}

export function ContentListEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border bg-admin-surface px-6 py-16 text-center">
      <p className="text-[15px] font-medium text-admin-fg">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-[13px] text-admin-fg-subtle">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
