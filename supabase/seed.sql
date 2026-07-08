-- Hlíðin Lodge Quality Manual — reference data seed
-- Run this once after schema.sql, in the Supabase SQL Editor.
-- Source: Scene_List_v1.md and Departure_Deep_Clean.md (the authoritative English
-- source docs). See README.md "Content decisions" for how the five flagged open
-- items (terrace heaters, glass surfaces, fireplace fan check, kitchen floor 3x/day,
-- fly season) were folded in below.

-- ── Rooms ────────────────────────────────────────────────────────

insert into rooms (id, name, description, sort_order) values
  ('laki',    'Laki',    'Master Bedroom, upper floor', 1),
  ('katla',   'Katla',   'Ground floor, next to the kitchen', 2),
  ('heimaey', 'Heimaey', 'Large guesthouse room', 3),
  ('surtsey', 'Surtsey', 'Small guesthouse room', 4),
  ('hekla',   'Hekla',   'Small room upstairs ("Alex''s Room")', 5);

-- ── Scenes ───────────────────────────────────────────────────────

insert into scenes (id, key, name, subtitle, recurs, sort_order) values
  (0, 'departure_deep_clean', 'Departure / Deep Clean',      'Once, after every booking',   false, 0),
  (1, 'pre_arrival',          'Pre-Arrival Preparation',     'Once, before arrival',        false, 1),
  (2, 'morning_of_arrival',   'Morning of Arrival',          'Once per booking',            false, 2),
  (3, 'before_arrival',       'Right Before Guests Arrive',  'Once per booking',            false, 3),
  (4, 'morning_shift',        'Morning Shift',               'Every day of the stay',       true,  4),
  (5, 'together_shift',       'Together Shift',              'Every day of the stay',       true,  5),
  (6, 'turndown',             'Turndown Service',            'Every day of the stay',       true,  6),
  (7, 'night_shift',          'Night Shift',                 'Every day of the stay',       true,  7);

-- ── Shared components ────────────────────────────────────────────

insert into scene_components (id, name) values
  ('cheese_platter', 'Cheese Platter'),
  ('snack_basket', 'Snack Basket');

insert into component_items (component_id, label, sort_order) values
  ('cheese_platter', 'Cheeses', 1),
  ('cheese_platter', 'Ham', 2),
  ('cheese_platter', 'Salami', 3),
  ('cheese_platter', 'Olives (with cocktail picks)', 4),
  ('cheese_platter', 'Jams', 5),
  ('cheese_platter', 'Honey', 6),
  ('cheese_platter', 'Mixed nuts', 7),
  ('cheese_platter', 'Raspberries', 8),
  ('cheese_platter', 'Blueberries', 9),
  ('cheese_platter', 'Strawberries', 10),
  ('cheese_platter', 'Grapes', 11),
  ('cheese_platter', 'Mini toasts', 12),
  ('cheese_platter', 'Crackers', 13),
  ('cheese_platter', 'Ritz crackers', 14),
  ('cheese_platter', 'Rosemary', 15),
  ('cheese_platter', 'Thyme', 16),
  ('cheese_platter', 'Cheese knives', 17),
  ('cheese_platter', 'Small spoons', 18),
  ('cheese_platter', 'Milk (2): skimmed and semi-skimmed', 19),
  ('cheese_platter', 'Oat milk', 20),
  ('cheese_platter', 'Lemon', 21),
  ('cheese_platter', 'Lime', 22),
  ('cheese_platter', 'Ginger', 23),
  ('cheese_platter', 'Fresh mint', 24),
  ('cheese_platter', 'Orange juice', 25),
  ('cheese_platter', 'Large candles', 26),
  ('cheese_platter', 'Small candles', 27),
  ('snack_basket', 'Bottled water', 1),
  ('snack_basket', 'Protein bars', 2),
  ('snack_basket', 'Individually packed nuts', 3),
  ('snack_basket', 'Proper Popcorn', 4),
  ('snack_basket', 'Proper Chips', 5),
  ('snack_basket', 'Fruit', 6),
  ('snack_basket', 'Chocolates and candy (evening snack)', 7),
  ('snack_basket', 'Cereal (evening availability)', 8),
  ('snack_basket', 'Cookies/crackers (evening availability)', 9);

