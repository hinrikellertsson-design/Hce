"use client";

import { useState } from "react";
import { useStaticContent } from "@/lib/StaticContentContext";
import { useCurrentBooking } from "@/hooks/useCurrentBooking";
import {
  addGuest,
  createBooking,
  deleteBooking,
  removeGuest,
  updateBooking,
  updateGuestRoom,
} from "@/lib/queries";
import { SetupNotice } from "@/components/SetupNotice";
import type { Booking } from "@/lib/database.types";

export default function AssignPage() {
  const { content, loading: contentLoading, configured } = useStaticContent();
  const {
    booking,
    bookings,
    guests,
    loading: bookingLoading,
    refresh,
    selectBooking,
  } = useCurrentBooking();

  const [groupName, setGroupName] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [nights, setNights] = useState(2);
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ groupName: "", arrivalDate: "", nights: 1 });
  const [savingEdit, setSavingEdit] = useState(false);

  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestRoom, setNewGuestRoom] = useState("");
  const [addingGuest, setAddingGuest] = useState(false);

  if (!configured) return <SetupNotice />;
  if (contentLoading || bookingLoading || !content) return <p className="text-[13px] text-ink-muted">Loading…</p>;

  async function submitNewBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim() || !arrivalDate) return;
    setCreating(true);
    try {
      const created = await createBooking({ groupName: groupName.trim(), arrivalDate, nights });
      setGroupName("");
      setArrivalDate("");
      setNights(2);
      selectBooking(created.id);
      await refresh();
    } finally {
      setCreating(false);
    }
  }

  function startEdit(b: Booking) {
    setEditingId(b.id);
    setEditDraft({ groupName: b.group_name, arrivalDate: b.arrival_date, nights: b.nights });
  }

  async function saveEdit(bookingId: string) {
    if (!editDraft.groupName.trim() || !editDraft.arrivalDate) return;
    setSavingEdit(true);
    try {
      await updateBooking(bookingId, {
        groupName: editDraft.groupName.trim(),
        arrivalDate: editDraft.arrivalDate,
        nights: editDraft.nights,
      });
      setEditingId(null);
      await refresh();
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(b: Booking) {
    const ok = window.confirm(
      `Delete "${b.group_name}"? This permanently removes its guests, checklist progress, handover notes, and laundry status. This can't be undone.`
    );
    if (!ok) return;
    await deleteBooking(b.id);
    if (booking?.id === b.id) selectBooking(null);
    await refresh();
  }

  async function submitNewGuest(e: React.FormEvent) {
    if (!booking) return;
    e.preventDefault();
    if (!newGuestName.trim()) return;
    setAddingGuest(true);
    try {
      await addGuest(booking.id, newGuestName.trim(), newGuestRoom || null, guests.length);
      setNewGuestName("");
      setNewGuestRoom("");
      await refresh();
    } finally {
      setAddingGuest(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-xl font-semibold">Guests &amp; Rooms</h1>
        <p className="text-[13px] text-ink-muted mt-1">
          Manage bookings and assign each guest to a room.
        </p>
      </div>

      <div className="border border-border bg-surface">
        <div className="px-4 py-2.5 border-b border-border">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Bookings</h2>
        </div>
        {bookings.length === 0 ? (
          <p className="text-[13px] text-ink-muted px-4 py-3">No bookings yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {bookings.map((b) => {
              const isSelected = booking?.id === b.id;
              const isEditing = editingId === b.id;
              return (
                <li key={b.id} className="px-4 py-2.5">
                  {isEditing ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        value={editDraft.groupName}
                        onChange={(e) => setEditDraft((d) => ({ ...d, groupName: e.target.value }))}
                        className="flex-1 min-w-[140px] rounded-[4px] border border-border bg-canvas px-2 py-1 text-[13px] outline-none focus:border-accent"
                      />
                      <input
                        type="date"
                        value={editDraft.arrivalDate}
                        onChange={(e) => setEditDraft((d) => ({ ...d, arrivalDate: e.target.value }))}
                        className="rounded-[4px] border border-border bg-canvas px-2 py-1 text-[13px] outline-none focus:border-accent"
                      />
                      <input
                        type="number"
                        min={1}
                        value={editDraft.nights}
                        onChange={(e) => setEditDraft((d) => ({ ...d, nights: Number(e.target.value) }))}
                        className="w-16 rounded-[4px] border border-border bg-canvas px-2 py-1 text-[13px] outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(b.id)}
                        disabled={savingEdit}
                        className="rounded-[4px] bg-ink text-canvas px-3 py-1 text-[12px] font-medium disabled:opacity-40"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-[12px] text-ink-muted px-2 py-1.5"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => selectBooking(b.id)}
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${isSelected ? "bg-accent" : "bg-border"}`}
                        aria-label={isSelected ? "Currently viewing" : `View ${b.group_name}`}
                      />
                      <button
                        type="button"
                        onClick={() => selectBooking(b.id)}
                        className="flex-1 min-w-[160px] text-left"
                      >
                        <span className={`text-[13px] ${isSelected ? "font-medium text-ink" : "text-ink"}`}>
                          {b.group_name}
                        </span>
                        <span className="text-[11px] text-ink-muted ml-2">
                          {new Date(b.arrival_date).toLocaleDateString()} · {b.nights} night
                          {b.nights === 1 ? "" : "s"} · {b.status}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(b)}
                        className="text-[12px] text-ink-muted hover:text-ink px-2 py-1.5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b)}
                        className="text-[12px] text-danger px-2 py-1.5"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <form onSubmit={submitNewBooking} className="flex flex-wrap items-end gap-2 px-4 py-3 border-t border-border">
          <label className="block text-[13px]">
            <span className="text-ink-muted text-[11px] block">Group name</span>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Anderson Family"
              required
              className="mt-0.5 w-full rounded-[4px] border border-border bg-canvas px-2.5 py-1.5 text-[13px] outline-none focus:border-accent"
            />
          </label>
          <label className="block text-[13px]">
            <span className="text-ink-muted text-[11px] block">Arrival date</span>
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              required
              className="mt-0.5 rounded-[4px] border border-border bg-canvas px-2.5 py-1.5 text-[13px] outline-none focus:border-accent"
            />
          </label>
          <label className="block text-[13px]">
            <span className="text-ink-muted text-[11px] block">Nights</span>
            <input
              type="number"
              min={1}
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
              required
              className="mt-0.5 w-20 rounded-[4px] border border-border bg-canvas px-2.5 py-1.5 text-[13px] outline-none focus:border-accent"
            />
          </label>
          <button
            type="submit"
            disabled={creating}
            className="rounded-[4px] bg-ink text-canvas px-3.5 py-1.5 text-[13px] font-medium disabled:opacity-40"
          >
            {creating ? "Creating…" : "New booking"}
          </button>
        </form>
      </div>

      {booking && (
        <div className="border border-border bg-surface">
          <div className="px-4 py-2.5 border-b border-border">
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              Guests — {booking.group_name}
            </h2>
          </div>

          <ul className="divide-y divide-border">
            {guests.map((guest) => (
              <li key={guest.id} className="flex items-center gap-2 px-4 py-2">
                <span className="flex-1 text-[13px]">{guest.name}</span>
                <select
                  value={guest.room_id ?? ""}
                  onChange={(e) => updateGuestRoom(guest.id, e.target.value || null).then(refresh)}
                  className="rounded-[4px] border border-border bg-canvas px-2 py-1 text-[13px] outline-none focus:border-accent"
                >
                  <option value="">Unassigned</option>
                  {content.rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeGuest(guest.id).then(refresh)}
                  className="text-[12px] text-danger px-2 py-1.5"
                  aria-label={`Remove ${guest.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
            {guests.length === 0 && <p className="text-[13px] text-ink-muted px-4 py-3">No guests added yet.</p>}
          </ul>

          <form onSubmit={submitNewGuest} className="flex flex-wrap gap-2 px-4 py-3 border-t border-border">
            <input
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              placeholder="Guest name"
              className="flex-1 min-w-[140px] rounded-[4px] border border-border bg-canvas px-3 py-1.5 text-[13px] outline-none focus:border-accent"
            />
            <select
              value={newGuestRoom}
              onChange={(e) => setNewGuestRoom(e.target.value)}
              className="rounded-[4px] border border-border bg-canvas px-2 py-1.5 text-[13px] outline-none focus:border-accent"
            >
              <option value="">Unassigned</option>
              {content.rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={addingGuest || !newGuestName.trim()}
              className="rounded-[4px] bg-ink text-canvas px-3.5 py-1.5 text-[13px] font-medium disabled:opacity-40"
            >
              Add guest
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-border border border-border">
        {content.rooms.map((room) => (
          <div key={room.id} className="bg-surface px-3 py-2.5 text-center">
            <p className="text-[13px] font-medium">{room.name}</p>
            <p className="text-[11px] text-ink-muted">{room.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
