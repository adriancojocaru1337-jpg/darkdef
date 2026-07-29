Ashen Bastion v0.11.21 - Sequential Act II unlock

No schema change. No SQL to run.

- Stage 7 is locked on a fresh profile until Stage 6 / Act I is completed
- the Act II map can still be previewed before completion, but The Broken Gate
  is disabled and clearly marked Locked
- completing Stage 6 permanently opens Stage 7 through the existing persisted
  Act I / Endless completion flag; future sessions keep it unlocked
- Stages 8-12 continue to unlock sequentially from the player's furthest stage
- old direct-entry Act II run saves can no longer bypass the restored gate
- direct map-start calls now revalidate the stage instead of trusting the UI
- added regression tests for fresh, Stage 6, completed and legacy-save states

Ashen Bastion v0.11.20 - Smaller Varyn with sword attack animation

No schema change. No SQL to run.

- reduced Varyn's battlefield render from 52px to 46px while keeping his sword
  and shield readable against the path
- expanded the walk sheet from 12 to 20 frames for every one of the five source
  angles, still mirrored at runtime for eight-direction travel
- generated and preserved a dedicated five-view sword-strike turnaround, then
  added 20 attack frames per angle with wind-up, contact and recovery motion
- Varyn now turns toward his current target during a basic attack, moves the
  sword out of its idle position, lunges into the strike and draws a short
  gold-purple slash trail
- the combined lossless runtime sheet now contains 200 frames in one WebP, so
  the richer animation does not increase the runtime asset item count
- removed the rejected overlapping attack-source draft after replacing it with
  the clean, separated five-view source
- updated automated artwork checks for the new sources, 2560x1280 sheet,
  20-frame walk/attack sequences and 46px runtime size

Ashen Bastion v0.11.19 - Stronger Varyn movement

No schema change. No SQL to run.

- made Varyn's 12-frame walk cycle visibly stronger without increasing his
  52px battlefield size
- increased the baked step height, torso sway, stretch and directional drift
  across all five source angles
- added runtime footfall lift, side-to-side body motion and a clearer lean that
  follows every active walk frame
- added a short directional lunge on each basic attack, including correct
  forward motion for side, front, back and diagonal facings
- idle remains restrained and stable so movement is obvious when it starts
- kept the same single lossless runtime WebP and the same 97/99 asset counts
- expanded automated integration checks to protect walking and attack motion

Ashen Bastion v0.11.18 - Smaller eight-direction Varyn movement

No schema change. No SQL to run.

- reduced Varyn's battlefield render from 64px to 52px so he fits the scale of
  towers and regular enemies more naturally
- expanded the source turnaround from three to five approved views: front,
  front diagonal, side, back diagonal and back
- left/right mirroring now turns those five source rows into eight distinct
  movement directions
- regenerated the walk sheet as 60 lossless frames: 12 per source angle
- strengthened stride bob, sway and directional travel while keeping the hero
  still on a clean idle frame whenever he reaches his guard point
- tightened the ground shadow, aura and health-bar position around the smaller
  battlefield model
- kept the runtime asset count unchanged: assets has 97 recursive items and
  assets2 remains at 99
- updated automated checks for the five-row sheet, 52px render size and all
  eight direction-selection results

Ashen Bastion v0.11.17 - Varyn battlefield sprite

No schema change. No SQL to run.

- replaced Varyn's small procedural battlefield figure with original generated
  full-body character artwork matching his HUD portrait
- added dedicated front, side and back views with 12 lightweight walk frames
  per direction in one lossless WebP sprite sheet
- Varyn now turns with the actual direction of travel, including correct
  left/right mirroring and persistent facing when he stops
- retained the old procedural warden as a safe fallback while the sprite loads
- preserved the generated chroma-key turnaround and transparent master under
  source-art/hero and added tools/build-hero-sprite.py for reproducible output
- kept Rift Pulse, projectile effects, command ring, shadow and health feedback
  layered around the new character artwork
- assets contains 97 recursive items and assets2 remains at 99
- added automated checks for the source masters, lossless sprite format,
  runtime wiring and directional view selection

Ashen Bastion v0.11.16 - Varyn hero portrait

No schema change. No SQL to run.

- replaced the temporary sword glyph in Varyn's HUD with original generated
  dark-fantasy portrait artwork
