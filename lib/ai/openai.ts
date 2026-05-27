import type { AiCompletionOptions, AiProvider } from "./types";

const DEFAULT_CHAT_URL = "https://api.openai.com/v1/chat/completions";

export function resolveChatCompletionsUrl(baseUrl?: string | null): string {
  const raw = baseUrl?.trim();
  if (!raw) return DEFAULT_CHAT_URL;
  const normalized = raw.replace(/\/$/, "");
  if (normalized.endsWith("/chat/completions")) return normalized;
  return `${normalized}/chat/completions`;
}

export function createOpenAiProvider(
  apiKey: string,
  model: string,
  baseUrl?: string | null,
  providerName = "openai"
): AiProvider {
  const endpoint = resolveChatCompletionsUrl(baseUrl);
  return {
    name: providerName,
    isMock: false,
    async complete(options) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: options.messages,
          max_tokens: options.maxTokens ?? 800,
          temperature: options.temperature ?? 0.4,
        }),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => res.statusText);
        throw new Error(`OpenAI failed: ${err}`);
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      return data.choices?.[0]?.message?.content?.trim() ?? "";
    },
  };
}
