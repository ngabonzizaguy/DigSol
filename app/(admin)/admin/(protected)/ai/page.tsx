import { Sparkles } from "lucide-react";
import { AiSettingsForm } from "@/components/admin/ai/ai-settings-form";
import { getAiSettingsForAdmin, getAiRuntimeStatus } from "@/lib/ai/settings";

export const metadata = { title: "AI" };
export const dynamic = "force-dynamic";

export default async function AiSettingsPage() {
  const [settings, runtime] = await Promise.all([getAiSettingsForAdmin(), getAiRuntimeStatus()]);

  const sourceLabel =
    runtime.source === "env"
      ? "Environment"
      : runtime.source === "database"
        ? "Saved here"
        : "None";

  return (
    <div className="space-y-5">
      <header>
        <h1 className="flex items-center gap-2 text-[20px] font-semibold tracking-tight text-admin-fg">
          <Sparkles className="size-5" /> AI
        </h1>
        <p className="text-[13px] text-admin-fg-subtle">
          Configure your AI provider, API key, feature toggles, and reply tone. Keys are stored in site settings and
          never shown in full after saving.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatusCard
          label="Mode"
          value={runtime.mock ? "Mock (offline)" : "Live"}
          tone={runtime.mock ? "warn" : "ok"}
        />
        <StatusCard label="Provider" value={runtime.provider} />
        <StatusCard label="Model" value={runtime.model} />
        <StatusCard
          label="API key"
          value={runtime.keyConfigured ? "Configured" : "Not set"}
          tone={runtime.keyConfigured ? "ok" : "warn"}
        />
        <StatusCard label="Active source" value={sourceLabel} />
        <StatusCard label="Lead assist" value={settings.lead_assist_enabled ? "On" : "Off"} />
      </div>

      <AiSettingsForm initial={settings} envOverrides={runtime.envOverrides} />
    </div>
  );
}

function StatusCard({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
  const toneClass =
    tone === "warn"
      ? "text-amber-600 dark:text-amber-400"
      : tone === "ok"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-admin-fg";
  return (
    <div className="rounded-xl border border-admin-border bg-admin-surface p-4">
      <div className="text-[11px] font-medium uppercase tracking-wider text-admin-fg-subtle">{label}</div>
      <div className={`mt-1 text-[14px] font-medium ${toneClass}`}>{value}</div>
    </div>
  );
}
