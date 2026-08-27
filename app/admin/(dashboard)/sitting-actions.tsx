"use client";

import { useTransition } from "react";
import { deleteSitting, toggleSittingStatus } from "@/app/actions/admin-sittings";

export function ToggleStatusButton({ sittingId, status }: { sittingId: string; status: "OPEN" | "CLOSED" }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => toggleSittingStatus(sittingId))}
      className="text-gold-dark hover:underline disabled:opacity-50"
    >
      {status === "OPEN" ? "Loka" : "Opna"}
    </button>
  );
}

export function DeleteSittingButton({ sittingId }: { sittingId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Eyða þessari æfingu og öllum bókunum tengdum henni?")) {
          startTransition(() => deleteSitting(sittingId));
        }
      }}
      className="text-red-700 hover:underline disabled:opacity-50"
    >
      Eyða
    </button>
  );
}
