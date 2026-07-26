Ashen Bastion - Bonus Leaderboard UI update

Ce s-a schimbat:
- am scos butoanele Start Wave / Pause / Reset din hero-ul din dreapta sus
- în locul lor apare un card compact: Online Endless Bonus Top 5
- cardul citește topul global din /.netlify/functions/get-bonus-leaderboard
- la Game Over în Endless Mode, jocul trimite bonus score-ul în leaderboard

Ce mai trebuie:
1. rulează sql/setup_leaderboard.sql în Neon / Netlify DB
2. deploy pe Netlify cu package.json inclus
3. verifică Functions logs dacă leaderboard-ul nu răspunde

Spell system restored:
- Frost Nova: slow AoE
- Meteor Strike: damage AoE
- Chain Lightning: multi-target hit


Serious anti-cheat update:
- create /.netlify/functions/start-run before a real run
- submit-score validates signed run tokens, DB-backed rate limits, IP/user-agent fingerprint, single-use run IDs, and plausibility checks
- run setup_leaderboard.sql again after this update

v0.8 RPG foundation:
- Varyn hero with persistent XP and levels
- tactical road movement, auto combat, blocking, death and respawn
- Rift Pulse active ability (C)
- versioned player profile with legacy progress import
- run save v3 remains compatible with v2 saves
- architecture audit and roadmap: docs/ARCHITECTURE_ROADMAP.md
- validation: npm run check && npm test

v0.8.1 Combat architecture:
- deterministic RunRng with seed/state persisted in run save v4
- backward-compatible loading for run saves v2 and v3
- reusable EnemyBehaviorSystem with Pack Hunter, Bulwark and Last Stand
- data-driven BossPhaseSystem with three phases per campaign boss
- telegraphed boss transitions, persistent shields and stronger late phases
- all combat damage flows through one shield-aware damage adapter
- validation: 17 unit tests plus desktop/mobile browser smoke tests

v0.8.2 Application architecture:
- explicit RunStateMachine for idle, ready, wave, paused, reward, transition and game-over phases
- invalid run transitions are rejected instead of creating contradictory flags
- run save v5 persists the flow snapshot and still loads v2, v3 and v4 saves
- shared ApiClient for every Netlify Function used by the game
- typed API errors, timeout handling, query serialization and sendBeacon support
- game.js no longer calls fetch directly
- validation: 27 unit tests plus start/wave/pause/resume/reset and v4/v5 browser checks

v0.9.0 Procedural loot foundation:
- data-driven item, rarity, affix and boss reward catalogs
- deterministic RewardGenerator driven by the persisted run RNG
- stable reward and item IDs prevent duplicate boss rewards after reload
- persistent Loot Cache preserves unclaimed equipment between sessions
- profile schema v2 sanitizes and migrates reward and inventory collections
- boss reward UI shows rarity, item level, slot, affix and Power
- Inventory and Equipment UI are intentionally reserved for the next v0.9 slice
- validation: 34 unit tests plus a complete live boss reward and reload check

v0.9.1 Inventory and Equipment:
- atomic claim from Loot Cache into a persistent 40-slot inventory
- zero item loss when capacity or duplicate validation blocks a claim
- five validated equipment slots for Varyn: weapon, armor, boots, ring and charm
- safe equip, swap and unequip operations; replaced items stay in Inventory
- Hero Stat Pipeline composes flat, percentage, cooldown, speed and boss bonuses
- equipment modifies real hero combat, HP, cooldown and respawn values
- responsive Inventory & Equipment overlay with filtering, sorting and live stat preview
- profile schema v3 persists sanitized hero loadouts and writes migrations immediately
- validation: 44 unit tests plus claim/equip/reload/unequip desktop and 390x844 browser checks

v0.9.2 Hero Skill Tree and Reward Pity:
- nine data-driven Varyn skills across Warden's Blade, Riftcaller and Last Bastion
- one skill point per hero level after Level 1, with rank caps and prerequisites
- persistent purchase and two-step Respec without losing XP, loot or equipment
- skill bonuses and equipment bonuses compose through the same Hero Stat Pipeline
- deterministic Rare and Epic pity counters are isolated per reward table
- pity advances atomically only when a unique reward bundle enters Loot Cache
- profile schema v4 sanitizes hero skill ranks and persists migrations immediately
- responsive Hero Skill Tree overlay, header badge and K keyboard shortcut
- validation: 54 unit tests plus purchase/reload/respec desktop and 390x844 browser checks

