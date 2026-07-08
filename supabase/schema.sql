-- Hlíðin Lodge Quality Manual — database schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query) before seed.sql.

create extension if not exists pgcrypto;

-- ── Reference data ──────────────────────────────────────────────

create table rooms (
  id text primary key,
  name text not null,
  description text,
  sort_order int not null
);

create table scenes (
  id int primary key,
  key text unique not null,
  name text not null,
  subtitle text,
  recurs boolean not null default false, -- true for the daily-loop scenes (4-7)
  sort_order int not null
);

create table scene_components (
  id text primary key, -- 'cheese_platter' | 'snack_basket'
  name text not null
);

create table component_items (
  id uuid primary key default gen_random_uuid(),
  component_id text not null references scene_components(id) on delete cascade,
  label text not null,
  sort_order int not null
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  scene_id int not null references scenes(id),
  section text not null,           -- display grouping, e.g. "Kitchen", "Bedrooms — Laki"
  label text not null,
  note text,                       -- optional clarifying note shown under the task
  room_scoped boolean not null default false, -- true = one instance per currently-occupied room (Scene 5 bedroom tasks)
  fixed_room_id text references rooms(id),    -- set when a task always belongs to one specific room (Scene 0 per-room sections)
  component_id text references scene_components(id), -- set when this task is a pointer to a shared checklist component
  sort_order int not null
);

-- ── Operational data ─────────────────────────────────────────────

create table bookings (
  id uuid primary key default gen_random_uuid(),
  group_name text not null,
  booking_reference text,
  arrival_date date not null,
  nights int not null check (nights > 0),
  current_day int not null default 1,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'departed')),
  created_at timestamptz not null default now()
);

create table guests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  name text not null,
  room_id text references rooms(id),
  sort_order int not null default 0
);

-- Per-room, per-day occupancy status — gates Scene 5 (Together Shift) room tasks.
create table room_day_status (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  day_number int not null,
  room_id text not null references rooms(id),
  status text not null default 'in_house' check (status in ('in_house', 'free_to_clean')),
  updated_at timestamptz not null default now(),
  unique (booking_id, day_number, room_id)
);

-- Note: day_number and room_id are nullable (once-per-booking scenes have no day
-- number; whole-house tasks have no room). Postgres treats NULL as distinct in a
-- plain UNIQUE constraint, so de-duplication for these two tables is done at the
-- application layer (read-then-write in src/lib/queries.ts) rather than via
-- upsert-on-conflict. The indexes below just speed up the read side of that.

create table task_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  booking_id uuid not null references bookings(id) on delete cascade,
  day_number int,             -- null for once-per-booking scenes (0-3)
  room_id text references rooms(id), -- set for room_scoped tasks and fixed_room_id tasks
  completed boolean not null default false,
  completed_by text,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);
create index task_completions_lookup_idx on task_completions (task_id, booking_id, day_number, room_id);

create table component_item_completions (
  id uuid primary key default gen_random_uuid(),
  component_item_id uuid not null references component_items(id) on delete cascade,
  task_id uuid not null references tasks(id) on delete cascade, -- which scene's pointer task this belongs to
  booking_id uuid not null references bookings(id) on delete cascade,
  day_number int,
  completed boolean not null default false,
  completed_by text,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);
create index component_item_completions_lookup_idx on component_item_completions (component_item_id, task_id, booking_id, day_number);

create table handover_notes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  day_number int,
  author text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table laundry_status (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  day_number int not null,
  is_running boolean not null default false,
  whose text,
  note text,
  updated_at timestamptz not null default now(),
  unique (booking_id, day_number)
);

-- ── Row Level Security ───────────────────────────────────────────
-- MVP has no staff login (single shared link, matching the paper-list workflow it replaces).
-- Anyone with the link can read and write. Tighten this later (e.g. Supabase Auth + a
-- per-property PIN) once the core loop is validated with staff.

alter table rooms enable row level security;
alter table scenes enable row level security;
alter table scene_components enable row level security;
alter table component_items enable row level security;
alter table tasks enable row level security;
alter table bookings enable row level security;
alter table guests enable row level security;
alter table room_day_status enable row level security;
alter table task_completions enable row level security;
alter table component_item_completions enable row level security;
alter table handover_notes enable row level security;
alter table laundry_status enable row level security;

create policy "public read" on rooms for select using (true);
create policy "public read" on scenes for select using (true);
create policy "public read" on scene_components for select using (true);
create policy "public read" on component_items for select using (true);
create policy "public read" on tasks for select using (true);

create policy "public all" on bookings for all using (true) with check (true);
create policy "public all" on guests for all using (true) with check (true);
create policy "public all" on room_day_status for all using (true) with check (true);
create policy "public all" on task_completions for all using (true) with check (true);
create policy "public all" on component_item_completions for all using (true) with check (true);
create policy "public all" on handover_notes for all using (true) with check (true);
create policy "public all" on laundry_status for all using (true) with check (true);

-- ── Realtime ─────────────────────────────────────────────────────

alter publication supabase_realtime add table task_completions;
alter publication supabase_realtime add table component_item_completions;
alter publication supabase_realtime add table room_day_status;
alter publication supabase_realtime add table handover_notes;
alter publication supabase_realtime add table laundry_status;
alter publication supabase_realtime add table bookings;
alter publication supabase_realtime add table guests;
