const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function loadStageCatalog() {
  const source = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
  const startMarker = "const STAGES = ";
  const endMarker = "\n\nconst ACT_ONE_FINAL_STAGE";
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, "STAGES catalog could not be extracted");
  const literal = source.slice(start + startMarker.length, end).replace(/;\s*$/, "");
  return vm.runInNewContext(`(${literal})`);
}

function getRoutes(stage) {
  return [stage.route, ...(stage.branches || [])];
}

test("Act II contains six complete playable stages", () => {
  const stages = loadStageCatalog();
  assert.deepEqual(Object.keys(stages).map(Number), [1,2,3,4,5,6,7,8,9,10,11,12]);

  let previousDifficulty = stages[6].difficulty;
  for(let id = 7; id <= 12; id += 1) {
    const stage = stages[id];
    assert.equal(stage.act, 2, `Stage ${id} is not assigned to Act II`);
    assert.ok(stage.name && stage.name.length > 3, `Stage ${id} needs a name`);
    assert.ok(stage.bossWave >= 7 && stage.bossWave <= 10, `Stage ${id} boss wave is out of bounds`);
    assert.ok(stage.difficulty > 3, `Stage ${id} must scale beyond Act I`);
    assert.ok(stage.difficulty > previousDifficulty, `Stage ${id} difficulty must rise monotonically`);
    previousDifficulty = stage.difficulty;
    assert.equal(stage.terrainStage, id, `Stage ${id} needs its own dedicated terrain artwork`);
    assert.equal(stage.bossArtStage, id, `Stage ${id} needs its own dedicated boss artwork`);
    assert.equal(stage.musicStage, id, `Stage ${id} must use its dedicated soundtrack`);
  }
});

test("every Act II boss ships dedicated splash and three-view walk art", () => {
  const source = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
  assert.match(source, /for\(let stage = 1; stage <= 12; stage\+\+\)/);

  for(let id = 7; id <= 12; id += 1) {
    assert.match(
      source,
      new RegExp(`${id}: "assets/ui/boss-stage${id}\\.webp"`)
    );
    assert.ok(
      fs.existsSync(path.join(ROOT, "assets", "ui", `boss-stage${id}.webp`)),
      `Stage ${id} splash is missing`
    );
    for(const view of ["front", "side", "back"]) {
      assert.ok(
        fs.existsSync(path.join(ROOT, "assets2", "enemies", "animated", `boss${id}_${view}_walk.webp`)),
        `Stage ${id} ${view} walk art is missing`
      );
    }
  }
});

test("every Act II route is orthogonal, in bounds and buildable", () => {
  const stages = loadStageCatalog();
  for(let id = 7; id <= 12; id += 1) {
    const stage = stages[id];
    const pathCells = new Set();

    for(const [routeIndex, route] of getRoutes(stage).entries()) {
      assert.ok(route.length >= 7, `Stage ${id} route ${routeIndex} is too short`);
      for(let index = 0; index < route.length; index += 1) {
        const point = route[index];
        assert.ok(point.c >= 0 && point.c <= 17, `Stage ${id} route column out of bounds`);
        assert.ok(point.r >= 0 && point.r <= 9, `Stage ${id} route row out of bounds`);
        if(index === 0) continue;
        const previous = route[index - 1];
        assert.ok(
          previous.c === point.c || previous.r === point.r,
          `Stage ${id} route ${routeIndex} segment ${index} is diagonal`
        );
        if(previous.c === point.c) {
          for(let row = Math.min(previous.r, point.r); row <= Math.max(previous.r, point.r); row += 1) {
            pathCells.add(`${point.c}-${row}`);
          }
        } else {
          for(let column = Math.min(previous.c, point.c); column <= Math.max(previous.c, point.c); column += 1) {
            pathCells.add(`${column}-${point.r}`);
          }
        }
      }
    }

    for(const blocked of stage.blocked) {
      assert.equal(
        pathCells.has(`${blocked.c}-${blocked.r}`),
        false,
        `Stage ${id} has blocked terrain on its route at ${blocked.c},${blocked.r}`
      );
    }
    for(const ley of stage.ley) {
      assert.equal(
        pathCells.has(`${ley.c}-${ley.r}`),
        false,
        `Stage ${id} has a Ley node on its route at ${ley.c},${ley.r}`
      );
    }
  }
});

