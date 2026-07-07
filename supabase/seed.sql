-- Hlíðin Lodge Quality Manual — reference data seed
-- Run this once after schema.sql, in the Supabase SQL Editor.
-- Source: Senulisti_v1.md (scene structure) and Djuphreinsun_Brottfor.md (Scene 0 detail),
-- translated to English. See README.md "Content decisions" for the open items folded in below.

-- ── Rooms ────────────────────────────────────────────────────────

insert into rooms (id, name, description, sort_order) values
  ('laki',    'Laki',    'Master Bedroom, upstairs', 1),
  ('katla',   'Katla',   'Ground floor, next to the kitchen', 2),
  ('heimaey', 'Heimaey', 'Large guest house room', 3),
  ('surtsey', 'Surtsey', 'Small guest house room', 4),
  ('hekla',   'Hekla',   'Small room upstairs ("Alex''s Room")', 5);

-- ── Scenes ───────────────────────────────────────────────────────

insert into scenes (id, key, name, subtitle, recurs, sort_order) values
  (0, 'departure_deep_clean', 'Departure / Deep Clean',      'Once per booking, after guests leave',  false, 0),
  (1, 'pre_arrival',          'Pre-Arrival Preparation',     'Once per booking',                      false, 1),
  (2, 'morning_of_arrival',   'Morning of Arrival',          'Once per booking',                      false, 2),
  (3, 'before_arrival',       'Right Before Guests Arrive',  'Once per booking',                      false, 3),
  (4, 'morning_shift',        'Morning Shift',               'Every day of the stay',                 true,  4),
  (5, 'together_shift',       'Together Shift',              'Every day of the stay',                 true,  5),
  (6, 'turndown',             'Turndown Service',            'Every day of the stay',                 true,  6),
  (7, 'night_shift',          'Night Shift',                 'Every day of the stay',                 true,  7);

-- ── Shared components ────────────────────────────────────────────

insert into scene_components (id, name) values
  ('cheese_platter', 'Cheese Platter'),
  ('snack_basket', 'Snack Basket');

insert into component_items (component_id, label, sort_order) values
  ('cheese_platter', 'Cheeses', 1),
  ('cheese_platter', 'Ham', 2),
  ('cheese_platter', 'Salami', 3),
  ('cheese_platter', 'Olives (with cocktail picks)', 4),
  ('cheese_platter', 'Jams / preserves', 5),
  ('cheese_platter', 'Honey', 6),
  ('cheese_platter', 'Mixed nuts', 7),
  ('cheese_platter', 'Raspberries', 8),
  ('cheese_platter', 'Blueberries', 9),
  ('cheese_platter', 'Strawberries', 10),
  ('cheese_platter', 'Grapes', 11),
  ('cheese_platter', 'Mini toasted bread', 12),
  ('cheese_platter', 'Crackers', 13),
  ('cheese_platter', 'Ritz crackers', 14),
  ('cheese_platter', 'Rosemary', 15),
  ('cheese_platter', 'Thyme', 16),
  ('cheese_platter', 'Cheese knives', 17),
  ('cheese_platter', 'Small spoons', 18),
  ('cheese_platter', 'Milk (skim and low-fat)', 19),
  ('cheese_platter', 'Oat milk', 20),
  ('cheese_platter', 'Lemon', 21),
  ('cheese_platter', 'Lime', 22),
  ('cheese_platter', 'Ginger', 23),
  ('cheese_platter', 'Fresh mint', 24),
  ('cheese_platter', 'Orange juice', 25),
  ('cheese_platter', 'Large candles', 26),
  ('cheese_platter', 'Small candles', 27),
  ('snack_basket', 'Water bottles', 1),
  ('snack_basket', 'Protein bars', 2),
  ('snack_basket', 'Individually packed nuts', 3),
  ('snack_basket', 'Proper Popcorn', 4),
  ('snack_basket', 'Proper Chips', 5),
  ('snack_basket', 'Fruit', 6),
  ('snack_basket', 'Chocolate and candy (evening snack)', 7),
  ('snack_basket', 'Cereal (evening offering)', 8),
  ('snack_basket', 'Crackers / cookies (evening offering)', 9);

