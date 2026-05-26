import { mockAiProvider } from "./mock";
import { createOpenAiProvider } from "./openai";
import type { AiProvider } from "./types";

export type { AiMessage, AiCompletionOptions, AiProvider } from "./types";

export function getAiProvider(): AiProvider {
  const key = process.env.AI_API_KEY?.trim();
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  if (key && (provider === "openai" || provider === "gateway")) {
    const model = process.env.AI_MODEL?.trim() || "gpt-4o-mini";
    return createOpenAiProvider(key, model);
  }
  return mockAiProvider;
}

export function isAiMockMode(): boolean {
  return getAiProvider().isMock;
}
