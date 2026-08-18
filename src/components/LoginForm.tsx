"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

export function LoginForm() {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Netfang
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border border-neutral-300 rounded-md px-3 py-2 bg-white"
          placeholder="nafn@mk.is"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Lykilorð
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="border border-neutral-300 rounded-md px-3 py-2 bg-white"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-neutral-900 text-white rounded-md px-4 py-2 font-medium disabled:opacity-50"
      >
        {pending ? "Skrái inn..." : "Skrá inn"}
      </button>
    </form>
  );
}