-- ── Scene 1 — Pre-Arrival Preparation ────────────────────────────

insert into tasks (scene_id, section, label, note, sort_order) values
  (1, 'Tasks Before Guests', 'Clean the fireplace', 'Check both extraction fans (upstairs/downstairs) show green/active in Crestron before lighting.', 10),
  (1, 'Tasks Before Guests', 'Restock drinks', null, 20),
  (1, 'Tasks Before Guests', 'Charge the travel speaker', 'Kept in the garage.', 30),
  (1, 'Tasks Before Guests', 'Replace candles', null, 40),
  (1, 'Tasks Before Guests', 'Empty all trash bins', null, 50),
  (1, 'Tasks Before Guests', 'Make beds properly with fresh linens', null, 60),
  (1, 'Tasks Before Guests', 'Set out towels', null, 70),
  (1, 'Tasks Before Guests', 'Set out bathrobes and slippers', null, 80),
  (1, 'Tasks Before Guests', 'Bring in firewood', null, 90),
  (1, 'Tasks Before Guests', 'Iron', null, 100),
  (1, 'Tasks Before Guests', 'Empty the hot tub', null, 110),
  (1, 'Tasks Before Guests', 'Vacuum and mop', null, 120),
  (1, 'Tasks Before Guests', 'Wash cleaning cloths', null, 130);

-- ── Scene 2 — Morning of Arrival ─────────────────────────────────

insert into tasks (scene_id, section, label, note, sort_order) values
  (2, 'Morning of Arrival', 'Clean the hot tub', null, 10),
  (2, 'Morning of Arrival', 'Clean bird droppings', null, 20),
  (2, 'Morning of Arrival', 'Remove cobwebs', null, 30),
  (2, 'Morning of Arrival', 'Restock food supplies', null, 40),
  (2, 'Morning of Arrival', 'Set out fresh flowers', null, 50),
  (2, 'Morning of Arrival', 'Add scent / fragrance', null, 60),
  (2, 'Morning of Arrival', 'Print welcome letter', null, 70),
  (2, 'Morning of Arrival', 'Place water bottles in the bedrooms', null, 80);

-- ── Scene 3 — Right Before Guests Arrive ─────────────────────────

insert into tasks (scene_id, section, label, note, component_id, sort_order) values
  (3, 'Right Before Guests Arrive', 'Turn on the sauna', 'The sauna needs 4 hours to preheat — time this from the expected arrival time, not just "right before".', null, 10),
  (3, 'Right Before Guests Arrive', 'Vacuum', null, null, 20),
  (3, 'Right Before Guests Arrive', 'Set the mood: drinks, music, fireplace, candles, lighting', null, null, 30),
  (3, 'Right Before Guests Arrive', 'Prepare the Cheese Platter', null, 'cheese_platter', 40),
  (3, 'Right Before Guests Arrive', 'Check the hot tub', null, null, 50),
  (3, 'Right Before Guests Arrive', 'Remove the hot tub cover', null, null, 60),
  (3, 'Right Before Guests Arrive', 'Put the hot tub cover back on', null, null, 70),
  (3, 'Right Before Guests Arrive', 'Turn off the sauna', null, null, 80);

-- ── Scene 4 — Morning Shift ───────────────────────────────────────
-- Includes resolved open items: kitchen floor 3x/day (pass 1 of 3) and recurring
-- glass-surfaces / terrace-heater checks (see README "Content decisions").

