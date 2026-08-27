"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cancelBookingByToken, type CancelBookingState } from "@/app/actions/bookings";

const initialState: CancelBookingState = { status: "idle" };

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-red-800 disabled:opacity-50"
    >
      {pending ? "Afbóka..." : "Staðfesta afbókun"}
    </button>
  );
}

export function CancelForm({ cancelToken }: { cancelToken: string }) {
  const [state, formAction] = useActionState(cancelBookingByToken, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-cream-muted p-6">
        <p className="font-display text-lg text-ink">Bókun afbókuð</p>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="cancelToken" value={cancelToken} />
      {state.status === "error" && state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      <ConfirmButton />
    </form>
  );
}
