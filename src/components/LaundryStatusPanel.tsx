"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { fetchLaundryStatus, upsertLaundryStatus } from "@/lib/queries";
import type { LaundryStatus } from "@/lib/database.types";

export function LaundryStatusPanel({ bookingId, dayNumber }: { bookingId: string; dayNumber: number }) {
  const [status, setStatus] = useState<LaundryStatus | null>(null);
  const [whose, setWhose] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchLaundryStatus(bookingId, dayNumber);
    setStatus(data);
    setWhose(data?.whose ?? "");
    setNote(data?.note ?? "");
    setLoading(false);
  }, [bookingId, dayNumber]);

  useEffect(() => {
    refresh();
    const supabase = getSupabase();
    if (!supabase) return;
    const channel = supabase
      .channel(`laundry-${bookingId}-${dayNumber}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "laundry_status", filter: `booking_id=eq.${bookingId}` },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, dayNumber, refresh]);

  async function toggleRunning() {
    await upsertLaundryStatus({
      bookingId,
      dayNumber,
      isRunning: !(status?.is_running ?? false),
      whose: whose || null,
      note: note || null,
    });
    refresh();
  }

  async function saveDetails() {
    await upsertLaundryStatus({
      bookingId,
      dayNumber,
      isRunning: status?.is_running ?? false,
      whose: whose || null,
      note: note || null,
    });
    refresh();
  }

  if (loading) return null;
  const running = status?.is_running ?? false;

  return (
    <div className="border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Laundry</h2>
        <button
          type="button"
          onClick={toggleRunning}
          className="flex items-center gap-1.5 rounded-[4px] border border-border px-2 py-1 text-[11px] font-medium text-ink-muted hover:border-accent transition-colors"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${running ? "bg-warning" : "bg-border"}`} />
          {running ? "Running" : "Not running"}
        </button>
      </div>
      <div className="p-4 space-y-2">
        <input
          value={whose}
          onChange={(e) => setWhose(e.target.value)}
          onBlur={saveDetails}
          placeholder="Whose laundry / which room"
          className="w-full rounded-[4px] border border-border bg-canvas px-3 py-1.5 text-[13px] outline-none focus:border-accent"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={saveDetails}
          placeholder="Note (optional)"
          className="w-full rounded-[4px] border border-border bg-canvas px-3 py-1.5 text-[13px] outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}
