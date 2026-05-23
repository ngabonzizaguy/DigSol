"use server";
import { z } from "zod";
import { buildEntityActions } from "@/lib/admin/generic-actions";

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  format: z.string().min(1),
  pages: z.number().int(),
  file_url: z.string().url().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  sort_order: z.number().int().default(0),
});

const actions = buildEntityActions({
  table: "guides",
  schema,
  numberFields: ["pages", "sort_order"],
  slugField: "slug",
  listPath: "/admin/guides",
  editPath: (slug) => `/admin/guides/${slug}`,
  revalidate: () => ["/insights/guides", "/insights"],
});

export const upsertGuide = actions.upsert;
export const deleteGuide = actions.remove;
export async function publishGuide(id: string) { await actions.setStatus(id, "published"); }
export async function unpublishGuide(id: string) { await actions.setStatus(id, "draft"); }
