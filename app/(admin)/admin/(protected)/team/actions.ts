"use server";
import { z } from "zod";
import { buildEntityActions } from "@/lib/admin/generic-actions";

const schema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  avatar_url: z.string().url().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  sort_order: z.number().int().default(0),
});

const actions = buildEntityActions({
  table: "team_members",
  schema,
  numberFields: ["sort_order"],
  listPath: "/admin/team",
  editPath: (id) => `/admin/team/${id}`,
  revalidate: () => ["/about", "/about/leadership"],
});

export const upsertTeamMember = actions.upsert;
export const deleteTeamMember = actions.remove;
export async function publishTeamMember(id: string) { await actions.setStatus(id, "published"); }
export async function unpublishTeamMember(id: string) { await actions.setStatus(id, "draft"); }
