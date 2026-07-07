// Hand-written types matching supabase/schema.sql.
// If you later run `supabase gen types typescript`, you can replace this file
// with the generated one — the shapes below were written to match it.
//
// These must stay `type` aliases, not `interface`s: supabase-js's generics require
// each Row/Insert/Update to structurally satisfy Record<string, unknown>, and
// TypeScript only considers plain object-literal types (not interfaces) assignable
// to an index-signature type like that.

export type BookingStatus = "upcoming" | "active" | "departed";
export type RoomDayStatusValue = "in_house" | "free_to_clean";

export type Room = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Scene = {
  id: number;
  key: string;
  name: string;
  subtitle: string | null;
  recurs: boolean;
  sort_order: number;
};

export type SceneComponent = {
  id: string;
  name: string;
};

export type ComponentItem = {
  id: string;
  component_id: string;
  label: string;
  sort_order: number;
};

export type Task = {
  id: string;
  scene_id: number;
  section: string;
  label: string;
  note: string | null;
  room_scoped: boolean;
  fixed_room_id: string | null;
  component_id: string | null;
  sort_order: number;
};

export type Booking = {
  id: string;
  group_name: string;
  booking_reference: string | null;
  arrival_date: string;
  nights: number;
  current_day: number;
  status: BookingStatus;
  created_at: string;
};

export type Guest = {
  id: string;
  booking_id: string;
  name: string;
  room_id: string | null;
  sort_order: number;
};

export type RoomDayStatus = {
  id: string;
  booking_id: string;
  day_number: number;
  room_id: string;
  status: RoomDayStatusValue;
  updated_at: string;
};

export type TaskCompletion = {
  id: string;
  task_id: string;
  booking_id: string;
  day_number: number | null;
  room_id: string | null;
  completed: boolean;
  completed_by: string | null;
  completed_at: string | null;
  updated_at: string;
};

export type ComponentItemCompletion = {
  id: string;
  component_item_id: string;
  task_id: string;
  booking_id: string;
  day_number: number | null;
  completed: boolean;
  completed_by: string | null;
  completed_at: string | null;
  updated_at: string;
};

export type HandoverNote = {
  id: string;
  booking_id: string;
  day_number: number | null;
  author: string;
  message: string;
  created_at: string;
};

export type LaundryStatus = {
  id: string;
  booking_id: string;
  day_number: number;
  is_running: boolean;
  whose: string | null;
  note: string | null;
  updated_at: string;
};

type TableDef<Row> = { Row: Row; Insert: Partial<Row>; Update: Partial<Row>; Relationships: [] };

export type Database = {
  public: {
    Tables: {
      rooms: TableDef<Room>;
      scenes: TableDef<Scene>;
      scene_components: TableDef<SceneComponent>;
      component_items: TableDef<ComponentItem>;
      tasks: TableDef<Task>;
      bookings: TableDef<Booking>;
      guests: TableDef<Guest>;
      room_day_status: TableDef<RoomDayStatus>;
      task_completions: TableDef<TaskCompletion>;
      component_item_completions: TableDef<ComponentItemCompletion>;
      handover_notes: TableDef<HandoverNote>;
      laundry_status: TableDef<LaundryStatus>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
