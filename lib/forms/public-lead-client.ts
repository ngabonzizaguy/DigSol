import "server-only";

import { getServiceSupabase } from "@/lib/supabase/service";

/** Server-only Supabase client for public marketing form inserts (bypasses RLS). */
export function getPublicLeadClient() {
  return getServiceSupabase();
}

export function publicLeadErrorMessage(error: { message?: string } | null | undefined): string {
  const msg = error?.message ?? "";
  if (!msg) return "Could not save your request. Please try again.";
  if (/row-level security/i.test(msg)) {
    return "We could not save your request. Please try again or contact us by email.";
  }
  return msg;
}
