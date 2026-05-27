import { mockEmailProvider } from "./mock";
import { createResendProvider } from "./resend";
import type { EmailProvider } from "./types";

export type { EmailMessage, EmailProvider, EmailSendResult } from "./types";

export function getEmailProvider(): EmailProvider {
  const key = process.env.RESEND_API_KEY?.trim();
  if (key) {
    return createResendProvider(key);
  }
  return mockEmailProvider;
}

export function isEmailMockMode(): boolean {
  return !process.env.RESEND_API_KEY?.trim();
}

export function getDefaultFromEmail(): string {
  return process.env.EMAIL_FROM?.trim() || "hello@digsolutions.co";
}
