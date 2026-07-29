(function bootstrapRewardContent(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  const freezeEntries = (record) => Object.freeze(
    Object.fromEntries(Object.entries(record).map(([key, value]) => [key, Object.freeze(value)]))
  );

  DarkDefense.EQUIPMENT_SLOTS = Object.freeze([
    Object.freeze({ id: "weapon", name: "Weapon", icon: "⚔" }),
    Object.freeze({ id: "armor", name: "Armor", icon: "🛡" }),
    Object.freeze({ id: "boots", name: "Boots", icon: "🥾" }),
    Object.freeze({ id: "ring", name: "Ring", icon: "💍" }),
    Object.freeze({ id: "charm", name: "Charm", icon: "🔷" })
  ]);

  DarkDefense.ITEM_RARITIES = freezeEntries({
    common: {
      id: "common",
      name: "Common",
      color: "#cbd5e1",
      affixCount: 0,
      powerMultiplier: 1
    },
    uncommon: {
      id: "uncommon",
      name: "Uncommon",
      color: "#86efac",
      affixCount: 1,
      powerMultiplier: 1.08
    },
    rare: {
      id: "rare",
      name: "Rare",
      color: "#60a5fa",
      affixCount: 2,
      powerMultiplier: 1.18
    },
    epic: {
      id: "epic",
      name: "Epic",
      color: "#c084fc",
      affixCount: 3,
      powerMultiplier: 1.32
    },
    legendary: {
      id: "legendary",
      name: "Legendary",
      color: "#fbbf24",
      affixCount: 4,
      powerMultiplier: 1.52
    }
  });

  DarkDefense.ITEM_DEFINITIONS = freezeEntries({
    warden_blade: {
      id: "warden_blade",
      name: "Warden Blade",
      icon: "⚔",
      slot: "weapon",
      minStage: 1,
      coreStat: "hero_damage_flat",
      coreMin: 5,
      coreMax: 9
    },
    nightguard_bow: {
      id: "nightguard_bow",
      name: "Nightguard Bow",
      icon: "🏹",
      slot: "weapon",
      minStage: 2,
      coreStat: "hero_attack_speed_pct",
      coreMin: 0.025,
      coreMax: 0.055
    },
    bastion_plate: {
      id: "bastion_plate",
      name: "Bastion Plate",
      icon: "🛡",
      slot: "armor",
      minStage: 1,
      coreStat: "hero_max_hp_flat",
      coreMin: 16,
      coreMax: 30
    },
    gravewalker_boots: {
      id: "gravewalker_boots",
      name: "Gravewalker Boots",
      icon: "🥾",
      slot: "boots",
      minStage: 2,
      coreStat: "hero_move_speed_pct",
      coreMin: 0.025,
      coreMax: 0.06
    },
    rift_ring: {
      id: "rift_ring",
      name: "Rift Ring",
      icon: "💍",
      slot: "ring",
      minStage: 3,
      coreStat: "ability_damage_pct",
      coreMin: 0.045,
      coreMax: 0.09
    },
    ley_charm: {
      id: "ley_charm",
      name: "Ley Charm",
      icon: "🔷",
      slot: "charm",
      minStage: 4,
      coreStat: "cooldown_reduction_pct",
      coreMin: 0.025,
      coreMax: 0.055
    }
  });

  DarkDefense.ITEM_AFFIXES = freezeEntries({
    hero_damage_pct: {
      id: "hero_damage_pct",
      name: "Slayer's",
      label: "Hero damage",
      min: 0.035,
      max: 0.09,
      format: "percent",
      slots: ["weapon", "ring", "charm"]
    },
    hero_max_hp_pct: {
      id: "hero_max_hp_pct",
      name: "of the Colossus",
      label: "Maximum HP",
      min: 0.04,
      max: 0.1,
      format: "percent",
      slots: ["armor", "boots", "ring", "charm"]
    },
    hero_attack_speed_pct: {
      id: "hero_attack_speed_pct",
      name: "Swift",
      label: "Attack speed",
      min: 0.025,
      max: 0.075,
      format: "percent",
      slots: ["weapon", "boots", "ring"]
    },
    ability_damage_pct: {
      id: "ability_damage_pct",
      name: "Riftborn",
      label: "Ability damage",
      min: 0.05,
      max: 0.13,
      format: "percent",
      slots: ["weapon", "ring", "charm"]
    },
    cooldown_reduction_pct: {
      id: "cooldown_reduction_pct",
      name: "of Focus",
      label: "Cooldown reduction",
      min: 0.025,
      max: 0.07,
      format: "percent",
      slots: ["boots", "ring", "charm"]
    },
    boss_damage_pct: {
      id: "boss_damage_pct",
      name: "Kingsbane",
      label: "Damage to bosses",
      min: 0.045,
      max: 0.12,
      format: "percent",
      slots: ["weapon", "ring", "charm"]
    },
    respawn_speed_pct: {
      id: "respawn_speed_pct",
      name: "Undying",
      label: "Respawn speed",
      min: 0.06,
      max: 0.16,
      format: "percent",
      slots: ["armor", "boots", "charm"]
    }
  });

  const weights = (common, uncommon, rare, epic, legendary) => Object.freeze({
    common,
    uncommon,
    rare,
    epic,
    legendary
  });

  DarkDefense.REWARD_TABLES = Object.freeze({
    boss_campaign: Object.freeze({
      id: "boss_campaign",
      itemCount: 1,
      rarityBands: Object.freeze([
        Object.freeze({ maxStage: 2, weights: weights(46, 32, 17, 4.5, 0.5) }),
        Object.freeze({ maxStage: 4, weights: weights(31, 34, 25, 9, 1) }),
        Object.freeze({ maxStage: 6, weights: weights(18, 31, 33, 15.5, 2.5) }),
        Object.freeze({ maxStage: 8, weights: weights(12, 29, 35, 20, 4) }),
        Object.freeze({ maxStage: 10, weights: weights(8, 24, 38, 24, 6) }),
        Object.freeze({ maxStage: 12, weights: weights(5, 18, 40, 29, 8) })
      ])
    }),
    boss_endless: Object.freeze({
      id: "boss_endless",
      itemCount: 1,
      rarityBands: Object.freeze([
        Object.freeze({ maxStage: 99, weights: weights(12, 26, 36, 21, 5) })
      ])
    }),
    boss_daily: Object.freeze({
      id: "boss_daily",
      itemCount: 1,
      rarityBands: Object.freeze([
        Object.freeze({ maxStage: 99, weights: weights(10, 25, 36, 23, 6) })
      ])
    })
  });

  DarkDefense.REWARD_PITY_RULES = Object.freeze({
    boss_campaign: Object.freeze({ rare: 4, epic: 10 }),
    boss_endless: Object.freeze({ rare: 4, epic: 9 }),
    boss_daily: Object.freeze({ rare: 3, epic: 8 })
  });

  // Essence granted when an item is salvaged. Deterministic function of
  // rarity and power so the same item always yields the same value.
  DarkDefense.SALVAGE_RARITY_ESSENCE = Object.freeze({
    common: 2,
    uncommon: 4,
    rare: 8,
    epic: 16,
    legendary: 32
  });

  DarkDefense.salvageValue = function salvageValue(item) {
    if (!item || typeof item !== "object") return 0;
    const rarityId = typeof item.rarity === "string" ? item.rarity : "common";
    const base = DarkDefense.SALVAGE_RARITY_ESSENCE[rarityId]
      || DarkDefense.SALVAGE_RARITY_ESSENCE.common;
    const power = Math.max(0, Math.floor(Number(item.power) || 0));
    return Math.max(1, base + Math.floor(power / 20));
  };

  // Essence required to craft a single Crystal.
  DarkDefense.CRYSTAL_ESSENCE_COST = 100;
})(typeof window !== "undefined" ? window : globalThis);
