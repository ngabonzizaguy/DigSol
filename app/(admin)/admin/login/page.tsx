import { LoginForm } from "@/components/admin/auth/login-form";

export const metadata = { title: "Admin sign in — DigSolutions" };

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  return (
    <div className="grid min-h-screen w-full place-items-center bg-admin-bg px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto grid size-10 place-items-center rounded-lg bg-admin-accent text-admin-accent-fg">
            <span className="font-display text-lg font-medium">D</span>
          </div>
          <h1 className="mt-4 text-[18px] font-semibold tracking-tight text-admin-fg">DigSolutions admin</h1>
          <p className="mt-1 text-[13px] text-admin-fg-subtle">Sign in with your work email</p>
        </div>
        <LoginForm searchParamsPromise={searchParams} />
      </div>
    </div>
  );
}
