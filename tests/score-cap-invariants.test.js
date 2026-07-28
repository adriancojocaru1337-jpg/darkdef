const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const submitScore = fs.readFileSync(
  path.join(__dirname, "..", "netlify", "functions", "submit-score.js"),
  "utf8"
);

/* The server rejects a run whose bonus exceeds computeMaxBonus. That cap is
   linear in wave and kills, while the game's per-wave bonus grows WITH the wave
   (the early-call bonus is half of 16 + 3*wave + 4*stage), so the wave-derived
   bonus is quadratic.
   
   That is fine today only because kills also grow quadratically and carry a
   35-per-kill allowance which absorbs it — the worst case converges to about 96%
   of the cap and never crosses. It is a narrow margin held up by a coincidence
   between two independent formulas, so pin it: if someone adds a per-kill bonus
   source or raises the early-call bonus, this fails instead of the players'
   scores silently getting rejected as cheating. */

// Mirrors game.js. Update deliberately, together with the constants there.
const STAGE = 6;
const MAX_LIVES = 25;            // START_LIVES 20 + leyBonusLives max
const WAVE_CLEAR_BONUS = 20;
const CALL_BONUS = (w) => Math.round((16 + 3 * w + 4 * STAGE) * 0.5);
const BOSS_EVERY = 10;
const BOSS_BONUS = MAX_LIVES * 25 + 80 + 250; // lives, boss pair, survivor
const ENEMIES_PER_WAVE = (n) => 6 + (n - 1) * 2 + (STAGE - 1);

// Wealth aura on every single kill (25) plus a permanently live combo (8).
const WORST_CASE_BONUS_PER_KILL = 33;

function capsFromSource() {
  const bonus = submitScore.match(/return 500 \+ wave \* (\d+) \+ kills \* (\d+);/);
  assert.ok(bonus, "computeMaxBonus no longer matches the expected shape");
  return { perWave: Number(bonus[1]), perKill: Number(bonus[2]) };
}

function simulate(throughWave, bonusPerKill) {
  let bonus = 0;
  let kills = 0;
  for (let w = 1; w <= throughWave; w++) {
    bonus += WAVE_CLEAR_BONUS + CALL_BONUS(w);
    if (w % BOSS_EVERY === 0) bonus += BOSS_BONUS;
    kills += ENEMIES_PER_WAVE(w);
    bonus += ENEMIES_PER_WAVE(w) * bonusPerKill;
  }
  return { bonus, kills };
}

test("the bonus cap is never exceeded by a maximally lucky run", () => {
  const { perWave, perKill } = capsFromSource();
  for (let wave = 5; wave <= 500; wave += 5) {
    const { bonus, kills } = simulate(wave, WORST_CASE_BONUS_PER_KILL);
    const cap = 500 + wave * perWave + kills * perKill;
    assert.ok(
      bonus <= cap,
      `wave ${wave}: best-case bonus ${bonus} exceeds the cap ${cap} — real runs would be rejected as cheating`
    );
  }
});

test("the margin does not silently collapse at depth", () => {
  const { perWave, perKill } = capsFromSource();
  const { bonus, kills } = simulate(500, WORST_CASE_BONUS_PER_KILL);
  const cap = 500 + 500 * perWave + kills * perKill;
  const margin = 1 - bonus / cap;
  // Currently ~4%. If a change pushes this under 2% the cap is one balance
  // tweak away from rejecting honest runs.
  assert.ok(margin > 0.02, `worst-case margin collapsed to ${(margin * 100).toFixed(1)}%`);
});

test("a realistic run sits far clear of the cap", () => {
  const { perWave, perKill } = capsFromSource();
  const { bonus, kills } = simulate(200, 16); // Wealth on ~40% of kills
  const cap = 500 + 200 * perWave + kills * perKill;
  assert.ok(1 - bonus / cap > 0.35, "a normal run is uncomfortably close to the cap");
});

/* Player identity: the board renders coalesce(u.username, ls.player_name), so a
   client-supplied name that drifts from the account name splits one person
   across several identities. */

test("a logged-in submission is stored under the account name, not the client's", () => {
  assert.match(
    submitScore,
    /playerName = sessionUser\?\.username\s*\n\s*\? sanitizeName\(sessionUser\.username\)\s*\n\s*: sanitizeName\(body\.name\);/,
    "submit-score still trusts the client-supplied name for logged-in players"
  );
});

test("submit-power keeps using the session name too", () => {
  const submitPower = fs.readFileSync(
    path.join(__dirname, "..", "netlify", "functions", "submit-power.js"),
    "utf8"
  );
  assert.match(submitPower, /session\.username/);
});

test("logging out drops the cached account name", () => {
  const game = fs.readFileSync(path.join(__dirname, "..", "game.js"), "utf8");
  const logout = game.slice(game.indexOf('apiClient.post("logout"'));
  assert.match(logout.slice(0, 500), /localStorage\.removeItem\("sdcPlayerName"\)/);
});
