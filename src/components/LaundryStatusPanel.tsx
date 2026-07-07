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
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="font-serif text-lg">Laundry</h2>
        <button
          type="button"
          onClick={toggleRunning}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            running ? "border-accent/50 bg-warning-soft text-warning" : "border-border text-ink-muted"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${running ? "bg-warning animate-pulse" : "bg-ink-muted/40"}`} />
          {running ? "Running" : "Not running"}
        </button>
      </div>
      <div className="space-y-2">
        <input
          value={whose}
          onChange={(e) => setWhose(e.target.value)}
          onBlur={saveDetails}
          placeholder="Whose laundry / which room"
          className="w-full rounded-full border border-border bg-canvas px-3.5 py-1.5 text-sm outline-none focus:border-accent"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={saveDetails}
          placeholder="Note (optional)"
          className="w-full rounded-full border border-border bg-canvas px-3.5 py-1.5 text-sm outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}
