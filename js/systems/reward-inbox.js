(function bootstrapRewardInbox(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  const clone = (value) => typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

  function createRewardInbox(options = {}) {
    const profileStore = options.profileStore;
    const events = options.events || DarkDefense.events || null;
    if (!profileStore?.getSnapshot || !profileStore?.update) {
      throw new TypeError("RewardInbox requires a ProfileStore.");
    }

    function list() {
      const profile = profileStore.getSnapshot();
      return clone(Array.isArray(profile.rewards?.unclaimed) ? profile.rewards.unclaimed : []);
    }

    function itemCount() {
      return list().reduce((total, bundle) => total + (Array.isArray(bundle.items) ? bundle.items.length : 0), 0);
    }

    function getPity(tableId) {
      const profile = profileStore.getSnapshot();
      const state = profile.rewards?.pityCounters?.[tableId];
      return {
        rare: Math.max(0, Math.floor(Number(state?.rare) || 0)),
        epic: Math.max(0, Math.floor(Number(state?.epic) || 0))
      };
    }

    function enqueue(bundle) {
      if (!bundle || typeof bundle.bundleId !== "string" || !Array.isArray(bundle.items)) {
        throw new TypeError("RewardInbox requires a valid reward bundle.");
      }
      if (list().some((entry) => entry.bundleId === bundle.bundleId)) {
        return { accepted: false, reason: "duplicate", bundle: clone(bundle) };
      }

      const persisted = profileStore.update((profile) => {
        profile.rewards = profile.rewards || {};
        profile.rewards.unclaimed = Array.isArray(profile.rewards.unclaimed)
          ? profile.rewards.unclaimed
          : [];
        profile.rewards.unclaimed.push(clone(bundle));
        const pity = bundle.pity;
        if (pity
          && typeof pity.key === "string"
          && pity.key
          && pity.after
          && typeof pity.after === "object") {
          profile.rewards.pityCounters = profile.rewards.pityCounters || {};
          profile.rewards.pityCounters[pity.key] = {
            rare: Math.max(0, Math.floor(Number(pity.after.rare) || 0)),
            epic: Math.max(0, Math.floor(Number(pity.after.epic) || 0))
          };
        }
        return profile;
      }, "reward:queued");
      const result = {
        accepted: persisted,
        reason: persisted ? "queued" : "persistence_failed",
        bundle: clone(bundle)
      };
      if (persisted) events?.emit?.("reward:queued", result);
      return result;
    }

    return Object.freeze({ list, itemCount, getPity, enqueue });
  }

  DarkDefense.createRewardInbox = createRewardInbox;
})(typeof window !== "undefined" ? window : globalThis);
