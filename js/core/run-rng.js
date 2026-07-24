(function bootstrapRunRng(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  function hashSeed(seed) {
    const text = String(seed ?? "");
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    hash >>>= 0;
    return hash || 0x6d2b79f5;
  }

  function createRunSeed(prefix = "run") {
    const randomPart = global.crypto?.getRandomValues
      ? Array.from(global.crypto.getRandomValues(new Uint32Array(2)), (value) => value.toString(36)).join("")
      : `${Date.now().toString(36)}${Math.floor(Math.random() * 0xffffffff).toString(36)}`;
    return `${prefix}:${randomPart}`;
  }

  function createRunRng(seedOrSnapshot) {
    const snapshot = seedOrSnapshot && typeof seedOrSnapshot === "object"
      ? seedOrSnapshot
      : null;
    const seed = String(snapshot?.seed ?? seedOrSnapshot ?? createRunSeed());
    let state = Number(snapshot?.state) >>> 0 || hashSeed(seed);
    let draws = Math.max(0, Math.floor(Number(snapshot?.draws) || 0));

    function nextUint32() {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      state >>>= 0;
      draws += 1;
      return state;
    }

    function next() {
      return nextUint32() / 0x100000000;
    }

    function int(min, max) {
      const low = Math.ceil(Math.min(min, max));
      const high = Math.floor(Math.max(min, max));
      if (!Number.isFinite(low) || !Number.isFinite(high)) {
        throw new TypeError("RunRng.int requires finite bounds.");
      }
      return low + Math.floor(next() * (high - low + 1));
    }

    function chance(probability) {
      const value = Math.min(1, Math.max(0, Number(probability) || 0));
      return next() < value;
    }

    function pick(items) {
      if (!Array.isArray(items) || items.length === 0) return undefined;
      return items[int(0, items.length - 1)];
    }

    function shuffle(items) {
      if (!Array.isArray(items)) throw new TypeError("RunRng.shuffle requires an array.");
      const result = items.slice();
      for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = int(0, index);
        [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
      }
      return result;
    }

    function weighted(entries) {
      if (!Array.isArray(entries) || entries.length === 0) return undefined;
      const normalized = entries
        .map((entry) => ({ ...entry, weight: Math.max(0, Number(entry.weight) || 0) }))
        .filter((entry) => entry.weight > 0);
      const total = normalized.reduce((sum, entry) => sum + entry.weight, 0);
      if (total <= 0) return undefined;
      let roll = next() * total;
      for (const entry of normalized) {
        roll -= entry.weight;
        if (roll <= 0) return entry.value;
      }
      return normalized[normalized.length - 1].value;
    }

    function getSnapshot() {
      return { seed, state: state >>> 0, draws };
    }

    return Object.freeze({
      seed,
      next,
      int,
      chance,
      pick,
      shuffle,
      weighted,
      getSnapshot
    });
  }

  DarkDefense.hashRunSeed = hashSeed;
  DarkDefense.createRunSeed = createRunSeed;
  DarkDefense.createRunRng = createRunRng;
})(typeof window !== "undefined" ? window : globalThis);
