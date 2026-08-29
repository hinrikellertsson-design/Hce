"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestPasswordReset, type ForgotPasswordState } from "@/app/actions/auth";

const initialState: ForgotPasswordState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Sendi..." : "Senda endurstillingarhlekk"}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-cream-muted p-6 text-center text-sm text-ink">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-white/60 p-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Netfang
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
