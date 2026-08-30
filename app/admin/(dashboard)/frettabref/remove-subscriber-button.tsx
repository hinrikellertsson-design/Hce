"use client";

import { useTransition } from "react";
import { removeNewsletterSubscriber } from "@/app/actions/admin-newsletter";

export function RemoveSubscriberButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Fjarlægja af póstlista?")) {
          startTransition(() => removeNewsletterSubscriber(id));
        }
      }}
      className="text-red-700 hover:underline disabled:opacity-50"
    >
      Fjarlægja
    </button>
  );
}