insert into tasks (scene_id, section, label, note, component_id, sort_order) values
  (4, 'Morning Shift', 'Prepare Snack Baskets', 'Snacks, water, etc. — see the shared checklist.', 'snack_basket', 10),
  (4, 'Morning Shift', 'Empty both dishwashers', null, null, 20),
  (4, 'Morning Shift', 'Clean the fireplace', null, null, 30),
  (4, 'Morning Shift', 'Clean dryer filters and empty the water tank', null, null, 40),
  (4, 'Morning Shift', 'Vacuum and mop the kitchen floor', 'Pass 1 of 3 for the day — after breakfast.', null, 50),
  (4, 'Morning Shift', 'Wipe down glass surfaces and staircase panels', 'Fingerprints build up fast while guests are in the house — check these every shift.', null, 60),
  (4, 'Morning Shift', 'Check the terrace heaters are running correctly', 'Check every 2-4 hours while in use.', null, 70);

-- ── Scene 5 — Together Shift ──────────────────────────────────────
-- room_scoped tasks get one checklist instance per currently-occupied room, gated by
-- that room's "Guests out" status for the day (see the assignment/dashboard screens).

insert into tasks (scene_id, section, label, note, room_scoped, sort_order) values
  (5, 'Bedrooms (per occupied room)', 'Change water bottles and glasses', null, true, 10),
  (5, 'Bedrooms (per occupied room)', 'Make the bed', null, true, 20),
  (5, 'Bedrooms (per occupied room)', 'Change towels', null, true, 30),
  (5, 'Bedrooms (per occupied room)', 'Change bathrobes and/or slippers', null, true, 40),
  (5, 'Bedrooms (per occupied room)', 'Empty bathroom trash bins', null, true, 50),
  (5, 'Bedrooms (per occupied room)', 'Fold toilet paper into a point (or replace if needed)', null, true, 60),
  (5, 'Bedrooms (per occupied room)', 'Vacuum', null, true, 70),
  (5, 'Bedrooms (per occupied room)', 'Mop', null, true, 80);

insert into tasks (scene_id, section, label, note, sort_order) values
  (5, 'Whole House', 'Take large trash bags out to the car', null, 90),
  (5, 'Whole House', 'Wipe down glass surfaces and staircase panels', 'Fingerprints build up fast while guests are in the house — check these every shift.', 100),
  (5, 'Whole House', 'Check the terrace heaters are running correctly', 'Check every 2-4 hours while in use.', 110);

-- ── Scene 6 — Turndown Service ────────────────────────────────────

insert into tasks (scene_id, section, label, note, sort_order) values
  (6, 'Turndown Service', 'Dim the lights', null, 10),
  (6, 'Turndown Service', 'Turn on bedside lamps', null, 20),
  (6, 'Turndown Service', 'Lower the curtains / blinds', null, 30),
  (6, 'Turndown Service', 'Pull back the duvet slightly', null, 40),
  (6, 'Turndown Service', 'Set out a throw blanket', null, 50),
  (6, 'Turndown Service', 'Remove the large decorative pillow', null, 60),
  (6, 'Turndown Service', 'Set out 2 water bottles', null, 70),
  (6, 'Turndown Service', 'Open the windows', null, 80),
  (6, 'Turndown Service', 'Vacuum and mop the kitchen floor', 'Pass 2 of 3 for the day — before guests return.', 90),
  (6, 'Turndown Service', 'Wipe down glass surfaces and staircase panels', 'Fingerprints build up fast while guests are in the house — check these every shift.', 100);

-- ── Scene 7 — Night Shift ─────────────────────────────────────────

insert into tasks (scene_id, section, label, note, component_id, sort_order) values
  (7, 'Night Shift', 'Iron napkins', null, null, 10),
  (7, 'Night Shift', 'Prepare the welcome setup', 'Drinks + Cheese Platter, light candles, light the fire, turn on music, turn on all house lights, remove the hot tub cover, turn on the sauna.', 'cheese_platter', 20),
  (7, 'Night Shift', 'Replace candles', null, null, 30),
  (7, 'Night Shift', 'Sweep and mop the dining area', null, null, 40),
  (7, 'Night Shift', 'Prepare the Snack Basket', null, 'snack_basket', 50),
  (7, 'Night Shift', 'Blow out candles', null, null, 60),
  (7, 'Night Shift', 'Take large trash bags out to the car', null, null, 70),
  (7, 'Night Shift', 'Vacuum and mop the kitchen floor', 'Pass 3 of 3 for the day — after dinner.', null, 80),
  (7, 'Night Shift', 'Wipe down glass surfaces and staircase panels', 'Fingerprints build up fast while guests are in the house — check these every shift.', null, 90);