-- ── Scene 1 — Pre-Arrival Preparation (Tasks Before Guests) ──────

insert into tasks (scene_id, section, label, note, sort_order) values
  (1, 'Tasks Before Guests', 'Clean the fireplace', 'Check that the fireplace extraction fan (upstairs/downstairs) is green/active before lighting.', 10),
  (1, 'Tasks Before Guests', 'Restock drinks', null, 20),
  (1, 'Tasks Before Guests', 'Charge the portable speakers', 'Kept in the garage.', 30),
  (1, 'Tasks Before Guests', 'Replace candles', null, 40),
  (1, 'Tasks Before Guests', 'Empty all bins', null, 50),
  (1, 'Tasks Before Guests', 'Make the beds properly and put on fresh bed linen', null, 60),
  (1, 'Tasks Before Guests', 'Set out towels', null, 70),
  (1, 'Tasks Before Guests', 'Set out bathrobes and slippers', null, 80),
  (1, 'Tasks Before Guests', 'Bring up firewood', null, 90),
  (1, 'Tasks Before Guests', 'Iron', null, 100),
  (1, 'Tasks Before Guests', 'Empty the hot tub', null, 110),
  (1, 'Tasks Before Guests', 'Vacuum and mop', null, 120),
  (1, 'Tasks Before Guests', 'Wash cleaning cloths', null, 130);

-- ── Scene 2 — Morning of Arrival ─────────────────────────────────

insert into tasks (scene_id, section, label, note, sort_order) values
  (2, 'Morning of Arrival', 'Clean the hot tub', null, 10),
  (2, 'Morning of Arrival', 'Clean bird droppings', null, 20),
  (2, 'Morning of Arrival', 'Remove spider webs', null, 30),
  (2, 'Morning of Arrival', 'Restock food', null, 40),
  (2, 'Morning of Arrival', 'Put out fresh flowers', null, 50),
  (2, 'Morning of Arrival', 'Add fragrance', null, 60),
  (2, 'Morning of Arrival', 'Print welcome letters', null, 70),
  (2, 'Morning of Arrival', 'Place water jugs in the bedrooms', null, 80);

-- ── Scene 3 — Right Before Guests Arrive ─────────────────────────

insert into tasks (scene_id, section, label, note, component_id, sort_order) values
  (3, 'Right Before Guests Arrive', 'Turn on the sauna', 'The sauna needs 4 hours to preheat — schedule this based on the actual arrival time, not just "right before".', null, 10),
  (3, 'Right Before Guests Arrive', 'Vacuum', null, null, 20),
  (3, 'Right Before Guests Arrive', 'Set up drinks, music, fireplace, candles, and lights', null, null, 30),
  (3, 'Right Before Guests Arrive', 'Prepare the Cheese Platter', null, 'cheese_platter', 40),
  (3, 'Right Before Guests Arrive', 'Check the hot tub', null, null, 50),
  (3, 'Right Before Guests Arrive', 'Remove the hot tub cover', null, null, 60),
  (3, 'Right Before Guests Arrive', 'Put the hot tub cover back on', null, null, 70),
  (3, 'Right Before Guests Arrive', 'Turn off the sauna', null, null, 80);

-- ── Scene 4 — Morning Shift ───────────────────────────────────────
-- Includes resolved open items from Scene_List_v1.md's "Notes and Possible Gaps":
-- kitchen floor 3x/day (pass 1 of 3) and recurring glass-surfaces / terrace-heater
-- checks (see README "Content decisions").

