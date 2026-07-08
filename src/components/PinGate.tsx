"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hlidin_pin_ok";
const STAFF_PIN = process.env.NEXT_PUBLIC_STAFF_PIN;

// Lightweight shared-PIN speed bump, not real access control — see README
// "Security note". Skipped entirely if NEXT_PUBLIC_STAFF_PIN isn't set.
export function PinGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(!STAFF_PIN);
  const [unlocked, setUnlocked] = useState(!STAFF_PIN);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!STAFF_PIN) return;
    setUnlocked(window.localStorage.getItem(STORAGE_KEY) === STAFF_PIN);
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input === STAFF_PIN) {
              window.localStorage.setItem(STORAGE_KEY, input);
              setUnlocked(true);
            } else {
              setError(true);
            }
          }}
          className="w-full max-w-xs border border-border bg-surface p-5"
        >
          <p className="text-[13px] font-semibold">Hlíðin Lodge</p>
          <p className="text-[11px] text-ink-muted mt-0.5 mb-4">Enter the staff PIN to continue</p>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="PIN"
            className={`w-full rounded-[4px] border px-3 py-2 text-[14px] outline-none ${
              error ? "border-danger" : "border-border focus:border-accent"
            }`}
          />
          {error && <p className="text-[11px] text-danger mt-1.5">Incorrect PIN</p>}
          <button
            type="submit"
            className="mt-3 w-full rounded-[4px] bg-ink text-canvas px-3 py-2 text-[13px] font-medium"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
