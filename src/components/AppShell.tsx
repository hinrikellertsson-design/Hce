"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStaffName } from "@/hooks/useStaffName";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/assign", label: "Guests & Rooms" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { name, setName } = useStaffName();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="font-serif text-lg sm:text-xl tracking-tight leading-none">Hlíðin Lodge</p>
            <p className="text-xs text-ink-muted tracking-wide uppercase mt-0.5">Quality Manual</p>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  pathname === link.href
                    ? "bg-ink text-canvas"
                    : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {editing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setName(draft.trim());
                  setEditing(false);
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Your name"
                  className="w-28 sm:w-36 rounded-full border border-border bg-surface px-3 py-1 text-sm outline-none focus:border-accent"
                />
                <button type="submit" className="text-sm text-accent font-medium">
                  Save
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  setDraft(name);
                  setEditing(true);
                }}
                className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm hover:border-accent transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {name || "Set your name"}
              </button>
            )}
          </div>
        </div>
        <nav className="flex sm:hidden gap-1 px-4 pb-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 text-center px-3 py-1.5 rounded-full text-sm transition-colors ${
                pathname === link.href ? "bg-ink text-canvas" : "text-ink-muted hover:bg-surface-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
}
