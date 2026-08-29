"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { resetPassword, type ResetPasswordState } from "@/app/actions/auth";

const initialState: ResetPasswordState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Vista..." : "Velja nýtt lykilorð"}
    </button>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const boundAction = resetPassword.bind(null, token);
  const [state, formAction] = useActionState(boundAction, initialState);

  if (state.status === "success") {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-gold/40 bg-cream-muted p-6 text-center text-sm text-ink">
          {state.message}
        </div>
        <Link
          href="/admin/innskraning"
          className="block w-full rounded-full bg-ink px-6 py-3 text-center text-sm font-medium text-cream hover:bg-gold-dark"
        >
          Fara í innskráningu
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-white/60 p-6">
      {state.status === "error" && state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Nýtt lykilorð
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink">
          Staðfesta lykilorð
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
