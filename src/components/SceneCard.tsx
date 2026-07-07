"use client";

import Link from "next/link";
import { ProgressPill } from "./ProgressPill";

export function SceneCard({
  href,
  name,
  subtitle,
  completed,
  total,
}: {
  href: string;
  name: string;
  subtitle?: string | null;
  completed: number;
  total: number;
}) {
  const done = total > 0 && completed === total;
  return (
    <Link
      href={href}
      className={`block rounded-2xl border px-4 py-3.5 transition-colors hover:border-accent ${
        done ? "border-success/30 bg-success-soft" : "border-border bg-surface"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-sm text-ink truncate">{name}</p>
          {subtitle && <p className="text-xs text-ink-muted truncate">{subtitle}</p>}
        </div>
        <ProgressPill completed={completed} total={total} />
      </div>
    </Link>
  );
}
