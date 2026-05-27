import "server-only";
import { createClient } from "@/lib/supabase/server";
import { mockAiProvider } from "./mock";
import { createOpenAiProvider } from "./openai";
import type { AiProvider } from "./types";
import {
  DEFAULT_AI_SETTINGS,
  providerToPreset,
  type AiCredentialsSource,
  type AiSettings,
  type AiSettingsFormState,
  type AiRuntimeStatus,
} from "./config-types";

export type {
  AiReplyTone,
  AiProviderPreset,
  AiSettings,
  AiSettingsFormState,
  AiCredentialsSource,
  AiRuntimeStatus,
} from "./config-types";
export { DEFAULT_AI_SETTINGS, AI_PROVIDER_PRESETS, providerToPreset } from "./config-types";

function normalize(raw: unknown): AiSettings {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_AI_SETTINGS };
  const r = raw as Record<string, unknown>;
  const tone =
    r.default_reply_tone === "friendly" || r.default_reply_tone === "concise"
      ? r.default_reply_tone
      : "professional";
  const apiKey = typeof r.api_key === "string" && r.api_key.trim() ? r.api_key.trim() : null;
  const provider =
    typeof r.provider === "string" && r.provider.trim() ? r.provider.trim().toLowerCase() : "mock";
  const apiBase =
    typeof r.api_base_url === "string" && r.api_base_url.trim() ? r.api_base_url.trim() : null;

  return {
    lead_assist_enabled:
      typeof r.lead_assist_enabled === "boolean"
        ? r.lead_assist_enabled
        : DEFAULT_AI_SETTINGS.lead_assist_enabled,
    contact_assist_enabled:
      typeof r.contact_assist_enabled === "boolean"
        ? r.contact_assist_enabled
        : DEFAULT_AI_SETTINGS.contact_assist_enabled,
    analytics_insight_enabled:
      typeof r.analytics_insight_enabled === "boolean"
        ? r.analytics_insight_enabled
        : DEFAULT_AI_SETTINGS.analytics_insight_enabled,
    default_reply_tone: tone,
    provider,
    model: typeof r.model === "string" && r.model.trim() ? r.model.trim() : DEFAULT_AI_SETTINGS.model,
    api_key: apiKey,
    api_base_url: apiBase,
  };
}

function maskApiKey(key: string | null): string | null {
  if (!key || key.length < 8) return key ? "••••" : null;
  return `••••${key.slice(-4)}`;
}

export function toFormState(settings: AiSettings): AiSettingsFormState {
  const { api_key, ...rest } = settings;
  return {
    ...rest,
    api_key_configured: Boolean(api_key?.trim()),
    api_key_hint: maskApiKey(api_key),
    provider_preset: providerToPreset(settings.provider),
  };
}

async function loadIntegrationsAi(): Promise<AiSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("integrations")
      .eq("id", 1)
      .maybeSingle();
    const integrations = (data?.integrations as Record<string, unknown> | undefined) ?? {};
    return normalize(integrations.ai);
  } catch {
    return { ...DEFAULT_AI_SETTINGS };
  }
}

export async function getAiSettings(): Promise<AiSettings> {
  return loadIntegrationsAi();
}

export async function getAiSettingsForAdmin(): Promise<AiSettingsFormState> {
  return toFormState(await getAiSettings());
}

export type ResolvedAiCredentials = {
  provider: string;
  model: string;
  apiKey: string;
  apiBaseUrl: string | null;
  source: Exclude<AiCredentialsSource, "none">;
};

function isLiveProvider(provider: string): boolean {
  return provider.trim().toLowerCase() !== "mock";
}

/** Env vars win when a valid key is set there. Otherwise use stored admin settings. */
export function resolveAiCredentials(settings: AiSettings): ResolvedAiCredentials | null {
  const envKey = process.env.AI_API_KEY?.trim();
  const envProvider = (process.env.AI_PROVIDER ?? "").trim().toLowerCase();
  const envBase = process.env.AI_API_BASE_URL?.trim() || null;

  if (envKey && envProvider && isLiveProvider(envProvider)) {
    return {
      provider: envProvider,
      model: process.env.AI_MODEL?.trim() || settings.model || "gpt-4o-mini",
      apiKey: envKey,
      apiBaseUrl: envBase,
      source: "env",
    };
  }

  if (!isLiveProvider(settings.provider)) return null;

  const dbKey = settings.api_key?.trim();
  if (!dbKey) return null;

  return {
    provider: settings.provider,
    model: settings.model?.trim() || "gpt-4o-mini",
    apiKey: dbKey,
    apiBaseUrl: settings.api_base_url,
    source: "database",
  };
}

export async function getAiProviderFromSettings(): Promise<AiProvider> {
  const settings = await getAiSettings();
  const creds = resolveAiCredentials(settings);
  if (creds) {
    return createOpenAiProvider(creds.apiKey, creds.model, creds.apiBaseUrl, creds.provider);
  }
  return mockAiProvider;
}

export async function getAiRuntimeStatus(): Promise<AiRuntimeStatus> {
  const settings = await getAiSettings();
  const creds = resolveAiCredentials(settings);
  const envOverrides = creds?.source === "env";

  if (!creds) {
    return {
      mock: true,
      provider: settings.provider,
      model: settings.model,
      keyConfigured: Boolean(settings.api_key?.trim()),
      source: "none",
      envOverrides: false,
    };
  }

  return {
    mock: false,
    provider: creds.provider,
    model: creds.model,
    keyConfigured: true,
    source: creds.source,
    envOverrides,
  };
}
