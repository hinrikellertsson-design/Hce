"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAdmin, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Skrái inn..." : "Skrá inn"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-white/60 p-6">
      {state.status === "error" && state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
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
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Lykilorð
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
