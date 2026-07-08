"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStaffName } from "@/hooks/useStaffName";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/assign", label: "Guests & Rooms" },
];

const PIN_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_STAFF_PIN);

function lock() {
  window.localStorage.removeItem("hlidin_pin_ok");
  window.location.reload();
}

function StaffNameControl({ className = "" }: { className?: string }) {
  const { name, setName } = useStaffName();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setName(draft.trim());
          setEditing(false);
        }}
        className={`flex items-center gap-1 ${className}`}
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
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(name);
        setEditing(true);
      }}
      className={`flex items-center gap-2 rounded-[4px] border border-border px-2 py-1.5 text-[13px] hover:border-accent transition-colors ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
      <span className="truncate">{name || "Set your name"}</span>
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-full flex flex-col sm:flex-row">
      <aside className="hidden sm:flex sm:w-56 sm:shrink-0 sm:h-screen sm:sticky sm:top-0 sm:flex-col border-r border-border bg-surface">
        <div className="px-4 py-3.5 border-b border-border">
          <p className="text-[13px] font-semibold tracking-tight leading-none">Hlíðin Lodge</p>
          <p className="text-[11px] text-ink-muted mt-1">Quality Manual</p>
        </div>

        <nav className="flex flex-col flex-1 px-2 py-3 gap-0.5">
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

        <div className="px-2 py-2.5 border-t border-border">
          <StaffNameControl className="w-full" />
          {PIN_CONFIGURED && (
            <button onClick={lock} className="w-full text-left text-[12px] text-ink-muted hover:text-ink px-2 py-1.5 mt-0.5">
              Lock
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex sm:hidden items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2">
          <StaffNameControl />
          {PIN_CONFIGURED && (
            <button onClick={lock} className="text-[12px] text-ink-muted px-2 py-1.5">
              Lock
            </button>
          )}
        </div>
        <nav className="flex sm:hidden border-b border-border bg-surface px-2 py-2 gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 text-center px-2.5 py-2.5 rounded-[4px] text-[13px] transition-colors ${
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