v0.9.2c Salvage, Essence, Crystals & Shop:
- salvage inventory items into persistent Essence; Discard removes them outright
- craft 100 Essence into 1 Crystal (manual button in the Inventory overlay)
- crafted Crystals feed the SAME wallet as Ascension Crystals (1:1, no multiplier)
- the "Ascension" overlay is now the "Shop" with three tabs:
  * Ascension — Radiance, Bastion and Arcana permanent talents
  * Tower — Special Towers (Cryo unlock and upgrades)
  * Rename — change your leaderboard username for 150 Crystals each time
- new Netlify Function: rename-username (auth-gated, uniqueness-checked); Crystals
  are only spent after the server confirms the new name, so a taken name costs nothing
- no new SQL migration required (users.username already exists and is unique)
- validation: 64 unit tests plus salvage/craft/reload and Shop tab browser checks

v0.9.2d Hero Power leaderboard:
- new global online board ranking players by total Hero Power (equipment + skills)
- total power = equipment power + spent skill points × 25
- new SQL: setup_power_leaderboard.sql (one row per user) — apply before deploy
- new Netlify Functions:
  * submit-power (auth-gated, plausibility-capped, rate-limited) — one row per user, upserted
  * get-power-leaderboard (top 10 by power)
- client submits current power (debounced) on equip/unequip/skill purchase/respec and on sign-in
- new "Power" tab on leaderboards.html with podium and Gear/Skills/Power columns
- NOTE: power is computed client-side, so this board is trust-on-submit — auth, a
  plausibility cap and rate limits only stop trivial abuse, not a determined cheater
- validation: 64 unit tests still pass; new functions and inline script syntax-checked

v0.9.2e Rename propagation:
- renaming now updates the name EVERYWHERE, and old scores/records are preserved
- root cause: leaderboards linked players to crests/profiles by matching the
  frozen player_name text, so a rename broke the link and showed the old name
- fix part 1 (display): all leaderboard reads now link by user_id and show the
  current username via coalesce(u.username, ls.player_name); anonymous scores
  keep their frozen name. Updated: get-leaderboards, get-daily-leaderboard,
  get-bonus-leaderboard, get-power-leaderboard, get-profile
- fix part 2 (data): rename-username also refreshes the frozen player_name on the
  player's rows in leaderboard_scores and power_leaderboard (best-effort)
- daily board now dedupes best-run-per-player by user identity, not by name
- no new SQL migration: relies on leaderboard_scores.user_id (already added by
  setup_auth.sql) and daily_key (setup_daily_leaderboard.sql)
- validation: 64 unit tests pass; all six functions syntax-checked

v0.9.2f Tower menu auto-hide, leaderboard order, HUD redesign:
- tower upgrade menu now fades out and deselects on its own when you can't afford
  the upgrade/specialization — no need to click away or press Escape (which in
  fullscreen also exits fullscreen). Re-selecting or earning gold cancels the fade.
- Power leaderboard tab is now first (before Endless/Story/Daily) and the default
- redesigned the three HUD buttons (Skills / Bag / Shop) as a cohesive pill set:
  icon chip + label + count badge, per-button accent color, refined hover glow;
  the crystals button now reads "Shop" with a ✦ icon
- validation: 64 unit tests pass; game.js, leaderboards script and CSS checked

v0.9.2g Removed the start menu:
- the game now boots straight into the battlefield, ready to place towers
- root cause of "sometimes it shows, sometimes not": the start overlay stayed
  visible over the battlefield because nothing hid it on direct boot; a saved run
  showed the Resume overlay instead, which is why it appeared inconsistently
- removed the start overlay entirely (index.html). Play is no longer needed;
  Shop/Bag/Skills already live in the battlefield HUD, and the page's other nav
  already links Command Table / About / Guide / Leaderboards / Account
- saved-run behaviour is unchanged: on boot with a saved run you still get the
  Resume overlay (continue where you left off)
- "Main Menu" (game over) and "Back to Menu" (endless unlock) now drop into a
  fresh battlefield instead of the removed menu; Space-to-start does too
- validation: 64 unit tests pass; game.js syntax-checked

v0.9.2h World map (winding trail):
- the game now opens on a world map with the six campaign regions
  (Forest, Ruins, Graveyard, Castle, Catacombs, Dark Portal)
- regions unlock progressively: only Forest is open at first; clearing a region
  unlocks the next and returns you to the map (you play one region at a time)
- the map logic already existed in this build but had NO styling and the Resume
  button did nothing — this pass adds the visuals and wires Resume:
  * winding adventure-map layout: nodes alternate left/right down an SVG trail,
    the cleared portion of the trail is drawn brighter, current region pulses
  * locked regions show a padlock and a "clear the previous region" hint
  * world map Resume now restores the saved run (restoreRunState + finishResumeRun)
