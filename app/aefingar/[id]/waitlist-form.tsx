"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinWaitlist, type JoinWaitlistState } from "@/app/actions/waitlist";

const initialState: JoinWaitlistState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Sendi..." : "Skrá mig á biðlista"}
    </button>
  );
}

export function WaitlistForm({ sittingId }: { sittingId: string }) {
  const [state, formAction] = useActionState(joinWaitlist, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-cream-muted p-6">
        <p className="font-display text-lg text-ink">Þú ert á biðlistanum</p>
        <p className="mt-2 text-sm text-muted">
          Ef sæti losnar á þessa æfingu höfum við samband við þig í tölvupósti.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-white/60 p-6">
      <input type="hidden" name="sittingId" value={sittingId} />

      <div className="rounded-lg border border-gold/40 bg-cream-muted px-4 py-3 text-sm text-ink">
        Þessi æfing er fullbókuð. Skráðu þig á biðlista og við höfum samband ef sæti losnar.
      </div>

      {/* Falin gildra fyrir vélmenni — venjulegir gestir sjá þennan reit aldrei */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <label htmlFor="wl-website">Ekki fylla út þennan reit</label>
        <input id="wl-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="wl-name" className="block text-sm font-medium text-ink">
          Nafn
        </label>
        <input
          id="wl-name"
          name="name"
          required
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          placeholder="Fullt nafn"
        />
        {state.fieldErrors?.name && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-email" className="block text-sm font-medium text-ink">
            Netfang
          </label>
          <input
            id="wl-email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
            placeholder="nafn@netfang.is"
          />
          {state.fieldErrors?.email && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="wl-phone" className="block text-sm font-medium text-ink">
            Sími
          </label>
          <input
            id="wl-phone"
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
        <label htmlFor="wl-partySize" className="block text-sm font-medium text-ink">
          Fjöldi gesta
        </label>
        <input
          id="wl-partySize"
          name="partySize"
          type="number"
          min={1}
          defaultValue={2}
          required
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        {state.fieldErrors?.partySize && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.partySize}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