insert into tasks (scene_id, section, label, note, component_id, sort_order) values
  (4, 'Morning Shift', 'Prepare the Snack Baskets', 'With snacks, water, etc. — see the shared checklist.', 'snack_basket', 10),
  (4, 'Morning Shift', 'Empty two dishwashers', null, null, 20),
  (4, 'Morning Shift', 'Clean the fireplace', null, null, 30),
  (4, 'Morning Shift', 'Clean the dryer filters and empty the water container', null, null, 40),
  (4, 'Morning Shift', 'Vacuum/mop the kitchen floor', 'Pass 1 of 3 for the day — after breakfast.', null, 50),
  (4, 'Morning Shift', 'Clean glass surfaces and staircase panels', 'Fingerprints build up fast while guests are in the house — check these every shift.', null, 60),
  (4, 'Morning Shift', 'Check the terrace heaters', 'Confirm they are still running correctly — check every 2-4 hours while in use (timer maxes out at 4 hours).', null, 70);

-- ── Scene 5 — Together Shift ──────────────────────────────────────
-- room_scoped tasks get one checklist instance per currently-occupied room, gated by
-- that room's "Guests out" status for the day (see the assignment/dashboard screens).
-- "Clean the bedrooms" in the source doc is the heading for this per-room group,
-- not a separate checklist item, so it isn't repeated as its own task here.

insert into tasks (scene_id, section, label, note, room_scoped, sort_order) values
  (5, 'Bedrooms (per occupied room)', 'Replace water jugs and glasses', null, true, 10),
  (5, 'Bedrooms (per occupied room)', 'Make the bed', null, true, 20),
  (5, 'Bedrooms (per occupied room)', 'Replace towels', null, true, 30),
  (5, 'Bedrooms (per occupied room)', 'Replace bathrobes and/or slippers', null, true, 40),
  (5, 'Bedrooms (per occupied room)', 'Empty bathroom bins', null, true, 50),
  (5, 'Bedrooms (per occupied room)', 'Fold the toilet paper into a square (or replace if needed)', null, true, 60),
  (5, 'Bedrooms (per occupied room)', 'Vacuum', null, true, 70),
  (5, 'Bedrooms (per occupied room)', 'Mop', null, true, 80);

insert into tasks (scene_id, section, label, note, sort_order) values
  (5, 'Whole House', 'Take the large rubbish bags to the car', null, 90),
  (5, 'Whole House', 'Clean glass surfaces and staircase panels', 'Fingerprints build up fast while guests are in the house — check these every shift.', 100),
  (5, 'Whole House', 'Check the terrace heaters', 'Confirm they are still running correctly — check every 2-4 hours while in use (timer maxes out at 4 hours).', 110);

-- ── Scene 6 — Turndown Service ────────────────────────────────────

insert into tasks (scene_id, section, label, note, sort_order) values
  (6, 'Turndown Service', 'Dim the lights', null, 10),
  (6, 'Turndown Service', 'Turn on the bedside lamps', null, 20),
  (6, 'Turndown Service', 'Lower the blinds', null, 30),
  (6, 'Turndown Service', 'Pull the duvet cover back slightly', null, 40),
  (6, 'Turndown Service', 'Lay out the blanket', null, 50),
  (6, 'Turndown Service', 'Remove the large decorative cushion', null, 60),
  (6, 'Turndown Service', 'Place 2 bottles of water', null, 70),
  (6, 'Turndown Service', 'Open the windows', null, 80),
  (6, 'Turndown Service', 'Vacuum/mop the kitchen floor', 'Pass 2 of 3 for the day — before guests return.', 90),
  (6, 'Turndown Service', 'Clean glass surfaces and staircase panels', 'Fingerprints build up fast while guests are in the house — check these every shift.', 100);

-- ── Scene 7 — Night Shift ─────────────────────────────────────────

