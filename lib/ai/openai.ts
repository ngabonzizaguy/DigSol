import type { AiCompletionOptions, AiProvider } from "./types";

export function createOpenAiProvider(apiKey: string, model: string): AiProvider {
  return {
    name: "openai",
    isMock: false,
    async complete(options) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
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
