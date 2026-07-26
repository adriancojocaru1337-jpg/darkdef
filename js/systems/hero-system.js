(function bootstrapHeroSystem(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};
  const HERO_ID = "varyn";
  const MAX_LEVEL = 20;

  const HERO_DEFINITION = Object.freeze({
    id: HERO_ID,
    name: "Varyn",
    title: "Ashen Warden",
    color: "#f59e0b",
    accent: "#fde68a",
    startProgress: 0.68,
    respawnSeconds: 12,
    abilityName: "Rift Pulse",
    abilityCooldown: 24,
    abilityRadius: 112
  });

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function xpForNextLevel(level) {
    if (level >= MAX_LEVEL) return 0;
    return 90 + (level - 1) * 55;
  }

  function getStats(level) {
    const safeLevel = clamp(Math.floor(Number(level) || 1), 1, MAX_LEVEL);
    return {
      maxHp: 230 + (safeLevel - 1) * 24,
      damage: 26 + (safeLevel - 1) * 3.4,
      range: 132 + (safeLevel - 1) * 2,
      attackInterval: Math.max(0.52, 0.78 - (safeLevel - 1) * 0.012),
      moveSpeed: 0.15 + Math.min(0.035, (safeLevel - 1) * 0.002),
      abilityDamage: 100 + (safeLevel - 1) * 11,
      abilityCooldown: HERO_DEFINITION.abilityCooldown,
      respawnSeconds: HERO_DEFINITION.respawnSeconds,
      bossDamageMultiplier: 1,
      equipmentPower: 0
    };
  }

  function xpRewardFor(enemy) {
    if (!enemy) return 0;
    if (enemy.type === "boss") return 80;
    if (enemy.type === "tank") return 12;
    if (enemy.type === "armored") return 10;
    if (enemy.type === "splitter") return enemy.fragment ? 2 : 7;
    if (enemy.type === "fast") return 6;
    return 4;
  }

  function enemyDamagePerSecond(enemy, difficulty = 1) {
    const base = {
      normal: 9,
      fast: 7,
      tank: 22,
      armored: 18,
      splitter: 11
    }[enemy?.type] || 9;
    return base * clamp(Number(difficulty) || 1, 0.75, 3);
  }

  function createHeroSystem(options = {}) {
    if (!options.profileStore) throw new Error("Hero System requires a profile store.");
    if (typeof options.getEnemies !== "function") throw new Error("Hero System requires getEnemies().");
    if (typeof options.getPathPosition !== "function") throw new Error("Hero System requires getPathPosition().");

    const profileStore = options.profileStore;
    const events = options.events || DarkDefense.events || null;
    const statPipeline = options.statPipeline || null;
    const getEnemies = options.getEnemies;
    const getPathPosition = options.getPathPosition;
    const dealDamage = options.dealDamage || ((enemy, damage) => {
      enemy.hp -= damage;
      return damage;
    });
    const onMessage = options.onMessage || (() => {});
    const onNotification = options.onNotification || (() => {});
    const onLevelUp = options.onLevelUp || (() => {});
    const ui = options.ui || {};

    let state = createRunState();
    let lastContext = { active: false, paused: false, difficulty: 1 };
    let uiRefreshTimer = 0;

    function createRunState() {
      const stats = getCurrentStats();
      return {
        hp: stats.maxHp,
        progress: HERO_DEFINITION.startProgress,
        targetProgress: HERO_DEFINITION.startProgress,
        attackCooldown: 0,
        abilityCooldown: 0,
        respawnTimer: 0,
        commandMode: false,
        blockedEnemyId: null,
        shots: [],
        pulses: []
      };
    }

    function getProgression() {
      return profileStore.getHero(HERO_ID) || {
        unlocked: true,
        level: 1,
        xp: 0,
        totalXp: 0
      };
    }

    function getCurrentStats() {
      const baseStats = getStats(getProgression().level);
      return statPipeline?.apply
        ? statPipeline.apply(baseStats, { heroId: HERO_ID })
        : baseStats;
    }

    function isAlive() {
      return state.respawnTimer <= 0 && state.hp > 0;
    }

    function isCommanding() {
      return state.commandMode && isAlive();
    }

    function cancelCommand() {
      state.commandMode = false;
      syncUi();
    }

    function toggleCommandMode() {
      if (!lastContext.active || lastContext.paused || !isAlive()) {
        onMessage(state.respawnTimer > 0
          ? `${HERO_DEFINITION.name} returns in ${Math.ceil(state.respawnTimer)}s.`
          : "Start the run before issuing a hero command.");
        return false;
      }
      state.commandMode = !state.commandMode;
      onMessage(state.commandMode
        ? `Command ${HERO_DEFINITION.name}: choose a point on the road.`
        : "Hero command canceled.");
      syncUi();
      return state.commandMode;
    }

    function nearestPathProgress(x, y) {
      let bestProgress = state.progress;
      let bestDistanceSquared = Infinity;
      const samples = 180;
      for (let index = 0; index <= samples; index += 1) {
        const progress = index / samples;
        const point = getPathPosition(progress);
        const dx = point.x - x;
        const dy = point.y - y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < bestDistanceSquared) {
          bestDistanceSquared = distanceSquared;
          bestProgress = progress;
        }
      }
      return bestProgress;
    }

    function commandToWorld(x, y) {
      if (!isCommanding()) return false;
      state.targetProgress = clamp(nearestPathProgress(x, y), 0.08, 0.94);
      state.commandMode = false;
      onMessage(`${HERO_DEFINITION.name} is moving to the new guard point.`);
      events?.emit("hero:commanded", { heroId: HERO_ID, targetProgress: state.targetProgress });
      syncUi();
      return true;
    }

    function clearHeroBlocks(enemies) {
      enemies.forEach((enemy) => {
        if (enemy.blockedByHeroId === HERO_ID) delete enemy.blockedByHeroId;
      });
      state.blockedEnemyId = null;
    }

    function move(dt) {
      const stats = getCurrentStats();
      const delta = state.targetProgress - state.progress;
      if (Math.abs(delta) < 0.001) {
        state.progress = state.targetProgress;
        return;
      }
      const step = stats.moveSpeed * dt;
      state.progress += clamp(delta, -step, step);
    }

    function findBlockTarget(enemies, heroPosition) {
      let target = null;
      let bestDistance = 28;
      for (const enemy of enemies) {
        if (!enemy || enemy.hp <= 0 || enemy.type === "boss") continue;
        const enemyPosition = getPathPosition(enemy.progress);
        const distance = Math.hypot(enemyPosition.x - heroPosition.x, enemyPosition.y - heroPosition.y);
        if (distance < bestDistance) {
          target = enemy;
          bestDistance = distance;
        }
      }
      return target;
    }

    function findAttackTarget(enemies, heroPosition, range) {
      let target = null;
      let bestProgress = -Infinity;
      for (const enemy of enemies) {
        if (!enemy || enemy.hp <= 0) continue;
        const enemyPosition = getPathPosition(enemy.progress);
        const distance = Math.hypot(enemyPosition.x - heroPosition.x, enemyPosition.y - heroPosition.y);
        if (distance <= range && enemy.progress > bestProgress) {
          target = { enemy, position: enemyPosition };
          bestProgress = enemy.progress;
        }
      }
      return target;
    }

    function defeat() {
      const stats = getCurrentStats();
      state.hp = 0;
      state.respawnTimer = stats.respawnSeconds;
      state.commandMode = false;
      state.blockedEnemyId = null;
      onMessage(`${HERO_DEFINITION.name} has fallen. Respawn in ${Math.ceil(stats.respawnSeconds)}s.`);
      onNotification("stage", "Hero fallen", `${HERO_DEFINITION.name} will return to the road.`);
      events?.emit("hero:defeated", { heroId: HERO_ID, respawnSeconds: state.respawnTimer });
    }

    function respawn() {
      const stats = getCurrentStats();
      state.hp = stats.maxHp;
      state.respawnTimer = 0;
      state.progress = clamp(state.targetProgress, 0.08, 0.94);
      state.attackCooldown = 0.25;
      onMessage(`${HERO_DEFINITION.name} has returned to battle.`);
      onNotification("achievement", "Hero returned", `${HERO_DEFINITION.name} is ready to fight.`);
      events?.emit("hero:respawned", { heroId: HERO_ID });
    }

    function updateEffects(dt) {
      state.shots.forEach((shot) => { shot.life -= dt; });
      state.shots = state.shots.filter((shot) => shot.life > 0);
      state.pulses.forEach((pulse) => { pulse.life -= dt; });
      state.pulses = state.pulses.filter((pulse) => pulse.life > 0);
    }

    function update(dt, context = {}) {
      lastContext = {
        active: context.active === true,
        paused: context.paused === true,
        difficulty: Number(context.difficulty) || 1
      };
      updateEffects(dt);
      if (!lastContext.active || lastContext.paused) {
        syncUi();
        return;
      }

      const enemies = getEnemies();
      clearHeroBlocks(enemies);
      state.abilityCooldown = Math.max(0, state.abilityCooldown - dt);

      if (!isAlive()) {
        state.respawnTimer = Math.max(0, state.respawnTimer - dt);
        if (state.respawnTimer <= 0) respawn();
        syncUi();
        return;
      }

      move(dt);
      const stats = getCurrentStats();
      const heroPosition = getPathPosition(state.progress);
      const blockTarget = findBlockTarget(enemies, heroPosition);
      if (blockTarget) {
        blockTarget.blockedByHeroId = HERO_ID;
        state.blockedEnemyId = blockTarget.id;
        state.hp -= enemyDamagePerSecond(blockTarget, lastContext.difficulty) * dt;
        if (state.hp <= 0) {
          delete blockTarget.blockedByHeroId;
          defeat();
          syncUi();
          return;
        }
      }

      state.attackCooldown = Math.max(0, state.attackCooldown - dt);
      const attackTarget = findAttackTarget(enemies, heroPosition, stats.range);
      if (attackTarget && state.attackCooldown <= 0) {
        const targetMultiplier = attackTarget.enemy.type === "boss"
          ? stats.bossDamageMultiplier
          : 1;
        const damageDone = Math.max(0, Number(dealDamage(
          attackTarget.enemy,
          stats.damage * targetMultiplier,
          { heroId: HERO_ID, source: "basic" }
        )) || 0);
        state.shots.push({
          from: { ...heroPosition },
          to: { ...attackTarget.position },
          damage: damageDone,
          life: 0.18,
          maxLife: 0.18
        });
        state.attackCooldown = stats.attackInterval;
        events?.emit("hero:attacked", {
          heroId: HERO_ID,
          enemyId: attackTarget.enemy.id,
          damage: damageDone
        });
      }

      uiRefreshTimer -= dt;
      if (uiRefreshTimer <= 0) {
        uiRefreshTimer = 0.08;
        syncUi();
      }
    }

    function activateAbility() {
      if (!lastContext.active || lastContext.paused || !isAlive()) {
        onMessage(state.respawnTimer > 0
          ? `${HERO_DEFINITION.name} returns in ${Math.ceil(state.respawnTimer)}s.`
          : "The hero ability is not available right now.");
        return false;
      }
      if (state.abilityCooldown > 0) {
        onMessage(`${HERO_DEFINITION.abilityName} recharges in ${Math.ceil(state.abilityCooldown)}s.`);
        return false;
      }

      const stats = getCurrentStats();
      const heroPosition = getPathPosition(state.progress);
      let targetsHit = 0;
      for (const enemy of getEnemies()) {
        if (!enemy || enemy.hp <= 0) continue;
        const enemyPosition = getPathPosition(enemy.progress);
        const distance = Math.hypot(enemyPosition.x - heroPosition.x, enemyPosition.y - heroPosition.y);
        if (distance > HERO_DEFINITION.abilityRadius) continue;
        const targetMultiplier = enemy.type === "boss" ? stats.bossDamageMultiplier : 1;
        dealDamage(enemy, stats.abilityDamage * targetMultiplier, { heroId: HERO_ID, source: "ability" });
        targetsHit += 1;
      }

      state.abilityCooldown = stats.abilityCooldown;
      state.pulses.push({
        x: heroPosition.x,
        y: heroPosition.y,
        radius: HERO_DEFINITION.abilityRadius,
        life: 0.55,
        maxLife: 0.55
      });
      onMessage(`${HERO_DEFINITION.name} cast ${HERO_DEFINITION.abilityName} on ${targetsHit} ${targetsHit === 1 ? "enemy" : "enemies"}.`);
      events?.emit("hero:ability-used", {
        heroId: HERO_ID,
        abilityId: "rift_pulse",
        targetsHit
      });
      syncUi();
      return true;
    }

    function addExperience(amount, reason = "combat") {
      const gain = Math.max(0, Math.floor(Number(amount) || 0));
      if (gain <= 0) return { gained: 0, levelsGained: 0 };

      const before = getProgression();
      const next = { ...before, xp: before.xp + gain, totalXp: before.totalXp + gain };
      let levelsGained = 0;
      while (next.level < MAX_LEVEL) {
        const needed = xpForNextLevel(next.level);
        if (next.xp < needed) break;
        next.xp -= needed;
        next.level += 1;
        levelsGained += 1;
      }
      if (next.level >= MAX_LEVEL) next.xp = 0;
      profileStore.updateHero(HERO_ID, next, "hero:experience");

      if (levelsGained > 0) {
        const newStats = getCurrentStats();
        state.hp = newStats.maxHp;
        onLevelUp({ heroId: HERO_ID, level: next.level, levelsGained });
        events?.emit("hero:level-up", { heroId: HERO_ID, level: next.level, levelsGained });
      }
      events?.emit("hero:experience-gained", { heroId: HERO_ID, amount: gain, reason });
      syncUi();
      return { gained: gain, levelsGained, level: next.level };
    }

    function onEnemyDefeated(enemy) {
      if (!isAlive()) return { gained: 0, levelsGained: 0 };
      return addExperience(xpRewardFor(enemy), enemy?.type === "boss" ? "boss" : "combat");
    }

    function resetForStage() {
      const previousAbilityCooldown = state.abilityCooldown;
      state = createRunState();
      state.abilityCooldown = Math.min(previousAbilityCooldown, 4);
      syncUi();
    }

    function refreshStats(previousStats) {
      const nextStats = getCurrentStats();
      if (isAlive()) {
        const previousMaxHp = Math.max(1, Number(previousStats?.maxHp) || nextStats.maxHp);
        const healthRatio = clamp(state.hp / previousMaxHp, 0, 1);
        state.hp = clamp(nextStats.maxHp * healthRatio, 1, nextStats.maxHp);
      } else {
        state.respawnTimer = Math.min(state.respawnTimer, nextStats.respawnSeconds);
      }
      state.abilityCooldown = Math.min(state.abilityCooldown, nextStats.abilityCooldown);
      events?.emit("hero:stats-refreshed", {
        heroId: HERO_ID,
        stats: { ...nextStats }
      });
      syncUi();
      return { ...nextStats };
    }

    function serializeRunState() {
      return {
        heroId: HERO_ID,
        hp: Math.max(0, state.hp),
        progress: state.progress,
        targetProgress: state.targetProgress,
        attackCooldown: state.attackCooldown,
        abilityCooldown: state.abilityCooldown,
        respawnTimer: state.respawnTimer
      };
    }

    function restoreRunState(snapshot) {
      if (!snapshot || snapshot.heroId !== HERO_ID) {
        resetForStage();
        return;
      }
      const stats = getCurrentStats();
      state.hp = clamp(Number(snapshot.hp) || 0, 0, stats.maxHp);
      state.progress = clamp(Number(snapshot.progress) || HERO_DEFINITION.startProgress, 0.08, 0.94);
      state.targetProgress = clamp(Number(snapshot.targetProgress) || state.progress, 0.08, 0.94);
      state.attackCooldown = Math.max(0, Number(snapshot.attackCooldown) || 0);
      state.abilityCooldown = Math.max(0, Number(snapshot.abilityCooldown) || 0);
      state.respawnTimer = Math.max(0, Number(snapshot.respawnTimer) || 0);
      if (state.hp <= 0 && state.respawnTimer <= 0) state.respawnTimer = stats.respawnSeconds;
      state.commandMode = false;
      state.shots = [];
      state.pulses = [];
      syncUi();
    }

    function draw(ctx) {
      state.pulses.forEach((pulse) => {
        const alpha = clamp(pulse.life / pulse.maxLife, 0, 1);
        const progress = 1 - alpha;
        ctx.save();
        ctx.globalAlpha = alpha * 0.75;
        ctx.strokeStyle = HERO_DEFINITION.accent;
        ctx.lineWidth = 5 - progress * 3;
        ctx.shadowColor = HERO_DEFINITION.color;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius * (0.3 + progress * 0.7), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      state.shots.forEach((shot) => {
        const alpha = clamp(shot.life / shot.maxLife, 0, 1);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = HERO_DEFINITION.accent;
        ctx.lineWidth = 3;
        ctx.shadowColor = HERO_DEFINITION.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(shot.from.x, shot.from.y - 8);
        ctx.lineTo(shot.to.x, shot.to.y);
        ctx.stroke();
        ctx.restore();
      });

      const position = getPathPosition(state.progress);
      if (!isAlive()) {
        ctx.save();
        const alpha = 0.25 + 0.15 * Math.sin(performance.now() / 220);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = HERO_DEFINITION.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(position.x, position.y, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        return;
      }

      const stats = getCurrentStats();
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.fillStyle = "rgba(0,0,0,.34)";
      ctx.beginPath();
      ctx.ellipse(0, 12, 17, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      if (state.commandMode) {
        ctx.strokeStyle = "rgba(253,230,138,.9)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.shadowColor = HERO_DEFINITION.color;
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#422006";
      ctx.strokeStyle = HERO_DEFINITION.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -2, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = HERO_DEFINITION.color;
      ctx.beginPath();
      ctx.moveTo(-9, -4);
      ctx.lineTo(0, -15);
      ctx.lineTo(9, -4);
      ctx.lineTo(6, 10);
      ctx.lineTo(-6, 10);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#fef3c7";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(7, -8);
      ctx.lineTo(15, -18);
      ctx.stroke();
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(11, -13, 8, 2);

      const healthRatio = clamp(state.hp / stats.maxHp, 0, 1);
      ctx.fillStyle = "rgba(2,6,23,.86)";
      ctx.fillRect(-20, -27, 40, 5);
      ctx.fillStyle = healthRatio > 0.35 ? "#22c55e" : "#ef4444";
      ctx.fillRect(-20, -27, 40 * healthRatio, 5);
      ctx.restore();
    }

    function syncUi() {
      const progression = getProgression();
      const stats = getCurrentStats();
      const hpRatio = clamp(state.hp / stats.maxHp, 0, 1);
      const xpNeeded = xpForNextLevel(progression.level);
      const xpRatio = progression.level >= MAX_LEVEL ? 1 : clamp(progression.xp / xpNeeded, 0, 1);

      if (ui.name) ui.name.textContent = `${HERO_DEFINITION.name} · Lv.${progression.level}`;
      if (ui.state) {
        ui.state.textContent = state.respawnTimer > 0
          ? `Respawn ${Math.ceil(state.respawnTimer)}s`
          : (state.commandMode ? "Choose road point" : `${Math.ceil(state.hp)} / ${stats.maxHp} HP`);
      }
      if (ui.hpFill) ui.hpFill.style.width = `${Math.round(hpRatio * 100)}%`;
      if (ui.xpFill) ui.xpFill.style.width = `${Math.round(xpRatio * 100)}%`;
      if (ui.commandButton) {
        ui.commandButton.classList.toggle("active", state.commandMode);
        ui.commandButton.classList.toggle("hero-down", !isAlive());
        ui.commandButton.setAttribute("aria-pressed", String(state.commandMode));
      }
      if (ui.abilityButton) {
        const ready = state.abilityCooldown <= 0 && isAlive() && lastContext.active && !lastContext.paused;
        ui.abilityButton.disabled = !ready;
        ui.abilityButton.classList.toggle("ready", ready);
      }
      if (ui.abilityCooldown) {
        ui.abilityCooldown.textContent = state.abilityCooldown > 0
          ? `${Math.ceil(state.abilityCooldown)}s`
          : (isAlive() ? "Ready" : "Down");
      }
    }

    syncUi();

    return Object.freeze({
      definition: HERO_DEFINITION,
      getProgression,
      getStats: getCurrentStats,
      getRunState: () => ({ ...state }),
      isAlive,
      isCommanding,
      cancelCommand,
      toggleCommandMode,
      commandToWorld,
      activateAbility,
      addExperience,
      onEnemyDefeated,
      update,
      draw,
      resetForStage,
      serializeRunState,
      restoreRunState,
      refreshStats,
      syncUi
    });
  }

  DarkDefense.HERO_DEFINITION = HERO_DEFINITION;
  DarkDefense.heroXpForNextLevel = xpForNextLevel;
  DarkDefense.getHeroStats = getStats;
  DarkDefense.createHeroSystem = createHeroSystem;
})(typeof window !== "undefined" ? window : globalThis);
