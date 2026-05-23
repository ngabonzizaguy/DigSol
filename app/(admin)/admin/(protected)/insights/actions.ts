"use server";
import { z } from "zod";
import { buildEntityActions } from "@/lib/admin/generic-actions";

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  body: z.array(z.string()).default([]),
  author: z.string().min(1),
  author_role: z.string().min(1),
  category: z.string().min(1),
  read_time: z.string().min(1),
  cover_url: z.string().url().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().nullable().optional(),
});

const actions = buildEntityActions({
  table: "insights",
  schema,
  listFields: ["body"],
  slugField: "slug",
  listPath: "/admin/insights",
  editPath: (slug) => `/admin/insights/${slug}`,
  revalidate: (slug) => ["/insights", "/insights/blog", slug ? `/insights/${slug}` : "/insights", "/"],
});

export const upsertInsight = actions.upsert;
export const deleteInsight = actions.remove;
export async function publishInsight(id: string) { await actions.setStatus(id, "published"); }
export async function unpublishInsight(id: string) { await actions.setStatus(id, "draft"); }
