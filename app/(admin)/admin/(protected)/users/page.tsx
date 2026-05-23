import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/ui/data-table";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { InviteForm } from "@/components/admin/users/invite-form";
import { RemoveUserButton } from "@/components/admin/users/remove-user-button";
import { UserRoleCell } from "@/components/admin/users/user-role-cell";
import type { UserRole } from "@/lib/supabase/types";

export const metadata = { title: "Users & roles" };
export const dynamic = "force-dynamic";

type Row = { id: string; email: string; name: string | null; role: UserRole; created_at: string };

export default async function UsersPage() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, name, role, created_at")
    .order("created_at", { ascending: false });
  const users = (data ?? []) as Row[];

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Users & roles</h1>
        <p className="text-[13px] text-admin-fg-subtle">Invite teammates and manage admin / editor / viewer access.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {users.length === 0 ? (
            <EmptyState title="Just you, for now" />
          ) : (
            <DataTable<Row>
              data={users}
              columns={[
                { key: "email", header: "Email", cell: (r) => <span className="font-mono text-[12px] text-admin-fg">{r.email}</span> },
                { key: "name", header: "Name", cell: (r) => <span className="text-admin-fg-muted">{r.name ?? "—"}</span> },
                { key: "role", header: "Role", width: "160px", cell: (r) => <UserRoleCell userId={r.id} role={r.role} /> },
                { key: "created", header: "Joined", align: "right", width: "120px", cell: (r) => <span className="text-[11px] text-admin-fg-subtle">{new Date(r.created_at).toLocaleDateString()}</span> },
                {
                  key: "actions",
                  header: "",
                  align: "right",
                  width: "120px",
                  cell: (r) => (
                    <RemoveUserButton userId={r.id} email={r.email} isSelf={r.id === currentUser?.id} />
                  ),
                },
              ]}
            />
          )}
        </div>

        <Card>
          <CardHeader><CardTitle>Invite teammate</CardTitle></CardHeader>
          <CardContent>
            <InviteForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
