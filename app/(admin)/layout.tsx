import "../globals.css";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // Admin uses its own font stack (mono accent) and dense scale.
  return (
    <div className="min-h-screen bg-admin-bg text-admin-fg font-sans antialiased [font-feature-settings:'cv11','ss01']">
      {children}
    </div>
  );
}
