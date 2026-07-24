const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/api-client.js");

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

test("GET serializes query values and returns JSON", async () => {
  let capturedUrl = "";
  const client = DarkDefense.createApiClient({
    fetchImpl: async (url) => {
      capturedUrl = url;
      return jsonResponse({ ok: true });
    }
  });

  const result = await client.get("scores", { query: { day: "2026-07-24", skip: null } });
  assert.deepEqual(result, { ok: true });
  assert.equal(capturedUrl, "/.netlify/functions/scores?day=2026-07-24");
});

test("POST sends JSON with shared defaults", async () => {
  let captured = null;
  const client = DarkDefense.createApiClient({
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return jsonResponse({ accepted: true });
    }
  });

  await client.post("submit-score", { score: 42 }, { credentials: "include" });
  assert.equal(captured.url, "/.netlify/functions/submit-score");
  assert.equal(captured.options.method, "POST");
  assert.equal(captured.options.credentials, "include");
  assert.equal(captured.options.headers["Content-Type"], "application/json");
  assert.equal(captured.options.body, '{"score":42}');
});

test("HTTP failures expose status, server message and retryability", async () => {
  const client = DarkDefense.createApiClient({
    fetchImpl: async () => jsonResponse({ error: "Too many runs" }, 429)
  });

  await assert.rejects(
    () => client.post("submit-score", {}),
    (error) => error instanceof DarkDefense.ApiError &&
      error.status === 429 &&
      error.message === "Too many runs" &&
      error.retryable === true
  );
});

test("timeouts become typed ApiError instances", async () => {
  const client = DarkDefense.createApiClient({
    defaultTimeoutMs: 5,
    fetchImpl: async (_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener("abort", () => reject(options.signal.reason));
    })
  });

  await assert.rejects(
    () => client.get("slow"),
    (error) => error instanceof DarkDefense.ApiError && error.code === "timeout"
  );
});

test("sendBeacon serializes JSON against the configured base path", async () => {
  let captured = null;
  const client = DarkDefense.createApiClient({
    basePath: "/api",
    fetchImpl: async () => jsonResponse({ ok: true }),
    beaconImpl: (url, body) => {
      captured = { url, body };
      return true;
    }
  });

  assert.equal(client.sendBeacon("save", { crystals: 9 }), true);
  assert.equal(captured.url, "/api/save");
  assert.equal(await captured.body.text(), '{"crystals":9}');
});
