(function bootstrapEquipmentSystem(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  const clone = (value) => typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

  function createEquipmentSystem(options = {}) {
    const profileStore = options.profileStore;
    const events = options.events || DarkDefense.events || null;
    const definitions = options.definitions || DarkDefense.ITEM_DEFINITIONS || {};
    const slots = options.slots || DarkDefense.EQUIPMENT_SLOTS || [];
    const slotIds = new Set(slots.map((slot) => slot.id));
    if (!profileStore?.getSnapshot || !profileStore?.update) {
      throw new TypeError("EquipmentSystem requires a ProfileStore.");
    }
    if (!slotIds.size) throw new TypeError("EquipmentSystem requires equipment slots.");

    function getHeroId(heroId) {
      const profile = profileStore.getSnapshot();
      return String(heroId || profile.heroes?.activeHeroId || "varyn");
    }

    function findItem(profile, instanceId) {
      return (Array.isArray(profile.inventory?.items) ? profile.inventory.items : [])
        .find((item) => item?.instanceId === instanceId) || null;
    }

    function itemSlot(item) {
      const definitionSlot = definitions[item?.definitionId]?.slot;
      return slotIds.has(definitionSlot)
        ? definitionSlot
        : (slotIds.has(item?.slot) ? item.slot : null);
    }

    function getEquippedIds(heroId) {
      const profile = profileStore.getSnapshot();
      const id = getHeroId(heroId);
      const loadout = profile.equipment?.heroes?.[id] || {};
      return Object.fromEntries(
        slots.map((slot) => [slot.id, typeof loadout[slot.id] === "string" ? loadout[slot.id] : null])
      );
    }

    function getEquippedItems(heroId) {
      const profile = profileStore.getSnapshot();
      const ids = getEquippedIds(heroId);
      return slots
        .map((slot) => {
          const item = ids[slot.id] ? findItem(profile, ids[slot.id]) : null;
          return item ? clone(item) : null;
        })
        .filter(Boolean);
    }

    function getLoadout(heroId) {
      const profile = profileStore.getSnapshot();
      const ids = getEquippedIds(heroId);
      return Object.fromEntries(slots.map((slot) => {
        const item = ids[slot.id] ? findItem(profile, ids[slot.id]) : null;
        return [slot.id, item ? clone(item) : null];
      }));
    }

    function isEquipped(instanceId, heroId) {
      return Object.values(getEquippedIds(heroId)).includes(instanceId);
    }

    function equip(instanceId, heroId) {
      const profile = profileStore.getSnapshot();
      const id = getHeroId(heroId);
      const item = findItem(profile, instanceId);
      if (!item) return { accepted: false, reason: "missing_item" };
      const slotId = itemSlot(item);
      if (!slotId) return { accepted: false, reason: "invalid_slot" };
      if (item.boundHeroId && item.boundHeroId !== id) {
        return { accepted: false, reason: "bound_to_other_hero" };
      }

      const previousInstanceId = profile.equipment?.heroes?.[id]?.[slotId] || null;
      if (previousInstanceId === instanceId) {
        return { accepted: false, reason: "already_equipped", slotId, item: clone(item) };
      }

      const persisted = profileStore.update((draft) => {
        draft.equipment = draft.equipment || { heroes: {} };
        draft.equipment.heroes = draft.equipment.heroes || {};
        draft.equipment.heroes[id] = draft.equipment.heroes[id] || {};
        draft.equipment.heroes[id][slotId] = instanceId;
        const storedItem = findItem(draft, instanceId);
        if (storedItem) storedItem.boundHeroId = id;
        return draft;
      }, "equipment:equipped");

      const result = {
        accepted: persisted,
        reason: persisted ? "equipped" : "persistence_failed",
        heroId: id,
        slotId,
        instanceId,
        previousInstanceId,
        item: clone(item)
      };
      if (persisted) events?.emit?.("equipment:changed", clone(result));
      return result;
    }

    function unequip(slotId, heroId) {
      if (!slotIds.has(slotId)) return { accepted: false, reason: "invalid_slot" };
      const profile = profileStore.getSnapshot();
      const id = getHeroId(heroId);
      const instanceId = profile.equipment?.heroes?.[id]?.[slotId] || null;
      if (!instanceId) return { accepted: false, reason: "empty_slot", slotId };

      const persisted = profileStore.update((draft) => {
        if (draft.equipment?.heroes?.[id]) {
          delete draft.equipment.heroes[id][slotId];
        }
        return draft;
      }, "equipment:unequipped");
      const result = {
        accepted: persisted,
        reason: persisted ? "unequipped" : "persistence_failed",
        heroId: id,
        slotId,
        instanceId
      };
      if (persisted) events?.emit?.("equipment:changed", clone(result));
      return result;
    }

    return Object.freeze({
      slots: clone(slots),
      getEquippedIds,
      getEquippedItems,
      getLoadout,
      isEquipped,
      equip,
      unequip
    });
  }

  DarkDefense.createEquipmentSystem = createEquipmentSystem;
})(typeof window !== "undefined" ? window : globalThis);
