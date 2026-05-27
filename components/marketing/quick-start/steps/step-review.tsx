"use client";

import { Pencil } from "lucide-react";
import { useQuickStart } from "../quick-start-provider";
import type { QuickStartService } from "@/lib/marketing/quick-start-server";
import { findCountry, flagEmoji } from "@/lib/marketing/countries";

export interface StepReviewProps {
  onEditStep: (step: number) => void;
  services: QuickStartService[];
}

function formatBudget(b: { currency: string; min: number; max: number; unsure: boolean }) {
  if (b.unsure) return "Not sure yet — recommend a range.";
  if (b.currency === "USD") return `$${b.min.toLocaleString()} – $${b.max.toLocaleString()}`;
  return `${b.min.toLocaleString()} – ${b.max.toLocaleString()} RWF`;
}

export function StepReview({ onEditStep, services }: StepReviewProps) {
  const { draft, config } = useQuickStart();
  const country = findCountry(draft.about.country_code);
  const serviceTitles = services
    .filter((s) => draft.needs.service_slugs.includes(s.slug))
    .map((s) => s.title);

  const Row = ({ label, value, step }: { label: string; value: React.ReactNode; step: number }) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-hairline last:border-0">
      <div className="space-y-0.5">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <div className="text-[15px] text-ink">{value || <span className="text-muted-soft">—</span>}</div>
      </div>
      <button
        type="button"
        onClick={() => onEditStep(step)}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-muted hover:bg-surface-strong hover:text-ink"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-[15px] text-body">{config.copy.review.body}</p>
      <div className="rounded-2xl border border-hairline bg-surface-card px-4">
        <Row
          label="Intent"
          step={1}
          value={
            draft.intent === "find_service"
              ? "Find the right service"
              : draft.intent === "custom_request"
                ? "Custom project"
                : draft.intent === "exploring"
                  ? "Just exploring"
                  : ""
          }
        />
        <Row
          label="About you"
          step={2}
          value={
            <div className="space-y-0.5">
              <p>
                {draft.about.name} · {draft.about.email}
              </p>
              {(country || draft.about.phone) && (
                <p className="text-muted">
                  {country ? `${flagEmoji(country.code)} ${country.name}` : ""}
                  {draft.about.phone ? ` · ${draft.about.phone_dial_code} ${draft.about.phone}` : ""}
                </p>
              )}
              {(draft.about.company || draft.about.role) && (
                <p className="text-muted">
                  {[draft.about.company, draft.about.role].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          }
        />
        <Row
          label="What you need"
          step={3}
          value={
            <div className="space-y-0.5">
              {serviceTitles.length > 0 ? <p>{serviceTitles.join(", ")}</p> : null}
              {draft.needs.custom_request ? (
                <p className="text-muted line-clamp-3">{draft.needs.custom_request}</p>
              ) : null}
            </div>
          }
        />
        <Row
          label="Details"
          step={4}
          value={
            <div className="space-y-0.5">
              {draft.details.description ? (
                <p className="line-clamp-2">{draft.details.description}</p>
              ) : null}
              {draft.details.timeline ? (
                <p className="text-muted">Timeline: {draft.details.timeline.replace("_", "–")}</p>
              ) : null}
              {draft.details.links.length > 0 ? (
                <p className="text-muted">{draft.details.links.length} link(s)</p>
              ) : null}
            </div>
          }
        />
        <Row label="Budget" step={5} value={formatBudget(draft.budget)} />
        <Row
          label="Contact"
          step={6}
          value={
            <div className="space-y-0.5">
              <p className="capitalize">{draft.contact.channel || "—"}</p>
              {draft.contact.window ? <p className="text-muted">{draft.contact.window}</p> : null}
            </div>
          }
        />
      </div>
    </div>
  );
}