insert into tasks (scene_id, section, label, note, component_id, sort_order) values
  (7, 'Night Shift', 'Iron the napkins', null, null, 10),
  (7, 'Night Shift', 'Prepare the welcome setup', 'Drinks + Cheese Platter, light the candles, light the fireplace, turn on the music, switch on all the lights in the house, remove the hot tub cover, and turn on the sauna.', 'cheese_platter', 20),
  (7, 'Night Shift', 'Replace candles', null, null, 30),
  (7, 'Night Shift', 'Sweep and mop the dining area', null, null, 40),
  (7, 'Night Shift', 'Prepare the Snack Basket', null, 'snack_basket', 50),
  (7, 'Night Shift', 'Blow out the candles', null, null, 60),
  (7, 'Night Shift', 'Take the large rubbish bags to the car', null, null, 70),
  (7, 'Night Shift', 'Vacuum/mop the kitchen floor', 'Pass 3 of 3 for the day — after dinner.', null, 80),
  (7, 'Night Shift', 'Clean glass surfaces and staircase panels', 'Fingerprints build up fast while guests are in the house — check these every shift.', null, 90);

-- ── Scene 0 — Departure / Deep Clean ──────────────────────────────
-- Full house checklist, area by area, run once after guests leave and before the next
-- Pre-Arrival Preparation cycle begins. Not tied to the day counter.

-- A. Spa Area
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Spa Area', 'Bathroom #1', 'Toilet paper, clean hand towels, soap, hand cream restocked.', 10),
  (0, 'Spa Area', 'Bathroom #2', 'Toilet paper, clean hand towels, soap, hand cream restocked.', 20),
  (0, 'Spa Area', 'Changing Room #1', 'Robes and spa slippers in place, basket for used items emptied.', 30),
  (0, 'Spa Area', 'Changing Room #2', 'Robes and spa slippers in place, basket for used items emptied.', 40),
  (0, 'Spa Area', 'Full shower', 'Cleaned; check shower dials (2 for rain shower, 1 handheld).', 50),
  (0, 'Spa Area', 'Cold shower', 'Cleaned.', 60),
  (0, 'Spa Area', 'Outdoor shower', 'Cleaned; check the motion sensor (left of the shower).', 70),
  (0, 'Spa Area', 'Bathtub', 'Cleaned; check the controls beside the tub.', 80),
  (0, 'Spa Area', 'White stool by the shower', 'Restock/clean Blue Lagoon shampoo, conditioner, shower gel, lotion; wipe down.', 90),
  (0, 'Spa Area', 'Sauna', 'Confirm it''s working correctly via Crestron (Misc → Sauna).', 100),
  (0, 'Spa Area', 'Spa floor', 'Vacuumed and mopped.', 110);

-- B. Living Room and Common Areas
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Living Room and Common Areas', 'Fireplace', 'Confirm both extraction fans (upstairs/downstairs) are green/active in Crestron; listen at the fireplace + check the outlet by the river; empty ash; clean inside.', 10),
  (0, 'Living Room and Common Areas', 'Firewood', 'Restock the storage by the fireplace; check garage stock of firewood and ignition tablets.', 20),
  (0, 'Living Room and Common Areas', 'Terrace heaters', 'Confirm they''re working (Crestron → Misc → Spa Heaters).', 30),
  (0, 'Living Room and Common Areas', 'Floors', 'Vacuum all stone/wood floors, including under furniture.', 40),
  (0, 'Living Room and Common Areas', 'Stone floors', 'Mop kitchen, living room, stairs, spa, and gym floors.', 50),
  (0, 'Living Room and Common Areas', 'Stairs', 'Vacuum and hand-clean the Icelandic bluestone steps.', 60),
  (0, 'Living Room and Common Areas', 'Glass stair panels', 'Cleaned (best done in daylight).', 70),
  (0, 'Living Room and Common Areas', 'Lighting', 'Check settings throughout the house.', 80),
  (0, 'Living Room and Common Areas', 'Cushions', 'Fluffed/straightened; send covers for dry-cleaning where needed.', 90),
  (0, 'Living Room and Common Areas', 'All glass surfaces', 'Mirrors, interior windows, glass panels — cleaned with microfiber/window paper (rv.is).', 100),
  (0, 'Living Room and Common Areas', 'Office — floor', 'Wooden floor vacuumed.', 110),
  (0, 'Living Room and Common Areas', 'Office — surfaces', 'Shelves, electronics, décor dusted.', 120),
  (0, 'Living Room and Common Areas', 'Office — high surfaces', 'Bookshelf top cleaned (weekly / between bookings — fits well here).', 130),
  (0, 'Living Room and Common Areas', 'Office — glass and doors', 'Glass panels, doors, windows cleaned.', 140),
  (0, 'Living Room and Common Areas', 'Office — terrace', 'Same terrace routine as the Master bedroom (see Laki below).', 150),
  (0, 'Living Room and Common Areas', 'Office — computer', 'Screen cleaned, cables organized.', 160),
  (0, 'Living Room and Common Areas', 'Piano', 'Dusted and polished with piano polish.', 170),
  (0, 'Living Room and Common Areas', 'Living room', 'Vacuumed under and behind furniture.', 180),
  (0, 'Living Room and Common Areas', 'Living room fireplace', 'Fully cleaned and a small fire prepared for the next arrival.', 190),
  (0, 'Living Room and Common Areas', 'Living room cushions', 'Straightened; check the 6 decorative cushion covers (dry-clean only) and spot-clean marks on other cushions.', 200),
  (0, 'Living Room and Common Areas', 'Side tables, glass surfaces, décor', 'Wiped/polished.', 210),
  (0, 'Living Room and Common Areas', '6 candles above the fireplace', 'Holders cleaned, no wax residue.', 220),
  (0, 'Living Room and Common Areas', 'Louis Poulsen globe light', 'Charged (USB-C cable in the top drawer, far left of the sink in the main kitchen).', 230);

