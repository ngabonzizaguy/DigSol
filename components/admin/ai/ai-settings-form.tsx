"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { saveAiSettings } from "@/app/(admin)/admin/(protected)/ai/actions";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { FormField } from "@/components/admin/ui/form-field";
import {
  AI_PROVIDER_PRESETS,
  type AiProviderPreset,
  type AiSettingsFormState,
} from "@/lib/ai/config-types";

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <Button variant="primary" size="sm" type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save AI settings"}
    </Button>
  );
}

const selectClass =
  "flex h-9 w-full max-w-md rounded-md border border-admin-border bg-admin-surface px-3 text-[13px] text-admin-fg";

export function AiSettingsForm({
  initial,
  envOverrides,
}: {
  initial: AiSettingsFormState;
  envOverrides: boolean;
}) {
  const [state, action] = useActionState(saveAiSettings, null);
  const [preset, setPreset] = useState<AiProviderPreset>(initial.provider_preset);
  const [customProvider, setCustomProvider] = useState(
    initial.provider_preset === "custom" ? initial.provider : ""
  );

  const showBaseUrl = preset !== "mock";
  const showCustomName = preset === "custom";

  useEffect(() => {
    if (state?.ok) toast.success("AI settings saved");
    else if (state && !state.ok) toast.error(state.error);
  }, [state]);

  const resolvedProvider =
    preset === "custom" ? customProvider.trim().toLowerCase() || "custom" : preset;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="provider" value={resolvedProvider} />

      <Card>
        <CardHeader>
          <CardTitle>Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {envOverrides ? (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-800 dark:text-amber-200">
              Environment variables (<code className="font-mono">AI_API_KEY</code>,{" "}
              <code className="font-mono">AI_PROVIDER</code>, <code className="font-mono">AI_MODEL</code>,{" "}
              optional <code className="font-mono">AI_API_BASE_URL</code>) override the values below at
              runtime.
            </p>
          ) : null}

          <FormField
            label="Provider"
            hint="Mock for offline demos. OpenAI uses the default API. Choose Custom for any OpenAI-compatible host."
          >
            <select
              name="provider_preset_ui"
              value={preset}
              onChange={(e) => setPreset(e.target.value as AiProviderPreset)}
              className={selectClass}
            >
              {AI_PROVIDER_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </FormField>

          {showCustomName ? (
            <FormField
              label="Custom provider name"
              hint="Short id used in status and logs (e.g. together, azure, groq)."
            >
              <Input
                value={customProvider}
                onChange={(e) => setCustomProvider(e.target.value)}
                placeholder="e.g. together"
              />
            </FormField>
          ) : null}

          {showBaseUrl ? (
            <FormField
              label="API base URL"
              hint="OpenAI-compatible root URL. OpenAI can leave blank. Gateway/custom: e.g. https://api.openai.com/v1 or your proxy."
            >
              <Input
                name="api_base_url"
                defaultValue={initial.api_base_url ?? ""}
                placeholder="https://api.openai.com/v1"
              />
            </FormField>
          ) : null}

          <FormField label="Model" hint="e.g. gpt-4o-mini, gpt-4o, claude via compatible proxy">
            <Input name="model" defaultValue={initial.model} placeholder="gpt-4o-mini" />
          </FormField>

          <FormField
            label="API key"
            hint={
              initial.api_key_configured
                ? `Stored key: ${initial.api_key_hint ?? "configured"}. Leave blank to keep it.`
                : "Paste your API key. Stored in site settings (admin-only)."
            }
          >
            <Input
              name="api_key"
              type="password"
              autoComplete="off"
              placeholder={initial.api_key_configured ? "Leave blank to keep current key" : "sk-…"}
            />
          </FormField>

          {initial.api_key_configured ? (
            <label className="flex items-center gap-2 text-[12px] text-admin-fg-muted">
              <input type="checkbox" name="clear_api_key" className="size-4 rounded border-admin-border" />
              Remove stored API key
            </label>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Toggle
            name="lead_assist_enabled"
            defaultChecked={initial.lead_assist_enabled}
            label="Lead assist"
            description="Show AI summaries and reply tone suggestions in the leads inbox."
          />
          <Toggle
            name="contact_assist_enabled"
            defaultChecked={initial.contact_assist_enabled}
            label="Contact form polish"
            description="Let visitors improve their contact message with AI before submitting."
          />
          <Toggle
            name="analytics_insight_enabled"
            defaultChecked={initial.analytics_insight_enabled}
            label="Analytics summary"
            description="Generate a 2-sentence summary at the top of the analytics page."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField label="Default reply tone" hint="Used when suggesting replies to new leads.">
            <select name="default_reply_tone" defaultValue={initial.default_reply_tone} className={selectClass}>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="concise">Concise</option>
            </select>
          </FormField>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <SaveBtn />
      </div>
    </form>
  );
}

function Toggle({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-admin-border-soft bg-admin-elevated p-3 hover:bg-admin-hover">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 rounded border-admin-border"
      />
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-admin-fg">{label}</p>
        <p className="text-[12px] text-admin-fg-subtle">{description}</p>
      </div>
    </label>
  );
}
