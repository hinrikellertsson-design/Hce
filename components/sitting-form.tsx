"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { SittingFormState } from "@/app/actions/admin-sittings";

const initialState: SittingFormState = { status: "idle" };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream hover:bg-gold-dark disabled:opacity-50"
    >
      {pending ? "Vista..." : label}
    </button>
  );
}

export type SittingDefaults = {
  date?: string; // yyyy-MM-ddTHH:mm fyrir datetime-local
  mealType?: "LUNCH" | "DINNER";
  title?: string;
  menuDescription?: string;
  maxSeats?: number;
  pricePerSeat?: number;
  paymentReference?: string;
};

export function SittingForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prevState: SittingFormState, formData: FormData) => Promise<SittingFormState>;
  defaults?: SittingDefaults;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialState);

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
        <label htmlFor="title" className="block text-sm font-medium text-ink">
          Titill
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={defaults?.title}
          placeholder="T.d. Vorhátíðarkvöldverður"
          className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        {state.fieldErrors?.title && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.title}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-ink">
            Dagsetning og tími
          </label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            required
            defaultValue={defaults?.date}
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          />
          {state.fieldErrors?.date && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.date}</p>}
        </div>
        <div>
          <label htmlFor="mealType" className="block text-sm font-medium text-ink">
            Máltíð
          </label>
          <select
            id="mealType"
            name="mealType"
            defaultValue={defaults?.mealType ?? "DINNER"}
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          >
            <option value="LUNCH">Hádegisverður</option>
            <option value="DINNER">Kvöldverður</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="maxSeats" className="block text-sm font-medium text-ink">
            Hámarksfjöldi sæta
          </label>
          <input
            id="maxSeats"
            name="maxSeats"
            type="number"
            min={1}
            required
            defaultValue={defaults?.maxSeats}
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          />
          {state.fieldErrors?.maxSeats && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.maxSeats}</p>
          )}
        </div>
        <div>
          <label htmlFor="pricePerSeat" className="block text-sm font-medium text-ink">
            Verð á sæti (kr.)
          </label>
          <input
            id="pricePerSeat"
            name="pricePerSeat"
            type="number"
            min={0}
            required
            defaultValue={defaults?.pricePerSeat}
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          />
          {state.fieldErrors?.pricePerSeat && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.pricePerSeat}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="menuDescription" className="block text-sm font-medium text-ink">
          Lýsing / matseðill <span className="text-muted">(valfrjálst)</span>
        </label>
        <textarea
          id="menuDescription"
          name="menuDescription"
          rows={4}
          defaultValue={defaults?.menuDescription}
          className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>

      <div>
        <label htmlFor="paymentReference" className="block text-sm font-medium text-ink">
          Skýring við greiðslu <span className="text-muted">(valfrjálst)</span>
        </label>
        <input
          id="paymentReference"
          name="paymentReference"
          defaultValue={defaults?.paymentReference}
          placeholder="T.d. HÆ01"
          className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        <p className="mt-1 text-xs text-muted">
          Notaðu <code>{"{tilvísun}"}</code> í greiðslutextanum undir Stillingum svo þessi skýring birtist sjálfkrafa í greiðslupóstinum fyrir þessa æfingu.
        </p>
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