-- C. Bedrooms — common to all rooms, applied per room, followed by room-specific tasks.
insert into tasks (scene_id, section, label, note, fixed_room_id, sort_order) values
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Restock robes, slippers, vanity kits, shower caps, soap, lotion', null, 'laki', 10),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Place silk eye mask and earplugs at bedside', null, 'laki', 20),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Fold and arrange linens and decorative items', null, 'laki', 30),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Vacuum the entire room', 'Check wooden floors for marks/stains.', 'laki', 40),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Mop the bathroom floor', null, 'laki', 50),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Clean bedside tables', 'Including drawers inside and out.', 'laki', 60),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Polish wardrobe handles', 'Dust shelves, rails, hangers.', 'laki', 70),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Fluff duvet and pillows', null, 'laki', 80),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Set out bathrobes and disposable slippers', null, 'laki', 90),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Bathroom: clean the shower thoroughly', 'Ideally remove shower tiles to clean the drain.', 'laki', 100),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Bathroom: wipe stainless steel fixtures', 'Clean glass panels, mirrors, sink area (remove the sink attachment, clean it, dry underneath).', 'laki', 110),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Bathroom: clean and dry the cabinet below the sink', 'Inside and out.', 'laki', 120),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Bathroom: wipe down hairdryer and straightener', 'Coil cords neatly.', 'laki', 130),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Bathroom: refill and centre soap/lotion bottles', null, 'laki', 140),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Replace TV remote batteries', 'Charge the Apple remote if needed.', 'laki', 150),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Dust the TV screen, wipe the Crestron panel', null, 'laki', 160),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Check light switches and door handles for smudges', null, 'laki', 170),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Clean all wooden doors carefully', 'Avoid introducing dampness.', 'laki', 180),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Wipe the soft armchairs gently in one direction', null, 'laki', 190),
  (0, 'Laki — Master Bedroom (Upper Floor)', 'Terrace', 'Check for bird droppings (Karcher), wipe furniture, clean the glass panel on the door/window/handles and the glass feature, water the flowers.', 'laki', 200);

