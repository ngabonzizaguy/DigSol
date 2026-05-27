export type EmailMessage = {
  to: string;
  from: string;
  subject: string;
  html?: string;
  text: string;
  replyTo?: string;
};

export type EmailSendResult = {
  id: string;
  provider: "mock" | "resend";
};

export interface EmailProvider {
  readonly name: "mock" | "resend";
  send(message: EmailMessage): Promise<EmailSendResult>;
}
