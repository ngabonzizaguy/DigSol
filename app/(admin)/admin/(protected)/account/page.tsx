import { requireAdminProfile } from "@/lib/admin/auth";
import { AccountForm } from "@/components/admin/account/account-form";

export const metadata = { title: "My account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const profile = await requireAdminProfile();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">My account</h1>
        <p className="text-[13px] text-admin-fg-subtle">
          Update how you appear in the admin and across activity logs.
        </p>
      </header>

      <AccountForm
        initial={{
          email: profile.email,
          role: profile.role,
          name: profile.name,
          avatar_url: profile.avatar_url,
        }}
      />
    </div>
  );
}