- added the same portrait to a new heraldic identity block in the Hero Skill
  Tree, with responsive desktop and mobile framing
- the Skill Tree identity now follows the player's custom hero name instead of
  remaining hard-coded to Varyn
- preserved the generated PNG master under source-art/hero and added
  tools/build-hero-art.py for reproducible 512px lossless WebP output
- moved completion-screen source masters from assets/source to source-art so
  the new runtime portrait fits without breaking the 99-item asset limit
- assets now contains 96 recursive items and assets2 remains at 99
- added automated artwork, integration, responsive-layout and lossless-format
  checks for the hero portrait

Ashen Bastion v0.11.15 - Act II boss portraits in Guide

No schema change. No SQL to run.

- replaced all six reused Act I boss images in the Guide with the dedicated
  Commander Oren, Ash Shepherd, Hollow Saint, Iron Procession, Leybound Titan
  and Lord Marshal Vael artwork
- Act II boss cards now use a taller 2:3 presentation so their full illustrated
  title portraits remain readable
- added distinct Act II card and stage-badge treatments plus descriptive alt
  text for every portrait
- added automated checks that prevent the Guide from returning to reused Act I
  boss artwork

Ashen Bastion v0.11.14 - Illustrated act selectors

No schema change. No SQL to run.

- replaced the plain Act I / Act II pills with two large heraldic campaign
  selectors built around original generated artwork
- Act I now uses a bronze bastion-and-forest seal while Act II uses a
  black-steel eastern gate and road-to-dawn seal
- kept all labels as crisp responsive HTML instead of baking text into images
- added distinct active colors, selection marks, hover/focus feedback and
  compact mobile/short-screen layouts
- active act state now updates aria-pressed for keyboard and screen-reader use
- preserved the two generated PNG masters under source-art/act-switches and
  added tools/build-act-switch-art.py for reproducible lossless WebP outputs
- assets and assets2 now each contain exactly 99 recursive items

Ashen Bastion v0.11.13 - Dedicated Act II music

No schema change. No SQL to run.

- added the six supplied original tracks for Stages 7-12
- every Act II stage now selects its matching soundtrack instead of reusing an
  Act I fallback theme
- the new tracks use the existing music volume, mute, looping and boss-entry
  swell systems
- stored the tracks under assets2/music so assets remains at 97 recursive
  items and assets2 reaches exactly 99 without exceeding the packaging limit
- added automated checks for every MP3 file, runtime mapping and asset count

Ashen Bastion v0.11.12 - Split asset packages

No schema change. No SQL to run.

- split the runtime artwork between assets and assets2 so neither directory
  exceeds the 99-item packaging limit, including nested folders
- assets now contains 97 recursive items and assets2 contains 92
- moved all enemy rigs and animation sheets to assets2/enemies
- moved the bestiary thumbnails to assets2/guide
- updated the game, guide, art rebuild tools and automated asset audits to use
  the new paths
- added a permanent test that fails if either asset directory ever grows past
  99 recursive items

Ashen Bastion v0.11.11 - Stage Debrief and Reserve Management

No schema change. No SQL to run.

- every campaign stage now ends with a dedicated battle report before the
  next map or act-completion choices appear
- the debrief shows clear gold, boss and stage Ley Crystals, gate repairs,
  the defeated boss and the exact condition of every deployed tower
- attrition rows show each real level change, lost level-1 towers, destroyed
  aura-bound towers and specializations removed by falling below level 3
- a second Reserve Management step lists every surviving tower with its
  level, specialization and legendary aura
- reserve towers can be moved to the front, earlier or later in the free
  redeployment order for their tower type
- the chosen order is now honored when a reserve tower is placed and persists
  in the saved run
- Act I and Act II completion cinematics now open only after the debrief and
  reserve steps, without applying attrition a second time
- an unfinished debrief or reserve-management screen survives save and resume
- the complete intermission interface is responsive and supported in native
  and simulated fullscreen

Ashen Bastion v0.11.10 - Act completion choice screens

No schema change. No SQL to run.

- Act I now ends on a dedicated Dark Portal intermission instead of moving
  directly into Act II
- the player can choose Continue to Act II, Enter Endless or return to the
  World Map after completing Act I
- Act II now has its own Field of Dawn campaign-finale screen with separate
  artwork and choices for Endless or the World Map
