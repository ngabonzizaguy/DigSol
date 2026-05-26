import { StatusBadge } from "@/components/admin/ui/badge";
import type { LeadStatus } from "@/lib/supabase/types";

const PIPELINE: { status: LeadStatus; label: string }[] = [
  { status: "new", label: "New" },
  { status: "in_progress", label: "In progress" },
  { status: "replied", label: "Replied" },
  { status: "closed", label: "Closed" },
];

export function LeadPipelineBar({ current }: { current: LeadStatus }) {
  const idx = PIPELINE.findIndex((s) => s.status === current);
  const activeIdx = idx >= 0 ? idx : 0;

  return (
    <div className="rounded-xl border border-admin-border-soft bg-admin-surface p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-admin-fg-subtle">Pipeline</p>
      <div className="flex flex-wrap items-center gap-2">
        {PIPELINE.map((step, i) => {
          const done = i <= activeIdx;
          const isCurrent = step.status === current;
          return (
            <div key={step.status} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] ${
                  isCurrent
                    ? "bg-admin-accent/15 font-medium text-admin-fg"
                    : done
                      ? "text-admin-fg-muted"
                      : "text-admin-fg-subtle"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${done ? "bg-admin-accent" : "bg-admin-border"}`}
                  aria-hidden
                />
                {step.label}
              </div>
              {i < PIPELINE.length - 1 ? (
                <span className="hidden text-admin-fg-subtle sm:inline" aria-hidden>
                  →
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-3">
        <StatusBadge status={current} />
      </div>
    </div>
  );
}
