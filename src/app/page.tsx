"use client";

import Link from "next/link";
import { useStaticContent } from "@/lib/StaticContentContext";
import { useCurrentBooking } from "@/hooks/useCurrentBooking";
import { useScenesData } from "@/hooks/useScenesData";
import { advanceBookingDay, setBookingStatus, setRoomDayStatus } from "@/lib/queries";
import { SetupNotice } from "@/components/SetupNotice";
import { SceneCard } from "@/components/SceneCard";
import { RoomStatusToggle } from "@/components/RoomStatusToggle";
import { HandoverNotesPanel } from "@/components/HandoverNotesPanel";
import { LaundryStatusPanel } from "@/components/LaundryStatusPanel";
import type { BookingStatus } from "@/lib/database.types";

const PHASE_SCENES: Record<BookingStatus, number[]> = {
  upcoming: [1, 2, 3],
  active: [4, 5, 6, 7],
  departed: [0],
};

export default function DashboardPage() {
  const { content, loading: contentLoading, configured } = useStaticContent();
  const { booking, guests, occupiedRoomIds, loading: bookingLoading, refresh: refreshBooking } = useCurrentBooking();

  const sceneIds = booking ? PHASE_SCENES[booking.status] : [];
  const dayNumber = booking && booking.status === "active" ? booking.current_day : null;
  const { views, loading: dataLoading, refresh: refreshScenes } = useScenesData({
    content,
    bookingId: booking?.id ?? null,
    dayNumber,
    sceneIds,
    occupiedRoomIds,
  });

  if (!configured) return <SetupNotice />;
  if (contentLoading || bookingLoading) return <p className="text-[13px] text-ink-muted">Loading…</p>;

  if (!booking) {
    return (
      <div className="border border-border bg-surface p-8 text-center">
        <h1 className="text-lg font-semibold mb-1">No booking yet</h1>
        <p className="text-[13px] text-ink-muted mb-4">Create a booking and assign guests to rooms to get started.</p>
        <Link href="/assign" className="inline-block rounded-[4px] bg-ink text-canvas px-4 py-1.5 text-[13px] font-medium">
          Set up a booking
        </Link>
      </div>
    );
  }

  const totalOutstanding = sceneIds.reduce((sum, id) => {
    const v = views.get(id);
    return sum + (v ? v.totalCount - v.completedCount : 0);
  }, 0);

  async function startStay() {
    if (!booking) return;
    await setBookingStatus(booking.id, "active");
    refreshBooking();
  }

  async function advanceDay() {
    if (!booking) return;
    await advanceBookingDay(booking, occupiedRoomIds);
    refreshBooking();
  }

  async function markDeparted() {
    if (!booking) return;
    await setBookingStatus(booking.id, "departed");
    refreshBooking();
  }

  const roomSections = booking.status === "active" ? (views.get(5)?.sections.filter((s) => s.roomId) ?? []) : [];

  return (
    <div className="space-y-6">
      <div className="border border-border bg-surface px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              {booking.status === "upcoming" && "Upcoming booking"}
              {booking.status === "active" && `Day ${booking.current_day} of ${booking.nights}`}
              {booking.status === "departed" && "Departed — deep clean in progress"}
            </p>
            <h1 className="text-xl font-semibold mt-1">{booking.group_name}</h1>
            <p className="text-[13px] text-ink-muted mt-1">
              {guests.length} guest{guests.length === 1 ? "" : "s"} · Arriving{" "}
              {new Date(booking.arrival_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} ·{" "}
              {booking.nights} night{booking.nights === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {!dataLoading && (
              <p className="text-[13px] text-ink-muted">
                <span className="font-medium text-ink tabular-nums">{totalOutstanding}</span> task
                {totalOutstanding === 1 ? "" : "s"} outstanding
              </p>
            )}
            {booking.status === "upcoming" && (
              <button onClick={startStay} className="rounded-[4px] bg-ink text-canvas px-3.5 py-1.5 text-[13px] font-medium">
                Start stay — Day 1
              </button>
            )}
            {booking.status === "active" && booking.current_day < booking.nights && (
              <button onClick={advanceDay} className="rounded-[4px] bg-ink text-canvas px-3.5 py-1.5 text-[13px] font-medium">
                Advance to Day {booking.current_day + 1}
              </button>
            )}
            {booking.status === "active" && (
              <button onClick={markDeparted} className="text-[12px] text-ink-muted underline underline-offset-2">
                Guests have departed
              </button>
            )}
            {booking.status === "departed" && (
              <Link href="/assign" className="rounded-[4px] bg-ink text-canvas px-3.5 py-1.5 text-[13px] font-medium">
                Set up next booking
              </Link>
            )}
          </div>
        </div>
      </div>

      {roomSections.length > 0 && (
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted mb-2">Rooms today</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border border border-border">
            {roomSections.map((s) => (
              <div key={s.roomId} className="bg-surface px-3 py-2.5">
                <RoomStatusToggle
                  roomName={s.section}
                  locked={s.locked ?? true}
                  onChange={(currentlyLocked) =>
                    setRoomDayStatus(
                      booking.id,
                      booking.current_day,
                      s.roomId!,
                      currentlyLocked ? "free_to_clean" : "in_house"
                    ).then(refreshScenes)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted mb-2">
          {booking.status === "upcoming" && "Before arrival"}
          {booking.status === "active" && "Today's scenes"}
          {booking.status === "departed" && "Departure checklist"}
        </h2>
        {dataLoading ? (
          <p className="text-[13px] text-ink-muted">Loading…</p>
        ) : (
          <div className="border border-border divide-y divide-border bg-surface">
            {sceneIds.map((id) => {
              const v = views.get(id);
              if (!v) return null;
              return (
                <SceneCard
                  key={id}
                  href={`/scenes/${id}`}
                  name={v.scene.name}
                  subtitle={v.scene.subtitle}
                  completed={v.completedCount}
                  total={v.totalCount}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <HandoverNotesPanel bookingId={booking.id} dayNumber={dayNumber} />
        {dayNumber !== null && <LaundryStatusPanel bookingId={booking.id} dayNumber={dayNumber} />}
      </div>
    </div>
  );
}