insert into tasks (scene_id, section, label, note, fixed_room_id, sort_order) values
  (0, 'Katla — Ground Floor Room by Kitchen', 'Restock robes, slippers, vanity kits, shower caps, soap, lotion', null, 'katla', 10),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Place silk eye mask and earplugs at bedside', null, 'katla', 20),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Fold and arrange linens and decorative items', null, 'katla', 30),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Clean bedside tables, drawers, bookshelf', null, 'katla', 40),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Clean glass windows and doors', null, 'katla', 50),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Wipe the TV, replace batteries in both remotes', null, 'katla', 60),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Bathroom: clean shower, toilet, mirror', null, 'katla', 70),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Bathroom: remove the toothbrush holder to clean it', null, 'katla', 80),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Bathroom: clean the sink and surface', null, 'katla', 90),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Bathroom: clean the cabinet above and below the sink', null, 'katla', 100),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Bathroom: wipe down hairdryer and straightener', null, 'katla', 110),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Bathroom: refill and align soaps/lotions', null, 'katla', 120),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Place robes, slippers, vanity kit, shower cap', null, 'katla', 130),
  (0, 'Katla — Ground Floor Room by Kitchen', 'Replace eye mask and earplugs at bedside', null, 'katla', 140);

insert into tasks (scene_id, section, label, note, fixed_room_id, sort_order) values
  (0, 'Heimaey — Large Guesthouse Room', 'Restock robes, slippers, vanity kits, shower caps, soap, lotion', null, 'heimaey', 10),
  (0, 'Heimaey — Large Guesthouse Room', 'Place silk eye mask and earplugs at bedside', null, 'heimaey', 20),
  (0, 'Heimaey — Large Guesthouse Room', 'Fold and arrange linens and decorative items', null, 'heimaey', 30),
  (0, 'Heimaey — Large Guesthouse Room', 'Vacuum and mop the entire floor area', null, 'heimaey', 40),
  (0, 'Heimaey — Large Guesthouse Room', 'Bathroom: clean shower, toilet, sink', null, 'heimaey', 50),
  (0, 'Heimaey — Large Guesthouse Room', 'Wipe the mirror, clean the drawers under the sink, wipe hair accessories', null, 'heimaey', 60),
  (0, 'Heimaey — Large Guesthouse Room', 'Restock towels, bathrobes, slippers, amenities', null, 'heimaey', 70),
  (0, 'Heimaey — Large Guesthouse Room', 'Dust bedside tables and wardrobe', null, 'heimaey', 80),
  (0, 'Heimaey — Large Guesthouse Room', 'Replace eye mask and earplugs at bedside', null, 'heimaey', 90),
  (0, 'Heimaey — Large Guesthouse Room', 'Check linens for wear or stains; replace as needed', null, 'heimaey', 100);

insert into tasks (scene_id, section, label, note, fixed_room_id, sort_order) values
  (0, 'Surtsey — Small Guesthouse Room', 'Restock robes, slippers, vanity kits, shower caps, soap, lotion', null, 'surtsey', 10),
  (0, 'Surtsey — Small Guesthouse Room', 'Place silk eye mask and earplugs at bedside', null, 'surtsey', 20),
  (0, 'Surtsey — Small Guesthouse Room', 'Fold and arrange linens and decorative items', null, 'surtsey', 30),
  (0, 'Surtsey — Small Guesthouse Room', 'Vacuum and mop the entire floor area', null, 'surtsey', 40),
  (0, 'Surtsey — Small Guesthouse Room', 'TV — clean the screen and remotes', null, 'surtsey', 50),
  (0, 'Surtsey — Small Guesthouse Room', 'Bathroom (no window): clean shower, toilet, sink', null, 'surtsey', 60),
  (0, 'Surtsey — Small Guesthouse Room', 'Wipe the drawer beneath the sink and hair accessories', null, 'surtsey', 70),
  (0, 'Surtsey — Small Guesthouse Room', 'Restock towels, bathrobes, slippers, amenities', null, 'surtsey', 80),
  (0, 'Surtsey — Small Guesthouse Room', 'Replace eye mask and earplugs at bedside', null, 'surtsey', 90);