test("selected Act II stages contain real split-and-merge routes", () => {
  const stages = loadStageCatalog();
  const branchedStages = [8, 10, 12];
  const mapSignatures = new Set();

  for(let id = 7; id <= 12; id += 1) {
    mapSignatures.add(JSON.stringify(getRoutes(stages[id])));
  }
  assert.equal(mapSignatures.size, 6, "Every Act II stage needs a distinct route layout");

  for(const id of branchedStages) {
    const stage = stages[id];
    const routes = getRoutes(stage);
    assert.equal(routes.length, 2, `Stage ${id} should have two active routes`);
    assert.deepEqual(routes[0][0], routes[1][0], `Stage ${id} routes need one shared entrance`);
    assert.deepEqual(
      routes[0][routes[0].length - 1],
      routes[1][routes[1].length - 1],
      `Stage ${id} routes need one shared exit`
    );
    assert.notDeepEqual(routes[0], routes[1], `Stage ${id} routes never diverge`);
    assert.ok(stage.junctions?.some(junction => junction.kind === "split"), `Stage ${id} needs a split marker`);
    assert.ok(stage.junctions?.some(junction => junction.kind === "merge"), `Stage ${id} needs a merge marker`);
    for(const junction of stage.junctions) {
      assert.ok(
        routes.every(route => route.some(point => point.c === junction.c && point.r === junction.r)),
        `Stage ${id} junction ${junction.c},${junction.r} is not shared by every route`
      );
    }
  }

  assert.equal(stages[12].junctions.length, 4, "Stage 12 should split and merge twice");
});

test("the runtime assigns and renders enemies on their selected route", () => {
  const source = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
  assert.match(source, /pathIndex[\s\S]*paths\.length/);
  assert.match(source, /getPathPosition\(enemy\.progress,\s*enemy\.pathIndex/);
  assert.match(source, /pathCells=buildPathCells\(paths\)/);
  assert.match(source, /paths\.forEach\(route/);
});

test("Act II objectives complete before their boss waves and enemy mixes are valid", () => {
  const stages = loadStageCatalog();
  const specialTypes = new Set();
  for(let id = 7; id <= 12; id += 1) {
    const { objective, enemyWeights, specialEnemyWeights = {}, bossWave } = stages[id];
    assert.equal(objective.groups, 3, `Stage ${id} objective should expose three milestones`);
    assert.equal(objective.waveMilestones.length, objective.groups);
    assert.equal(new Set(objective.waveMilestones).size, objective.groups);
    assert.ok(objective.waveMilestones.every(wave => wave > 0 && wave < bossWave));

    Object.keys(specialEnemyWeights).forEach(type => specialTypes.add(type));
    const totalWeight = [...Object.values(enemyWeights), ...Object.values(specialEnemyWeights)]
      .reduce((sum, value) => sum + value, 0);
    assert.ok(totalWeight > 0.6 && totalWeight <= 1, `Stage ${id} enemy weights total ${totalWeight}`);
  }
  assert.deepEqual(
    [...specialTypes].sort(),
    ["cinder_skirmisher", "hollow_binder", "ley_revenant"]
  );
});

test("the three Act II special enemies ship traits, spawn templates and animated art", () => {
  globalThis.DarkDefense = {};
  const modulePath = require.resolve("../js/content/combat-content.js");
  delete require.cache[modulePath];
  require(modulePath);

  const source = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
  const types = ["cinder_skirmisher", "hollow_binder", "ley_revenant"];
  for(const type of types) {
    assert.ok(DarkDefense.ENEMY_TRAITS[type], `${type} trait is missing`);
    assert.match(source, new RegExp(`type:"${type}"`), `${type} spawn template is missing`);
    for(const view of ["front", "side", "back"]) {
      assert.ok(
        fs.existsSync(path.join(ROOT, "assets2", "enemies", "animated", `${type}_${view}_walk.webp`)),
        `${type} ${view} walk art is missing`
      );
    }
  }
});

test("every Act II boss has ordered three-phase combat state", () => {
  globalThis.DarkDefense = {};
  const modulePath = require.resolve("../js/content/combat-content.js");
  delete require.cache[modulePath];
  require(modulePath);

  for(let id = 7; id <= 12; id += 1) {
    const transitions = DarkDefense.BOSS_PHASES[id];
    assert.equal(transitions.length, 2, `Stage ${id} boss needs two phase transitions`);
    assert.ok(transitions[0].hpBelow > transitions[1].hpBelow, `Stage ${id} phase thresholds are unordered`);
    assert.equal(transitions[0].intensity, 1);
    assert.equal(transitions[1].intensity, 2);
  }
});

test("campaign loot keeps improving through the Act II finale", () => {
  globalThis.DarkDefense = {};
  const modulePath = require.resolve("../js/content/reward-content.js");
  delete require.cache[modulePath];
  require(modulePath);

  const bands = DarkDefense.REWARD_TABLES.boss_campaign.rarityBands;
  assert.deepEqual(bands.map(band => band.maxStage), [2,4,6,8,10,12]);

  const stageSix = bands.find(band => band.maxStage === 6).weights;
  const stageTwelve = bands.find(band => band.maxStage === 12).weights;
  assert.ok(stageTwelve.common < stageSix.common);
  assert.ok(stageTwelve.epic > stageSix.epic);
  assert.ok(stageTwelve.legendary > stageSix.legendary);
});
