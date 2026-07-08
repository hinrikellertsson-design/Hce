export function ProgressPill({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const done = total > 0 && completed === total;
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="h-1 w-14 bg-surface-muted overflow-hidden">
        <div
          className={`h-full transition-all ${done ? "bg-success" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-[12px] tabular-nums ${done ? "text-success font-medium" : "text-ink-muted"}`}>
        {completed}/{total}
      </span>
    </div>
  );
}
