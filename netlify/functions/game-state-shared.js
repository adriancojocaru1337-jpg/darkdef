"use strict";

const MAX_STATE_BYTES = 320 * 1024;
const MAX_OBJECT_KEYS = 160;
const MAX_ARRAY_ITEMS = 500;
const MAX_DEPTH = 10;
const BLOCKED_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function safeInteger(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(number)));
}

function safeString(value, maxLength = 240) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function sanitizeJson(value, depth = 0) {
  if (depth > MAX_DEPTH) return null;
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") return value.slice(0, 1000);
  if (Array.isArray(value)) {
    return value.slice(0, MAX_ARRAY_ITEMS).map((entry) => sanitizeJson(entry, depth + 1));
  }
  if (!isRecord(value)) return null;

  const result = {};
  Object.keys(value).slice(0, MAX_OBJECT_KEYS).forEach((key) => {
    if (BLOCKED_KEYS.has(key)) return;
    const cleanKey = safeString(key, 80);
    if (!cleanKey) return;
    result[cleanKey] = sanitizeJson(value[key], depth + 1);
  });
  return result;
}

function sanitizeLegacyProgress(candidate) {
  const source = isRecord(candidate) ? candidate : {};
  const claims = Array.isArray(source.achievementClaims)
    ? source.achievementClaims
      .filter((value) => typeof value === "string" && /^[a-z0-9_:-]{1,80}$/i.test(value))
      .slice(0, 100)
    : [];
  return {
    bestScore: safeInteger(source.bestScore, 0, 0, 2_000_000_000),
    furthestStage: safeInteger(source.furthestStage, 1, 1, 12),
    endlessUnlocked: source.endlessUnlocked === true,
    act2Complete: source.act2Complete === true,
    bestEndlessWave: safeInteger(source.bestEndlessWave, 0, 0, 1_000_000),
    bestEndlessBossPairs: safeInteger(source.bestEndlessBossPairs, 0, 0, 100_000),
    bestCombo: safeInteger(source.bestCombo, 0, 0, 10_000_000),
    achievementClaims: [...new Set(claims)]
  };
}

function sanitizeProfile(candidate) {
  if (!isRecord(candidate)) {
    throw new TypeError("Game state requires a profile object.");
  }
  const profile = sanitizeJson(candidate);
  profile.schemaVersion = safeInteger(profile.schemaVersion, 1, 1, 1000);
  profile.revision = safeInteger(profile.revision, 0, 0, Number.MAX_SAFE_INTEGER);
  profile.createdAt = safeInteger(profile.createdAt, Date.now(), 1, Number.MAX_SAFE_INTEGER);
  profile.updatedAt = safeInteger(profile.updatedAt, Date.now(), 1, Number.MAX_SAFE_INTEGER);

  if (isRecord(profile.inventory)) {
    profile.inventory.capacity = safeInteger(profile.inventory.capacity, 40, 1, 500);
    profile.inventory.items = Array.isArray(profile.inventory.items)
      ? profile.inventory.items.filter(isRecord).slice(0, 500)
      : [];
  }
  if (isRecord(profile.rewards)) {
    profile.rewards.unclaimed = Array.isArray(profile.rewards.unclaimed)
      ? profile.rewards.unclaimed.filter(isRecord).slice(0, 200)
      : [];
  }
  return profile;
}

function sanitizeGameState(candidate) {
  if (!isRecord(candidate)) {
    throw new TypeError("Game state must be an object.");
  }
  const state = {
    schemaVersion: 1,
    profile: sanitizeProfile(candidate.profile),
    legacy: sanitizeLegacyProgress(candidate.legacy)
  };
  if (Buffer.byteLength(JSON.stringify(state), "utf8") > MAX_STATE_BYTES) {
    const error = new RangeError("Game state is too large.");
    error.code = "state_too_large";
    throw error;
  }
  return state;
}

function sanitizeRevision(value) {
  return safeInteger(value, 0, 0, Number.MAX_SAFE_INTEGER);
}

module.exports = {
  MAX_STATE_BYTES,
  sanitizeGameState,
  sanitizeLegacyProgress,
  sanitizeRevision
};
