import { getSupabase } from "./supabase";
import type {
  Booking,
  BookingStatus,
  ComponentItem,
  ComponentItemCompletion,
  Guest,
  HandoverNote,
  LaundryStatus,
  Room,
  RoomDayStatus,
  RoomDayStatusValue,
  Scene,
  SceneComponent,
  Task,
  TaskCompletion,
} from "./database.types";

function requireSupabase() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  return supabase;
}

// ── Static reference content (rooms, scenes, tasks, components) ───

export interface StaticContent {
  rooms: Room[];
  scenes: Scene[];
  components: SceneComponent[];
  componentItems: ComponentItem[];
  tasks: Task[];
}

export async function fetchStaticContent(): Promise<StaticContent> {
  const supabase = requireSupabase();
  const [roomsRes, scenesRes, componentsRes, componentItemsRes, tasksRes] = await Promise.all([
    supabase.from("rooms").select("*").order("sort_order"),
    supabase.from("scenes").select("*").order("sort_order"),
    supabase.from("scene_components").select("*"),
    supabase.from("component_items").select("*").order("sort_order"),
    supabase.from("tasks").select("*").order("sort_order"),
  ]);
  for (const res of [roomsRes, scenesRes, componentsRes, componentItemsRes, tasksRes]) {
    if (res.error) throw res.error;
  }
  return {
    rooms: roomsRes.data ?? [],
    scenes: scenesRes.data ?? [],
    components: componentsRes.data ?? [],
    componentItems: componentItemsRes.data ?? [],
    tasks: tasksRes.data ?? [],
  };
}

// ── Bookings ───────────────────────────────────────────────────────

export async function fetchCurrentBooking(): Promise<Booking | null> {
  const supabase = requireSupabase();
  for (const status of ["active", "upcoming", "departed"] as BookingStatus[]) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
  }
  return null;
}

export async function fetchBooking(bookingId: string): Promise<Booking | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("bookings").select("*").eq("id", bookingId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createBooking(input: {
  groupName: string;
  bookingReference?: string;
  arrivalDate: string;
  nights: number;
}): Promise<Booking> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      group_name: input.groupName,
      booking_reference: input.bookingReference ?? null,
      arrival_date: input.arrivalDate,
      nights: input.nights,
      current_day: 1,
      status: "upcoming",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function setBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
  if (error) throw error;
}

// Advances the day counter and resets each occupied room back to "in_house" for the
// new day, so Scene 5 gating starts locked again each morning.
export async function advanceBookingDay(booking: Booking, occupiedRoomIds: string[]): Promise<void> {
  const supabase = requireSupabase();
  const nextDay = booking.current_day + 1;
  const { error } = await supabase.from("bookings").update({ current_day: nextDay }).eq("id", booking.id);
  if (error) throw error;
  if (occupiedRoomIds.length > 0) {
    const rows = occupiedRoomIds.map((roomId) => ({
      booking_id: booking.id,
      day_number: nextDay,
      room_id: roomId,
      status: "in_house" as RoomDayStatusValue,
    }));
    const { error: insertError } = await supabase.from("room_day_status").insert(rows);
    if (insertError) throw insertError;
  }
}

// ── Guests ─────────────────────────────────────────────────────────

export async function fetchGuests(bookingId: string): Promise<Guest[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("booking_id", bookingId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function addGuest(bookingId: string, name: string, roomId: string | null, sortOrder: number): Promise<Guest> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("guests")
    .insert({ booking_id: bookingId, name, room_id: roomId, sort_order: sortOrder })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateGuestRoom(guestId: string, roomId: string | null): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("guests").update({ room_id: roomId }).eq("id", guestId);
  if (error) throw error;
}

export async function removeGuest(guestId: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("guests").delete().eq("id", guestId);
  if (error) throw error;
}

// ── Room day status (Scene 5 per-room unlock) ──────────────────────

export async function fetchRoomDayStatuses(bookingId: string, dayNumber: number): Promise<RoomDayStatus[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("room_day_status")
    .select("*")
    .eq("booking_id", bookingId)
    .eq("day_number", dayNumber);
  if (error) throw error;
  return data ?? [];
}

export async function setRoomDayStatus(
  bookingId: string,
  dayNumber: number,
  roomId: string,
  status: RoomDayStatusValue
): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("room_day_status")
    .upsert(
      { booking_id: bookingId, day_number: dayNumber, room_id: roomId, status, updated_at: new Date().toISOString() },
      { onConflict: "booking_id,day_number,room_id" }
    );
  if (error) throw error;
}

