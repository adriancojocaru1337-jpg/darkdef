Dark Defense - Bonus Leaderboard UI update

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
