/* Daily challenge key helpers.
 *
 * The daily challenge rolls over at the player's LOCAL midnight, so the key is a
 * client-side concept the server cannot derive on its own. Callers should always
 * send ?day=. When one doesn't, ?tzOffset= (minutes, exactly what
 * Date.prototype.getTimezoneOffset returns) lets us reconstruct their local date.
 *
 * Falling back to plain UTC served the PREVIOUS day's board between local
 * midnight and 03:00 in UTC+3.
 */

const DAILY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_TZ_OFFSET_MINUTES = 840; // UTC-14 .. UTC+14

function parseTzOffset(raw) {
  const value = Number(raw);
  if (!Number.isFinite(value)) return 0;
  return Math.max(-MAX_TZ_OFFSET_MINUTES, Math.min(MAX_TZ_OFFSET_MINUTES, Math.trunc(value)));
}

function serverTodayKey(tzOffsetMinutes = 0, now = Date.now()) {
  // getTimezoneOffset() is UTC-minus-local, so subtracting it shifts a UTC
  // instant so that its UTC fields read as the caller's local wall clock.
  const localised = new Date(now - tzOffsetMinutes * 60_000);
  return localised.toISOString().slice(0, 10);
}

function resolveDailyKey(requestedDay, rawTzOffset, now = Date.now()) {
  const requested = String(requestedDay || "").trim();
  if (DAILY_KEY_RE.test(requested)) return requested;
  return serverTodayKey(parseTzOffset(rawTzOffset), now);
}

module.exports = {
  DAILY_KEY_RE,
  MAX_TZ_OFFSET_MINUTES,
  parseTzOffset,
  serverTodayKey,
  resolveDailyKey
};
