(function bootstrapProfileStore(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};
  const PROFILE_SCHEMA_VERSION = 4;
  const DEFAULT_STORAGE_KEY = "darkDefense.profile";
  const HERO_ID = "varyn";
  const EQUIPMENT_SLOT_IDS = Object.freeze(["weapon", "armor", "boots", "ring", "charm"]);

  function clone(value) {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function safeInteger(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, Math.floor(number)));
  }

  function createDefaultProfile(now = Date.now()) {
    return {
      schemaVersion: PROFILE_SCHEMA_VERSION,
      revision: 0,
      createdAt: now,
      updatedAt: now,
      player: {
        displayName: "",
        crestId: null
      },
      progress: {
        bestScore: 0,
        furthestStage: 1,
        endlessUnlocked: false,
        bestEndlessWave: 0
      },
      heroes: {
        activeHeroId: HERO_ID,
        roster: {
          [HERO_ID]: {
            unlocked: true,
            level: 1,
            xp: 0,
            totalXp: 0
          }
        }
      },
      inventory: {
        capacity: 40,
        items: []
      },
      equipment: {
        heroes: {}
      },
      skillTrees: {
        heroes: {
          [HERO_ID]: { ranks: {} }
        },
        towers: {}
      },
      castle: {
        level: 1,
        upgrades: {}
      },
      world: {
        unlockedNodes: ["forest_01"],
        completedNodes: []
      },
      story: {
        chapter: 1,
        flags: {}
      },
      rewards: {
        pityCounters: {},
        unclaimed: []
      },
      prestige: {
        rank: 0,
        currency: 0,
        upgrades: {}
      },
      guild: {
        mode: "single_player",
        level: 1,
        reputation: 0,
        roster: [],
        upgrades: {}
      },
      migration: {
        legacyImported: false
      }
    };
  }

  function sanitizeHero(hero, fallback) {
    const source = isRecord(hero) ? hero : {};
    return {
      ...fallback,
      ...source,
      unlocked: source.unlocked !== false,
      level: safeInteger(source.level, fallback.level, 1, 20),
      xp: safeInteger(source.xp, fallback.xp),
      totalXp: safeInteger(source.totalXp, fallback.totalXp)
    };
  }

  function sanitizeEquipment(equipment, fallback) {
    const source = isRecord(equipment) ? equipment : {};
    const sourceHeroes = isRecord(source.heroes) ? source.heroes : {};
    const heroes = {};
    Object.entries(sourceHeroes).forEach(([heroId, loadout]) => {
      if (!heroId || !isRecord(loadout)) return;
      const sanitizedLoadout = {};
      EQUIPMENT_SLOT_IDS.forEach((slotId) => {
        const instanceId = loadout[slotId];
        if (typeof instanceId === "string" && instanceId) {
          sanitizedLoadout[slotId] = instanceId;
        }
      });
      heroes[heroId] = sanitizedLoadout;
    });
    return {
      ...fallback,
      ...source,
      heroes
    };
  }

  function sanitizeSkillTrees(skillTrees, fallback) {
    const source = isRecord(skillTrees) ? skillTrees : {};
    const sourceHeroes = isRecord(source.heroes) ? source.heroes : {};
    const heroes = {};
    Object.entries(sourceHeroes).forEach(([heroId, tree]) => {
      if (!heroId || !isRecord(tree)) return;
      const sourceRanks = isRecord(tree.ranks) ? tree.ranks : {};
      const ranks = {};
      Object.entries(sourceRanks).forEach(([skillId, rank]) => {
        const sanitizedRank = safeInteger(rank, 0, 0, 99);
        if (skillId && sanitizedRank > 0) ranks[skillId] = sanitizedRank;
      });
      heroes[heroId] = { ranks };
    });
    if (!heroes[HERO_ID]) heroes[HERO_ID] = { ranks: {} };
    return {
      ...fallback,
      ...source,
      heroes,
      towers: isRecord(source.towers) ? clone(source.towers) : {}
    };
  }

  function sanitizeProfile(candidate, now = Date.now()) {
    const defaults = createDefaultProfile(now);
    const source = isRecord(candidate) ? candidate : {};
    const sourceHeroes = isRecord(source.heroes) ? source.heroes : {};
    const sourceRoster = isRecord(sourceHeroes.roster) ? sourceHeroes.roster : {};
    const sourceProgress = isRecord(source.progress) ? source.progress : {};
    const sourceInventory = isRecord(source.inventory) ? source.inventory : {};
    const sourceRewards = isRecord(source.rewards) ? source.rewards : {};
    const activeHeroId = typeof sourceHeroes.activeHeroId === "string" && sourceHeroes.activeHeroId
      ? sourceHeroes.activeHeroId
      : HERO_ID;

    return {
      ...defaults,
      ...source,
      schemaVersion: PROFILE_SCHEMA_VERSION,
      revision: safeInteger(source.revision, 0),
      createdAt: safeInteger(source.createdAt, now, 1),
      updatedAt: safeInteger(source.updatedAt, now, 1),
      player: { ...defaults.player, ...(isRecord(source.player) ? source.player : {}) },
      progress: {
        ...defaults.progress,
        ...sourceProgress,
        bestScore: safeInteger(sourceProgress.bestScore, 0),
        furthestStage: safeInteger(sourceProgress.furthestStage, 1, 1),
        bestEndlessWave: safeInteger(sourceProgress.bestEndlessWave, 0),
        endlessUnlocked: sourceProgress.endlessUnlocked === true
      },
      heroes: {
        ...defaults.heroes,
        ...sourceHeroes,
        activeHeroId,
        roster: {
          ...defaults.heroes.roster,
          ...sourceRoster,
          [HERO_ID]: sanitizeHero(sourceRoster[HERO_ID], defaults.heroes.roster[HERO_ID])
        }
      },
      inventory: {
        ...defaults.inventory,
        ...sourceInventory,
        capacity: safeInteger(sourceInventory.capacity, defaults.inventory.capacity, 1, 500),
        items: Array.isArray(sourceInventory.items)
          ? sourceInventory.items.filter(isRecord).map(clone)
          : []
      },
      equipment: sanitizeEquipment(source.equipment, defaults.equipment),
      skillTrees: sanitizeSkillTrees(source.skillTrees, defaults.skillTrees),
      castle: { ...defaults.castle, ...(isRecord(source.castle) ? source.castle : {}) },
      world: { ...defaults.world, ...(isRecord(source.world) ? source.world : {}) },
      story: { ...defaults.story, ...(isRecord(source.story) ? source.story : {}) },
      rewards: {
        ...defaults.rewards,
        ...sourceRewards,
        pityCounters: isRecord(sourceRewards.pityCounters) ? { ...sourceRewards.pityCounters } : {},
        unclaimed: Array.isArray(sourceRewards.unclaimed)
          ? sourceRewards.unclaimed.filter(isRecord).map(clone)
          : []
      },
      prestige: { ...defaults.prestige, ...(isRecord(source.prestige) ? source.prestige : {}) },
      guild: { ...defaults.guild, ...(isRecord(source.guild) ? source.guild : {}) },
      migration: { ...defaults.migration, ...(isRecord(source.migration) ? source.migration : {}) }
    };
  }

  function createProfileStore(options = {}) {
    const storage = options.storage || global.localStorage;
    const storageKey = options.storageKey || DEFAULT_STORAGE_KEY;
    const events = options.events || DarkDefense.events || null;
    let profile = load();

    function readStorage(key) {
      try {
        return storage && storage.getItem(key);
      } catch (error) {
        console.warn(`[Dark Defense] Could not read "${key}" from storage:`, error);
        return null;
      }
    }

    function writeStorage(key, value) {
      if (!storage) return false;
      try {
        storage.setItem(key, value);
        return true;
      } catch (error) {
        console.warn(`[Dark Defense] Could not write "${key}" to storage:`, error);
        return false;
      }
    }

    function load() {
      const raw = readStorage(storageKey);
      if (!raw) return importLegacy(createDefaultProfile());
      try {
        const parsed = JSON.parse(raw);
        if (!isRecord(parsed)) throw new TypeError("Profile root must be an object.");
        const migrated = importLegacy(sanitizeProfile(parsed));
        if (parsed.schemaVersion !== PROFILE_SCHEMA_VERSION) {
          writeStorage(storageKey, JSON.stringify(migrated));
        }
        return migrated;
      } catch (error) {
        const backupKey = `${storageKey}.corrupt`;
        writeStorage(backupKey, raw);
        console.warn(`[Dark Defense] Invalid profile moved to "${backupKey}".`, error);
        return importLegacy(createDefaultProfile());
      }
    }

    function importLegacy(candidate) {
      if (candidate.migration.legacyImported) return candidate;
      const imported = clone(candidate);
      imported.player.displayName = readStorage("sdcPlayerName") || imported.player.displayName;
      imported.progress.bestScore = safeInteger(readStorage("sdcBestScore"), imported.progress.bestScore);
      imported.progress.furthestStage = safeInteger(readStorage("sdcFurthestStage"), imported.progress.furthestStage, 1);
      imported.progress.endlessUnlocked = readStorage("sdcEndlessUnlocked") === "1" || imported.progress.endlessUnlocked;
      imported.progress.bestEndlessWave = safeInteger(readStorage("sdcBestEndlessWave"), imported.progress.bestEndlessWave);
      imported.migration.legacyImported = true;
      imported.updatedAt = Date.now();
      writeStorage(storageKey, JSON.stringify(imported));
      return imported;
    }

    function persist(nextProfile, reason = "update") {
      const next = sanitizeProfile(nextProfile);
      next.revision = profile.revision + 1;
      next.createdAt = profile.createdAt;
      next.updatedAt = Date.now();
      if (!writeStorage(storageKey, JSON.stringify(next))) return false;
      const previous = profile;
      profile = next;
      events?.emit("profile:changed", {
        reason,
        previous: clone(previous),
        current: clone(profile)
      });
      return true;
    }

    function getSnapshot() {
      return clone(profile);
    }

    function getHero(heroId = profile.heroes.activeHeroId) {
      const hero = profile.heroes.roster[heroId];
      return hero ? clone(hero) : null;
    }

    function updateHero(heroId, updater, reason = "hero:update") {
      const currentHero = getHero(heroId);
      if (!currentHero) throw new Error(`Unknown hero "${heroId}".`);
      const proposed = typeof updater === "function"
        ? updater(clone(currentHero))
        : { ...currentHero, ...(isRecord(updater) ? updater : {}) };
      const next = getSnapshot();
      next.heroes.roster[heroId] = sanitizeHero(proposed, currentHero);
      return persist(next, reason);
    }

    function update(updater, reason = "profile:update") {
      const draft = getSnapshot();
      const proposed = typeof updater === "function" ? updater(draft) : updater;
      return persist(proposed || draft, reason);
    }

    function reset() {
      const next = createDefaultProfile();
      return persist(next, "profile:reset");
    }

    return Object.freeze({
      storageKey,
      schemaVersion: PROFILE_SCHEMA_VERSION,
      getSnapshot,
      getHero,
      updateHero,
      update,
      reset
    });
  }

  DarkDefense.PROFILE_SCHEMA_VERSION = PROFILE_SCHEMA_VERSION;
  DarkDefense.createDefaultProfile = createDefaultProfile;
  DarkDefense.createProfileStore = createProfileStore;
})(typeof window !== "undefined" ? window : globalThis);