-- ── Scene 0 — Departure / Deep Clean ──────────────────────────────
-- Full house checklist, area by area, run once after guests leave and before the next
-- Pre-Arrival Preparation cycle begins. Not tied to the day counter.

-- A. Spa Area
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Spa Area', 'Bathroom #1', 'Restock toilet paper, clean towels, soap, hand lotion.', 10),
  (0, 'Spa Area', 'Bathroom #2', 'Restock toilet paper, clean towels, soap, hand lotion.', 20),
  (0, 'Spa Area', 'Changing room #1', 'Robes and spa slippers in place, used-clothing basket emptied.', 30),
  (0, 'Spa Area', 'Changing room #2', 'Robes and spa slippers in place, used-clothing basket emptied.', 40),
  (0, 'Spa Area', 'Full shower', 'Clean; check showerheads/settings (2 for rain shower, 1 handheld).', 50),
  (0, 'Spa Area', 'Cold shower', 'Clean.', 60),
  (0, 'Spa Area', 'Outdoor shower', 'Clean; check the motion sensor (left side of the shower).', 70),
  (0, 'Spa Area', 'Bathtub', 'Clean; check the controls by the tub.', 80),
  (0, 'Spa Area', 'White chair by the shower', 'Refill/clean Blue Lagoon shampoo, conditioner, shower gel, body lotion; wipe down.', 90),
  (0, 'Spa Area', 'Sauna', 'Check it is working correctly via Crestron (Misc → Sauna).', 100),
  (0, 'Spa Area', 'Spa floor', 'Vacuum and mop (stone floor).', 110);

-- B. Living Room & Common Areas
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Living Room & Common Areas', 'Fireplace', 'Check both extraction fans (upstairs/downstairs) show green/active in Crestron; listen at the fireplace and check the exhaust by the river; empty ashes; clean inside.', 10),
  (0, 'Living Room & Common Areas', 'Firewood', 'Restock the storage by the fireplace; check firelighter and firewood supply in the garage.', 20),
  (0, 'Living Room & Common Areas', 'Terrace heaters', 'Check they are working (Crestron → Misc → Spa Heaters).', 30),
  (0, 'Living Room & Common Areas', 'Floors', 'Vacuum all stone/wood floors, including under furniture.', 40),
  (0, 'Living Room & Common Areas', 'Stone floors', 'Mop kitchen, living room, stairs, spa, and gym.', 50),
  (0, 'Living Room & Common Areas', 'Stairs', 'Vacuum and hand-clean the blue Icelandic stone steps.', 60),
  (0, 'Living Room & Common Areas', 'Glass stair panels', 'Clean (best done in daylight).', 70),
  (0, 'Living Room & Common Areas', 'Light settings', 'Check throughout the house.', 80),
  (0, 'Living Room & Common Areas', 'Cushions', 'Fluff and arrange; send any covers that need it to dry-clean.', 90),
  (0, 'Living Room & Common Areas', 'All glass surfaces', 'Mirrors, interior windows, glass panels — clean with microfiber/glass paper (rv.is).', 100),
  (0, 'Living Room & Common Areas', 'Office — floor', 'Vacuum the wood floor.', 110),
  (0, 'Living Room & Common Areas', 'Office — surfaces', 'Dust shelves, electronics, decor.', 120),
  (0, 'Living Room & Common Areas', 'Office — high surfaces', 'Clean the bookshelf (weekly / between bookings — fits well here).', 130),
  (0, 'Living Room & Common Areas', 'Office — glass and doors', 'Clean glass panels, doors, windows.', 140),
  (0, 'Living Room & Common Areas', 'Office — terrace', 'Same terrace routine as the Master bedroom (see Laki).', 150),
  (0, 'Living Room & Common Areas', 'Office — computer', 'Clean the screen, organize the cables.', 160),
  (0, 'Living Room & Common Areas', 'Piano', 'Dust and polish with piano polish.', 170),
  (0, 'Living Room & Common Areas', 'Living room', 'Vacuum under and behind furniture.', 180),
  (0, 'Living Room & Common Areas', 'Living room fireplace', 'Fully clean out and prep a small fire for the next arrival.', 190),
  (0, 'Living Room & Common Areas', 'Living room cushions', 'Arrange; check the 6 decorative covers (dry-clean only) and check other cushions for stains.', 200),
  (0, 'Living Room & Common Areas', 'Side tables and decor', 'Dust/polish side tables, glass surfaces, living room decor.', 210),
  (0, 'Living Room & Common Areas', 'Candles above the fireplace', 'Clean the 6 candle holders — no wax residue.', 220),
  (0, 'Living Room & Common Areas', 'Louis Poulsen globe lamp', 'Charge it (USB-C cable is in the top-left drawer by the sink in the main kitchen).', 230);

