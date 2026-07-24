(function bootstrapApiClient(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  class ApiError extends Error {
    constructor(message, options = {}) {
      super(message);
      this.name = "ApiError";
      this.status = Number(options.status) || 0;
      this.code = options.code || "api_error";
      this.details = options.details ?? null;
      this.retryable = options.retryable ?? (this.status === 0 || this.status === 429 || this.status >= 500);
      if (options.cause) this.cause = options.cause;
    }
  }

  function createApiClient(options = {}) {
    const basePath = String(options.basePath ?? "/.netlify/functions").replace(/\/+$/, "");
    const fetchImpl = options.fetchImpl || global.fetch?.bind(global);
    const beaconImpl = options.beaconImpl || global.navigator?.sendBeacon?.bind(global.navigator);
    const events = options.events || null;
    const defaultTimeoutMs = Math.max(0, Number(options.defaultTimeoutMs) || 10000);

    if (typeof fetchImpl !== "function") {
      throw new TypeError("ApiClient requires a fetch implementation.");
    }

    function buildUrl(endpoint, query) {
      const resource = String(endpoint || "").replace(/^\/+/, "");
      let url = `${basePath}/${resource}`;
      if (query && typeof query === "object") {
        const params = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return;
          if (Array.isArray(value)) value.forEach((item) => params.append(key, String(item)));
          else params.set(key, String(value));
        });
        const suffix = params.toString();
        if (suffix) url += `?${suffix}`;
      }
      return url;
    }

    async function readPayload(response) {
      if (response.status === 204) return null;
      const contentType = response.headers?.get?.("content-type") || "";
      if (contentType.includes("application/json")) {
        try { return await response.json(); } catch (_) { return null; }
      }
      try {
        const text = await response.text();
        return text || null;
      } catch (_) {
        return null;
      }
    }

    async function request(endpoint, requestOptions = {}) {
      const method = String(requestOptions.method || "GET").toUpperCase();
      const url = buildUrl(endpoint, requestOptions.query);
      const timeoutMs = requestOptions.timeoutMs === undefined
        ? defaultTimeoutMs
        : Math.max(0, Number(requestOptions.timeoutMs) || 0);
      const controller = new AbortController();
      const externalSignal = requestOptions.signal;
      const abortFromExternal = () => controller.abort(externalSignal?.reason);
      if (externalSignal?.aborted) abortFromExternal();
      else externalSignal?.addEventListener?.("abort", abortFromExternal, { once: true });
      const timer = timeoutMs > 0
        ? setTimeout(() => controller.abort(new Error("Request timed out.")), timeoutMs)
        : null;

      const headers = { ...(requestOptions.headers || {}) };
      let body = requestOptions.body;
      if (body !== undefined && body !== null && !(body instanceof Blob) && typeof body !== "string") {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
        body = JSON.stringify(body);
      }

      events?.emit?.("api:request", { endpoint, method, url });
      try {
        const response = await fetchImpl(url, {
          method,
          headers,
          body,
          signal: controller.signal,
          credentials: requestOptions.credentials || "same-origin",
          ...(requestOptions.cache ? { cache: requestOptions.cache } : {})
        });
        const payload = await readPayload(response);
        if (!response.ok) {
          const message = payload && typeof payload === "object"
            ? payload.error || payload.message
            : payload;
          throw new ApiError(message || `Request failed with status ${response.status}.`, {
            status: response.status,
            code: payload?.code || "http_error",
            details: payload
          });
        }
        events?.emit?.("api:success", { endpoint, method, status: response.status });
        return payload;
      } catch (error) {
        if (error instanceof ApiError) {
          events?.emit?.("api:error", { endpoint, method, error });
          throw error;
        }
        const timedOut = controller.signal.aborted && !externalSignal?.aborted;
        const wrapped = new ApiError(
          timedOut ? "Request timed out." : "Network request failed.",
          {
            status: 0,
            code: timedOut ? "timeout" : "network_error",
            cause: error
          }
        );
        events?.emit?.("api:error", { endpoint, method, error: wrapped });
        throw wrapped;
      } finally {
        if (timer) clearTimeout(timer);
        externalSignal?.removeEventListener?.("abort", abortFromExternal);
      }
    }

    function get(endpoint, options = {}) {
      return request(endpoint, { ...options, method: "GET" });
    }

    function post(endpoint, body, options = {}) {
      return request(endpoint, { ...options, method: "POST", body });
    }

    function sendBeacon(endpoint, body) {
      if (typeof beaconImpl !== "function") return false;
      const payload = body instanceof Blob
        ? body
        : new Blob([JSON.stringify(body ?? {})], { type: "application/json" });
      return beaconImpl(buildUrl(endpoint), payload);
    }

    return Object.freeze({
      buildUrl,
      request,
      get,
      post,
      sendBeacon
    });
  }

  DarkDefense.ApiError = ApiError;
  DarkDefense.createApiClient = createApiClient;
})(typeof window !== "undefined" ? window : globalThis);
