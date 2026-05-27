import type { EmailMessage, EmailProvider, EmailSendResult } from "./types";

export function createResendProvider(apiKey: string): EmailProvider {
  return {
    name: "resend",
    async send(message: EmailMessage): Promise<EmailSendResult> {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: message.from,
          to: [message.to],
          subject: message.subject,
          text: message.text,
          html: message.html,
          reply_to: message.replyTo,
        }),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => res.statusText);
        throw new Error(`Resend failed: ${err}`);
      }
      const data = (await res.json()) as { id?: string };
      return { id: data.id ?? "unknown", provider: "resend" };
    },
  };
}
