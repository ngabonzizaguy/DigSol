import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminProfile = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "editor" | "viewer";
  avatar_url: string | null;
};

export async function requireAdminProfile(): Promise<AdminProfile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, name, role, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    redirect("/admin/login?error=unauthorized");
  }
  return profile as AdminProfile;
}

export async function getAdminProfileOrNull(): Promise<AdminProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, email, name, role, avatar_url")
    .eq("id", user.id)
    .maybeSingle();
  return (data as AdminProfile | null) ?? null;
}
