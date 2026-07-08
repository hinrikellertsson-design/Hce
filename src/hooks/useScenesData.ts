"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import {
  fetchComponentItemCompletions,
  fetchRoomDayStatuses,
  fetchTaskCompletions,
  type StaticContent,
} from "@/lib/queries";
import { buildSceneView, type SceneView } from "@/lib/sceneView";

// Fetches everything needed to render one or more scenes (progress totals for the
// dashboard, or the full section tree for a scene detail page) in a single batch,
// and keeps it live via Supabase Realtime.
export function useScenesData(params: {
  content: StaticContent | null;
  bookingId: string | null;
  dayNumber: number | null;
  sceneIds: number[];
  occupiedRoomIds: string[];
}) {
  const { content, bookingId, dayNumber, sceneIds, occupiedRoomIds } = params;
  const [views, setViews] = useState<Map<number, SceneView>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sceneIdsKey = sceneIds.join(",");
  const occupiedKey = occupiedRoomIds.join(",");

  const refresh = useCallback(async () => {
    if (!content || !bookingId || sceneIds.length === 0) {
      setViews(new Map());
      setLoading(false);
      return;
    }
    try {
      const taskIds = content.tasks.filter((t) => sceneIds.includes(t.scene_id)).map((t) => t.id);
      const [roomDayStatuses, taskCompletions, componentItemCompletions] = await Promise.all([
        dayNumber !== null ? fetchRoomDayStatuses(bookingId, dayNumber) : Promise.resolve([]),
        fetchTaskCompletions(bookingId, dayNumber, taskIds),
        fetchComponentItemCompletions(bookingId, dayNumber, taskIds),
      ]);
      const map = new Map<number, SceneView>();
      for (const sceneId of sceneIds) {
        const view = buildSceneView({
          content,
          sceneId,
          occupiedRoomIds,
          roomDayStatuses,
          taskCompletions,
          componentItemCompletions,
        });
        if (view) map.set(sceneId, view);
      }
      setViews(map);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, bookingId, dayNumber, sceneIdsKey, occupiedKey]);

  useEffect(() => {
    refresh();
    const supabase = getSupabase();
    if (!supabase || !bookingId) return;
    const channel = supabase
      .channel(`scenes-${bookingId}-${dayNumber ?? "none"}-${sceneIdsKey}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "task_completions", filter: `booking_id=eq.${bookingId}` },
        () => refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "component_item_completions", filter: `booking_id=eq.${bookingId}` },
        () => refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_day_status", filter: `booking_id=eq.${bookingId}` },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh, bookingId, dayNumber, sceneIdsKey]);

  return { views, loading, error, refresh };
}