- replaced the old image-baked titles and invisible click zones with sharp,
  accessible and responsive HTML/CSS titles and real buttons
- added two original text-free lossless WebP cinematic backgrounds; their PNG
  masters are preserved under source-art/completion-screens
- an unfinished completion choice is saved and restored with the run
- between-stage tower attrition is still applied exactly once before the
  completion choice appears
- tools/build-completion-art.py rebuilds both runtime backgrounds

Ashen Bastion v0.11.9 - Between-stage tower attrition

No schema change. No SQL to run.

- every tower deployed when a campaign stage ends now loses exactly one level
  before returning to the reserve
- level-1 towers are removed completely instead of returning to the reserve
- aura-bound level-1 towers are also removed; an aura survives only while its
  bound tower survives the between-stage attrition
- surviving towers are rebuilt at their real lower stats, upgrade price and
  invested-gold value instead of changing only the displayed level
- dropping from level 3 to level 2 removes the tower specialization correctly
- switching modes without completing a stage still preserves tower levels

Ashen Bastion v0.11.8 - Three dedicated Act II enemy types

No schema change. No SQL to run.

- added the Cinder Skirmisher, a fast raider that leaps forward below 55% HP
  and keeps a permanent movement-speed boost afterward
- added the Hollow Binder, a support caster that periodically hexes a nearby
  tower and prevents it from attacking for a short time
- added the Ley Revenant, a heavy enemy that enters with a Ley shield and
  restores the ward once when badly wounded
- distributed the new enemies across Stages 7-12 with stage-specific weights
  and dedicated targeting priorities, rewards, effects and death feedback
- added original front, side and back artwork plus 12-frame lossless WebP
  battlefield animation sheets for all three enemies
- source turnarounds and transparent masters are preserved under
  assets/source/act2-mobs
- tools/build-act2-mob-art.py rebuilds all runtime assets

Ashen Bastion v0.11.7 - Iron Procession redesign

No schema change. No SQL to run.

- replaced the Stage 10 four-legged funeral construct with a completely new
  upright drowned bell-knight design
- the Iron Procession is now a towering two-legged armored boss with a pointed
  cathedral helm, cyan visor, chained funeral bell and anchor-bladed halberd
- regenerated its front, side and back 12-frame battlefield animation sheets
- regenerated the Sunken Crossing cinematic introduction card to match
- all other Act II boss artwork remains unchanged

Ashen Bastion v0.11.6 - Dedicated Act II boss artwork

No schema change. No SQL to run.

- all six Act II bosses now have original visual identities instead of reusing
  recolored Act I boss art
- added cinematic 1000x1500 WebP introduction cards for Commander Oren, the
  Ash Shepherd, the Hollow Saint, the Iron Procession, the Leybound Titan and
  Lord Marshal Vael
- added dedicated front, side and back 12-frame walk sheets for every Act II boss
- each battlefield model matches its cinematic introduction card
- Act II stages now reference their own boss-art stage IDs from 7 through 12
- generated turnarounds, transparent sources and untitled splash masters are
  preserved under assets/source/act2-bosses
- tools/build-act2-boss-art.py rebuilds the runtime sprite sheets and title cards

Ashen Bastion v0.11.5 - Header Endless Mode access

No schema change. No SQL to run.

- added a permanent Endless Mode button beside Daily Challenge
- the button remains visible but locked until Act I / Stage 6 is cleared
- unlock state updates immediately after Act I completion and persists between sessions
- the unlocked button shows the best Endless wave and enters Endless directly
- while an Endless run is active, the button shows the current wave and prevents
  an accidental restart
- responsive War Council layouts keep the new control aligned on larger screens
  and stack it cleanly on narrow phones

Ashen Bastion v0.11.4 - Dedicated Act II battlefield artwork

No schema change. No SQL to run.

- all six Act II stages now load unique generated ground artwork:
  * Stage 7  — scorched Broken Gate fortress stone
  * Stage 8  — wind-scoured Ashen Road wasteland
  * Stage 9  — damp cobbles and rotten timber of the Hollow Village
  * Stage 10 — flooded masonry of the Sunken Crossing
  * Stage 11 — obsidian and Ley-fire fissures around the First Flame
  * Stage 12 — trampled dawn-lit soil of the Field of Dawn
