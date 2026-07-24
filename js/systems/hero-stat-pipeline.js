(function bootstrapHeroStatPipeline(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  const SUPPORTED_STATS = Object.freeze([
    "hero_damage_flat",
    "hero_damage_pct",
    "hero_max_hp_flat",
    "hero_max_hp_pct",
    "hero_attack_speed_pct",
    "hero_move_speed_pct",
    "ability_damage_pct",
    "cooldown_reduction_pct",
    "boss_damage_pct",
    "respawn_speed_pct"
  ]);

  const round = (value, precision = 10000) => Math.round(value * precision) / precision;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function createHeroStatPipeline(options = {}) {
    const getEquippedItems = options.getEquippedItems || (() => []);
    const getSkillModifiers = options.getSkillModifiers || (() => ({}));
    const supported = new Set(SUPPORTED_STATS);

    function collect(heroId) {
      const equipmentBonuses = Object.fromEntries(SUPPORTED_STATS.map((statId) => [statId, 0]));
      const skillBonuses = Object.fromEntries(SUPPORTED_STATS.map((statId) => [statId, 0]));
      const items = getEquippedItems(heroId);
      let equipmentPower = 0;

      (Array.isArray(items) ? items : []).forEach((item) => {
        equipmentPower += Math.max(0, Number(item?.power) || 0);
        const rolls = [item?.coreStat, ...(Array.isArray(item?.affixes) ? item.affixes : [])];
        rolls.forEach((roll) => {
          if (!roll || !supported.has(roll.id)) return;
          const value = Number(roll.value);
          if (!Number.isFinite(value) || value <= 0) return;
          equipmentBonuses[roll.id] += value;
        });
      });

      const rawSkillModifiers = getSkillModifiers(heroId) || {};
      Object.entries(rawSkillModifiers).forEach(([statId, rawValue]) => {
        if (!supported.has(statId)) return;
        const value = Number(rawValue);
        if (!Number.isFinite(value) || value <= 0) return;
        skillBonuses[statId] += value;
      });

      const bonuses = {};
      SUPPORTED_STATS.forEach((statId) => {
        equipmentBonuses[statId] = round(equipmentBonuses[statId]);
        skillBonuses[statId] = round(skillBonuses[statId]);
        bonuses[statId] = round(equipmentBonuses[statId] + skillBonuses[statId]);
      });
      return {
        bonuses,
        equipmentBonuses,
        skillBonuses,
        equipmentPower: Math.round(equipmentPower)
      };
    }

    function apply(baseStats = {}, context = {}) {
      const heroId = String(context.heroId || "varyn");
      const { bonuses, equipmentBonuses, skillBonuses, equipmentPower } = collect(heroId);
      const damage = (Number(baseStats.damage) + bonuses.hero_damage_flat)
        * (1 + bonuses.hero_damage_pct);
      const maxHp = (Number(baseStats.maxHp) + bonuses.hero_max_hp_flat)
        * (1 + bonuses.hero_max_hp_pct);
      const attackSpeed = clamp(bonuses.hero_attack_speed_pct, 0, 1);
      const cooldownReduction = clamp(bonuses.cooldown_reduction_pct, 0, 0.35);
      const respawnSpeed = clamp(bonuses.respawn_speed_pct, 0, 0.5);

      return Object.freeze({
        ...baseStats,
        maxHp: Math.max(1, Math.round(maxHp)),
        damage: Math.max(0, round(damage)),
        attackInterval: Math.max(0.24, round(Number(baseStats.attackInterval) / (1 + attackSpeed))),
        moveSpeed: Math.max(0.01, round(Number(baseStats.moveSpeed) * (1 + bonuses.hero_move_speed_pct))),
        abilityDamage: Math.max(0, round(Number(baseStats.abilityDamage) * (1 + bonuses.ability_damage_pct))),
        abilityCooldown: Math.max(4, round(Number(baseStats.abilityCooldown) * (1 - cooldownReduction))),
        respawnSeconds: Math.max(3, round(Number(baseStats.respawnSeconds) * (1 - respawnSpeed))),
        bossDamageMultiplier: round(1 + bonuses.boss_damage_pct),
        equipmentPower,
        equipmentBonuses: Object.freeze({ ...equipmentBonuses }),
        skillBonuses: Object.freeze({ ...skillBonuses })
      });
    }

    function getBreakdown(heroId = "varyn") {
      const collected = collect(heroId);
      return {
        equipmentPower: collected.equipmentPower,
        bonuses: { ...collected.bonuses },
        equipmentBonuses: { ...collected.equipmentBonuses },
        skillBonuses: { ...collected.skillBonuses }
      };
    }

    return Object.freeze({ apply, getBreakdown });
  }

  DarkDefense.HERO_EQUIPMENT_STATS = SUPPORTED_STATS;
  DarkDefense.createHeroStatPipeline = createHeroStatPipeline;
})(typeof window !== "undefined" ? window : globalThis);
