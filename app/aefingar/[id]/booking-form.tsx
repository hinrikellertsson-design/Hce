"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createBooking, type CreateBookingState } from "@/app/actions/bookings";

const initialState: CreateBookingState = { status: "idle" };

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Sendi bókun..." : "Staðfesta bókun"}
    </button>
  );
}

export function BookingForm({ sittingId, available }: { sittingId: string; available: number }) {
  const [state, formAction] = useActionState(createBooking, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-cream-muted p-6">
        <p className="font-display text-lg text-ink">Bókun móttekin</p>
        <p className="mt-2 text-sm text-muted">
          Við höfum sent staðfestingu á netfangið sem þú skráðir. Um það bil
          viku fyrir viðburðinn sendum við þér greiðsluupplýsingar.
        </p>
        {state.cancelToken && (
          <p className="mt-4 text-xs text-muted">
            Þarftu að afbóka síðar? Notaðu hlekkinn í tölvupóstinum sem þú
            fékkst.
          </p>
        )}
      </div>
    );
  }

  if (available <= 0) {
    return (
      <div className="rounded-2xl border border-line bg-cream-muted p-6 text-center text-muted">
        Því miður er þessi æfing fullbókuð.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-white/60 p-6">
      <input type="hidden" name="sittingId" value={sittingId} />

      {state.status === "error" && state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink">
          Nafn
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          placeholder="Fullt nafn"
        />
        {state.fieldErrors?.name && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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
            placeholder="nafn@netfang.is"
          />
          {state.fieldErrors?.email && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink">
            Sími
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
            placeholder="6XX XXXX"
          />
          {state.fieldErrors?.phone && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="partySize" className="block text-sm font-medium text-ink">
          Fjöldi gesta
        </label>
        <input
          id="partySize"
          name="partySize"
          type="number"
          min={1}
          max={available}
          defaultValue={2}
          required
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        <p className="mt-1 text-xs text-muted">{available} sæti laus á þessa æfingu.</p>
        {state.fieldErrors?.partySize && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.partySize}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-ink">
          Athugasemd <span className="text-muted">(valfrjálst)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          placeholder="T.d. ofnæmi eða sérþarfir"
        />
      </div>

      <SubmitButton disabled={available <= 0} />
    </form>
  );
}