- the new textures are 1254x1254 lossless WebP assets
- Act II's old reused terrain tint was reduced so the new materials remain clear
- dynamic single and branching roads still render above the artwork, preserving
  exact gameplay alignment and no-build validation
- Act I terrain artwork remains unchanged

Ashen Bastion v0.11.3 - Branched Act II battlefields

No schema change. No SQL to run.

- all six Act II battlefield routes were redesigned as distinct tactical maps
- Stage 8 (The Ashen Road) and Stage 10 (The Sunken Crossing) now split into
  two enemy roads and reunite before the bastion
- Stage 12 (The Field of Dawn) contains two separate split-and-merge sections
- enemies alternate between active branches while bosses use the primary road
- towers, spells, splash damage, enemy traits and the hero now resolve each
  enemy's actual branch position
- every branch is painted, decorated and included in no-build validation
- split and merge points receive visible battlefield markers
- run saves remain compatible because snapshots occur between waves

Ashen Bastion v0.11.2 - Dedicated Act II world map

No schema change. No SQL to run.

- Act II now uses a newly generated 1536x1024 campaign map instead of a
  filtered copy of the Act I artwork
- the six painted regions match The Broken Gate, The Ashen Road, The Hollow
  Village, The Sunken Crossing, The First Flame and The Field of Dawn
- Act II hotspot positions were retuned for the new landmarks
- the optimized runtime asset is assets/ui/world-map-act2.webp

Ashen Bastion v0.11.1 - Direct Act II access

No schema change. No SQL to run.

- the Act II selector on the index World Map is now always interactive
- Stage 7 (The Broken Gate) is the direct entry point for Act II
- Stages 8 through 12 remain locked until their preceding stage is cleared
- Act I keeps Stage 1 as its own direct entry point

Ashen Bastion v0.11.0 - Act II gameplay campaign

No schema change. No SQL to run.

- Campaign expanded from 6 to 12 stages across two selectable World Map acts:
  * Stage 7  — The Broken Gate / Commander Oren
  * Stage 8  — The Ashen Road / Ash Shepherd
  * Stage 9  — The Hollow Village / Hollow Saint
  * Stage 10 — The Sunken Crossing / Iron Procession
  * Stage 11 — The First Flame / Leybound Titan
  * Stage 12 — The Field of Dawn / Lord Marshal Vael
- every Act II stage has a new route, blocked terrain, Ley nodes, difficulty
  curve, enemy composition and a three-milestone battlefield objective
- milestones grant stage-specific rewards: gold, lives or spell cooldown
- six Act II bosses have two telegraphed phase transitions and temporarily
  reuse compatible animated Act I rigs until dedicated artwork is produced
- Stage 6 opens Act II while preserving the existing Endless unlock
- existing players with Endless already unlocked migrate directly to Stage 7
- World Map switches between Act I and Act II; Endless can be entered from it
- Save/Resume persists objective progress and accepts save versions 2 through 5
- guide, About and Command Table copy now describe the twelve-stage campaign
- validation covers Act II routes, objectives, enemy mixes and boss phases

Ashen Bastion v0.10.2 - Hero names on the Hero Power board

No schema change. No SQL to run.

- the Hero Power board ranked accounts but never showed the hero: the character
  the player named and levelled was invisible on the one board that ranks it.
- no new column was needed. submit-loadout already persists the name inside
  hero_loadouts.loadout->>'heroName', so get-power-leaderboard resolves it with
  a keyed lookup after ranking.
- that lookup is a separate query in its own try/catch rather than a join into
  the ranking queries: hero_loadouts is optional, and a missing table should
  cost the board its hero names, not its rows.
- shown on both the podium and the rows, only for type="power", escaped, and
  hidden below 560px where the row has no space for it.
- players who have never synced a loadout simply show no hero name.

- validation: all JavaScript syntax checks plus 136 unit tests

Ashen Bastion v0.10.1 - Content-hash cache busting, daily key timezone

No schema change. No SQL to run.

NEW DEPLOY STEP: netlify.toml now has a [build] command. Netlify will run
`node tools/stamp-assets.cjs` on every deploy. Nothing to configure.

