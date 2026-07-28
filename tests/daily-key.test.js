const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseTzOffset,
  serverTodayKey,
  resolveDailyKey
} = require("../netlify/functions/daily-key");

// 2026-07-27 00:30 in Bucharest (UTC+3) is still 2026-07-26 21:30 UTC.
const JUST_AFTER_LOCAL_MIDNIGHT = Date.parse("2026-07-26T21:30:00Z");
const BUCHAREST_OFFSET = -180; // what getTimezoneOffset() returns at UTC+3

test("an explicit day key always wins", () => {
  assert.equal(
    resolveDailyKey("2026-03-04", BUCHAREST_OFFSET, JUST_AFTER_LOCAL_MIDNIGHT),
    "2026-03-04"
  );
});

test("a malformed day key falls back instead of being trusted", () => {
  for (const bad of ["", "yesterday", "2026-3-4", "2026-03-04T00:00", null, undefined]) {
    assert.equal(
      resolveDailyKey(bad, 0, Date.parse("2026-07-27T12:00:00Z")),
      "2026-07-27"
    );
  }
});

test("the fallback uses the caller's local date, not UTC", () => {
  // This is the bug: without the offset the server answered 2026-07-26 while
  // the player had already rolled over to the 27th.
  assert.equal(serverTodayKey(0, JUST_AFTER_LOCAL_MIDNIGHT), "2026-07-26");
  assert.equal(serverTodayKey(BUCHAREST_OFFSET, JUST_AFTER_LOCAL_MIDNIGHT), "2026-07-27");
});

test("works the other way across the date line", () => {
  // 2026-07-27 08:00 UTC is still the 26th in Honolulu (UTC-10).
  const morningUtc = Date.parse("2026-07-27T08:00:00Z");
  assert.equal(serverTodayKey(600, morningUtc), "2026-07-26");
  assert.equal(serverTodayKey(-780, morningUtc), "2026-07-27"); // Auckland, UTC+13
});

test("a hostile tzOffset cannot shift the board arbitrarily", () => {
  assert.equal(parseTzOffset("999999"), 840);
  assert.equal(parseTzOffset("-999999"), -840);
  assert.equal(parseTzOffset("not a number"), 0);
  assert.equal(parseTzOffset(undefined), 0);
  assert.equal(parseTzOffset("-180.9"), -180);
});

test("both clients send the offset alongside the day", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const read = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8");
  assert.match(read("game.js"), /tzOffset: new Date\(\)\.getTimezoneOffset\(\)/);
  assert.match(read("leaderboards.html"), /tzOffset=\$\{new Date\(\)\.getTimezoneOffset\(\)\}/);
});
