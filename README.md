# Hlíðin Lodge — Quality Manual

An interactive operations checklist for the housekeeping and hospitality staff at Hlíðin
Lodge. Staff open one shared link, check off tasks per "scene" (Departure, Pre-Arrival,
Morning Shift, Together Shift, Turndown, Night Shift, ...), and see live progress, room
status, and shift handover notes update for everyone else looking at the same booking.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4) — the whole app, client-rendered
  for simplicity (no staff login yet, see below).
- **Supabase** (Postgres + Realtime) — the database and the live "someone else just
  checked this off" updates. No custom backend server to run or maintain.
- **Vercel** (or any Next.js host) — one shareable URL.

## Content decisions carried over from planning

The task content in `supabase/seed.sql` is taken from the authoritative English source
docs, `Scene_List_v1.md` and `Departure_Deep_Clean.md` (the first version of this seed
was translated from the Icelandic `Senulisti_v1.md` / `Djuphreinsun_Brottfor.md` drafts
because the English originals weren't in Drive yet; once they were provided, the seed
was checked word-for-word against them and updated to match — the two versions turned
out to already be near-identical in content, just some wording). `Manual.pdf` itself
still hasn't been provided; the Departure Deep Clean doc notes it was already built
from every item in it, so nothing from it should be missing. Five items that
`Scene_List_v1.md`'s own "Notes and Possible Gaps" section flagged as unresolved were
folded in as follows:

1. **Terrace heaters** (check every 2–4h while in use) → a recurring task in Morning
   Shift and Together Shift, not a single one-off checklist item.
2. **Glass surfaces / staircase panels** (fingerprints build up fast) → a recurring task
   in Morning Shift, Together Shift, Turndown, and Night Shift.
3. **Fireplace extraction fan check** → folded in as a note on the "clean/light the
   fireplace" tasks (Pre-Arrival, Morning Shift, Night Shift, and Scene 0).
4. **Kitchen floor, 3x/day while the chef is in house** → three explicit passes across
   Morning Shift (after breakfast), Turndown (before guests return), and Night Shift
   (after dinner).
5. **Fly season** (seasonal, sealing the house) → deferred out of the MVP entirely; not
   seeded as a task anywhere yet.

Scene 5 (Together Shift) per-room gating: each occupied room gets an "In house" /
"Free to clean" toggle for the day. Its bedroom tasks stay visually locked (but the
toggle is always there to flip, in either direction) until someone marks that room free
— rather than blocking the whole scene until every guest is out of the house.

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), create a free account and a new project.
2. In the project dashboard, go to **SQL Editor → New query**, paste the contents of
   `supabase/schema.sql`, and run it.
3. Run `supabase/seed.sql` the same way, in a second query.
4. Go to **Project Settings → API**. Copy the **Project URL** and the **anon public**
   key.

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the two values from above:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Run locally

```
npm install
npm run dev
```

Open http://localhost:3000. Go to **Guests & Rooms** to create the first booking.

### 4. (Optional) Set a shared staff PIN

Add `NEXT_PUBLIC_STAFF_PIN` to `.env.local` (any digits/text you like) to put a PIN
prompt in front of the whole app. Leave it unset to skip this entirely — see the
security note below for what it does and doesn't protect against.

### 5. Deploy

Push this repo to GitHub (or use the branch it's already on) and import it into
[Vercel](https://vercel.com/new). Add the same environment variables in the Vercel
project settings, deploy, and share the resulting URL with staff.

## Security note (read before relying on this for real bookings)

There is no staff login. Anyone with the link — and, if set, the shared PIN — can read
and write everything, matching how the paper checklist worked and keeping setup to
"share a link." The `completed_by` / note author fields are just a name staff type in
once (stored in that device's browser, see `useStaffName`), not an authenticated
identity.

The optional `NEXT_PUBLIC_STAFF_PIN` (`src/components/PinGate.tsx`) is a speed bump, not
real access control: it's a client-side check, the PIN value ships inside the public
JavaScript bundle same as the Supabase anon key, and the Supabase row-level-security
policies in `supabase/schema.sql` are still `using (true)` for every write regardless of
the PIN. It stops someone from stumbling onto the link and poking around, or a phone
being picked up by a guest — it does not stop a determined person who bothers to look at
the page source. If real access control matters later, add Supabase Auth (per-staff
login) and rewrite those RLS policies to check `auth.uid()`.

## Known limitations / next steps

- Real-time sync uses Supabase Realtime (websockets), not polling.
- Scene 0 (Departure / Deep Clean) and the Cheese Platter / Snack Basket components are
  fully seeded and functional through the same generic checklist screen as the daily
  scenes — there's no separate "detail" UI for them yet, per the brief's suggestion to
  get the daily loop working first.
