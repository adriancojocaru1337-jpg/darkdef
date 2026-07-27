/* Minimum plausible wall-clock runtime for a submitted run.
 *
 * The client can run the simulation at x1 / x2 / x3 (GAME_SPEED_STEPS in
 * game.js), and endless/daily runs also let the player call waves early for a
 * gold bonus, so a completely legitimate run can finish in a fraction of the
 * time a naive x1 estimate expects.
 *
 * Two corrections against the old `wave * 12s + kills * 250ms` floor:
 *   1. waves and kills overlap in time — the kills of a wave happen *during*
 *      that wave, so take the larger of the two estimates, not their sum;
 *   2. divide by the fastest speed the player is allowed to select.
 *
 * This still catches the case that matters (a script claiming wave 400 thirty
 * seconds after start-run) without punishing a real x3 endless run.
 */

const MAX_GAME_SPEED = 3;
const WAVE_PACE_MS = 12_000;
const KILL_PACE_MS = 250;
const ABSOLUTE_FLOOR_MS = 20_000;

function estimatedMinRuntimeMs(wave, kills) {
  const waves = Math.max(0, Number(wave) || 0);
  const killCount = Math.max(0, Number(kills) || 0);
  const pacedMs = Math.max(waves * WAVE_PACE_MS, killCount * KILL_PACE_MS);
  return Math.max(ABSOLUTE_FLOOR_MS, Math.floor(pacedMs / MAX_GAME_SPEED));
}

module.exports = {
  estimatedMinRuntimeMs,
  MAX_GAME_SPEED,
  WAVE_PACE_MS,
  KILL_PACE_MS,
  ABSOLUTE_FLOOR_MS
};
