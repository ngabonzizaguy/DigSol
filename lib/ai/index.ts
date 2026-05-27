import { mockAiProvider } from "./mock";
import { createOpenAiProvider } from "./openai";
import {
  getAiProviderFromSettings,
  getAiRuntimeStatus,
} from "./settings";
import type { AiProvider } from "./types";

export type { AiMessage, AiCompletionOptions, AiProvider } from "./types";
export type {
  AiSettings,
  AiSettingsFormState,
  AiRuntimeStatus,
  AiProviderPreset,
  AiReplyTone,
} from "./config-types";
export {
  getAiSettings,
  getAiSettingsForAdmin,
  getAiProviderFromSettings,
  getAiRuntimeStatus,
} from "./settings";

/** @deprecated Prefer `getAiProviderFromSettings()` — reads DB + env. */
export function getAiProvider(): AiProvider {
  const key = process.env.AI_API_KEY?.trim();
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  if (key && (provider === "openai" || provider === "gateway")) {
    const model = process.env.AI_MODEL?.trim() || "gpt-4o-mini";
    return createOpenAiProvider(key, model);
  }
  return mockAiProvider;
}

export async function isAiMockMode(): Promise<boolean> {
  return (await getAiProviderFromSettings()).isMock;
}
