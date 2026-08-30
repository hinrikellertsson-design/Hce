"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createBookingManually, type ManualBookingState } from "@/app/actions/admin-bookings";

const initialState: ManualBookingState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Skrái..." : "Skrá bókun"}
    </button>
  );
}

export function ManualBookingForm({ sittingId }: { sittingId: string }) {
  const boundAction = createBookingManually.bind(null, sittingId);
  const [state, formAction] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-5 rounded-2xl border border-line bg-white p-6">
      {state.status === "error" && state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      {state.status === "success" && state.message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="mb-name" className="block text-sm font-medium text-ink">
          Nafn
        </label>
        <input
          id="mb-name"
          name="name"
          required
          className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        {state.fieldErrors?.name && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="mb-email" className="block text-sm font-medium text-ink">
            Netfang
          </label>
          <input
            id="mb-email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          />
          {state.fieldErrors?.email && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="mb-phone" className="block text-sm font-medium text-ink">
            Sími
          </label>
          <input
            id="mb-phone"
            name="phone"
            required
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          />
          {state.fieldErrors?.phone && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="mb-partySize" className="block text-sm font-medium text-ink">
          Fjöldi gesta
        </label>
        <input
          id="mb-partySize"
          name="partySize"
          type="number"
          min={1}
          defaultValue={2}
          required
          className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        {state.fieldErrors?.partySize && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.partySize}</p>
        )}
      </div>

      <div>
        <label htmlFor="mb-notes" className="block text-sm font-medium text-ink">
          Athugasemd <span className="text-muted">(valfrjálst)</span>
        </label>
        <textarea
          id="mb-notes"
          name="notes"
          rows={2}
          className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>

      <div className="flex items-center gap-2.5">
        <input
          id="mb-sendConfirmation"
          name="sendConfirmation"
          type="checkbox"
          defaultChecked
          className="h-4 w-4 rounded border-line text-gold focus:ring-gold"
        />
        <label htmlFor="mb-sendConfirmation" className="text-sm text-muted">
          Senda staðfestingarpóst á gestinn
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}