insert into tasks (scene_id, section, label, note, fixed_room_id, sort_order) values
  (0, 'Hekla — Small Room Upstairs (Alex''s Room)', 'Restock robes, slippers, vanity kits, shower caps, soap, lotion', null, 'hekla', 10),
  (0, 'Hekla — Small Room Upstairs (Alex''s Room)', 'Place silk eye mask and earplugs at bedside', null, 'hekla', 20),
  (0, 'Hekla — Small Room Upstairs (Alex''s Room)', 'Fold and arrange linens and decorative items', null, 'hekla', 30),
  (0, 'Hekla — Small Room Upstairs (Alex''s Room)', 'Vacuum and dust surfaces, bedside table, drawers', null, 'hekla', 40),
  (0, 'Hekla — Small Room Upstairs (Alex''s Room)', 'Clean the small drawer unit', null, 'hekla', 50),
  (0, 'Hekla — Small Room Upstairs (Alex''s Room)', 'Clean the window', null, 'hekla', 60),
  (0, 'Hekla — Small Room Upstairs (Alex''s Room)', 'Clean the door and handles', null, 'hekla', 70),
  (0, 'Hekla — Small Room Upstairs (Alex''s Room)', 'Confirm the room is aired out, dust-free, and neatly arranged', null, 'hekla', 80),
  (0, 'Hekla — Small Room Upstairs (Alex''s Room)', 'Replace eye mask and earplugs at bedside', null, 'hekla', 90);

-- D. Bathrooms — general standards (all bathrooms, ensuite and shared)
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Bathrooms — General Standards', 'Empty waste bins and replace liners', null, 10),
  (0, 'Bathrooms — General Standards', 'Fold and replace all towels', 'Complete sets: bath, hand, face, mat.', 20),
  (0, 'Bathrooms — General Standards', 'Restock vanity kits, shower caps, soap, lotion bottles', null, 30),
  (0, 'Bathrooms — General Standards', 'Polish chrome/stainless steel fixtures', 'Taps, drains, handles — dry and streak-free.', 40),
  (0, 'Bathrooms — General Standards', 'Clean mirrors and glass to a streak-free finish', null, 50),
  (0, 'Bathrooms — General Standards', 'Clean the toilet inside and out, including hinges', null, 60),
  (0, 'Bathrooms — General Standards', 'Clean and dry the sink area, corners and edges', null, 70),
  (0, 'Bathrooms — General Standards', 'Countertops', 'Wipe dry, use a mild detergent mix if there''s grease buildup.', 80),
  (0, 'Bathrooms — General Standards', 'Check drawers/under-sink storage', null, 90),
  (0, 'Bathrooms — General Standards', 'Vacuum and mop the floor', 'Last, after everything else.', 100),
  (0, 'Bathrooms — General Standards', 'Confirm towels/robes/amenities are placed symmetrically', null, 110);

