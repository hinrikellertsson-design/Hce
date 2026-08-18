import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function HomePage() {
  const session = await auth();
  if (session) {
    redirect(session.user.role === "TEACHER" ? "/kennari" : "/nemandi");
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Kennsluvefur — matreiðslubraut</h1>
        <p className="text-neutral-600 mt-1">
          Frumgerð: áfangar, verkefni, skilahólf og endurgjöf.
        </p>
      </div>
      <LoginForm />
      <div className="text-sm text-neutral-500 max-w-sm text-center border-t pt-4">
        <p className="font-medium mb-1">Prufuaðgangar (sýnigögn)</p>
        <p>Kennari: kennari@mk.is / kennari123</p>
        <p>Nemandi: nemandi1@mk.is / nemandi123</p>
      </div>
    </main>
  );
}
