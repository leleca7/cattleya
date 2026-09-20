import { AdminSidebar } from "@/components/admin-sidebar";
import { requireAdminUser } from "@/lib/admin-auth";

export default async function SecureAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminUser();

  return (
    <div className="admin-shell">
      <AdminSidebar email={user.email} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
