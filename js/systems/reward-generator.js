(function bootstrapRewardGenerator(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  const roundStat = (value) => Math.round(value * 10000) / 10000;

  function createRewardGenerator(options = {}) {
    const definitions = options.definitions || DarkDefense.ITEM_DEFINITIONS || {};
    const rarities = options.rarities || DarkDefense.ITEM_RARITIES || {};
    const affixes = options.affixes || DarkDefense.ITEM_AFFIXES || {};
    const tables = options.tables || DarkDefense.REWARD_TABLES || {};
    const pityRules = options.pityRules || DarkDefense.REWARD_PITY_RULES || {};
    const rngSource = options.rng;
    const hashSeed = options.hashSeed || DarkDefense.hashRunSeed;
    const rarityRank = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };

    function getRng() {
      const rng = typeof rngSource === "function" ? rngSource() : rngSource;
      if (!rng || typeof rng.next !== "function" || typeof rng.weighted !== "function") {
        throw new TypeError("RewardGenerator requires a RunRng instance.");
      }
      return rng;
    }

    function makeStableId(prefix, value) {
      const hash = typeof hashSeed === "function"
        ? hashSeed(value).toString(36)
        : String(value).replace(/[^a-z0-9]+/gi, "_").toLowerCase();
      return `${prefix}_${hash}`;
    }

    function rarityWeights(table, stage, endlessTier) {
      const band = table.rarityBands.find((entry) => stage <= entry.maxStage)
        || table.rarityBands[table.rarityBands.length - 1];
      const weights = { ...band.weights };
      if (endlessTier > 0) {
        const shift = Math.min(10, endlessTier);
        weights.common = Math.max(1, weights.common - shift * 0.8);
        weights.uncommon = Math.max(1, weights.uncommon - shift * 0.25);
        weights.rare += shift * 0.35;
        weights.epic += shift * 0.45;
        weights.legendary += shift * 0.25;
      }
      return weights;
    }

    function rollRarity(rng, table, stage, endlessTier) {
      const weights = rarityWeights(table, stage, endlessTier);
      return rng.weighted(Object.entries(weights).map(([value, weight]) => ({ value, weight })))
        || "common";
    }

    function rollBetween(rng, min, max, multiplier = 1) {
      return roundStat((min + (max - min) * rng.next()) * multiplier);
    }

    function resolvePity(tableId, rolledRarity, pityState) {
      const rules = pityRules[tableId] || {};
      const before = {
        rare: Math.max(0, Math.floor(Number(pityState?.rare) || 0)),
        epic: Math.max(0, Math.floor(Number(pityState?.epic) || 0))
      };
      let awardedRarity = rolledRarity;
      let triggered = null;
      const epicThreshold = Math.max(0, Math.floor(Number(rules.epic) || 0));
      const rareThreshold = Math.max(0, Math.floor(Number(rules.rare) || 0));

      if (epicThreshold > 0
        && before.epic >= epicThreshold - 1
        && rarityRank[awardedRarity] < rarityRank.epic) {
        awardedRarity = "epic";
        triggered = "epic";
      } else if (rareThreshold > 0
        && before.rare >= rareThreshold - 1
        && rarityRank[awardedRarity] < rarityRank.rare) {
        awardedRarity = "rare";
        triggered = "rare";
      }

      const after = {
        rare: rarityRank[awardedRarity] >= rarityRank.rare ? 0 : before.rare + 1,
        epic: rarityRank[awardedRarity] >= rarityRank.epic ? 0 : before.epic + 1
      };
      return {
        key: tableId,
        before,
        after,
        thresholds: { rare: rareThreshold, epic: epicThreshold },
        rolledRarity,
        awardedRarity,
        triggered
      };
    }

    function rollAffixes(rng, definition, rarity, itemLevel) {
      const candidates = Object.values(affixes)
        .filter((affix) => affix.slots.includes(definition.slot));
      const shuffled = rng.shuffle(candidates);
      const count = Math.min(rarity.affixCount, shuffled.length);
      const levelMultiplier = 1 + Math.max(0, itemLevel - 1) * 0.025;
      return shuffled.slice(0, count).map((affix) => ({
        id: affix.id,
        name: affix.name,
        label: affix.label,
        format: affix.format,
        value: rollBetween(rng, affix.min, affix.max, rarity.powerMultiplier * levelMultiplier)
      }));
    }

    function createItem(rng, context, itemIndex) {
      const available = Object.values(definitions)
        .filter((definition) => definition.minStage <= context.stage);
      const definition = rng.pick(available) || Object.values(definitions)[0];
      if (!definition) throw new Error("RewardGenerator has no item definitions.");

      const rolledRarity = rollRarity(rng, context.table, context.stage, context.endlessTier);
      const pity = itemIndex === 0
        ? resolvePity(context.table.id, rolledRarity, context.pityState)
        : null;
      const rarityId = pity?.awardedRarity || rolledRarity;
      const rarity = rarities[rarityId] || rarities.common;
      const itemLevel = Math.max(1, context.stage + rng.int(0, 1) + context.endlessTier);
      const coreValue = rollBetween(
        rng,
        definition.coreMin,
        definition.coreMax,
        rarity.powerMultiplier * (1 + (itemLevel - 1) * 0.035)
      );
      const instanceKey = `${context.sourceId}:${itemIndex}`;

      return {
        item: {
          instanceId: makeStableId("itm", instanceKey),
          definitionId: definition.id,
          name: definition.name,
          icon: definition.icon,
          slot: definition.slot,
          level: itemLevel,
          rarity: rarity.id,
          rarityName: rarity.name,
          rarityColor: rarity.color,
          power: Math.max(1, Math.round((itemLevel * 10 + coreValue * 2) * rarity.powerMultiplier)),
          coreStat: {
            id: definition.coreStat,
            value: coreValue
          },
          affixes: rollAffixes(rng, definition, rarity, itemLevel),
          boundHeroId: null,
          sourceId: context.sourceId
        },
        pity
      };
    }

    function generateBossReward(input = {}) {
      const rng = getRng();
      const mode = ["campaign", "endless", "daily"].includes(input.mode)
        ? input.mode
        : "campaign";
      const table = tables[`boss_${mode}`] || tables.boss_campaign;
      if (!table) throw new Error(`Missing reward table for mode "${mode}".`);
      const stage = Math.max(1, Math.floor(Number(input.stage) || 1));
      const wave = Math.max(1, Math.floor(Number(input.wave) || 1));
      const endlessTier = mode === "campaign" ? 0 : Math.max(0, Math.floor((wave - 1) / 10));
      const sourceId = String(input.sourceId || `boss:${rng.seed}:${mode}:${stage}:${wave}`);
      const bundleId = makeStableId("rwd", sourceId);
      const context = {
        table,
        stage,
        wave,
        mode,
        endlessTier,
        sourceId,
        pityState: input.pityState || {}
      };
      const generatedItems = Array.from(
        { length: Math.max(1, table.itemCount || 1) },
        (_, index) => createItem(rng, context, index)
      );
      const items = generatedItems.map((entry) => entry.item);
      const pity = generatedItems[0]?.pity || null;

      return {
        bundleId,
        sourceId,
        runSeed: String(input.runSeed || rng.seed || ""),
        tableId: table.id,
        mode,
        stage,
        wave,
        currency: {},
        items,
        pity
      };
    }

    return Object.freeze({ generateBossReward });
  }

  DarkDefense.createRewardGenerator = createRewardGenerator;
})(typeof window !== "undefined" ? window : globalThis);