- Space no longer bypasses the map — you pick a region to start
- saved-run Resume overlay on boot is unchanged
- validation: 64 unit tests pass; game.js + CSS checked

v0.9.2i World Map button:
- added a "World Map" button in the battlefield header, placed before the
  Daily Challenge button, so you can open the map any time to switch regions
- teal-themed to match the HUD, distinct from the amber Daily button
- opening the map mid-run snapshots the current run first, so the map's
  "Resume Run" button brings you straight back if you don't pick a new region
- validation: 64 unit tests pass; game.js + CSS checked

v0.9.2j Illustrated world map inside the battlefield:
- the world map is no longer a separate full-screen overlay — it now renders
  INSIDE the battlefield frame (over the canvas), using the hand-drawn map art
  (assets/ui/world-map.png) as the background
- six clickable hotspots sit exactly over the region banners (Forest, Ruins,
  Graveyard, Castle, Catacombs, Dark Portal); positions verified against the art
- hotspots are invisible until hover (respecting the artwork): teal glow on
  hover, amber pulse on the current region, and a dark vignette + gray outline
  on locked regions
- image + hotspots share a shrink-wrapped frame so they always align regardless
  of the battlefield's shape (letterboxed, never cropped-misaligned)
- in-game HUD chips/toggles hide while the map is open; Resume chip (top-right)
  appears if a saved run exists
- replaces the previous CSS winding-trail map
- validation: 64 unit tests pass; game.js + CSS checked; hotspot alignment
  verified against the map image

v0.9.2k World map polish — softer hotspots:
- replaced the hard rectangular outline boxes over each banner with soft radial
  glows: hover lights the region up (teal), the current region has a gentle
  breathing amber aura, cleared shows a small green tick pill
- locked regions get a soft blurred vignette that visibly dims them (no box)
- status pills are smaller and more discrete
- unlock logic verified: fresh player (furthestStage=1) shows only Forest
  playable, regions 2-6 locked; the "everything unlocked" look in testing is
  just saved progress (sdcFurthestStage), not a bug
- validation: 64 unit tests pass; game.js + CSS checked

v0.9.2l Compact campaign header:
- the World Map and Challenge of the Day buttons now sit side by side instead of
  stacked, so the header no longer stretches down the page
- both size to content with equal height; they wrap to stacked only on narrow
  screens
- validation: 64 unit tests pass; CSS balanced, game.js checked

v0.9.2m Compact campaign buttons:
- shrank the World Map and Challenge of the Day buttons ~15% (smaller icons,
  tighter padding) and stripped them to icon + short name
- removed the "Campaign"/"Challenge of the Day" kickers and the "Open ▸"/"Play ▸"
  CTAs and the best-score line — the buttons are now compact pills
- daily challenge name is capped and ellipsised so long names stay small
- validation: 64 unit tests pass; CSS balanced, game.js checked

v0.9.2n Command Table as profile + hero loadout + public profiles:
- command-table now shows your Hero (Varyn): equipment in all 5 slots with
  rarity colors + power, a skills list, and Hero/Gear/Skill-point totals
- your own hero reads live from localStorage; another player's comes from the server
- clicking a name on the leaderboards now opens THEIR command-table
  (/command-table.html?user=NAME) showing their synced hero + public stats
- to make others' gear visible, the client now syncs the loadout to the server:
  * new SQL: setup_hero_loadout.sql (one row per user, JSON) — apply before deploy
  * new function submit-loadout (auth, sanitized+bounded JSON, rate-limited)
  * get-profile now returns the loadout; device-only cards hide on public view
- NOTE: like power, the loadout is client-computed → trust-on-submit, not verified;
  it's a display convenience. Equipment/skills become public for signed-in players.
- validation: 64 unit tests pass; all HTML scripts + functions syntax-checked

v0.9.2o Fix BATTLEFIELD label overlap:
- the "BATTLEFIELD" kicker was absolutely positioned at the header's center,
  so it overlapped the Skills/Bag buttons on the right
- moved it into normal flow on its own row above the World Map / Challenge
  buttons (its logical place), clearing the right-side buttons entirely
- buttons kept their compact size; no resizing needed
- validation: 64 unit tests pass; CSS balanced, game.js checked

v0.9.2p Fix: Challenge of the Day from the world map:
- clicking Challenge of the Day while the world map was open did nothing visible —
  the daily run started underneath but the world map layer stayed on top
- startDailyChallenge now closes the world map (like region-select and resume do)
- validation: 64 unit tests pass; game.js checked

v0.9.2q Hero rename in the shop:
- new "Rename Hero" option in the shop's Rename tab (next to Change Username),
  costs ✦ 100, repeatable — renames your hero from the default "Varyn"
