"use client";

import { use } from "react";
import Link from "next/link";
import { useStaticContent } from "@/lib/StaticContentContext";
import { useCurrentBooking } from "@/hooks/useCurrentBooking";
import { useScenesData } from "@/hooks/useScenesData";
import { useStaffName } from "@/hooks/useStaffName";
import { setComponentItemCompletion, setRoomDayStatus, setTaskCompletion } from "@/lib/queries";
import { SetupNotice } from "@/components/SetupNotice";
import { ProgressPill } from "@/components/ProgressPill";
import { TaskRow } from "@/components/TaskRow";
import { ComponentChecklist } from "@/components/ComponentChecklist";
import { RoomStatusToggle } from "@/components/RoomStatusToggle";

export default function ScenePage({ params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId: sceneIdParam } = use(params);
  const sceneId = Number(sceneIdParam);

  const { content, loading: contentLoading, configured } = useStaticContent();
  const { booking, occupiedRoomIds, loading: bookingLoading } = useCurrentBooking();
  const { name } = useStaffName();

  const dayNumber = booking && booking.status === "active" ? booking.current_day : null;
  const { views, loading: dataLoading, refresh } = useScenesData({
    content,
    bookingId: booking?.id ?? null,
    dayNumber,
    sceneIds: [sceneId],
    occupiedRoomIds,
  });

  if (!configured) return <SetupNotice />;
  if (contentLoading || bookingLoading || dataLoading) {
    return <p className="text-[13px] text-ink-muted">Loading…</p>;
  }
  if (!booking) {
    return (
      <p className="text-[13px] text-ink-muted">
        No current booking yet. Create one under{" "}
        <Link href="/assign" className="text-accent underline">
          Guests &amp; Rooms
        </Link>
        .
      </p>
    );
  }
  const view = views.get(sceneId);
  if (!view) return <p className="text-[13px] text-ink-muted">Scene not found.</p>;

  const staffName = name || "Staff";

  async function toggleTask(taskId: string, roomId: string | null, completed: boolean) {
    if (!booking) return;
    await setTaskCompletion({ taskId, bookingId: booking.id, dayNumber, roomId, completed, completedBy: staffName });
    refresh();
  }

  async function toggleComponentItem(taskId: string, componentItemId: string, completed: boolean) {
    if (!booking) return;
    await setComponentItemCompletion({
      componentItemId,
      taskId,
      bookingId: booking.id,
      dayNumber,
      completed,
      completedBy: staffName,
    });
    refresh();
  }

  async function setRoomFree(roomId: string, freeToClean: boolean) {
    if (!booking || dayNumber === null) return;
    await setRoomDayStatus(booking.id, dayNumber, roomId, freeToClean ? "free_to_clean" : "in_house");
    refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-[12px] text-ink-muted hover:text-accent">
          ← Dashboard
        </Link>
        <div className="flex items-start justify-between gap-4 mt-1 pb-4 border-b border-border">
          <div>
            <h1 className="text-xl font-semibold">{view.scene.name}</h1>
            <p className="text-[13px] text-ink-muted mt-0.5">
              {view.scene.subtitle}
              {dayNumber ? ` · Day ${dayNumber} of ${booking.nights}` : ""}
            </p>
          </div>
          <ProgressPill completed={view.completedCount} total={view.totalCount} />
        </div>
      </div>

      {view.sections.length === 0 && (
        <p className="text-[13px] text-ink-muted">
          {sceneId === 5
            ? "No rooms are assigned to this booking yet — assign guests to rooms first."
            : "No tasks in this scene."}
        </p>
      )}

      {view.sections.map((section) => (
        <div key={section.roomId ?? section.section}>
          {section.roomId ? (
            <div className="mb-2 pb-2 border-b border-border">
              <RoomStatusToggle
                roomName={section.section}
                locked={section.locked ?? true}
                onChange={(currentlyLocked) => setRoomFree(section.roomId!, currentlyLocked)}
              />
            </div>
          ) : (
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted mb-2">
              {section.section}
            </h2>
          )}
          <ul className="border border-border divide-y divide-border bg-surface">
            {section.plainItems.map((item) => (
              <TaskRow
                key={item.key}
                label={item.task.label}
                note={item.task.note}
                roomName={item.roomId && !section.roomId ? item.roomName : undefined}
                locked={item.locked}
                completed={item.completion?.completed ?? false}
                completedBy={item.completion?.completed_by}
                onToggle={() => toggleTask(item.task.id, item.roomId, !(item.completion?.completed ?? false))}
              />
            ))}
            {section.componentItems.map((instance) => (
              <ComponentChecklist
                key={instance.key}
                instance={instance}
                onToggleItem={(componentItemId, completed) =>
                  toggleComponentItem(instance.task.id, componentItemId, completed)
                }
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
