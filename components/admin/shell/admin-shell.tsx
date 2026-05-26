import { AdminSidebar } from "@/components/admin/shell/sidebar";
import { AdminTopbar } from "@/components/admin/shell/topbar";
import { CommandPalette } from "@/components/admin/shell/command-palette";
import { SidebarProvider } from "@/components/admin/shell/sidebar-context";
import { ThemeProvider } from "@/components/admin/theme-provider";
import type { AdminRole, PermissionOverrides } from "@/lib/admin/permissions";

export function AdminShell({
  user,
  integrationMode,
  children,
}: {
  user: {
    email: string;
    role: AdminRole;
    name?: string | null;
    permissions?: PermissionOverrides | null;
  } | null;
  integrationMode?: { aiMock?: boolean; emailMock?: boolean };
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <CommandPalette>
          <div className="flex min-h-screen w-full">
            <AdminSidebar role={user?.role} permissionOverrides={user?.permissions ?? null} />
            <div className="flex min-w-0 flex-1 flex-col">
              <AdminTopbar user={user} integrationMode={integrationMode} />
              <main className="flex-1 overflow-x-hidden px-3 py-4 md:px-6 md:py-6">{children}</main>
            </div>
          </div>
        </CommandPalette>
      </SidebarProvider>
    </ThemeProvider>
  );
}
