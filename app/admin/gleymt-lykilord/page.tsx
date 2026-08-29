import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Stjórnborð</p>
          <h1 className="font-display mt-2 text-2xl text-ink">Gleymt lykilorð</h1>
          <p className="mt-2 text-sm text-muted">
            Skráðu netfangið þitt og við sendum þér hlekk til að velja nýtt lykilorð.
          </p>
        </div>
        <ForgotPasswordForm />
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/admin/innskraning" className="text-gold-dark hover:underline">
            Til baka í innskráningu
          </Link>
        </p>
      </div>
    </main>
  );
}
