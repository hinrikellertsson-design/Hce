"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addNewsletterSubscriber, type AddSubscriberState } from "@/app/actions/admin-newsletter";

const initialState: AddSubscriberState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Bæti við..." : "Bæta við"}
    </button>
  );
}

export function AddSubscriberForm() {
  const [state, formAction] = useActionState(addNewsletterSubscriber, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="sub-name" className="block text-xs text-muted">
          Nafn <span className="text-muted">(valfrjálst)</span>
        </label>
        <input
          id="sub-name"
          name="name"
          className="mt-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-gold"
        />
      </div>
      <div>
        <label htmlFor="sub-email" className="block text-xs text-muted">
          Netfang
        </label>
        <input
          id="sub-email"
          name="email"
          type="email"
          required
          className="mt-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-gold"
        />
      </div>
      <SubmitButton />
      {state.status === "error" && state.message && <p className="text-sm text-red-600">{state.message}</p>}
      {state.status === "success" && state.message && <p className="text-sm text-green-700">{state.message}</p>}
    </form>
  );
}
