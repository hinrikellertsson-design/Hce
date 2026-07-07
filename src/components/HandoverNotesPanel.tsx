"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { addHandoverNote, fetchHandoverNotes } from "@/lib/queries";
import type { HandoverNote } from "@/lib/database.types";
import { useStaffName } from "@/hooks/useStaffName";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString();
}

export function HandoverNotesPanel({ bookingId, dayNumber }: { bookingId: string; dayNumber: number | null }) {
  const { name } = useStaffName();
  const [notes, setNotes] = useState<HandoverNote[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setNotes(await fetchHandoverNotes(bookingId));
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    refresh();
    const supabase = getSupabase();
    if (!supabase) return;
    const channel = supabase
      .channel(`handover-${bookingId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "handover_notes", filter: `booking_id=eq.${bookingId}` },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, refresh]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await addHandoverNote(bookingId, dayNumber, name || "Staff", message.trim());
      setMessage("");
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-border bg-surface">
      <div className="px-4 py-2.5 border-b border-border">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Handover Notes</h2>
      </div>
      <div className="p-4">
        <form onSubmit={submit} className="flex gap-2 mb-4">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a note for the next shift…"
            className="flex-1 rounded-[4px] border border-border bg-canvas px-3 py-1.5 text-[13px] outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={submitting || !message.trim()}
            className="rounded-[4px] bg-ink text-canvas px-3.5 py-1.5 text-[13px] font-medium disabled:opacity-40"
          >
            Post
          </button>
        </form>
        {loading ? (
          <p className="text-[13px] text-ink-muted">Loading…</p>
        ) : notes.length === 0 ? (
          <p className="text-[13px] text-ink-muted">No notes yet.</p>
        ) : (
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {notes.map((note) => (
              <li key={note.id} className="text-[13px]">
                <p className="text-ink">{note.message}</p>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  {note.author} · {timeAgo(note.created_at)}
                  {note.day_number ? ` · Day ${note.day_number}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