-- C. Bedrooms — shared standard, applied per room, followed by room-specific tasks.
insert into tasks (scene_id, section, label, note, fixed_room_id, sort_order) values
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Restock robes, slippers, amenity kit, shower caps, soap, body lotion', null, 'laki', 10),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Set out a silk eye mask and earplugs at the bedside', null, 'laki', 20),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Fold and arrange linens and decorative items', null, 'laki', 30),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Vacuum the whole room', 'Check the wood floor for marks/stains.', 'laki', 40),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Mop the bathroom floor', null, 'laki', 50),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Wipe the nightstands', 'Including inside and outside of drawers.', 'laki', 60),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Polish the wardrobe handles', 'Dust shelves, rails, hangers.', 'laki', 70),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Fluff the duvet and pillows', null, 'laki', 80),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Set out bathrobes and disposable slippers', null, 'laki', 90),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Bathroom: clean the shower thoroughly', 'Ideally remove the drain cover to clean underneath.', 'laki', 100),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Bathroom: dry stainless steel fixtures', 'Clean glass panels, mirrors, sink area — remove the sink stopper, clean and dry underneath.', 'laki', 110),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Bathroom: clean and dry the cabinet under the sink', 'Inside and out.', 'laki', 120),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Bathroom: wipe down the hairdryer and straightener', 'Wrap cords neatly.', 'laki', 130),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Bathroom: refill and center the soap/lotion bottles', null, 'laki', 140),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Replace the TV remote batteries', 'Charge the Apple remote if needed.', 'laki', 150),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Wipe the TV screen and the Crestron panel', null, 'laki', 160),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Check light switches and door handles for marks', null, 'laki', 170),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Gently clean all wood doors', 'Avoid moisture.', 'laki', 180),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Gently wipe the soft chairs in one direction', null, 'laki', 190),
  (0, 'Bedrooms — Laki (Master, upstairs)', 'Terrace', 'Check for bird droppings (Karcher), wipe furniture, clean glass panels on door/window/handle, glass decor, water the plants.', 'laki', 200);

