export const PRIMARY_OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";
export const LAMBERT_OVERPASS_ENDPOINT = "https://lambert.openstreetmap.de/api/interpreter";
export const GALL_OVERPASS_ENDPOINT = "https://gall.openstreetmap.de/api/interpreter";
export const FALLBACK_OVERPASS_ENDPOINT = "https://overpass.private.coffee/api/interpreter";

export const DEFAULT_OVERPASS_ATTEMPT_PLAN = Object.freeze([
  Object.freeze({ endpoint: PRIMARY_OVERPASS_ENDPOINT, waitBeforeMs: 0 }),
  Object.freeze({ endpoint: LAMBERT_OVERPASS_ENDPOINT, waitBeforeMs: 5_000 }),
  Object.freeze({ endpoint: GALL_OVERPASS_ENDPOINT, waitBeforeMs: 5_000 }),
  Object.freeze({ endpoint: FALLBACK_OVERPASS_ENDPOINT, waitBeforeMs: 20_000 }),
  Object.freeze({ endpoint: PRIMARY_OVERPASS_ENDPOINT, waitBeforeMs: 60_000 }),
]);

const DEFAULT_TIMEOUT_MS = 75_000;
const DEFAULT_MAX_DATA_AGE_MS = 24 * 60 * 60 * 1_000;
const MAX_ERROR_BODY_CHARS = 1_200;

class NonRetryableOverpassError extends Error {}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const errorMessage = (error) => (error instanceof Error ? error.message : String(error));

const assertValidOverpassData = (data, { maxDataAgeMs, nowMs }) => {
  if (!Array.isArray(data?.elements)) {
    throw new Error("expected an elements array");
  }

  if (data.elements.length === 0) {
    throw new Error("returned no elements");
  }

  const timestamp = data?.osm3s?.timestamp_osm_base;
  const timestampMs = typeof timestamp === "string" ? Date.parse(timestamp) : Number.NaN;

  if (!Number.isFinite(timestampMs)) {
    throw new Error("missing or invalid osm3s.timestamp_osm_base");
  }

  const ageMs = nowMs - timestampMs;
  if (ageMs > maxDataAgeMs) {
    const ageHours = Math.round((ageMs / (60 * 60 * 1_000)) * 10) / 10;
    throw new Error(`database snapshot is stale (${ageHours} hours old)`);
  }

  return data;
};

const fetchAttempt = async ({
  endpoint,
  fetchImpl,
  maxDataAgeMs,
  nowImpl,
  query,
  timeoutMs,
}) => {
  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": "make-vienna-cool-auto-update/1.0",
      },
      body: new URLSearchParams({ data: query }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      const message = `${response.status} ${response.statusText || "HTTP error"}\n${body.slice(0, MAX_ERROR_BODY_CHARS)}`;

      if (response.status === 400) {
        throw new NonRetryableOverpassError(message);
      }

      throw new Error(message);
    }

    const data = await response.json();
    return assertValidOverpassData(data, {
      maxDataAgeMs,
      nowMs: nowImpl(),
    });
  } catch (error) {
    if (timedOut) {
      throw new Error(`request timed out after ${timeoutMs} ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchOverpassData = async ({
  query,
  attemptPlan = DEFAULT_OVERPASS_ATTEMPT_PLAN,
  fetchImpl = globalThis.fetch,
  logger = console,
  maxDataAgeMs = DEFAULT_MAX_DATA_AGE_MS,
  nowImpl = Date.now,
  sleepImpl = sleep,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) => {
  if (typeof query !== "string" || query.trim() === "") {
    throw new TypeError("An Overpass query is required.");
  }

  if (typeof fetchImpl !== "function") {
    throw new TypeError("A fetch implementation is required.");
  }

  const failures = [];

  for (let index = 0; index < attemptPlan.length; index += 1) {
    const { endpoint, waitBeforeMs = 0 } = attemptPlan[index];

    if (waitBeforeMs > 0) {
      logger.log?.(`Waiting ${waitBeforeMs / 1_000}s before Overpass attempt ${index + 1}.`);
      await sleepImpl(waitBeforeMs);
    }

    logger.log?.(`Fetching OpenStreetMap public toilets (attempt ${index + 1}/${attemptPlan.length}): ${endpoint}`);

    try {
      const data = await fetchAttempt({
        endpoint,
        fetchImpl,
        maxDataAgeMs,
        nowImpl,
        query,
        timeoutMs,
      });
      logger.log?.(`OpenStreetMap public toilets: received ${data.elements.length} elements.`);
      return data;
    } catch (error) {
      if (error instanceof NonRetryableOverpassError) {
        throw new Error(`OpenStreetMap public toilets query was rejected and will not be retried: ${error.message}`);
      }

      const message = errorMessage(error);
      failures.push(`Attempt ${index + 1} (${endpoint}): ${message}`);
      logger.warn?.(`Overpass attempt ${index + 1} failed: ${message}`);
    }
  }

  throw new Error(
    `OpenStreetMap public toilets fetch failed after ${attemptPlan.length} attempts.\n${failures.join("\n")}`,
  );
};