Cache busting:
- ?v= stamps were hand-incremented (game.js?v=r102, style.css?v=r12,
  site-nav.js?v=5) and pinned in three test files, so shipping a change meant
  remembering to bump it in several places. Forget, and browsers keep the old
  file — a symptom indistinguishable from a broken deploy.
- worse, all 17 modules under js/ shared a single stamp (r93) while game.js had
  moved to r102. Editing any one of them shipped nothing to anyone holding a
  cached copy. That had been true for some time.
- every stamp is now a 10-character hash of the file it points at, rewritten by
  tools/stamp-assets.cjs. 38 references across 10 pages.
- npm run stamp / npm run stamp:check
- tests fail if any stamp is stale, if two files share a stamp, or if a manual
  revision string reappears.

Daily key timezone (ported from the shelved v0.9.7):
- get-daily-leaderboard fell back to the UTC date when no ?day= was supplied.
  The daily challenge rolls over at the player's LOCAL midnight, so for UTC+3
  that served the previous day's board between 00:00 and 03:00.
- new netlify/functions/daily-key.js: resolveDailyKey() prefers an explicit
  ?day=, otherwise reconstructs the local date from ?tzOffset= (clamped to
  +/-840 minutes so it cannot be abused). Both callers now send it.

Incidental, found while making the publish directory explicit:
- Netlify publishes the repository root, so every setup_*.sql was publicly
  downloadable — the full anti-cheat schema. _redirects now 404s the schema
  files, tools/, tests/, and the package manifests.

- validation: all JavaScript syntax checks plus 132 unit tests

Ashen Bastion v0.10.0 - Player identity on the server, score cap invariants

No schema change. No SQL to run.

Player identity:
- submit-score stored the client-supplied name (localStorage.sdcPlayerName).
  That drifts from the account name: it is set at login but survives a rename,
  a logout, a second account in the same browser, or guest play before signing
  in. Because the boards render coalesce(u.username, ls.player_name), one person
  appeared under several names and could not find their own rows in
  score_submissions. With a session, the account name is now authoritative and
  the client gets no say. submit-power already worked this way.
- logging out clears the cached name, so guest play afterwards no longer submits
  under an account name it no longer owns.

Score caps:
- computeMaxBonus is linear in wave and kills, but the game's per-wave bonus
  grows WITH the wave (early call is half of 16 + 3*wave + 4*stage), so the
  wave-derived bonus is quadratic. It stays under the cap only because kills are
  also quadratic and carry a 35-per-kill allowance that absorbs it: the worst
  case converges to ~96% of the cap and never crosses, even at wave 2000.
- that margin is a coincidence between two independent formulas, so it is now
  pinned by tests. Add a per-kill bonus source or raise the early-call bonus and
  the build fails, instead of players' scores being silently rejected as
  cheating.
- NO cap values were changed. Widening them would have weakened the anti-cheat
  to fix a problem that does not exist.

- index.html loads game.js?v=r102
- validation: all JavaScript syntax checks plus 120 unit tests

Ashen Bastion v0.9.9 - Endless ranked by depth, own placement, no boot token

No schema change. No SQL to run.

BEHAVIOUR CHANGE: the historical endless board reshuffles.
- endless was ranked by bonus_score first, so a wave-10 run that rolled a Wealth
  aura outranked someone who reached wave 50. It now ranks by wave_reached with
  bonus as the tiebreaker. The stored rows are untouched, only the ordering.

Own placement:
- get-bonus-leaderboard accepts ?player= and returns { rows, you, total }.
  The client appends its own row below the top 10 when it ranks outside it, and
  the subtitle reads "You: #N of M". A submitted run that ranked 40th used to be
  indistinguishable from a lost one — which is how a working board gets reported
  as broken.
- the client accepts both the old array and the new object shape, so a cached
  client does not render an empty board after deploy.

Run token litter:
- no token is minted at page load any more. Every reload used to create one and
  most were never submitted: that is the 'active'/'expired' litter in game_runs,
  and it consumed the 30-per-10-minutes start-run budget, silently pushing a
  player who reloaded a few times into an unranked session. startWave() mints
  the token on the first wave of whatever mode is actually played.

- index.html loads game.js?v=r101
- validation: all JavaScript syntax checks plus 114 unit tests

Ashen Bastion v0.9.8 - Endless checkpoints, pacing and board fixes

No schema change. No SQL to run.

