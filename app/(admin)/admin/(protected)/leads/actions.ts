"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";

const statusSchema = z.enum(["new", "contacted", "qualified", "won", "lost"]);

export async function updateLeadStatus(id: string, status: z.infer<typeof statusSchema>) {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) throw new Error("Invalid status");
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status: parsed.data }).eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ entity: "leads", entity_id: id, action: `status:${parsed.data}` });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function updateLeadNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ notes }).eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ entity: "leads", entity_id: id, action: "notes" });
  revalidatePath(`/admin/leads/${id}`);
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ entity: "leads", entity_id: id, action: "delete" });
  revalidatePath("/admin/leads");
}
