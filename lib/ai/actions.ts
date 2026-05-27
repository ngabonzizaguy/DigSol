"use server";

import { getAiProviderFromSettings } from "@/lib/ai/settings";
import { getAiSettings } from "@/lib/ai/settings";
import type { AnalyticsSummary } from "@/lib/admin/analytics";

const TONE_HINTS: Record<string, string> = {
  professional: "Use a polished, professional tone.",
  friendly: "Use a warm, friendly tone.",
  concise: "Use a brief, no-frills tone with short sentences.",
};

export async function summarizeLead(input: {
  name: string | null;
  email: string;
  message: string | null;
  kind: string;
  status: string;
}): Promise<string> {
  const settings = await getAiSettings();
  if (!settings.lead_assist_enabled) {
    throw new Error("Lead AI assist is disabled. Enable it in Admin → AI.");
  }
  const ai = await getAiProviderFromSettings();
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
  const settings = await getAiSettings();
  if (!settings.lead_assist_enabled) {
    throw new Error("Lead AI assist is disabled. Enable it in Admin → AI.");
  }
  const ai = await getAiProviderFromSettings();
  const toneHint = TONE_HINTS[settings.default_reply_tone] ?? TONE_HINTS.professional;
  return ai.complete({
    messages: [
      {
        role: "system",
        content: `Suggest reply tone and structure for a digital transformation consultancy. ${toneHint}`,
      },
      {
        role: "user",
        content: `Suggest reply tone for:\n${input.message ?? "(no message)"}`,
      },
    ],
  });
}

export async function improveContactMessage(message: string): Promise<string> {
  const settings = await getAiSettings();
  if (!settings.contact_assist_enabled) {
    throw new Error("Contact AI polish is disabled.");
  }
  const text = message.trim();
  if (!text) throw new Error("Message is empty");
  const ai = await getAiProviderFromSettings();
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
): Promise<string | null> {
  const settings = await getAiSettings();
  if (!settings.analytics_insight_enabled) return null;
  const ai = await getAiProviderFromSettings();
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
