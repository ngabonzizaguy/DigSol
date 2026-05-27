"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { useQuickStart } from "../quick-start-provider";
import type { PreferredChannel } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const CHANNELS: { id: PreferredChannel; label: string; icon: typeof Mail; body: string }[] = [
  { id: "email", label: "Email", icon: Mail, body: "We'll reply at your address." },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, body: "Best for quick back-and-forth." },
  { id: "phone", label: "Phone call", icon: Phone, body: "We'll book a short call." },
];

export function StepContact() {
  const { draft, setDraft, config } = useQuickStart();
  const windows = config.reachability_windows;
  const hasWhatsapp = Boolean(config.whatsapp.number_e164);

  return (
    <div className="space-y-5">
      <p className="text-[15px] text-body">{config.copy.contact.body}</p>

      <div className="grid gap-3 md:grid-cols-3">
        {CHANNELS.map((c) => {
          if (c.id === "whatsapp" && !hasWhatsapp) return null;
          const Icon = c.icon;
          const on = draft.contact.channel === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() =>
                setDraft((d) => ({ ...d, contact: { ...d.contact, channel: c.id } }))
              }
              className={cn(
                "rounded-2xl border bg-surface-card p-4 text-left transition-all",
                on
                  ? "border-ink shadow-soft ring-1 ring-ink"
                  : "border-hairline hover:border-hairline-strong",
              )}
            >
              <span
                className={cn(
                  "mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full",
                  on ? "bg-ink text-on-dark" : "bg-surface-strong text-ink",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="block text-[15px] font-medium text-ink">{c.label}</span>
              <span className="block text-[13px] text-muted">{c.body}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-body-strong">When works best?</span>
        <div className="flex flex-wrap gap-2">
          {windows.map((w) => {
            const on = draft.contact.window === w;
            return (
              <button
                key={w}
                type="button"
                onClick={() =>
                  setDraft((d) => ({ ...d, contact: { ...d.contact, window: on ? "" : w } }))
                }
                className={
                  on
                    ? "rounded-full bg-ink px-4 py-2 text-sm text-on-dark"
                    : "rounded-full border border-hairline-strong px-4 py-2 text-sm text-ink hover:bg-surface-strong"
                }
              >
                {w}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
