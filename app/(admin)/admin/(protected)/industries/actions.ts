"use server";
import { z } from "zod";
import { buildEntityActions } from "@/lib/admin/generic-actions";

const schema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  short: z.string().min(1),
  challenges: z.array(z.string()).default([]),
  solutions: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  sort_order: z.number().int().default(0),
});

const actions = buildEntityActions({
  table: "industries",
  schema,
  listFields: ["challenges", "solutions"],
  numberFields: ["sort_order"],
  slugField: "slug",
  listPath: "/admin/industries",
  editPath: (slug) => `/admin/industries/${slug}`,
  revalidate: (slug) => ["/industries", slug ? `/industries/${slug}` : "/industries"],
});

export const upsertIndustry = actions.upsert;
export const deleteIndustry = actions.remove;
export async function publishIndustry(id: string) { await actions.setStatus(id, "published"); }
export async function unpublishIndustry(id: string) { await actions.setStatus(id, "draft"); }
