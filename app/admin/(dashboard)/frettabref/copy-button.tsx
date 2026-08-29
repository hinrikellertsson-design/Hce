"use client";

import { useState } from "react";

export function CopyEmailsButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ekkert klipiborð tiltækt (t.d. óöruggt samhengi) — hunsum þögult.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={emails.length === 0}
      className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      {copied ? "Afritað!" : "Afrita öll netföng"}
    </button>
  );
}
