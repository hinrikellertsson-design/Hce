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
      <h2 className="text-sm font-semibold text-ink">{roomName}</h2>
      <button
        type="button"
        onClick={() => onChange(locked)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
          locked
            ? "border-warning/50 bg-warning-soft text-warning"
            : "border-success/50 bg-success-soft text-success"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${locked ? "bg-warning" : "bg-success"}`} />
        {locked ? "Guests in house" : "Free to clean"}
      </button>
    </div>
  );
}
