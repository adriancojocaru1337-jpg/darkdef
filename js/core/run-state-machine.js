(function bootstrapRunStateMachine(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  const RUN_PHASES = Object.freeze({
    IDLE: "idle",
    READY: "ready",
    WAVE: "wave",
    PAUSED: "paused",
    REWARD: "reward",
    TRANSITION: "transition",
    GAME_OVER: "game_over"
  });

  const VALID_PHASES = new Set(Object.values(RUN_PHASES));
  const ACTIVE_PHASES = new Set([
    RUN_PHASES.READY,
    RUN_PHASES.WAVE,
    RUN_PHASES.PAUSED,
    RUN_PHASES.REWARD,
    RUN_PHASES.TRANSITION
  ]);
  const VALID_MODES = new Set(["campaign", "endless", "daily"]);

  function normalizeMode(mode, daily = false) {
    if (daily) return "daily";
    return VALID_MODES.has(mode) ? mode : "campaign";
  }

  function normalizePhase(phase, fallback = RUN_PHASES.IDLE) {
    return VALID_PHASES.has(phase) ? phase : fallback;
  }

  function createRunStateMachine(options = {}) {
    const events = options.events || null;
    const onTransition = typeof options.onTransition === "function"
      ? options.onTransition
      : null;
    const initial = options.initial && typeof options.initial === "object"
      ? options.initial
      : {};

    let state = {
      phase: normalizePhase(initial.phase),
      previousPhase: normalizePhase(initial.previousPhase, null),
      mode: normalizeMode(initial.mode, initial.daily),
      revision: Math.max(0, Math.floor(Number(initial.revision) || 0)),
      reason: typeof initial.reason === "string" ? initial.reason : "initial"
    };

    function getState() {
      return Object.freeze({ ...state });
    }

    function getSnapshot() {
      return {
        phase: state.phase,
        previousPhase: state.previousPhase,
        mode: state.mode,
        revision: state.revision
      };
    }

    function is(phase) {
      return state.phase === phase;
    }

    function can(eventName) {
      switch (eventName) {
        case "RESET":
        case "RETURN_TO_MENU":
        case "RESTORE":
          return true;
        case "START_RUN":
          return state.phase !== RUN_PHASES.WAVE;
        case "START_WAVE":
          return state.phase === RUN_PHASES.READY;
        case "PAUSE":
          return state.phase === RUN_PHASES.READY || state.phase === RUN_PHASES.WAVE;
        case "RESUME":
          return state.phase === RUN_PHASES.PAUSED;
        case "WAVE_CLEARED":
          return state.phase === RUN_PHASES.WAVE;
        case "REWARD_OPENED":
          return state.phase === RUN_PHASES.WAVE ||
            state.phase === RUN_PHASES.READY ||
            state.phase === RUN_PHASES.PAUSED;
        case "TRANSITION_STARTED":
          return ACTIVE_PHASES.has(state.phase);
        case "READY":
          return ACTIVE_PHASES.has(state.phase);
        case "GAME_OVER":
          return ACTIVE_PHASES.has(state.phase);
        case "CHANGE_MODE":
          return state.phase !== RUN_PHASES.WAVE && state.phase !== RUN_PHASES.GAME_OVER;
        default:
          return false;
      }
    }

    function reject(eventName, payload) {
      const result = Object.freeze({
        accepted: false,
        event: eventName,
        payload,
        state: getState()
      });
      events?.emit?.("run:transition-rejected", result);
      return result;
    }

    function send(eventName, payload = {}) {
      const event = String(eventName || "").toUpperCase();
      if (!can(event)) return reject(event, payload);

      const previous = getState();
      let phase = state.phase;
      let previousPhase = state.previousPhase;
      let mode = state.mode;

      switch (event) {
        case "RESET":
        case "RETURN_TO_MENU":
          phase = RUN_PHASES.IDLE;
          previousPhase = null;
          mode = normalizeMode(payload.mode, payload.daily);
          break;
        case "START_RUN":
          phase = RUN_PHASES.READY;
          previousPhase = null;
          mode = normalizeMode(payload.mode, payload.daily);
          break;
        case "RESTORE":
          phase = normalizePhase(payload.phase, RUN_PHASES.READY);
          if (phase === RUN_PHASES.IDLE || phase === RUN_PHASES.GAME_OVER) {
            phase = RUN_PHASES.READY;
          }
          previousPhase = normalizePhase(payload.previousPhase, null);
          mode = normalizeMode(payload.mode, payload.daily);
          break;
        case "START_WAVE":
          phase = RUN_PHASES.WAVE;
          previousPhase = null;
          break;
        case "PAUSE":
          previousPhase = state.phase;
          phase = RUN_PHASES.PAUSED;
          break;
        case "RESUME":
          phase = state.previousPhase === RUN_PHASES.WAVE
            ? RUN_PHASES.WAVE
            : RUN_PHASES.READY;
          previousPhase = null;
          break;
        case "WAVE_CLEARED":
        case "READY":
          phase = RUN_PHASES.READY;
          previousPhase = null;
          break;
        case "REWARD_OPENED":
          phase = RUN_PHASES.REWARD;
          previousPhase = null;
          break;
        case "TRANSITION_STARTED":
          phase = RUN_PHASES.TRANSITION;
          previousPhase = null;
          break;
        case "GAME_OVER":
          phase = RUN_PHASES.GAME_OVER;
          previousPhase = null;
          break;
        case "CHANGE_MODE":
          mode = normalizeMode(payload.mode, payload.daily);
          break;
      }

      state = {
        phase,
        previousPhase,
        mode,
        revision: state.revision + 1,
        reason: typeof payload.reason === "string" ? payload.reason : event.toLowerCase()
      };

      const result = Object.freeze({
        accepted: true,
        event,
        payload,
        previous,
        state: getState()
      });
      events?.emit?.("run:transition", result);
      onTransition?.(result);
      return result;
    }

    return Object.freeze({
      phases: RUN_PHASES,
      getState,
      getSnapshot,
      is,
      can,
      send
    });
  }

  DarkDefense.RUN_PHASES = RUN_PHASES;
  DarkDefense.createRunStateMachine = createRunStateMachine;
})(typeof window !== "undefined" ? window : globalThis);
