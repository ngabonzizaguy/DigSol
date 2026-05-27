export type AiReplyTone = "professional" | "friendly" | "concise";

/** Preset ids or any custom provider label (e.g. azure, together, local). */
export type AiProviderPreset = "mock" | "openai" | "gateway" | "custom";

export type AiSettings = {
  lead_assist_enabled: boolean;
  contact_assist_enabled: boolean;
  analytics_insight_enabled: boolean;
  default_reply_tone: AiReplyTone;
  /** `mock` or any provider name. Custom names use `api_base_url` when set. */
  provider: string;
  model: string;
  api_key: string | null;
  /** OpenAI-compatible chat completions base (e.g. https://api.openai.com/v1). */
  api_base_url: string | null;
};

export type AiSettingsFormState = Omit<AiSettings, "api_key"> & {
  api_key_configured: boolean;
  api_key_hint: string | null;
  provider_preset: AiProviderPreset;
};

export type AiCredentialsSource = "env" | "database" | "none";

export type AiRuntimeStatus = {
  mock: boolean;
  provider: string;
  model: string;
  keyConfigured: boolean;
  source: AiCredentialsSource;
  envOverrides: boolean;
};

export const AI_PROVIDER_PRESETS: { value: AiProviderPreset; label: string }[] = [
  { value: "mock", label: "Mock (offline)" },
  { value: "openai", label: "OpenAI" },
  { value: "gateway", label: "OpenAI-compatible gateway" },
  { value: "custom", label: "Custom provider…" },
];

export const DEFAULT_AI_SETTINGS: AiSettings = {
  lead_assist_enabled: true,
  contact_assist_enabled: false,
  analytics_insight_enabled: true,
  default_reply_tone: "professional",
  provider: "mock",
  model: "gpt-4o-mini",
  api_key: null,
  api_base_url: null,
};

export function providerToPreset(provider: string): AiProviderPreset {
  const p = provider.toLowerCase();
  if (p === "mock" || p === "openai" || p === "gateway") return p;
  return "custom";
}
