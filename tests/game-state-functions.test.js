const test = require("node:test");
const assert = require("node:assert/strict");

const AUTH_PATH = require.resolve("../netlify/functions/auth-utils");

function json(statusCode, payload) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) };
}

function stateFixture(revision = 3) {
  return {
    schemaVersion: 1,
    profile: {
      schemaVersion: 4,
      revision,
      createdAt: 1000,
      updatedAt: 2000,
      inventory: { capacity: 40, items: [{ instanceId: "itm_saved" }] }
    },
    legacy: { furthestStage: 7, endlessUnlocked: true }
  };
}

function loadFunction(name, overrides = {}) {
  const target = require.resolve(`../netlify/functions/${name}`);
  const previous = require.cache[AUTH_PATH];
  require.cache[AUTH_PATH] = {
    id: AUTH_PATH,
    filename: AUTH_PATH,
    loaded: true,
    exports: {
      json,
      getSessionUser: async () => ({ user_id: 44 }),
      sql: async () => [],
      memoryRateLimited: () => false,
      getClientIp: () => "test",
      ...overrides
    }
  };
  delete require.cache[target];
  const loaded = require(target);
  if (previous) require.cache[AUTH_PATH] = previous;
  else delete require.cache[AUTH_PATH];
  return loaded.handler;
}

test("get-game-state requires authentication", async () => {
  const handler = loadFunction("get-game-state", {
    getSessionUser: async () => null
  });
  const response = await handler({ httpMethod: "GET" });

  assert.equal(response.statusCode, 401);
  assert.match(JSON.parse(response.body).error, /authentication/i);
});

test("get-game-state returns the authenticated account revision", async () => {
  const state = stateFixture();
  const handler = loadFunction("get-game-state", {
    sql: async () => [{ state, revision: 6, updated_at: "2026-07-30T12:00:00Z" }]
  });
  const response = await handler({ httpMethod: "GET" });
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.revision, 6);
  assert.equal(body.state.profile.inventory.items[0].instanceId, "itm_saved");
});

test("save-game-state creates revision one for a new account save", async () => {
  const state = stateFixture();
  const calls = [];
  const handler = loadFunction("save-game-state", {
    sql: async (strings) => {
      calls.push(strings.join(" "));
      return [{ state, revision: 1, updated_at: "2026-07-30T12:00:00Z" }];
    }
  });
  const response = await handler({
    httpMethod: "POST",
    body: JSON.stringify({ state, expectedRevision: 0 }),
    headers: {}
  });
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.revision, 1);
  assert.match(calls[0], /insert into player_game_state/i);
});

test("save-game-state returns the current snapshot on an optimistic conflict", async () => {
  const submitted = stateFixture(8);
  const server = stateFixture(9);
  let call = 0;
  const handler = loadFunction("save-game-state", {
    sql: async () => {
      call += 1;
      if (call === 1) return [];
      return [{ state: server, revision: 12, updated_at: "2026-07-30T13:00:00Z" }];
    }
  });
  const response = await handler({
    httpMethod: "POST",
    body: JSON.stringify({ state: submitted, expectedRevision: 11 }),
    headers: {}
  });
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 409);
  assert.equal(body.code, "revision_conflict");
  assert.equal(body.revision, 12);
  assert.equal(body.state.profile.revision, 9);
});
