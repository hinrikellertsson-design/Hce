"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { setupFirstAdmin, type SetupState } from "@/app/actions/setup";

const initialState: SetupState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Bý til aðgang..." : "Búa til stjórnandaaðgang"}
    </button>
  );
}

export function SetupForm() {
  const [state, formAction] = useActionState(setupFirstAdmin, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-white/60 p-6">
      {state.status === "error" && state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Netfangið þitt
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          placeholder="nafn@mk.is"
        />
        {state.fieldErrors?.email && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email}</p>}
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
          minLength={8}
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        <p className="mt-1 text-xs text-muted">Að minnsta kosti 8 stafir.</p>
        {state.fieldErrors?.password && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.password}</p>}
      </div>
      <div>
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-ink">
          Staðfesta lykilorð
        </label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          required
          minLength={8}
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        {state.fieldErrors?.passwordConfirm && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.passwordConfirm}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
