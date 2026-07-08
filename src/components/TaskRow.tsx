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
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={completed}
        aria-label={label}
        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted active:bg-surface-muted ${
          locked ? "opacity-50" : ""
        }`}
      >
        <span
          className={`mt-0.5 h-4 w-4 shrink-0 rounded-[3px] border flex items-center justify-center transition-colors ${
            completed ? "bg-success border-success text-accent-ink" : "border-ink-muted/50"
          }`}
        >
          {completed && (
            <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
              <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className={`text-[13px] leading-snug ${completed ? "line-through text-ink-muted" : "text-ink"}`}>
              {label}
            </span>
            {roomName && (
              <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">{roomName}</span>
            )}
          </span>
          {note && <span className="block text-[12px] text-ink-muted mt-0.5">{note}</span>}
          {completed && completedBy && (
            <span className="block text-[11px] text-ink-muted mt-0.5">Done by {completedBy}</span>
          )}
        </span>
      </button>
    </li>
  );
}
