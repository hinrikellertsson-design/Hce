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
    <div className="min-h-full flex flex-col sm:flex-row">
      <aside className="sm:w-56 sm:shrink-0 sm:h-screen sm:sticky sm:top-0 border-b sm:border-b-0 sm:border-r border-border bg-surface flex sm:flex-col">
        <div className="px-4 py-3.5 border-b border-border sm:block hidden">
          <p className="text-[13px] font-semibold tracking-tight leading-none">Hlíðin Lodge</p>
          <p className="text-[11px] text-ink-muted mt-1">Quality Manual</p>
        </div>

        <nav className="flex sm:flex-col flex-1 px-2 py-2 sm:py-3 gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2.5 py-1.5 text-[13px] rounded-[4px] transition-colors ${
                pathname === link.href
                  ? "bg-surface-muted text-ink font-medium"
                  : "text-ink-muted hover:text-ink hover:bg-surface-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:block px-2 py-2.5 border-t border-border">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setName(draft.trim());
                setEditing(false);
              }}
              className="flex items-center gap-1"
            >
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-[4px] border border-border bg-canvas px-2 py-1 text-[13px] outline-none focus:border-accent"
              />
              <button type="submit" className="text-[12px] text-accent font-medium shrink-0 px-1">
                Save
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setDraft(name);
                setEditing(true);
              }}
              className="flex w-full items-center gap-2 rounded-[4px] border border-border px-2 py-1.5 text-[13px] hover:border-accent transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
              <span className="truncate">{name || "Set your name"}</span>
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="flex sm:hidden border-b border-border bg-surface px-2 py-1.5 gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 text-center px-2.5 py-1.5 rounded-[4px] text-[13px] transition-colors ${
                pathname === link.href ? "bg-surface-muted text-ink font-medium" : "text-ink-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 w-full max-w-4xl px-4 sm:px-8 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
