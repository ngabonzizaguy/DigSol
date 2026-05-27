import type { AiCompletionOptions, AiProvider } from "./types";

function seedFromMessages(messages: AiCompletionOptions["messages"]): number {
  const s = messages.map((m) => m.content).join("|");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const REPLY_TONES = [
  "Warm and consultative — acknowledge their goals, propose a short discovery call, and avoid hard selling.",
  "Direct and professional — confirm next steps, timeline, and who will follow up.",
  "Empathetic — validate constraints, offer a phased approach, and invite questions.",
];

export const mockAiProvider: AiProvider = {
  name: "mock",
  isMock: true,
  async complete(options) {
    const lastUser = [...options.messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const seed = seedFromMessages(options.messages);
    const tone = REPLY_TONES[seed % REPLY_TONES.length];

    if (lastUser.includes("analytics") || lastUser.includes("pageviews")) {
      return "Traffic is steady with concentration on top entry pages. Lead volume aligns with form types — prioritize new and in-progress items for faster response times.";
    }
    if (lastUser.includes("Summarize") || lastUser.includes("lead")) {
      return "The lead is exploring transformation support with a clear timeline. Key themes: operational efficiency, measurable outcomes, and executive alignment. Recommended next step: a scoped discovery session.";
    }
    if (lastUser.includes("tone") || lastUser.includes("reply")) {
      return tone;
    }
    if (lastUser.includes("Improve") || lastUser.includes("message")) {
      const trimmed = lastUser.replace(/^Improve this message:\s*/i, "").trim();
      return `${trimmed}\n\nWe would welcome the chance to learn more about your goals and share a tailored perspective on next steps.`;
    }
    return "Here is a concise draft based on your context. Review before sending.";
  },
};
