import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Stjórnborð</p>
          <h1 className="font-display mt-2 text-2xl text-ink">MK Bókanir</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
