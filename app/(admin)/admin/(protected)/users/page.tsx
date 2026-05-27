import { createClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/lib/admin/auth";
import { DataTable } from "@/components/admin/ui/data-table";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { InviteForm } from "@/components/admin/users/invite-form";
import { RemoveUserButton } from "@/components/admin/users/remove-user-button";
import { UserRoleCell } from "@/components/admin/users/user-role-cell";
import { UserPermissionsPanel } from "@/components/admin/users/user-permissions-panel";
import type { UserRole } from "@/lib/supabase/types";
import type { PermissionOverrides } from "@/lib/admin/permissions";

export const metadata = { title: "Users & roles" };
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  created_at: string;
  permissions: PermissionOverrides | null;
};

export default async function UsersPage() {
  const profile = await requireAdminProfile();
  const isAdmin = profile.role === "admin";

  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const { data } = isAdmin
    ? await supabase
        .from("profiles")
        .select("id, email, name, role, created_at, permissions")
        .order("created_at", { ascending: false })
    : await supabase
        .from("profiles")
        .select("id, email, name, role, created_at, permissions")
        .eq("id", currentUser?.id ?? "")
        .order("created_at", { ascending: false });

  const users = (data ?? []) as Row[];

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Users & roles</h1>
        <p className="text-[13px] text-admin-fg-subtle">
          Invite teammates, assign roles, and fine-tune what each person can access.
        </p>
      </header>

      {!isAdmin ? (
        <Card>
          <CardContent className="py-6 text-[13px] text-admin-fg-muted">
            Only admins can manage users. You can view your own profile below.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {users.length === 0 ? (
            <EmptyState title="No users yet" description="Invite your first teammate using the form." />
          ) : (
            <Card>
              <CardContent className="!p-0">
                <DataTable<Row>
                  data={users}
                  columns={[
                    {
                      key: "email",
                      header: "Email",
                      cell: (r) => <span className="font-mono text-[12px] text-admin-fg">{r.email}</span>,
                    },
                    {
                      key: "name",
                      header: "Name",
                      cell: (r) => <span className="text-admin-fg-muted">{r.name ?? "—"}</span>,
                    },
                    {
                      key: "role",
                      header: "Role",
                      width: "140px",
                      cell: (r) =>
                        isAdmin && r.id !== currentUser?.id ? (
                          <UserRoleCell userId={r.id} role={r.role} />
                        ) : (
                          <span className="capitalize text-[12px] text-admin-fg">{r.role}</span>
                        ),
                    },
                    {
                      key: "perms",
                      header: "Access",
                      width: "120px",
                      cell: (r) =>
                        isAdmin ? (
                          <UserPermissionsPanel
                            userId={r.id}
                            email={r.email}
                            role={r.role}
                            initialOverrides={r.permissions}
                          />
                        ) : (
                          <span className="text-[11px] text-admin-fg-subtle">—</span>
                        ),
                    },
                    {
                      key: "created",
                      header: "Joined",
                      align: "right",
                      width: "100px",
                      cell: (r) => (
                        <span className="text-[11px] text-admin-fg-subtle">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      ),
                    },
                    {
                      key: "actions",
                      header: "",
                      align: "right",
                      width: "80px",
                      cell: (r) =>
                        isAdmin ? (
                          <RemoveUserButton userId={r.id} email={r.email} isSelf={r.id === currentUser?.id} />
                        ) : null,
                    },
                  ]}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {isAdmin ? (
          <Card>
            <CardHeader>
              <CardTitle>Invite teammate</CardTitle>
            </CardHeader>
            <CardContent>
              <InviteForm />
              <div className="mt-4 space-y-2 rounded-lg border border-admin-border-soft bg-admin-elevated p-3 text-[12px] text-admin-fg-muted">
                <p>
                  <strong className="text-admin-fg">Admin</strong> — full access including users and settings.
                </p>
                <p>
                  <strong className="text-admin-fg">Editor</strong> — content, leads, media (no users/settings by default).
                </p>
                <p>
                  <strong className="text-admin-fg">Viewer</strong> — read-only leads and analytics.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