insert into tasks (scene_id, section, label, note, fixed_room_id, sort_order) values
  (0, 'Bedrooms — Katla (ground floor)', 'Restock robes, slippers, amenity kit, shower caps, soap, body lotion', null, 'katla', 10),
  (0, 'Bedrooms — Katla (ground floor)', 'Set out a silk eye mask and earplugs at the bedside', null, 'katla', 20),
  (0, 'Bedrooms — Katla (ground floor)', 'Fold and arrange linens and decorative items', null, 'katla', 30),
  (0, 'Bedrooms — Katla (ground floor)', 'Wipe the nightstands, drawers, and bookshelf', null, 'katla', 40),
  (0, 'Bedrooms — Katla (ground floor)', 'Clean the glass doors', null, 'katla', 50),
  (0, 'Bedrooms — Katla (ground floor)', 'Wipe the TV, replace batteries in both remotes', null, 'katla', 60),
  (0, 'Bedrooms — Katla (ground floor)', 'Bathroom: clean shower, toilet, mirror', null, 'katla', 70),
  (0, 'Bedrooms — Katla (ground floor)', 'Bathroom: remove the toothbrush holder to clean', null, 'katla', 80),
  (0, 'Bedrooms — Katla (ground floor)', 'Bathroom: clean the sink and surfaces', null, 'katla', 90),
  (0, 'Bedrooms — Katla (ground floor)', 'Bathroom: clean the cabinet above and below the sink', null, 'katla', 100),
  (0, 'Bedrooms — Katla (ground floor)', 'Bathroom: wipe the hairdryer and straightener', null, 'katla', 110),
  (0, 'Bedrooms — Katla (ground floor)', 'Bathroom: refill and arrange soaps/lotions', null, 'katla', 120),
  (0, 'Bedrooms — Katla (ground floor)', 'Set out robes, slippers, amenity kit, shower cap', null, 'katla', 130),
  (0, 'Bedrooms — Katla (ground floor)', 'Replace the eye mask and earplugs at the bed', null, 'katla', 140);

insert into tasks (scene_id, section, label, note, fixed_room_id, sort_order) values
  (0, 'Bedrooms — Heimaey', 'Restock robes, slippers, amenity kit, shower caps, soap, body lotion', null, 'heimaey', 10),
  (0, 'Bedrooms — Heimaey', 'Set out a silk eye mask and earplugs at the bedside', null, 'heimaey', 20),
  (0, 'Bedrooms — Heimaey', 'Fold and arrange linens and decorative items', null, 'heimaey', 30),
  (0, 'Bedrooms — Heimaey', 'Vacuum and mop the entire floor area', null, 'heimaey', 40),
  (0, 'Bedrooms — Heimaey', 'Bathroom: clean shower, toilet, sink', null, 'heimaey', 50),
  (0, 'Bedrooms — Heimaey', 'Wipe the mirror, clean the drawers under the sink, wipe hair products', null, 'heimaey', 60),
  (0, 'Bedrooms — Heimaey', 'Restock towels, robes, slippers, toiletries', null, 'heimaey', 70),
  (0, 'Bedrooms — Heimaey', 'Wipe the nightstand and wardrobe', null, 'heimaey', 80),
  (0, 'Bedrooms — Heimaey', 'Replace the eye mask and earplugs', null, 'heimaey', 90),
  (0, 'Bedrooms — Heimaey', 'Check linens for wear/stains, replace if needed', null, 'heimaey', 100);

insert into tasks (scene_id, section, label, note, fixed_room_id, sort_order) values
  (0, 'Bedrooms — Surtsey', 'Restock robes, slippers, amenity kit, shower caps, soap, body lotion', null, 'surtsey', 10),
  (0, 'Bedrooms — Surtsey', 'Set out a silk eye mask and earplugs at the bedside', null, 'surtsey', 20),
  (0, 'Bedrooms — Surtsey', 'Fold and arrange linens and decorative items', null, 'surtsey', 30),
  (0, 'Bedrooms — Surtsey', 'Vacuum and mop the entire floor area', null, 'surtsey', 40),
  (0, 'Bedrooms — Surtsey', 'TV — clean screen and remotes', null, 'surtsey', 50),
  (0, 'Bedrooms — Surtsey', 'Bathroom (no window): clean shower, toilet, sink', null, 'surtsey', 60),
  (0, 'Bedrooms — Surtsey', 'Wipe the drawer under the sink and hair products', null, 'surtsey', 70),
  (0, 'Bedrooms — Surtsey', 'Restock towels, robes, slippers, toiletries', null, 'surtsey', 80),
  (0, 'Bedrooms — Surtsey', 'Replace the eye mask and earplugs', null, 'surtsey', 90);

