import { AdminShell } from "@/components/admin/shell/admin-shell";
import { requireAdminProfile } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdminProfile();
  return <AdminShell user={profile}>{children}</AdminShell>;
}
