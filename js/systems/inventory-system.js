(function bootstrapInventorySystem(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  const clone = (value) => typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

  const isItem = (item) => item
    && typeof item === "object"
    && typeof item.instanceId === "string"
    && item.instanceId
    && typeof item.definitionId === "string"
    && item.definitionId;

  function createInventorySystem(options = {}) {
    const profileStore = options.profileStore;
    const events = options.events || DarkDefense.events || null;
    const salvageValue = typeof options.salvageValue === "function"
      ? options.salvageValue
      : (DarkDefense.salvageValue || (() => 1));
    const crystalCost = Math.max(1, Math.floor(
      Number(options.crystalCost ?? DarkDefense.CRYSTAL_ESSENCE_COST ?? 100) || 100
    ));
    const isEquippedFn = typeof options.isEquipped === "function"
      ? options.isEquipped
      : null;
    if (!profileStore?.getSnapshot || !profileStore?.update) {
      throw new TypeError("InventorySystem requires a ProfileStore.");
    }

    function itemIsEquipped(item) {
      if (!item) return false;
      if (isEquippedFn) return !!isEquippedFn(item.instanceId);
      return typeof item.boundHeroId === "string" && !!item.boundHeroId;
    }

    function snapshotInventory() {
      const profile = profileStore.getSnapshot();
      const inventory = profile.inventory || {};
      return {
        capacity: Math.max(1, Math.floor(Number(inventory.capacity) || 40)),
        items: Array.isArray(inventory.items) ? inventory.items.filter(isItem).map(clone) : []
      };
    }

    function list(sort = "power_desc") {
      const items = snapshotInventory().items;
      const comparators = {
        power_desc: (a, b) => (Number(b.power) || 0) - (Number(a.power) || 0),
        power_asc: (a, b) => (Number(a.power) || 0) - (Number(b.power) || 0),
        level_desc: (a, b) => (Number(b.level) || 0) - (Number(a.level) || 0),
        name_asc: (a, b) => String(a.name || "").localeCompare(String(b.name || ""))
      };
      return items.sort(comparators[sort] || comparators.power_desc);
    }

    function getItem(instanceId) {
      return list().find((item) => item.instanceId === instanceId) || null;
    }

    function getStatus() {
      const inventory = snapshotInventory();
      return {
        count: inventory.items.length,
        capacity: inventory.capacity,
        free: Math.max(0, inventory.capacity - inventory.items.length),
        full: inventory.items.length >= inventory.capacity
      };
    }

    function collectBundles(profile, bundleIds) {
      const queue = Array.isArray(profile.rewards?.unclaimed) ? profile.rewards.unclaimed : [];
      const requested = new Set(bundleIds);
      return queue.filter((bundle) => requested.has(bundle.bundleId));
    }

    function claim(bundleIds) {
      const ids = [...new Set((Array.isArray(bundleIds) ? bundleIds : [bundleIds])
        .filter((id) => typeof id === "string" && id))];
      if (!ids.length) return { accepted: false, reason: "empty", claimedItems: [] };

      const profile = profileStore.getSnapshot();
      const bundles = collectBundles(profile, ids);
      if (bundles.length !== ids.length) {
        return { accepted: false, reason: "missing_bundle", claimedItems: [] };
      }

      const claimedItems = bundles.flatMap((bundle) =>
        Array.isArray(bundle.items) ? bundle.items.filter(isItem).map(clone) : []
      );
      if (!claimedItems.length) {
        return { accepted: false, reason: "empty_bundle", claimedItems: [] };
      }

      const inventory = Array.isArray(profile.inventory?.items) ? profile.inventory.items : [];
      const existingIds = new Set(inventory.map((item) => item?.instanceId).filter(Boolean));
      const incomingIds = new Set();
      const conflict = claimedItems.some((item) => {
        if (existingIds.has(item.instanceId) || incomingIds.has(item.instanceId)) return true;
        incomingIds.add(item.instanceId);
        return false;
      });
      if (conflict) return { accepted: false, reason: "duplicate_item", claimedItems: [] };

      const capacity = Math.max(1, Math.floor(Number(profile.inventory?.capacity) || 40));
      if (inventory.length + claimedItems.length > capacity) {
        return {
          accepted: false,
          reason: "capacity",
          claimedItems: [],
          required: claimedItems.length,
          free: Math.max(0, capacity - inventory.length)
        };
      }

      const persisted = profileStore.update((draft) => {
        draft.inventory = draft.inventory || { capacity, items: [] };
        draft.inventory.items = Array.isArray(draft.inventory.items) ? draft.inventory.items : [];
        draft.rewards = draft.rewards || { pityCounters: {}, unclaimed: [] };
        draft.rewards.unclaimed = Array.isArray(draft.rewards.unclaimed)
          ? draft.rewards.unclaimed
          : [];
        draft.inventory.items.push(...claimedItems.map(clone));
        draft.rewards.unclaimed = draft.rewards.unclaimed
          .filter((bundle) => !ids.includes(bundle.bundleId));
        return draft;
      }, "inventory:claimed");

      const result = {
        accepted: persisted,
        reason: persisted ? "claimed" : "persistence_failed",
        bundleIds: [...ids],
        claimedItems: persisted ? claimedItems.map(clone) : []
      };
      if (persisted) events?.emit?.("inventory:claimed", clone(result));
      return result;
    }

    function removeFromInventory(instanceId, { grantEssence } = {}) {
      const id = typeof instanceId === "string" ? instanceId : "";
      if (!id) return { accepted: false, reason: "empty" };

      const profile = profileStore.getSnapshot();
      const items = Array.isArray(profile.inventory?.items) ? profile.inventory.items : [];
      const target = items.find((item) => item?.instanceId === id) || null;
      if (!target) return { accepted: false, reason: "not_found" };
      if (itemIsEquipped(target)) {
        return { accepted: false, reason: "equipped", item: clone(target) };
      }

      const essence = grantEssence ? Math.max(0, Math.floor(Number(salvageValue(target)) || 0)) : 0;
      const persisted = profileStore.update((draft) => {
        draft.inventory = draft.inventory || { capacity: 40, items: [] };
        draft.inventory.items = Array.isArray(draft.inventory.items) ? draft.inventory.items : [];
        draft.inventory.items = draft.inventory.items.filter((item) => item?.instanceId !== id);
        if (essence > 0) {
          draft.prestige = draft.prestige || { rank: 0, currency: 0, upgrades: {} };
          draft.prestige.currency = Math.max(0, Math.floor(Number(draft.prestige.currency) || 0)) + essence;
        }
        return draft;
      }, grantEssence ? "inventory:salvaged" : "inventory:discarded");

      return {
        accepted: persisted,
        reason: persisted ? (grantEssence ? "salvaged" : "discarded") : "persistence_failed",
        instanceId: id,
        item: clone(target),
        essence: persisted ? essence : 0
      };
    }

    function discard(instanceId) {
      const result = removeFromInventory(instanceId, { grantEssence: false });
      if (result.accepted) events?.emit?.("inventory:discarded", clone(result));
      return result;
    }

    function salvage(instanceId) {
      const result = removeFromInventory(instanceId, { grantEssence: true });
      if (result.accepted) events?.emit?.("inventory:salvaged", clone(result));
      return result;
    }

    function previewSalvage(instanceId) {
      const item = getItem(instanceId);
      return item ? Math.max(0, Math.floor(Number(salvageValue(item)) || 0)) : 0;
    }

    function getCurrency() {
      const prestige = profileStore.getSnapshot().prestige || {};
      const essence = Math.max(0, Math.floor(Number(prestige.currency) || 0));
      return {
        essence,
        crystalCost,
        craftableCrystals: Math.floor(essence / crystalCost),
        essenceToNextCrystal: crystalCost - (essence % crystalCost)
      };
    }

    // Spends essence and reports how many Crystals were produced. It does NOT
    // store the Crystals itself — the caller deposits them into the shared
    // Ascension wallet so essence-crafted Crystals are the same currency as
    // every other Crystal in the game.
    function craftCrystal(count = 1) {
      const requested = Math.max(1, Math.floor(Number(count) || 1));
      const before = getCurrency();
      if (before.craftableCrystals < requested) {
        return {
          accepted: false,
          reason: "insufficient_essence",
          required: requested * crystalCost,
          essence: before.essence
        };
      }
      const spent = requested * crystalCost;
      const persisted = profileStore.update((draft) => {
        draft.prestige = draft.prestige || { rank: 0, currency: 0, upgrades: {} };
        const essence = Math.max(0, Math.floor(Number(draft.prestige.currency) || 0));
        draft.prestige.currency = Math.max(0, essence - spent);
        return draft;
      }, "inventory:crystal-crafted");

      const result = {
        accepted: persisted,
        reason: persisted ? "crafted" : "persistence_failed",
        crafted: persisted ? requested : 0,
        essenceSpent: persisted ? spent : 0,
        currency: getCurrency()
      };
      if (persisted) events?.emit?.("inventory:crystal-crafted", clone(result));
      return result;
    }

    function claimBundle(bundleId) {
      return claim([bundleId]);
    }

    function claimAll() {
      const profile = profileStore.getSnapshot();
      const bundleIds = (Array.isArray(profile.rewards?.unclaimed)
        ? profile.rewards.unclaimed
        : [])
        .map((bundle) => bundle?.bundleId)
        .filter(Boolean);
      return claim(bundleIds);
    }

    return Object.freeze({
      list,
      getItem,
      getStatus,
      claimBundle,
      claimAll,
      salvage,
      discard,
      previewSalvage,
      getCurrency,
      craftCrystal
    });
  }

  DarkDefense.createInventorySystem = createInventorySystem;
})(typeof window !== "undefined" ? window : globalThis);
