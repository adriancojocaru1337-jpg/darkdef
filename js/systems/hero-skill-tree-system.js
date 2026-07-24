(function bootstrapHeroSkillTreeSystem(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  const clone = (value) => typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

  function createHeroSkillTreeSystem(options = {}) {
    const profileStore = options.profileStore;
    const events = options.events || DarkDefense.events || null;
    const definitions = options.definitions || DarkDefense.HERO_SKILL_DEFINITIONS || {};
    if (!profileStore?.getSnapshot || !profileStore?.update) {
      throw new TypeError("HeroSkillTreeSystem requires a ProfileStore.");
    }

    function heroIdOrActive(heroId, profile = profileStore.getSnapshot()) {
      return String(heroId || profile.heroes?.activeHeroId || "varyn");
    }

    function normalizedRanks(profile, heroId) {
      const source = profile.skillTrees?.heroes?.[heroId]?.ranks || {};
      return Object.fromEntries(Object.values(definitions).map((definition) => {
        const rank = Math.max(0, Math.min(
          definition.maxRank,
          Math.floor(Number(source[definition.id]) || 0)
        ));
        return [definition.id, rank];
      }));
    }

    function getState(heroId) {
      const profile = profileStore.getSnapshot();
      const id = heroIdOrActive(heroId, profile);
      const level = Math.max(1, Math.floor(Number(profile.heroes?.roster?.[id]?.level) || 1));
      const earnedPoints = Math.max(0, level - 1);
      const ranks = normalizedRanks(profile, id);
      const spentPoints = Object.values(ranks).reduce((total, rank) => total + rank, 0);
      return {
        heroId: id,
        level,
        earnedPoints,
        spentPoints,
        availablePoints: Math.max(0, earnedPoints - spentPoints),
        ranks: clone(ranks)
      };
    }

    function getRank(skillId, heroId) {
      return getState(heroId).ranks[skillId] || 0;
    }

    function canPurchase(skillId, heroId) {
      const definition = definitions[skillId];
      if (!definition) return { accepted: false, reason: "unknown_skill" };
      const state = getState(heroId);
      const rank = state.ranks[skillId] || 0;
      if (rank >= definition.maxRank) {
        return { accepted: false, reason: "max_rank", definition, state };
      }
      const missing = definition.prerequisites.filter((requirement) =>
        (state.ranks[requirement.id] || 0) < requirement.rank
      );
      if (missing.length) {
        return { accepted: false, reason: "prerequisite", missing: clone(missing), definition, state };
      }
      if (state.availablePoints <= 0) {
        return { accepted: false, reason: "no_points", definition, state };
      }
      return { accepted: true, reason: "available", definition, state };
    }

    function purchase(skillId, heroId) {
      const check = canPurchase(skillId, heroId);
      if (!check.accepted) return check;
      const id = check.state.heroId;
      const nextRank = check.state.ranks[skillId] + 1;
      const persisted = profileStore.update((profile) => {
        profile.skillTrees = profile.skillTrees || { heroes: {}, towers: {} };
        profile.skillTrees.heroes = profile.skillTrees.heroes || {};
        profile.skillTrees.heroes[id] = profile.skillTrees.heroes[id] || { ranks: {} };
        profile.skillTrees.heroes[id].ranks = profile.skillTrees.heroes[id].ranks || {};
        profile.skillTrees.heroes[id].ranks[skillId] = nextRank;
        return profile;
      }, "hero-skill:purchased");
      const result = {
        accepted: persisted,
        reason: persisted ? "purchased" : "persistence_failed",
        heroId: id,
        skillId,
        rank: nextRank,
        definition: check.definition,
        state: persisted ? getState(id) : check.state
      };
      if (persisted) events?.emit?.("hero-skill:changed", clone(result));
      return result;
    }

    function respec(heroId) {
      const state = getState(heroId);
      if (state.spentPoints <= 0) {
        return { accepted: false, reason: "empty", refundedPoints: 0, state };
      }
      const persisted = profileStore.update((profile) => {
        profile.skillTrees = profile.skillTrees || { heroes: {}, towers: {} };
        profile.skillTrees.heroes = profile.skillTrees.heroes || {};
        profile.skillTrees.heroes[state.heroId] = { ranks: {} };
        return profile;
      }, "hero-skill:respec");
      const result = {
        accepted: persisted,
        reason: persisted ? "respecced" : "persistence_failed",
        heroId: state.heroId,
        refundedPoints: persisted ? state.spentPoints : 0,
        state: persisted ? getState(state.heroId) : state
      };
      if (persisted) events?.emit?.("hero-skill:changed", clone(result));
      return result;
    }

    function getModifiers(heroId) {
      const state = getState(heroId);
      const modifiers = {};
      Object.values(definitions).forEach((definition) => {
        const rank = state.ranks[definition.id] || 0;
        if (rank <= 0) return;
        Object.entries(definition.modifiers).forEach(([statId, value]) => {
          modifiers[statId] = (modifiers[statId] || 0) + (Number(value) || 0) * rank;
        });
      });
      Object.keys(modifiers).forEach((statId) => {
        modifiers[statId] = Math.round(modifiers[statId] * 10000) / 10000;
      });
      return modifiers;
    }

    return Object.freeze({
      definitions,
      getState,
      getRank,
      canPurchase,
      purchase,
      respec,
      getModifiers
    });
  }

  DarkDefense.createHeroSkillTreeSystem = createHeroSkillTreeSystem;
})(typeof window !== "undefined" ? window : globalThis);