-- E. Kitchen
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Kitchen', 'Scrub and polish the stainless steel sink basin', 'Polish the tap streak-free.', 10),
  (0, 'Kitchen', 'Empty and clean the drawer beneath the sink', 'Including under the basin.', 20),
  (0, 'Kitchen', 'Deep clean the recycling and general waste bins', 'Plus the storage box.', 30),
  (0, 'Kitchen', 'Refill dishwasher tablets', null, 40),
  (0, 'Kitchen', 'Store sponges/brushes out of sight', null, 50),
  (0, 'Kitchen', 'Clean the stovetop', 'Remove grates, clean beneath them.', 60),
  (0, 'Kitchen', 'Clean and polish the extraction fan mirrors', 'Check/clean the fan filters.', 70),
  (0, 'Kitchen', 'Wipe/wash placemats', null, 80),
  (0, 'Kitchen', 'Empty crumbs from the toaster', 'Wipe it down, store above the fridge.', 90),
  (0, 'Kitchen', 'Arrange wine/liquor bottles neatly', null, 100),
  (0, 'Kitchen', 'Polish cutlery', null, 110),
  (0, 'Kitchen', 'Clean the oven inside and out', null, 120),
  (0, 'Kitchen', 'Clean removable Nespresso machine parts', 'Capsule tray, water tank, drip grid; wipe the exterior.', 130),
  (0, 'Kitchen', 'Polish the kettle dry and streak-free', null, 140),
  (0, 'Kitchen', 'Empty kitchen drawers', 'Clean inside, wipe exteriors.', 150),
  (0, 'Kitchen', 'Inspect and clean under-sink storage', null, 160),
  (0, 'Kitchen', 'Check expiry dates on all food', 'Discard opened/expired items, seal and store in-date items for the next booking.', 170),
  (0, 'Kitchen', 'Empty upper and lower cabinets', 'Including spices and utensils — wipe down and reorganize.', 180),
  (0, 'Kitchen', 'Deep clean the fridge and freezer', 'Inside and out; remove old items.', 190),
  (0, 'Kitchen', 'Reorganize the cabinets above the fridge', null, 200),
  (0, 'Kitchen', 'Polish glassware', null, 210),
  (0, 'Kitchen', 'Vacuum and mop kitchen floors', 'Including edges and under cabinets.', 220),
  (0, 'Kitchen', 'Spot clean backsplash tiles', 'Behind the coffee machine and TV.', 230),
  (0, 'Kitchen', 'Dust the TV and the shelf beneath it', null, 240),
  (0, 'Kitchen', 'Dust light switches, handles, lamps', null, 250),
  (0, 'Kitchen', 'Confirm surfaces are streak- and fingerprint-free', 'Fridge doors, countertops, glass cabinet fronts.', 260),
  (0, 'Kitchen', 'Confirm clean kitchen cloths/towels are available', null, 270),
  (0, 'Kitchen', 'Coffee machine and kettle', 'Clean, filled, ready.', 280),
  (0, 'Kitchen', 'Check Nespresso capsule stock', 'Notify the office if running low.', 290),
  (0, 'Kitchen', 'Pull out and wipe every kitchen chair', 'Including the stainless steel parts underneath; straighten chairs/stools at the table and island.', 300),
  (0, 'Kitchen', 'Confirm the extraction fan is working correctly', 'Before/after cooking.', 310);

-- F. Dining Room (Kitchen Dining Area)
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Dining Room', 'Vacuum the floor', 'Including under and around chairs.', 10),
  (0, 'Dining Room', 'Wipe/polish the round dining table', null, 20),
  (0, 'Dining Room', 'Pull out and wipe each chair', 'Including the stainless steel base.', 30),
  (0, 'Dining Room', 'Clean and polish decorative objects and candle holders on the table', null, 40),
  (0, 'Dining Room', 'Dust/polish the light fixture above the table', 'Weekly — fits here if a week has passed.', 50),
  (0, 'Dining Room', 'Check nearby glass panels and windows', null, 60),
  (0, 'Dining Room', 'Confirm the table is centred under the light fixture', null, 70),
  (0, 'Dining Room', 'Placemats washed/wiped; napkins laundered and ironed', null, 80),
  (0, 'Dining Room', 'Confirm all service items are spotless and ready', 'Plates, glasses, cutlery.', 90);

-- G. Stock Levels — Snacks and Drinks
insert into tasks (scene_id, section, label, note, sort_order) values
  (0, 'Stock Levels — Snacks and Drinks', 'Soft drinks', 'Coca-Cola, Coca-Cola Zero, Sprite, Appelsín, Collab — guest fridge stock checked.', 10),
  (0, 'Stock Levels — Snacks and Drinks', 'Bottled tap water', 'Dining room fridge stock checked.', 20),
  (0, 'Stock Levels — Snacks and Drinks', 'Beer', 'Viking lager, Arctic pale ale — stock checked.', 30),
  (0, 'Stock Levels — Snacks and Drinks', 'Red/white wine/champagne', 'Stock checked (wine cellar + fridge by the fuse box).', 40),
  (0, 'Stock Levels — Snacks and Drinks', 'Extra soft drinks', 'Gym storage fridge / dry storage near the living room — checked.', 50),
  (0, 'Stock Levels — Snacks and Drinks', 'Snack stock', 'Protein bars, Proper Popcorn, Proper Chips, packed nuts — checked.', 60),
  (0, 'Stock Levels — Snacks and Drinks', 'Firepit supplies', 'Marshmallows, graham crackers, cocktail sausages checked.', 70);
