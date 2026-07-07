"use client";

import { useState } from "react";
import { useStaticContent } from "@/lib/StaticContentContext";
import { useCurrentBooking } from "@/hooks/useCurrentBooking";
import { addGuest, createBooking, removeGuest, updateGuestRoom } from "@/lib/queries";
import { SetupNotice } from "@/components/SetupNotice";

export default function AssignPage() {
  const { content, loading: contentLoading, configured } = useStaticContent();
  const { booking, guests, loading: bookingLoading, refresh } = useCurrentBooking();

  const [groupName, setGroupName] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [nights, setNights] = useState(2);
  const [creating, setCreating] = useState(false);

  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestRoom, setNewGuestRoom] = useState("");
  const [addingGuest, setAddingGuest] = useState(false);

  if (!configured) return <SetupNotice />;
  if (contentLoading || bookingLoading || !content) return <p className="text-sm text-ink-muted">Loading…</p>;

  const canCreateNew = !booking || booking.status === "departed";

  async function submitNewBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim() || !arrivalDate) return;
    setCreating(true);
    try {
      await createBooking({ groupName: groupName.trim(), arrivalDate, nights });
      setGroupName("");
      setArrivalDate("");
      setNights(2);
      await refresh();
    } finally {
      setCreating(false);
    }
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
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl">Guests &amp; Rooms</h1>
        <p className="text-sm text-ink-muted mt-1">Set up the current booking and assign each guest to a room.</p>
      </div>

      {canCreateNew && (
        <form onSubmit={submitNewBooking} className="rounded-2xl border border-border bg-surface p-5 space-y-3">
          <h2 className="font-serif text-lg">{booking ? "Set up next booking" : "New booking"}</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="block text-sm">
              <span className="text-ink-muted text-xs">Group name</span>
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Anderson Family"
                required
                className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink-muted text-xs">Arrival date</span>
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink-muted text-xs">Nights</span>
              <input
                type="number"
                min={1}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                required
                className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="rounded-full bg-ink text-canvas px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            {creating ? "Creating…" : "Create booking"}
          </button>
        </form>
      )}

      {booking && booking.status !== "departed" && (
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <div>
            <h2 className="font-serif text-lg">{booking.group_name}</h2>
            <p className="text-xs text-ink-muted">
              {new Date(booking.arrival_date).toLocaleDateString()} · {booking.nights} night
              {booking.nights === 1 ? "" : "s"} · {booking.status}
            </p>
          </div>

          <ul className="space-y-2">
            {guests.map((guest) => (
              <li key={guest.id} className="flex items-center gap-2">
                <span className="flex-1 text-sm">{guest.name}</span>
                <select
                  value={guest.room_id ?? ""}
                  onChange={(e) => updateGuestRoom(guest.id, e.target.value || null).then(refresh)}
                  className="rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-sm outline-none focus:border-accent"
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
                  className="text-xs text-danger px-2"
                  aria-label={`Remove ${guest.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
            {guests.length === 0 && <p className="text-sm text-ink-muted">No guests added yet.</p>}
          </ul>

          <form onSubmit={submitNewGuest} className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <input
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              placeholder="Guest name"
              className="flex-1 min-w-[140px] rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <select
              value={newGuestRoom}
              onChange={(e) => setNewGuestRoom(e.target.value)}
              className="rounded-lg border border-border bg-canvas px-2.5 py-2 text-sm outline-none focus:border-accent"
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
              className="rounded-full bg-ink text-canvas px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              Add guest
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {content.rooms.map((room) => (
          <div key={room.id} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-center">
            <p className="text-sm font-medium">{room.name}</p>
            <p className="text-xs text-ink-muted">{room.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
