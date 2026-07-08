import type {
  ComponentItem,
  ComponentItemCompletion,
  Room,
  RoomDayStatus,
  Scene,
  SceneComponent,
  Task,
  TaskCompletion,
} from "./database.types";
import type { StaticContent } from "./queries";

export interface ExpandedTaskInstance {
  key: string;
  task: Task;
  roomId: string | null;
  roomName: string | null;
  locked: boolean;
  completion: TaskCompletion | null;
}

export interface ComponentTaskInstance {
  key: string;
  task: Task;
  component: SceneComponent;
  items: { item: ComponentItem; completion: ComponentItemCompletion | null }[];
}

export interface SceneSection {
  section: string;
  roomId?: string;   // set when this section is one occupied room's checklist (Scene 5)
  locked?: boolean;  // current lock state for that room, for the section-level toggle
  plainItems: ExpandedTaskInstance[];
  componentItems: ComponentTaskInstance[];
}

export interface SceneView {
  scene: Scene;
  sections: SceneSection[];
  totalCount: number;
  completedCount: number;
}

function taskCompletionKey(taskId: string, roomId: string | null) {
  return `${taskId}:${roomId ?? "none"}`;
}

function componentCompletionKey(componentItemId: string, taskId: string) {
  return `${componentItemId}:${taskId}`;
}

export function buildSceneView(params: {
  content: StaticContent;
  sceneId: number;
  occupiedRoomIds: string[];
  roomDayStatuses: RoomDayStatus[];
  taskCompletions: TaskCompletion[];
  componentItemCompletions: ComponentItemCompletion[];
}): SceneView | null {
  const { content, sceneId, occupiedRoomIds, roomDayStatuses, taskCompletions, componentItemCompletions } = params;
  const scene = content.scenes.find((s) => s.id === sceneId);
  if (!scene) return null;

  const roomsById = new Map<string, Room>(content.rooms.map((r) => [r.id, r]));
  const roomStatusByRoomId = new Map<string, RoomDayStatus>(roomDayStatuses.map((s) => [s.room_id, s]));
  const completionMap = new Map<string, TaskCompletion>(
    taskCompletions.map((c) => [taskCompletionKey(c.task_id, c.room_id), c])
  );
  const componentCompletionMap = new Map<string, ComponentItemCompletion>(
    componentItemCompletions.map((c) => [componentCompletionKey(c.component_item_id, c.task_id), c])
  );
  const componentItemsByComponent = new Map<string, ComponentItem[]>();
  for (const item of content.componentItems) {
    const list = componentItemsByComponent.get(item.component_id) ?? [];
    list.push(item);
    componentItemsByComponent.set(item.component_id, list);
  }
  const componentsById = new Map<string, SceneComponent>(content.components.map((c) => [c.id, c]));

  const tasks = content.tasks.filter((t) => t.scene_id === sceneId).sort((a, b) => a.sort_order - b.sort_order);

  const sectionOrder: string[] = [];
  const sectionMap = new Map<string, SceneSection>();
  function getSection(key: string, init?: Partial<SceneSection>): SceneSection {
    if (!sectionMap.has(key)) {
      sectionMap.set(key, { section: init?.section ?? key, plainItems: [], componentItems: [], ...init });
      sectionOrder.push(key);
    }
    return sectionMap.get(key)!;
  }

  let totalCount = 0;
  let completedCount = 0;

  for (const task of tasks) {
    if (task.room_scoped) {
      if (occupiedRoomIds.length === 0) continue;
      for (const roomId of occupiedRoomIds) {
        const roomStatus = roomStatusByRoomId.get(roomId);
        const locked = (roomStatus?.status ?? "in_house") !== "free_to_clean";
        const section = getSection(`room:${roomId}`, {
          section: roomsById.get(roomId)?.name ?? roomId,
          roomId,
          locked,
        });
        const completion = completionMap.get(taskCompletionKey(task.id, roomId)) ?? null;
        section.plainItems.push({
          key: `${task.id}:${roomId}`,
          task,
          roomId,
          roomName: roomsById.get(roomId)?.name ?? roomId,
          locked,
          completion,
        });
        totalCount += 1;
        if (completion?.completed) completedCount += 1;
      }
      continue;
    }

    const section = getSection(task.section);

    if (task.component_id) {
      const component = componentsById.get(task.component_id);
      if (!component) continue;
      const items = (componentItemsByComponent.get(task.component_id) ?? []).map((item) => ({
        item,
        completion: componentCompletionMap.get(componentCompletionKey(item.id, task.id)) ?? null,
      }));
      section.componentItems.push({ key: task.id, task, component, items });
      totalCount += items.length;
      completedCount += items.filter((i) => i.completion?.completed).length;
      continue;
    }

    const roomId = task.fixed_room_id ?? null;
    const completion = completionMap.get(taskCompletionKey(task.id, roomId)) ?? null;
    section.plainItems.push({
      key: task.id,
      task,
      roomId,
      roomName: roomId ? roomsById.get(roomId)?.name ?? roomId : null,
      locked: false,
      completion,
    });
    totalCount += 1;
    if (completion?.completed) completedCount += 1;
  }

  return {
    scene,
    sections: sectionOrder.map((name) => sectionMap.get(name)!),
    totalCount,
    completedCount,
  };
}

// Lightweight progress-only computation for dashboard scene cards, without
// building the full section tree (same counting rules as buildSceneView).
export function computeSceneProgress(params: {
  content: StaticContent;
  sceneId: number;
  occupiedRoomIds: string[];
  roomDayStatuses: RoomDayStatus[];
  taskCompletions: TaskCompletion[];
  componentItemCompletions: ComponentItemCompletion[];
}): { totalCount: number; completedCount: number } {
  const view = buildSceneView(params);
  return { totalCount: view?.totalCount ?? 0, completedCount: view?.completedCount ?? 0 };
}