Why endless scores never appeared:
- endless submitted from exactly ONE place, the game-over branch. A run that
  ended any other way — closed tab, refresh, or the player simply stopping —
  left the run token 'active' forever and the score was never recorded. With
  endless runs regularly passing 40 minutes, that was the normal outcome.
  Campaign never had this problem because it submits at every stage clear.
- endless runs now bank progress every 5 waves. The run token is deliberately
  NOT retired on a checkpoint, so started_at stays the true run start and the
  server's runtime floor gets stricter, not weaker.
- server: a checkpoint keeps status 'active' and upserts the leaderboard row on
  run_id (already unique), so a run has one row that is updated, not many.
  Checkpoints are rate limited to one per 45s per run.

Display:
- get-bonus-leaderboard returned 5 rows and the client rendered rows.slice(0,1),
  so the board showed only the all-time record holder. Now 10 rows, all rendered,
  with numbered places.

Pacing:
- endless added two enemies per wave forever at a fixed 0.68s spawn interval, so
  wave length grew linearly and total run time grew QUADRATICALLY (wave 100 was
  ~125 minutes of spawning alone). The interval now tapers from 0.68s to 0.30s
  between waves 10 and 55, roughly halving a deep run.
- campaign and daily keep the original pacing.
- NOTE this is also a difficulty change: the same wave HP arrives in less time,
  so required DPS rises at high waves. Worth playtesting past wave 40.

- index.html loads game.js?v=r100
- validation: all JavaScript syntax checks plus 109 unit tests

Ashen Bastion v0.9.6c - Schema repair (corrected)

READ THIS FIRST:
Three tables were never created in the database: run_start_limits,
username_renames and player_ley_meta.

- run_start_limits: start-run.js inserts into game_runs through a CTE that
  depends on it, so the whole statement failed and start-run returned 500 on
  every call. No run was ever recorded, which is why endless and daily scores
  never reached the board.
- player_ley_meta: get-ley-meta / save-ley-meta fail, so Crystal totals and
  talent purchases never persist to the account.
- username_renames: rename-username fails to log the rename.

BEFORE DEPLOY:
1. Run setup_repair_missing_schema.sql in Neon. It is idempotent, creates
   player_ley_meta before altering it, and ends by re-running the inventory so
   you can confirm every table reads 'ok'.
2. Deploy the site and Functions together.

Ashen Bastion v0.9.6b - Schema repair

READ THIS FIRST:
The v0.9.4 migration was never applied to the database. run_start_limits did not
exist, and start-run.js inserts into game_runs through a CTE that depends on it,
so the whole statement failed and start-run returned 500 on every call. No run
was ever recorded, which is why endless and daily scores never reached the board.

BEFORE DEPLOY:
1. Run setup_repair_missing_schema.sql in Neon. It is idempotent and includes a
   check that lists every missing table/column before it repairs anything.
2. Deploy the site and Functions together.

Ashen Bastion v0.9.6a - Run token lifecycle fix + cache bust + visible start-run failures

IMPORTANT BEFORE DEPLOY:
1. Run setup_v0_9_5_runtime_floor_fix.sql in Neon (clears the false-positive IP blocks).
2. Deploy the site and Functions together.
   No schema change is required by this build.

Added in 0.9.6a:
- index.html now loads game.js?v=r99 (was r98) so browsers actually pick up the
  new client instead of serving the cached bundle
- prewarmLeaderboardRun no longer swallows start-run failures: a 429 from the
  per-IP rate limit, a Functions outage or a rejected Origin now raises a
  "Rankings unavailable" notification at the start of the run instead of losing
  the score silently at Game Over

Ashen Bastion v0.9.6 - Run token lifecycle fix (endless / daily rankings)

IMPORTANT BEFORE DEPLOY:
1. Run setup_v0_9_5_runtime_floor_fix.sql in Neon (clears the false-positive IP blocks).
2. Deploy the site and Functions together.
   No schema change is required by this build.

Fixed in this build:
- endless and daily scores were being dropped because the run token was minted
  at the moment the player died: started_at equalled submitted_at, so the server
  rejected the run with "Run completed too quickly" - correctly, it had never
  seen the run start
- root cause: after a successful submission the client cleared leaderboardRun
  unconditionally, wiping a token that a concurrent prewarm had just stored, and
  nothing minted a replacement for the next run
