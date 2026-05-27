import type { EmailMessage, EmailProvider, EmailSendResult } from "./types";

function hashSeed(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return `mock_${h.toString(16).padStart(8, "0")}`;
}

export const mockEmailProvider: EmailProvider = {
  name: "mock",
  async send(message: EmailMessage): Promise<EmailSendResult> {
    const seed = `${message.to}|${message.subject}|${message.text.slice(0, 64)}`;
    return { id: hashSeed(seed), provider: "mock" };
  },
};
