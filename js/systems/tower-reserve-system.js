(function bootstrapTowerReserveSystem(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  function createTowerReserveSystem(options = {}) {
    const unitTypes = options.unitTypes || {};
    const specializations = options.specializations || {};
    const applyPermanentUpgrades = options.applyPermanentUpgrades || (() => {});
    const clone = options.clone || ((value) => (
      typeof structuredClone === "function"
        ? structuredClone(value)
        : JSON.parse(JSON.stringify(value))
    ));

    function applyGenericUpgrade(unit) {
      unit.damage *= unit.type === "bomb" ? 1.50 : 1.40;
      unit.range *= 1.10;
      unit.fireRate *= 0.95;
      if (unit.projectileSpeed) unit.projectileSpeed *= 1.06;
      if (unit.splash) unit.splash *= 1.10;
    }

    function resetSpecializationStats(unit) {
      unit.specialization = null;
      unit.specSlowFactor = 1;
      unit.specSlowDuration = 0;
      unit.specChainTargets = 0;
      unit.specChainDamageFactor = 0;
      unit.specBonusVsFast = 1;
      unit.specStunChance = 0;
      unit.specStunDuration = 0;
      unit.specBrittleStacks = 1;
    }

    function resetTransientState(unit) {
      unit.id = null;
      unit.c = null;
      unit.r = null;
      unit.cooldown = 0;
      unit.aimAngle = -0.3;
      unit.snareTimer = 0;
      unit.wealthSurgeTimer = 0;
      unit.cryoTick = 0;
      delete unit.snareColor;
      delete unit.snareLabel;
    }

    function rebuildAtLevel(sourceUnit, targetLevel) {
      const base = unitTypes[sourceUnit?.type];
      if (!base || targetLevel < 1) return null;

      const rebuilt = clone(sourceUnit);
      Object.assign(rebuilt, clone(base));
      rebuilt.level = 1;
      rebuilt.totalSpent = base.cost;
      rebuilt.nextUpgradeCost = base.upgradeCost;
      resetSpecializationStats(rebuilt);
      resetTransientState(rebuilt);
      applyPermanentUpgrades(rebuilt);

      const requestedSpecialization = targetLevel >= 3
        ? sourceUnit.specialization
        : null;
      const specialization = requestedSpecialization
        ? specializations[sourceUnit.type]?.[requestedSpecialization]
        : null;

      for (let level = 2; level <= targetLevel; level += 1) {
        if (level === 3 && specialization) {
          const cost = Math.round(
            rebuilt.nextUpgradeCost * (specialization.costMult || 1)
          );
          rebuilt.totalSpent += cost;
          rebuilt.level = level;
          rebuilt.specialization = requestedSpecialization;
          specialization.apply(rebuilt);
          rebuilt.nextUpgradeCost = Math.round(cost * 1.65);
          continue;
        }

        const cost = Math.round(rebuilt.nextUpgradeCost);
        rebuilt.totalSpent += cost;
        rebuilt.level = level;
        applyGenericUpgrade(rebuilt);
        rebuilt.nextUpgradeCost = Math.round(cost * 1.65);
      }

      return rebuilt;
    }

    function returnToReserve(units, reservePool, options = {}) {
      const degradeLevels = Math.max(0, Math.floor(options.degradeLevels || 0));
      const report = {
        returned: 0,
        dismissed: 0,
        auraDismissed: 0,
        degraded: 0,
        entries: []
      };

      for (const unit of units || []) {
        const currentLevel = Math.max(1, Math.floor(Number(unit?.level) || 1));
        const targetLevel = currentLevel - degradeLevels;
        const entry = {
          type: unit?.type || "unknown",
          name: unitTypes[unit?.type]?.name || unit?.name || "Tower",
          fromLevel: currentLevel,
          toLevel: Math.max(0, targetLevel),
          lost: targetLevel < 1,
          auraType: unit?.auraType || null,
          auraName: unit?.auraName || null,
          specialization: unit?.specialization || null,
          specializationLost: !!unit?.specialization && targetLevel < 3
        };
        if (targetLevel < 1) {
          report.dismissed += 1;
          if (unit?.auraType) report.auraDismissed += 1;
          report.entries.push(entry);
          continue;
        }

        const copy = degradeLevels > 0
          ? rebuildAtLevel(unit, targetLevel)
          : clone(unit);
        if (!copy || !reservePool[unit.type]) continue;
        resetTransientState(copy);
        reservePool[unit.type].push(copy);
        report.returned += 1;
        if (degradeLevels > 0) report.degraded += 1;
        report.entries.push(entry);
      }

      return report;
    }

    function sortReserveForDeployment(reservePool) {
      Object.values(reservePool || {}).forEach((pool) => {
        if (!Array.isArray(pool)) return;
        pool.sort((a, b) => {
          const levelDiff = (b?.level || 1) - (a?.level || 1);
          if (levelDiff !== 0) return levelDiff;
          const spentDiff = (b?.totalSpent || 0) - (a?.totalSpent || 0);
          if (spentDiff !== 0) return spentDiff;
          return (b?.nextUpgradeCost || 0) - (a?.nextUpgradeCost || 0);
        });
      });
      return reservePool;
    }

    function moveReserveUnit(reservePool, type, fromIndex, toIndex) {
      const pool = reservePool?.[type];
      if (!Array.isArray(pool) || !pool.length) return false;
      const from = Math.max(0, Math.min(pool.length - 1, Math.floor(fromIndex)));
      const to = Math.max(0, Math.min(pool.length - 1, Math.floor(toIndex)));
      if (from === to) return false;
      const [unit] = pool.splice(from, 1);
      pool.splice(to, 0, unit);
      return true;
    }

    return Object.freeze({
      rebuildAtLevel,
      returnToReserve,
      sortReserveForDeployment,
      moveReserveUnit
    });
  }

  DarkDefense.createTowerReserveSystem = createTowerReserveSystem;
})(typeof window !== "undefined" ? window : globalThis);
