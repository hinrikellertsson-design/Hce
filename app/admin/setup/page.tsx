import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SetupForm } from "./setup-form";

export const dynamic = "force-dynamic";

export default async function AdminSetupPage() {
  const existingCount = await prisma.adminUser.count();
  if (existingCount > 0) {
    redirect("/admin/innskraning");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Fyrsta uppsetning</p>
          <h1 className="font-display mt-2 text-2xl text-ink">Velkomin í MK Bókanir</h1>
          <p className="mt-3 text-sm text-muted">
            Búðu til aðgang stjórnanda til að byrja. Þetta eyðublað virkar
            aðeins þar til fyrsti aðgangurinn hefur verið stofnaður.
          </p>
        </div>
        <SetupForm />
      </div>
    </main>
  );
}
