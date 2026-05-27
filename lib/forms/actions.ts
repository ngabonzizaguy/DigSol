"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";

const contactSchema = z.object({
  name: z.string().min(1).max(160),
  email: z.string().email(),
  company: z.string().max(160).optional().or(z.literal("")),
  role: z.string().max(160).optional().or(z.literal("")),
  message: z.string().min(1).max(4000),
  phone: z.string().optional().or(z.literal("")),
  phone_country: z.string().length(2).optional().or(z.literal("")),
  phone_dial: z.string().optional().or(z.literal("")),
});

const consultationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional().or(z.literal("")),
  company_size: z.string().optional().or(z.literal("")),
  timeline: z.string().optional().or(z.literal("")),
  intent: z.string().min(1),
  phone: z.string().optional().or(z.literal("")),
  phone_country: z.string().length(2).optional().or(z.literal("")),
  phone_dial: z.string().optional().or(z.literal("")),
});

const newsletterSchema = z.object({
  email: z.string().email(),
});

export type FormResult = { ok: true; redirect?: string } | { ok: false; error: string };

export async function submitContact(_prev: FormResult | null, formData: FormData): Promise<FormResult> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    role: String(formData.get("role") ?? ""),
    message: String(formData.get("message") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    phone_country: String(formData.get("phone_country") ?? ""),
    phone_dial: String(formData.get("phone_dial") ?? ""),
  };
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields." };

  const supabase = await createClient();
  const phoneClean = parsed.data.phone ? parsed.data.phone.replace(/[^\d]/g, "") : null;
  const { data, error } = await supabase
    .from("leads")
    .insert({
      kind: "contact",
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      role: parsed.data.role || null,
      message: parsed.data.message,
      phone: phoneClean,
      country_code: parsed.data.phone_country || null,
      phone_dial_code: parsed.data.phone_dial || null,
      payload: { source: "/contact" },
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  await logActivity({ entity: "leads", entity_id: data.id, action: "create:contact" });
  return { ok: true, redirect: "/thank-you" };
}

export async function submitConsultation(_prev: FormResult | null, formData: FormData): Promise<FormResult> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    company_size: String(formData.get("company_size") ?? ""),
    timeline: String(formData.get("timeline") ?? ""),
    intent: String(formData.get("intent") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    phone_country: String(formData.get("phone_country") ?? ""),
    phone_dial: String(formData.get("phone_dial") ?? ""),
  };
  const parsed = consultationSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields." };

  const supabase = await createClient();
  const phoneClean = parsed.data.phone ? parsed.data.phone.replace(/[^\d]/g, "") : null;
  const { data, error } = await supabase
    .from("leads")
    .insert({
      kind: "consultation",
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      company_size: parsed.data.company_size || null,
      timeline: parsed.data.timeline || null,
      intent: parsed.data.intent,
      phone: phoneClean,
      country_code: parsed.data.phone_country || null,
      phone_dial_code: parsed.data.phone_dial || null,
      payload: { phone: parsed.data.phone, source: "/book-consultation" },
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  await logActivity({ entity: "leads", entity_id: data.id, action: "create:consultation" });
  return { ok: true, redirect: "/thank-you" };
}

export async function subscribeNewsletter(_prev: FormResult | null, formData: FormData): Promise<FormResult> {
  const raw = { email: String(formData.get("email") ?? "") };
  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Enter a valid email" };
  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    kind: "newsletter",
    email: parsed.data.email,
    payload: { source: "footer" },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