insert into tasks (scene_id, section, label, note, fixed_room_id, sort_order) values
  (0, 'Bedrooms — Hekla (Alex''s Room)', 'Restock robes, slippers, amenity kit, shower caps, soap, body lotion', null, 'hekla', 10),
  (0, 'Bedrooms — Hekla (Alex''s Room)', 'Set out a silk eye mask and earplugs at the bedside', null, 'hekla', 20),
  (0, 'Bedrooms — Hekla (Alex''s Room)', 'Fold and arrange linens and decorative items', null, 'hekla', 30),
  (0, 'Bedrooms — Hekla (Alex''s Room)', 'Vacuum and dust surfaces, nightstand, drawers', null, 'hekla', 40),
  (0, 'Bedrooms — Hekla (Alex''s Room)', 'Clean the small drawer unit', null, 'hekla', 50),
  (0, 'Bedrooms — Hekla (Alex''s Room)', 'Clean the window', null, 'hekla', 60),
  (0, 'Bedrooms — Hekla (Alex''s Room)', 'Clean the door and handle', null, 'hekla', 70),
  (0, 'Bedrooms — Hekla (Alex''s Room)', 'Make sure it is well-ventilated, dust-free, and tidy', null, 'hekla', 80),
  (0, 'Bedrooms — Hekla (Alex''s Room)', 'Replace the eye mask and earplugs', null, 'hekla', 90);

-- D. Bathrooms — general standards (all bathrooms, ensuite and shared)
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Bathrooms — General Standards', 'Empty trash bins and replace bags', null, 10),
  (0, 'Bathrooms — General Standards', 'Fold and replace all towels', 'Full sets: bath, hand, face, mats.', 20),
  (0, 'Bathrooms — General Standards', 'Restock amenity kits, shower caps, soap, lotion bottles', null, 30),
  (0, 'Bathrooms — General Standards', 'Polish chrome/stainless fixtures', 'Taps, drains, handles — dry and shiny.', 40),
  (0, 'Bathrooms — General Standards', 'Clean mirrors and glass completely streak-free', null, 50),
  (0, 'Bathrooms — General Standards', 'Clean the toilet inside and out, including hinges', null, 60),
  (0, 'Bathrooms — General Standards', 'Clean and dry the sink area, corners and edges', null, 70),
  (0, 'Bathrooms — General Standards', 'Countertops', 'Wipe down; use a mild cleaning solution if there are grease marks.', 80),
  (0, 'Bathrooms — General Standards', 'Check drawers/storage under the sink', null, 90),
  (0, 'Bathrooms — General Standards', 'Vacuum and mop the floor', 'Do this last, after the other tasks.', 100),
  (0, 'Bathrooms — General Standards', 'Arrange towels/robes/toiletries symmetrically', null, 110);

