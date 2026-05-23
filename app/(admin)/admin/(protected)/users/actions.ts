"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";

const roleSchema = z.enum(["admin", "editor", "viewer"]);

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (data?.role !== "admin") throw new Error("Admin role required");
  return user;
}

export async function updateUserRole(userId: string, role: z.infer<typeof roleSchema>) {
  await requireAdmin();
  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) throw new Error("Invalid role");
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role: parsed.data }).eq("id", userId);
  if (error) throw new Error(error.message);
  await logActivity({ entity: "profiles", entity_id: userId, action: `role:${parsed.data}` });
  revalidatePath("/admin/users");
}

export type InviteResult = { ok: true; email: string } | { ok: false; error: string };

export async function inviteUser(_prev: InviteResult | null, formData: FormData): Promise<InviteResult> {
  try {
    await requireAdmin();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const role = (formData.get("role") as string) || "viewer";
    if (!email || !email.includes("@")) return { ok: false, error: "Valid email required" };

    const service = await createServiceClient();
    // Generates an invite link the user can click to set their password and sign in.
    const { data, error } = await service.auth.admin.inviteUserByEmail(email, {
      data: { invited_role: role },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/login`,
    });
    if (error) return { ok: false, error: error.message };

    // Ensure profile row exists + assign role
    if (data.user?.id) {
      await service.from("profiles").upsert({
        id: data.user.id,
        email,
        role: role as "admin" | "editor" | "viewer",
      });
    }
    await logActivity({ entity: "profiles", entity_id: data.user?.id ?? null, action: `invite:${role}` });
    revalidatePath("/admin/users");
    return { ok: true, email };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to invite" };
  }
}

export async function removeUser(userId: string) {
  const me = await requireAdmin();
  if (me.id === userId) throw new Error("You cannot remove your own account");

  const service = await createServiceClient();
  const { data: target, error: fetchError } = await service
    .from("profiles")
    .select("id, email, role")
    .eq("id", userId)
    .maybeSingle();
  if (fetchError) throw new Error(fetchError.message);
  if (!target) throw new Error("User not found");

  if (target.role === "admin") {
    const { count, error: countError } = await service
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countError) throw new Error(countError.message);
    if ((count ?? 0) <= 1) throw new Error("Cannot remove the last admin");
  }

  const { error } = await service.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);

  await logActivity({
    entity: "profiles",
    entity_id: userId,
    action: "remove",
    diff: { email: target.email, role: target.role },
  });
  revalidatePath("/admin/users");
}
