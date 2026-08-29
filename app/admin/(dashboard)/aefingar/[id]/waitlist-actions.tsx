"use client";

import { useTransition } from "react";
import { notifyWaitlistEntry, removeWaitlistEntry } from "@/app/actions/admin-waitlist";

export function NotifyWaitlistButton({ entryId }: { entryId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => notifyWaitlistEntry(entryId))}
      className="text-gold-dark hover:underline disabled:opacity-50"
    >
      Senda tilkynningu
    </button>
  );
}

export function RemoveWaitlistButton({ entryId }: { entryId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Fjarlægja af biðlista?")) {
          startTransition(() => removeWaitlistEntry(entryId));
        }
      }}
      className="text-red-700 hover:underline disabled:opacity-50"
    >
      Fjarlægja
    </button>
  );
}