- submissions now retire only the token they actually sent (matched by run id)
  and immediately prewarm its replacement
- a start-run response that lands after a newer request no longer overwrites the
  newer token (generation guard)
- startWave() mints a token if the run somehow has none, so started_at always
  reflects the real start of the run
- new currentLeaderboardMode() helper: a daily challenge runs the endless loop,
  so currentMode is "endless" while the board is "daily"
- carried over from v0.9.5: the minimum-runtime floor no longer assumes x1
  pacing and no longer adds wave time to kill time, so endless/daily runs played
  at game speed x2/x3 are accepted
- carried over from v0.9.5: timing heuristics no longer blocklist the IP for
  30 minutes; a single fast run used to lock the player out of every board
- validation: all JavaScript syntax checks plus 99 unit tests

Previous notes:

Ashen Bastion v0.9.5 - Rankings fix for game speed x2/x3

IMPORTANT BEFORE DEPLOY:
1. Run setup_v0_9_5_runtime_floor_fix.sql in Neon (clears the false-positive IP blocks).
2. Deploy the site and Functions together.
   No schema change is required by this build.

Fixed in this build:
- endless and daily scores played at game speed x2/x3 are no longer rejected as
  "Run completed too quickly"
- the minimum-runtime floor in submit-score.js assumed x1 pacing AND added wave
  time to kill time; kills happen during waves, so the floor now takes the larger
  of the two estimates and divides it by the fastest selectable speed (x3)
- timing heuristics no longer blocklist the IP for 30 minutes; a single fast
  endless run used to lock the player out of every board, campaign included
- the run token (HMAC) and the score/bonus caps are unchanged - they remain the
  actual anti-cheat
- new pure module netlify/functions/run-pacing.js so the floor is unit testable
- validation: all JavaScript syntax checks plus 93 unit tests

Previous notes:

Ashen Bastion v0.9.4 - Security, Rankings and navigation fixes

IMPORTANT BEFORE DEPLOY:
1. Run setup_v0_9_4_security_fixes.sql in Neon.
2. Set APP_BASE_URL to the exact public site URL in Netlify.
3. Keep RUN_TOKEN_SECRET configured with a long random value.
4. Deploy the site and Functions together.

Fixed in this build:
- every public page now uses the same graphical War Council navigation inside its hero/banner area
- Play, Command Table, Guide, Rankings and Account stay available everywhere
- on the home page, Play Now stays primary and the other four graphical buttons sit beside it
- navigation buttons load five optimized 128px transparent WebP emblems; redundant PNG masters are excluded from the deployment package
- deployed navigation artwork is about 38 KB total instead of about 1.52 MB
- the world map, animated enemy sheets, enemy fallbacks, tower art and guide mobs now use lossless WebP
- 58 runtime images retain every visible pixel while reducing their combined size by about 3.58 MB
- the exact image-generation prompts are included in NAVIGATION_ICON_PROMPTS.txt
- obsolete bottom navigation strips and the duplicated Command Table Quarters hub were removed
- Welcome Back and Prepare Defenses now share forged iron, bronze and ember-themed frames
- the Battlefield header is now a unified responsive War Council command bar with live mode, stage, wave and run status
- guest accounts show a clear Sign in action while authenticated players keep their crest and username
- tower selling is disabled while the game is paused and is also blocked at the action boundary
- Rankings is the single user-facing name across page buttons and messages
- the current section is highlighted and the menu adapts to narrow mobile screens
- the shared menu works both when index.html is opened from an extracted folder and when the site is hosted
- password-reset links no longer trust request Origin/Referer headers
- password reset tokens are claimed atomically and cannot be reused concurrently
- start-run has a DB-backed 30 requests / 10 minutes / IP limit
- expired security/run data is cleaned by a daily scheduled Function
- score commit, leaderboard insert and profile update are one atomic SQL statement
- campaign stage submissions no longer inflate lifetime kills or run counts
- Story and Endless boards keep only each player's best result
- usernames are unique case-insensitively at the database layer
- username rename charges 150 Crystals atomically on the server
- consumable Crystal spending persists across account/device sync
- validation: all JavaScript syntax checks plus 87 unit tests

Previous notes:

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
  (assets/ui/world-map.webp) as the background
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
