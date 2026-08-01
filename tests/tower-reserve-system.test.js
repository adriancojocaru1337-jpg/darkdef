const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

globalThis.DarkDefense = {};
require("../js/systems/tower-reserve-system.js");

const unitTypes = {
  archer: {
    name: "Archer",
    cost: 100,
    upgradeCost: 50,
    damage: 10,
    range: 100,
    fireRate: 1,
    projectileSpeed: 400,
    sellFactor: 0.8
  },
  bomb: {
    name: "Bomb",
    cost: 150,
    upgradeCost: 80,
    damage: 20,
    range: 80,
    fireRate: 2,
    projectileSpeed: 300,
    splash: 40,
    sellFactor: 0.8
  }
};

const specializations = {
  archer: {
    heavy: {
      costMult: 1.35,
      apply(unit) {
        unit.damage *= 2;
        unit.projectileSpeed *= 1.05;
      }
    }
  }
};

function createSystem() {
  return DarkDefense.createTowerReserveSystem({
    unitTypes,
    specializations
  });
}

function emptyReserve() {
  return { archer: [], bomb: [] };
}

test("a level-1 tower is lost at stage end even when it carries an aura", () => {
  const system = createSystem();
  const reserve = emptyReserve();
  const report = system.returnToReserve([{
    type: "archer",
    level: 1,
    auraType: "inferno",
    auraName: "Inferno"
  }], reserve, { degradeLevels: 1 });

  assert.equal(reserve.archer.length, 0);
  assert.deepEqual(report, {
    returned: 0,
    dismissed: 1,
    auraDismissed: 1,
    degraded: 0,
    entries: [{
      type: "archer",
      name: "Archer",
      fromLevel: 1,
      toLevel: 0,
      lost: true,
      auraType: "inferno",
      auraName: "Inferno",
      specialization: null,
      specializationLost: false
    }]
  });
});

test("a surviving tower loses one real level while keeping its aura", () => {
  const system = createSystem();
  const reserve = emptyReserve();
  const report = system.returnToReserve([{
    type: "archer",
    level: 4,
    specialization: "heavy",
    damage: 999,
    range: 999,
    fireRate: 0.01,
    projectileSpeed: 999,
    totalSpent: 9999,
    nextUpgradeCost: 9999,
    auraType: "storm",
    auraName: "Storm"
  }], reserve, { degradeLevels: 1 });

  const [tower] = reserve.archer;
  assert.equal(report.returned, 1);
  assert.equal(report.degraded, 1);
  assert.equal(tower.level, 3);
  assert.equal(tower.specialization, "heavy");
  assert.equal(tower.auraType, "storm");
  assert.equal(tower.damage, 28);
  assert.ok(Math.abs(tower.range - 110) < 0.0001);
  assert.equal(tower.fireRate, 0.95);
  assert.equal(tower.totalSpent, 262);
  assert.equal(tower.nextUpgradeCost, 185);
});

test("falling from specialization level to level 2 removes the specialization", () => {
  const system = createSystem();
  const reserve = emptyReserve();
  system.returnToReserve([{
    type: "archer",
    level: 3,
    specialization: "heavy",
    damage: 999,
    specBonusVsFast: 3,
    auraType: "frost"
  }], reserve, { degradeLevels: 1 });

  const [tower] = reserve.archer;
  assert.equal(tower.level, 2);
  assert.equal(tower.specialization, null);
  assert.equal(tower.damage, 14);
  assert.equal(tower.specBonusVsFast, 1);
  assert.equal(tower.auraType, "frost");
  assert.equal(tower.totalSpent, 150);
  assert.equal(tower.nextUpgradeCost, 83);
});

test("moving an army outside a stage clear does not degrade or delete it", () => {
  const system = createSystem();
  const reserve = emptyReserve();
  system.returnToReserve([{
    type: "archer",
    level: 1,
    damage: 10,
    auraType: "wealth"
  }], reserve);

  assert.equal(reserve.archer.length, 1);
  assert.equal(reserve.archer[0].level, 1);
  assert.equal(reserve.archer[0].auraType, "wealth");
});

