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
  if (contentLoading || bookingLoading || !content) return <p className="text-[13px] text-ink-muted">Loading…</p>;

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
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-xl font-semibold">Guests &amp; Rooms</h1>
        <p className="text-[13px] text-ink-muted mt-1">Set up the current booking and assign each guest to a room.</p>
      </div>

      {canCreateNew && (
        <form onSubmit={submitNewBooking} className="border border-border bg-surface">
          <div className="px-4 py-2.5 border-b border-border">
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              {booking ? "Set up next booking" : "New booking"}
            </h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <label className="block text-[13px]">
                <span className="text-ink-muted text-[11px]">Group name</span>
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Anderson Family"
                  required
                  className="mt-1 w-full rounded-[4px] border border-border bg-canvas px-3 py-1.5 text-[13px] outline-none focus:border-accent"
                />
              </label>
              <label className="block text-[13px]">
                <span className="text-ink-muted text-[11px]">Arrival date</span>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  required
                  className="mt-1 w-full rounded-[4px] border border-border bg-canvas px-3 py-1.5 text-[13px] outline-none focus:border-accent"
                />
              </label>
              <label className="block text-[13px]">
                <span className="text-ink-muted text-[11px]">Nights</span>
                <input
                  type="number"
                  min={1}
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  required
                  className="mt-1 w-full rounded-[4px] border border-border bg-canvas px-3 py-1.5 text-[13px] outline-none focus:border-accent"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="rounded-[4px] bg-ink text-canvas px-3.5 py-1.5 text-[13px] font-medium disabled:opacity-40"
            >
              {creating ? "Creating…" : "Create booking"}
            </button>
          </div>
        </form>
      )}

      {booking && booking.status !== "departed" && (
        <div className="border border-border bg-surface">
          <div className="px-4 py-2.5 border-b border-border">
            <h2 className="text-[13px] font-medium">{booking.group_name}</h2>
            <p className="text-[11px] text-ink-muted">
              {new Date(booking.arrival_date).toLocaleDateString()} · {booking.nights} night
              {booking.nights === 1 ? "" : "s"} · {booking.status}
            </p>
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
                  className="text-[12px] text-danger px-2"
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
