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

    function damageScore(unit, index, stage) {
      const key = `${Math.max(0, Math.floor(Number(stage) || 0))}:${unit?.id ?? index}`;
      let hash = 2166136261;
      for (let cursor = 0; cursor < key.length; cursor += 1) {
        hash ^= key.charCodeAt(cursor);
        hash = Math.imul(hash, 16777619);
      }
      return hash >>> 0;
    }

    function createDamagePlan(units, options = {}) {
      const army = Array.isArray(units) ? units : [];
      const heavy = options.heavy === true;
      const reserveFloor = Math.max(0, Math.floor(Number(options.reserveFloor ?? 2) || 0));
      const available = Math.max(0, army.length - reserveFloor);
      const cap = heavy ? 4 : 2;
      const minimum = heavy ? 2 : 1;
      const ratioTarget = Math.ceil(army.length * (heavy ? 0.5 : 0.25));
      const damageReduction = Math.max(0, Math.floor(Number(options.damageReduction) || 0));
      const damageCount = Math.max(0,
        Math.min(available, cap, Math.max(minimum, ratioTarget)) - damageReduction
      );
      const damagedUnitIds = army
        .map((unit, index) => ({
          id: unit?.id ?? index,
          score: damageScore(unit, index, options.stage)
        }))
        .sort((a, b) => a.score - b.score || String(a.id).localeCompare(String(b.id)))
        .slice(0, damageCount)
        .map((entry) => entry.id);
      return {
        version: 1,
        heavy,
        repairCost: Math.max(1, Math.floor(Number(options.repairCost) || 10)),
        damagedUnitIds,
        repairedUnitIds: [],
        resolved: false
      };
    }

    function returnToReserve(units, reservePool, options = {}) {
      const degradeLevels = Math.max(0, Math.floor(options.degradeLevels || 0));
      const selectiveDamage = Array.isArray(options.degradeUnitIds)
        ? new Set(options.degradeUnitIds.map((id) => String(id)))
        : null;
      const report = {
        returned: 0,
        dismissed: 0,
        auraDismissed: 0,
        degraded: 0,
        entries: []
      };

      for (const unit of units || []) {
        const unitDegradeLevels = selectiveDamage === null || selectiveDamage.has(String(unit?.id))
          ? degradeLevels
          : 0;
        const currentLevel = Math.max(1, Math.floor(Number(unit?.level) || 1));
        const targetLevel = currentLevel - unitDegradeLevels;
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

        const copy = unitDegradeLevels > 0
          ? rebuildAtLevel(unit, targetLevel)
          : clone(unit);
        if (!copy || !reservePool[unit.type]) continue;
        resetTransientState(copy);
        reservePool[unit.type].push(copy);
        report.returned += 1;
        if (unitDegradeLevels > 0) report.degraded += 1;
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
      createDamagePlan,
      returnToReserve,
      sortReserveForDeployment,
      moveReserveUnit
    });
  }

  DarkDefense.createTowerReserveSystem = createTowerReserveSystem;
})(typeof window !== "undefined" ? window : globalThis);
