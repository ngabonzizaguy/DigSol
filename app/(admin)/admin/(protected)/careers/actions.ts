"use server";
import { z } from "zod";
import { buildEntityActions } from "@/lib/admin/generic-actions";

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  team: z.string().min(1),
  location: z.string().min(1),
  employment_type: z.string().min(1),
  description: z.string().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

const actions = buildEntityActions({
  table: "open_roles",
  schema,
  slugField: "slug",
  listPath: "/admin/careers",
  editPath: (slug) => `/admin/careers/${slug}`,
  revalidate: (slug) => ["/about/careers", slug ? `/about/careers/${slug}` : "/about/careers"],
});

export const upsertRole = actions.upsert;
export const deleteRole = actions.remove;
export async function publishRole(id: string) { await actions.setStatus(id, "published"); }
export async function unpublishRole(id: string) { await actions.setStatus(id, "draft"); }
