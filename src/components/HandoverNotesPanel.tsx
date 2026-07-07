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
    <div className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="font-serif text-lg mb-3">Handover Notes</h2>
      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Leave a note for the next shift…"
          className="flex-1 rounded-full border border-border bg-canvas px-3.5 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={submitting || !message.trim()}
          className="rounded-full bg-ink text-canvas px-4 py-2 text-sm font-medium disabled:opacity-40"
        >
          Post
        </button>
      </form>
      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : notes.length === 0 ? (
        <p className="text-sm text-ink-muted">No notes yet.</p>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {notes.map((note) => (
            <li key={note.id} className="text-sm">
              <p className="text-ink">{note.message}</p>
              <p className="text-xs text-ink-muted mt-0.5">
                {note.author} · {timeAgo(note.created_at)}
                {note.day_number ? ` · Day ${note.day_number}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
