"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { fetchCurrentBooking, fetchGuests } from "@/lib/queries";
import type { Booking, Guest } from "@/lib/database.types";

export function useCurrentBooking() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const b = await fetchCurrentBooking();
      setBooking(b);
      setGuests(b ? await fetchGuests(b.id) : []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const occupiedRoomIds = Array.from(
    new Set(guests.map((g) => g.room_id).filter((id): id is string => Boolean(id)))
  );

  return { booking, guests, occupiedRoomIds, loading, error, refresh };
}
