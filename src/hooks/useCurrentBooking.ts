"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { fetchAllBookings, fetchGuests } from "@/lib/queries";
import type { Booking, Guest } from "@/lib/database.types";

const STORAGE_KEY = "hlidin_selected_booking";

// Several bookings can exist at once (overlapping turnovers, planning ahead) — this
// picks a sensible default when nothing has been explicitly selected yet.
function pickDefault(bookings: Booking[]): Booking | null {
  return bookings.find((b) => b.status === "active") ?? bookings.find((b) => b.status === "upcoming") ?? bookings[0] ?? null;
}

export function useCurrentBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(window.localStorage.getItem(STORAGE_KEY));
  }, []);

  const refresh = useCallback(async () => {
    try {
      const all = await fetchAllBookings();
      setBookings(all);
      const current = all.find((b) => b.id === selectedId) ?? pickDefault(all);
      setGuests(current ? await fetchGuests(current.id) : []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    refresh();
    const supabase = getSupabase();
    if (!supabase) return;
    const channel = supabase
      .channel("bookings-and-guests")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "guests" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const booking = bookings.find((b) => b.id === selectedId) ?? pickDefault(bookings);

  const selectBooking = useCallback((id: string | null) => {
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
    setSelectedId(id);
  }, []);

  const occupiedRoomIds = Array.from(
    new Set(guests.map((g) => g.room_id).filter((id): id is string => Boolean(id)))
  );

  return { booking, bookings, guests, occupiedRoomIds, loading, error, refresh, selectBooking };
}
