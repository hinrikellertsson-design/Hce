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
      className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-surface-muted transition-colors"
    >
      <div className="min-w-0 flex items-center gap-2.5">
        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${done ? "bg-success" : "bg-border"}`} />
        <div className="min-w-0">
          <p className="text-[13px] text-ink truncate">{name}</p>
          {subtitle && <p className="text-[12px] text-ink-muted truncate">{subtitle}</p>}
        </div>
      </div>
      <ProgressPill completed={completed} total={total} />
    </Link>
  );
}
