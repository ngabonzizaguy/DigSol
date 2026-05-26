"use server";

import { getAiProvider } from "@/lib/ai";
import type { AnalyticsSummary } from "@/lib/admin/analytics";

export async function summarizeLead(input: {
  name: string | null;
  email: string;
  message: string | null;
  kind: string;
  status: string;
}): Promise<string> {
  const ai = getAiProvider();
  return ai.complete({
    messages: [
      {
        role: "system",
        content: "You summarize inbound B2B leads in 2-3 sentences for an admin CRM.",
      },
      {
        role: "user",
        content: `Summarize this lead:\nKind: ${input.kind}\nStatus: ${input.status}\nName: ${input.name ?? "—"}\nEmail: ${input.email}\nMessage: ${input.message ?? "—"}`,
      },
    ],
  });
}

export async function suggestReplyTone(input: {
  message: string | null;
}): Promise<string> {
  const ai = getAiProvider();
  return ai.complete({
    messages: [
      {
        role: "system",
        content: "Suggest reply tone and structure for a digital transformation consultancy.",
      },
      {
        role: "user",
        content: `Suggest reply tone for:\n${input.message ?? "(no message)"}`,
      },
    ],
  });
}

export async function improveContactMessage(message: string): Promise<string> {
  const text = message.trim();
  if (!text) throw new Error("Message is empty");
  const ai = getAiProvider();
  return ai.complete({
    messages: [
      {
        role: "system",
        content: "Polish visitor contact messages: clear, professional, same intent, under 120 words.",
      },
      { role: "user", content: `Improve this message:\n${text}` },
    ],
  });
}

export async function generateAnalyticsInsight(
  summary: AnalyticsSummary,
  funnel: Record<string, number>
): Promise<string> {
  const ai = getAiProvider();
  return ai.complete({
    messages: [
      {
        role: "system",
        content: "Write a 2-sentence analytics summary for a marketing admin dashboard.",
      },
      {
        role: "user",
        content: `analytics pageviews JSON: ${JSON.stringify({
          total_views: summary.total_views,
          top_pages: summary.top_pages.slice(0, 3),
          devices: summary.devices,
          funnel,
        })}`,
      },
    ],
  });
}