-- E. Kitchen
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Kitchen', 'Scrub and polish the stainless steel sink', 'Polish the tap streak-free.', 10),
  (0, 'Kitchen', 'Empty and clean the drawer under the sink', 'Including under the sink basin.', 20),
  (0, 'Kitchen', 'Deep-clean the recycling and general trash bins + storage boxes', null, 30),
  (0, 'Kitchen', 'Restock dishwasher tablets', null, 40),
  (0, 'Kitchen', 'Store sponges/brushes out of sight', null, 50),
  (0, 'Kitchen', 'Clean the stovetop', 'Remove grates, clean underneath them.', 60),
  (0, 'Kitchen', 'Clean and polish the extractor fan glass panels', 'Check/clean the fan filters.', 70),
  (0, 'Kitchen', 'Wipe/wash the placemats', null, 80),
  (0, 'Kitchen', 'Empty toaster crumbs', 'Wipe down, store on top of the fridge.', 90),
  (0, 'Kitchen', 'Arrange wine/liquor bottles neatly', null, 100),
  (0, 'Kitchen', 'Polish cutlery', null, 110),
  (0, 'Kitchen', 'Clean the oven inside and out', null, 120),
  (0, 'Kitchen', 'Clean the Nespresso machine''s removable parts', 'Capsule tray, water tank, drip tray; wipe the outside.', 130),
  (0, 'Kitchen', 'Polish the kettle dry and streak-free', null, 140),
  (0, 'Kitchen', 'Empty kitchen drawers', 'Clean inside, wipe outside.', 150),
  (0, 'Kitchen', 'Check and clean storage under the sink', null, 160),
  (0, 'Kitchen', 'Check expiry dates on all food', 'Throw out anything open/expired, seal and store what is still good for the next booking.', 170),
  (0, 'Kitchen', 'Empty upper and lower cabinets', 'Including spices and utensils — wipe and rearrange.', 180),
  (0, 'Kitchen', 'Deep-clean the fridge and freezer', 'Inside and out; throw out old items.', 190),
  (0, 'Kitchen', 'Rearrange the cabinets above the fridge', null, 200),
  (0, 'Kitchen', 'Polish glassware', null, 210),
  (0, 'Kitchen', 'Vacuum and mop the kitchen floor', 'Including edges and under cabinets.', 220),
  (0, 'Kitchen', 'Spot-clean tiles behind the coffee machine and TV', null, 230),
  (0, 'Kitchen', 'Wipe down the TV and the shelf underneath it', null, 240),
  (0, 'Kitchen', 'Wipe/dust light switches, handles, lamps', null, 250),
  (0, 'Kitchen', 'Check surfaces are streak- and fingerprint-free', 'Fridge doors, countertops, glass cabinet doors.', 260),
  (0, 'Kitchen', 'Make sure clean kitchen cloths/towels are available', null, 270),
  (0, 'Kitchen', 'Coffee machine and kettle', 'Clean, filled, ready.', 280),
  (0, 'Kitchen', 'Check Nespresso capsule stock', 'Notify the office if running low.', 290),
  (0, 'Kitchen', 'Pull out and wipe down every kitchen chair/stool', 'Including the stainless steel base under each; arrange chairs/stools at the table and island.', 300),
  (0, 'Kitchen', 'Check the extractor fan works correctly', 'Before/after cooking.', 310);

-- F. Dining Area
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Dining Area', 'Vacuum the floor', 'Including under and around chairs.', 10),
  (0, 'Dining Area', 'Wipe/polish the round dining table', null, 20),
  (0, 'Dining Area', 'Pull out and wipe down each chair', 'Including the stainless steel footrest.', 30),
  (0, 'Dining Area', 'Clean and polish the table decor and candle holders', null, 40),
  (0, 'Dining Area', 'Wipe/polish the chandelier above the table', 'Weekly — fits here if a week has passed.', 50),
  (0, 'Dining Area', 'Check glass panels and nearby windows', null, 60),
  (0, 'Dining Area', 'Make sure the table is centered under the light', null, 70),
  (0, 'Dining Area', 'Placemats washed/dried; napkins washed and ironed', null, 80),
  (0, 'Dining Area', 'Check all serving items are spotless', 'Plates, glasses, cutlery.', 90);

-- G. Stock check — snacks & drinks
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Stock Check — Snacks & Drinks', 'Soft drinks', 'Coca-Cola, Coca-Cola Zero, Sprite, Appelsín, Collab — check stock in the guest fridge.', 10),
  (0, 'Stock Check — Snacks & Drinks', 'Bottled tap water', 'Glass bottles — check stock in the dining room fridge.', 20),
  (0, 'Stock Check — Snacks & Drinks', 'Beer', 'Viking lager, Arctic pale ale — check stock.', 30),
  (0, 'Stock Check — Snacks & Drinks', 'Red / white wine / champagne', 'Check stock (wine cellar + fridge by the electrical panel).', 40),
  (0, 'Stock Check — Snacks & Drinks', 'Extra soft drinks', 'Gym storage fridge / dry storage by the living room — check.', 50),
  (0, 'Stock Check — Snacks & Drinks', 'Snack stock', 'Protein bars, Proper Popcorn, Proper Chips, nut packs — check.', 60),
  (0, 'Stock Check — Snacks & Drinks', 'Grill area', 'Check stock of marshmallows, s''mores crackers, cocktail sausages.', 70);
