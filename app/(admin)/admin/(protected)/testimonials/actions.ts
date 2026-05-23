"use server";
import { z } from "zod";
import { buildEntityActions } from "@/lib/admin/generic-actions";

const schema = z.object({
  quote: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  sort_order: z.number().int().default(0),
});

const actions = buildEntityActions({
  table: "testimonials",
  schema,
  numberFields: ["sort_order"],
  listPath: "/admin/testimonials",
  editPath: (slug) => `/admin/testimonials/${slug}`,
  revalidate: () => ["/", "/about"],
});

export const upsertTestimonial = actions.upsert;
export const deleteTestimonial = actions.remove;
export async function publishTestimonial(id: string) { await actions.setStatus(id, "published"); }
export async function unpublishTestimonial(id: string) { await actions.setStatus(id, "draft"); }
