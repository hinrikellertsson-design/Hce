export function ProgressPill({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const done = total > 0 && completed === total;
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="h-1.5 w-16 rounded-full bg-surface-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${done ? "bg-success" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-medium tabular-nums ${done ? "text-success" : "text-ink-muted"}`}>
        {completed}/{total}
      </span>
    </div>
  );
}
