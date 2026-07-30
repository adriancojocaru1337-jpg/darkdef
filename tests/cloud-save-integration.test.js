const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const game = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
const schema = fs.readFileSync(path.join(ROOT, "setup_game_state.sql"), "utf8");

test("authenticated boot loads both Neon progression stores before power sync", () => {
  assert.match(
    game,
    /await Promise\.allSettled\(\[\s*syncLeyMetaWithAccount\(\),\s*syncGameStateWithAccount\(\)/
  );
  assert.match(game, /apiClient\.get\("get-game-state"/);
  assert.match(game, /apiClient\.post\("save-game-state"/);
});

test("profile changes autosave and page exit sends a final best-effort snapshot", () => {
  assert.match(game, /events\.on\("profile:changed"/);
  assert.match(game, /scheduleCloudGameStatePush\(delayMs=1800\)/);
  assert.match(game, /apiClient\.sendBeacon\("save-game-state"/);
});

test("Cloud Save guards cross-account caches and merges revision conflicts", () => {
  assert.match(game, /belongsToAnotherAccount/);
  assert.match(game, /owner !== cloudGameAccountId/);
  assert.match(game, /error\?\.status !== 409/);
  assert.match(game, /mergeCloudGameStates\(serverState, buildCloudGameState\(\)\)/);
  assert.match(game, /CLOUD_SAVE_OWNER_KEY = "darkDefense\.profileOwner"/);
});

test("Neon schema uses one row per user with an optimistic revision", () => {
  assert.match(schema, /user_id bigint primary key references users\(id\) on delete cascade/i);
  assert.match(schema, /state jsonb not null/i);
  assert.match(schema, /revision bigint not null/i);
});
