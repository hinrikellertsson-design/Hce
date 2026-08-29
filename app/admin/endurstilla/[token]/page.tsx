import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Stjórnborð</p>
          <h1 className="font-display mt-2 text-2xl text-ink">Velja nýtt lykilorð</h1>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
