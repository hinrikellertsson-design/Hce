"use client";

export function TaskRow({
  label,
  note,
  roomName,
  locked,
  completed,
  completedBy,
  onToggle,
}: {
  label: string;
  note?: string | null;
  roomName?: string | null;
  locked?: boolean;
  completed: boolean;
  completedBy?: string | null;
  onToggle: () => void;
}) {
  return (
    <li
      className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
        completed ? "border-success/30 bg-success-soft" : "border-border bg-surface"
      } ${locked ? "opacity-60" : ""}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={completed}
        aria-label={completed ? "Mark as not done" : "Mark as done"}
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-md border flex items-center justify-center transition-colors ${
          completed ? "bg-success border-success text-accent-ink" : "border-ink-muted/50 hover:border-accent"
        }`}
      >
        {completed && (
          <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
            <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className={`text-sm leading-snug ${completed ? "line-through text-ink-muted" : "text-ink"}`}>
            {label}
          </span>
          {roomName && (
            <span className="text-[11px] font-medium uppercase tracking-wide text-accent">{roomName}</span>
          )}
        </div>
        {note && <p className="text-xs text-ink-muted mt-0.5">{note}</p>}
        {completed && completedBy && <p className="text-[11px] text-ink-muted mt-0.5">Done by {completedBy}</p>}
      </div>
    </li>
  );
}
