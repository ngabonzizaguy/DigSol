import { AdminShell } from "@/components/admin/shell/admin-shell";
import { requireAdminProfile } from "@/lib/admin/auth";
import { isAiMockMode } from "@/lib/ai";
import { isEmailMockMode } from "@/lib/email";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdminProfile();
  return (
    <AdminShell
      user={profile}
      integrationMode={{ aiMock: isAiMockMode(), emailMock: isEmailMockMode() }}
    >
      {children}
    </AdminShell>
  );
}