// ── Task completions ────────────────────────────────────────────────

export async function fetchTaskCompletions(
  bookingId: string,
  dayNumber: number | null,
  taskIds: string[]
): Promise<TaskCompletion[]> {
  if (taskIds.length === 0) return [];
  const supabase = requireSupabase();
  let query = supabase.from("task_completions").select("*").eq("booking_id", bookingId).in("task_id", taskIds);
  query = dayNumber === null ? query.is("day_number", null) : query.eq("day_number", dayNumber);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function setTaskCompletion(params: {
  taskId: string;
  bookingId: string;
  dayNumber: number | null;
  roomId: string | null;
  completed: boolean;
  completedBy: string;
}): Promise<void> {
  const supabase = requireSupabase();
  let existing = supabase
    .from("task_completions")
    .select("id")
    .eq("task_id", params.taskId)
    .eq("booking_id", params.bookingId);
  existing = params.dayNumber === null ? existing.is("day_number", null) : existing.eq("day_number", params.dayNumber);
  existing = params.roomId === null ? existing.is("room_id", null) : existing.eq("room_id", params.roomId);
  const { data: existingRow, error: findError } = await existing.maybeSingle();
  if (findError) throw findError;

  const patch = {
    completed: params.completed,
    completed_by: params.completed ? params.completedBy : null,
    completed_at: params.completed ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (existingRow) {
    const { error } = await supabase.from("task_completions").update(patch).eq("id", existingRow.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("task_completions").insert({
      task_id: params.taskId,
      booking_id: params.bookingId,
      day_number: params.dayNumber,
      room_id: params.roomId,
      ...patch,
    });
    if (error) throw error;
  }
}

export async function fetchComponentItemCompletions(
  bookingId: string,
  dayNumber: number | null,
  taskIds: string[]
): Promise<ComponentItemCompletion[]> {
  if (taskIds.length === 0) return [];
  const supabase = requireSupabase();
  let query = supabase.from("component_item_completions").select("*").eq("booking_id", bookingId).in("task_id", taskIds);
  query = dayNumber === null ? query.is("day_number", null) : query.eq("day_number", dayNumber);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function setComponentItemCompletion(params: {
  componentItemId: string;
  taskId: string;
  bookingId: string;
  dayNumber: number | null;
  completed: boolean;
  completedBy: string;
}): Promise<void> {
  const supabase = requireSupabase();
  let existing = supabase
    .from("component_item_completions")
    .select("id")
    .eq("component_item_id", params.componentItemId)
    .eq("task_id", params.taskId)
    .eq("booking_id", params.bookingId);
  existing = params.dayNumber === null ? existing.is("day_number", null) : existing.eq("day_number", params.dayNumber);
  const { data: existingRow, error: findError } = await existing.maybeSingle();
  if (findError) throw findError;

  const patch = {
    completed: params.completed,
    completed_by: params.completed ? params.completedBy : null,
    completed_at: params.completed ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (existingRow) {
    const { error } = await supabase.from("component_item_completions").update(patch).eq("id", existingRow.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("component_item_completions").insert({
      component_item_id: params.componentItemId,
      task_id: params.taskId,
      booking_id: params.bookingId,
      day_number: params.dayNumber,
      ...patch,
    });
    if (error) throw error;
  }
}

// ── Handover notes ───────────────────────────────────────────────────

export async function fetchHandoverNotes(bookingId: string): Promise<HandoverNote[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("handover_notes")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addHandoverNote(bookingId: string, dayNumber: number | null, author: string, message: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("handover_notes")
    .insert({ booking_id: bookingId, day_number: dayNumber, author, message });
  if (error) throw error;
}

// ── Laundry status ───────────────────────────────────────────────────

export async function fetchLaundryStatus(bookingId: string, dayNumber: number): Promise<LaundryStatus | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("laundry_status")
    .select("*")
    .eq("booking_id", bookingId)
    .eq("day_number", dayNumber)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertLaundryStatus(params: {
  bookingId: string;
  dayNumber: number;
  isRunning: boolean;
  whose: string | null;
  note: string | null;
}): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("laundry_status").upsert(
    {
      booking_id: params.bookingId,
      day_number: params.dayNumber,
      is_running: params.isRunning,
      whose: params.whose,
      note: params.note,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "booking_id,day_number" }
  );
  if (error) throw error;
}
