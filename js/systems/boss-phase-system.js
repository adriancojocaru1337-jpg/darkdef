(function bootstrapBossPhaseSystem(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  function createBossPhaseSystem(options = {}) {
    const definitions = options.definitions || DarkDefense.BOSS_PHASES || {};
    const events = options.events || DarkDefense.events || null;
    const onTelegraph = options.onTelegraph || (() => {});
    const onTrigger = options.onTrigger || (() => {});

    function getPhases(enemy) {
      const stage = Number(enemy?.bossStage) || 1;
      return definitions[stage] || [];
    }

    function initialize(enemy) {
      if (!enemy || enemy.type !== "boss") return enemy;
      if (!enemy.phaseState) {
        enemy.phaseState = {
          completedIds: [],
          pending: null,
          activeName: "Opening",
          activeIndex: 0
        };
      }
      return enemy;
    }

    function update(enemy, dt) {
      if (!enemy || enemy.type !== "boss" || enemy.hp <= 0) return null;
      initialize(enemy);
      const state = enemy.phaseState;
      const phases = getPhases(enemy);

      if (state.pending) {
        state.pending.remaining = Math.max(0, state.pending.remaining - Math.max(0, dt));
        if (state.pending.remaining <= 0) {
          const phase = state.pending.phase;
          state.pending = null;
          if (!state.completedIds.includes(phase.id)) {
            state.completedIds.push(phase.id);
            state.activeName = phase.name;
            state.activeIndex = state.completedIds.length;
            onTrigger(enemy, phase);
            events?.emit("boss:phase-triggered", {
              enemyId: enemy.id,
              bossStage: enemy.bossStage,
              phaseId: phase.id,
              phaseIndex: state.activeIndex
            });
          }
        }
        return state;
      }

      const healthRatio = enemy.hp / Math.max(1, enemy.maxHp);
      const nextPhase = phases.find((phase) => (
        !state.completedIds.includes(phase.id)
        && healthRatio <= phase.hpBelow
      ));
      if (!nextPhase) return state;

      state.pending = {
        phase: nextPhase,
        remaining: Math.max(0.1, Number(nextPhase.telegraphSeconds) || 1.2)
      };
      onTelegraph(enemy, nextPhase);
      events?.emit("boss:phase-telegraphed", {
        enemyId: enemy.id,
        bossStage: enemy.bossStage,
        phaseId: nextPhase.id,
        delay: state.pending.remaining
      });
      return state;
    }

    function getDisplayState(enemy) {
      if (!enemy || enemy.type !== "boss") return null;
      initialize(enemy);
      const total = getPhases(enemy).length;
      return {
        activeName: enemy.phaseState.activeName,
        activeIndex: enemy.phaseState.activeIndex,
        total,
        pendingName: enemy.phaseState.pending?.phase?.name || null,
        pendingSeconds: enemy.phaseState.pending?.remaining || 0
      };
    }

    return Object.freeze({
      initialize,
      update,
      getPhases,
      getDisplayState
    });
  }

  DarkDefense.createBossPhaseSystem = createBossPhaseSystem;
})(typeof window !== "undefined" ? window : globalThis);
