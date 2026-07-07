"use client";

export function RoomStatusToggle({
  roomName,
  locked,
  onChange,
}: {
  roomName: string;
  locked: boolean;
  onChange: (freeToClean: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-[13px] font-medium text-ink">{roomName}</h2>
      <button
        type="button"
        onClick={() => onChange(locked)}
        className="flex items-center gap-1.5 rounded-[4px] border border-border px-2 py-1 text-[11px] font-medium text-ink-muted hover:border-accent transition-colors"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${locked ? "bg-warning" : "bg-success"}`} />
        {locked ? "Guests in house" : "Free to clean"}
      </button>
    </div>
  );
}
