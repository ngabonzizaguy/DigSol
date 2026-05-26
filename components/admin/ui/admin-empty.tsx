import type { LucideIcon } from "lucide-react";

export function AdminEmpty({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-admin-border bg-admin-elevated/50 px-6 py-12 text-center">
      <div className="mb-3 grid size-12 place-items-center rounded-full bg-admin-border-soft text-admin-fg-subtle">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <p className="text-[14px] font-medium text-admin-fg">{title}</p>
      <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-admin-fg-subtle">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
