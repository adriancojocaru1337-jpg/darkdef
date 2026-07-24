(function bootstrapEventBus(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  function createEventBus() {
    const listeners = new Map();

    function on(eventName, listener) {
      if (typeof listener !== "function") {
        throw new TypeError("Event listener must be a function.");
      }
      const eventListeners = listeners.get(eventName) || new Set();
      eventListeners.add(listener);
      listeners.set(eventName, eventListeners);
      return () => off(eventName, listener);
    }

    function once(eventName, listener) {
      const unsubscribe = on(eventName, (payload) => {
        unsubscribe();
        listener(payload);
      });
      return unsubscribe;
    }

    function off(eventName, listener) {
      const eventListeners = listeners.get(eventName);
      if (!eventListeners) return;
      eventListeners.delete(listener);
      if (eventListeners.size === 0) listeners.delete(eventName);
    }

    function emit(eventName, payload) {
      const eventListeners = listeners.get(eventName);
      if (!eventListeners) return;
      [...eventListeners].forEach((listener) => {
        try {
          listener(payload);
        } catch (error) {
          console.error(`[Dark Defense] Event listener failed for "${eventName}":`, error);
        }
      });
    }

    function clear(eventName) {
      if (typeof eventName === "string") listeners.delete(eventName);
      else listeners.clear();
    }

    return Object.freeze({ on, once, off, emit, clear });
  }

  DarkDefense.createEventBus = createEventBus;
  DarkDefense.events = DarkDefense.events || createEventBus();
})(typeof window !== "undefined" ? window : globalThis);