- the custom name is stored in your profile (localStorage) and now drives every
  in-game hero label (HUD, level-up, command messages, skill-tree feedback)
- it also syncs to the server with your loadout, so your public command-table
  profile shows the custom hero name too (own view reads it live from localStorage)
- hero-system now takes a getDisplayName callback; game.js resolves the name via
  getHeroName() with fallback to "Varyn"
- backend: submit-loadout + get-profile now carry heroName (sanitized, ≤18 chars)
- NOTE: hero name is client-set (no server rename endpoint needed); like the rest
  of the loadout it's trust-on-submit for the public profile
- validation: 64 unit tests pass; game.js, hero-system, functions, command-table
  all syntax-checked

v0.9.2r Hero sprite upgrade (vector art):
- replaced the simple geometric hero marker with a detailed warden knight drawn
  on the canvas: helmet with visor slit + gold plume, armored torso with a gold
  emblem, a waving cloak, shield on the back arm, and a raised glowing sword
- the sprite now faces its travel direction and has a subtle idle bob + a walk
  stride/cloak sway when moving
- health bar restyled (rounded, 3-color: green/amber/red)
- all vector-drawn — no image assets needed
- validation: 64 unit tests pass; hero-system syntax-checked; sprite render
  verified via an offline canvas pass

v0.9.2s Renamed the game to "Ashen Bastion":
- every visible "Dark Defense" is now "Ashen Bastion" — page titles, meta tags,
  Open Graph/Twitter cards, JSON-LD, the in-game title/kickers, resume/start
  labels, in-game messages, the password-reset email, and the PWA manifest
  (name + short_name) — 63 replacements across 22 files
- SEO: added "ashen bastion" to the keywords (kept "dark defense" so existing
  searches still match); the boss-guide SEO slug filename was intentionally left
  unchanged (it's a keyword slug, not the brand) to preserve its URL
- PRESERVED (unchanged on purpose): the JS namespace window.DarkDefense and the
  localStorage keys (darkDefense.profile, sdc*) — changing these would wipe every
  existing player's saved progress and break the code
- the netlify domain (darkdefense.netlify.app) is unchanged; rename it in Netlify
  settings if you want a matching URL
- validation: 64 unit tests pass; JS/JSON/JSON-LD all checked

v0.9.2t Fix: Endless scores not entering the leaderboard:
- ROOT CAUSE: entering Endless from the campaign finale used applyStage(6, false),
  which keeps the run state — so score/bonusScore/kills carried over from the
  campaign, but stageWave reset to 1. The server caps endless bonus against the
  wave count (500 + wave*220 + kills*35); a carried-over campaign bonus almost
  always exceeded that cap at low endless waves, so the server silently rejected
  the submission ("Suspicious score rejected") and the run never appeared.
- FIX: reset score, bonusScore and kills to 0 on Endless entry so the endless
  tally reflects only the endless run and stays under the server cap.
- verified with a simulation: endless bonus now stays well under the cap across
  30 waves. Daily challenges were unaffected (they use applyStage(stage, true),
  which already resets the tally).
- validation: 64 unit tests pass; game.js checked

v0.9.2u Linear campaign progression:
- clearing a region no longer returns you to the world map — the campaign now
  continues straight into the next region (Forest → Ruins → Graveyard → ...)
- the world map is now purely the entry screen (shown on boot / from the World
  Map button); you visit it only when you want to
- on advancing: money, lives and score carry over; your towers move to reserve
  so you can redeploy them for free on the next region; a fresh leaderboard run
  is prewarmed for the new stage
- clearing the final stage still triggers the Endless unlock as before
- validation: 64 unit tests pass; game.js checked

v0.9.2v Bug inspection pass:
- full sweep after the recent changes (linear campaign, endless fix, hero rename,
  world map, hero sprite). Findings:
  * FIXED: removed a leftover debug console.log that fired on every stage start
  * VERIFIED clean: all JS syntax + 64 tests pass; CSS braces balanced (1391/1391);
    hero name null-safety; hero sprite deps (getPathPosition injected, clamp in
    scope); tower-menu auto-hide timers clear properly; no division-by-zero in the
    draw code (all guarded, constant denominators); all 4 openWorldMap call sites
    are intentional entry points (not leftover between-stage returns); dynamically
    rendered rename buttons wired correctly; endless score/bonus/kills reset intact
- NOTE (not a regression, pre-existing): the campaign leaderboard receives a
  submission on every stage clear, not just the final stage — the server keeps the
  best per user, so it's harmless, but it's more submissions than strictly needed.
  Left as-is; can be changed to submit only on the final stage if you prefer.
- validation: 64 unit tests pass; game.js checked
