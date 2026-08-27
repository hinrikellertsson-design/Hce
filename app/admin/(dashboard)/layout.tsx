import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/innskraning");

  return (
    <div className="min-h-screen bg-cream-muted">
      <AdminNav email={session.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