test("only unrepaired damaged towers suffer attrition", () => {
  const system = createSystem();
  const reserve = emptyReserve();
  system.returnToReserve([
    { id: 11, type: "archer", level: 1, damage: 10 },
    { id: 12, type: "archer", level: 3, specialization: "heavy", damage: 20 },
    { id: 13, type: "bomb", level: 2, damage: 20 }
  ], reserve, { degradeLevels: 1, degradeUnitIds: [12] });

  assert.deepEqual(reserve.archer.map((tower) => tower.level), [1, 2]);
  assert.equal(reserve.archer[1].specialization, null);
  assert.equal(reserve.bomb[0].level, 2);
});

test("boss damage affects more towers while preserving a safe reserve floor", () => {
  const system = createSystem();
  const army = Array.from({ length: 8 }, (_, index) => ({ id: index + 1, type: "archer", level: 2 }));
  const normal = system.createDamagePlan(army, { stage: 5, heavy: false, repairCost: 10 });
  const boss = system.createDamagePlan(army, { stage: 6, heavy: true, repairCost: 10 });
  const fortifiedBoss = system.createDamagePlan(army, {
    stage: 6,
    heavy: true,
    repairCost: 8,
    damageReduction: 1
  });

  assert.equal(normal.damagedUnitIds.length, 2);
  assert.equal(boss.damagedUnitIds.length, 4);
  assert.equal(boss.repairCost, 10);
  assert.equal(boss.repairedUnitIds.length, 0);
  assert.equal(fortifiedBoss.damagedUnitIds.length, 3);
  assert.equal(fortifiedBoss.repairCost, 8);
  assert.deepEqual(
    system.createDamagePlan(army, { stage: 6, heavy: true, repairCost: 10 }).damagedUnitIds,
    boss.damagedUnitIds
  );

  const smallArmy = system.createDamagePlan(army.slice(0, 3), { stage: 6, heavy: true });
  assert.equal(smallArmy.damagedUnitIds.length, 1);
});

test("reserve deployment priority can be changed without altering towers", () => {
  const system = createSystem();
  const reserve = emptyReserve();
  reserve.archer.push(
    { type:"archer", level:1, auraType:"wealth" },
    { type:"archer", level:4, auraType:"storm" },
    { type:"archer", level:2 }
  );

  system.sortReserveForDeployment(reserve);
  assert.deepEqual(reserve.archer.map(unit => unit.level), [4, 2, 1]);

  assert.equal(system.moveReserveUnit(reserve, "archer", 2, 0), true);
  assert.deepEqual(reserve.archer.map(unit => unit.level), [1, 4, 2]);
  assert.equal(reserve.archer[0].auraType, "wealth");
});

test("campaign stage clears finalize only unrepaired damage exactly once", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "game.js"), "utf8");
  const selectiveCalls = source.match(/degradeUnitIds:status\.unrepairedUnitIds/g) || [];

  assert.equal(selectiveCalls.length, 1);
  assert.match(source, /function transitionToCampaignStage[\s\S]*?degradeLevels:1/);
  assert.match(source, /resolution\.type === "campaign-next-stage"[\s\S]*?createStageDamagePlan\(clearedStage\)/);
  assert.match(source, /resolution\.type === "act2-start"[\s\S]*?createStageDamagePlan\(ACT_ONE_FINAL_STAGE\)/);
  assert.match(source, /resolution\.type === "act2-complete"[\s\S]*?createStageDamagePlan\(clearedStage\)/);
  assert.match(source, /completeStageIntermission[\s\S]*?finalizeStageDamage\(intermission\)/);
  assert.match(source, /completeStageIntermission[\s\S]*?applyAttrition:false/);
  assert.match(source, /continueActTwoBtn[\s\S]*?applyAttrition:false/);
  assert.match(source, /if\(carryCampaignArmy\) moveUnitsToReserve\(\);/);
});
