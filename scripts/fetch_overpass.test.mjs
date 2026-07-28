import assert from "node:assert/strict";
import test from "node:test";

import { fetchOverpassData } from "./fetch_overpass.mjs";

const NOW_MS = Date.parse("2026-07-28T12:00:00Z");
const PRIMARY = "https://primary.example/api/interpreter";
const FALLBACK = "https://fallback.example/api/interpreter";
const QUERY = "[out:json];node[amenity=toilets];out;";
const FRESH_TIMESTAMP = "2026-07-28T11:55:00Z";
const STALE_TIMESTAMP = "2026-07-26T11:55:00Z";
const silentLogger = { log() {}, warn() {} };

const response = ({ body = "", data, status = 200, statusText = "OK" } = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText,
  async json() {
    return data;
  },
  async text() {
    return body;
  },
});

const validData = (timestamp = FRESH_TIMESTAMP) => ({
  elements: [{ id: 1, type: "node" }],
  osm3s: { timestamp_osm_base: timestamp },
});

const run = ({
  attemptPlan = [
    { endpoint: PRIMARY, waitBeforeMs: 0 },
    { endpoint: FALLBACK, waitBeforeMs: 0 },
  ],
  fetchImpl,
  timeoutMs = 100,
}) =>
  fetchOverpassData({
    query: QUERY,
    attemptPlan,
    fetchImpl,
    logger: silentLogger,
    nowImpl: () => NOW_MS,
    sleepImpl: async () => {},
    timeoutMs,
  });

test("uses the fallback after a primary 504 response", async () => {
  const calls = [];
  const result = await run({
    fetchImpl: async (endpoint) => {
      calls.push(endpoint);
      if (endpoint === PRIMARY) {
        return response({ body: "server busy", status: 504, statusText: "Gateway Timeout" });
      }
      return response({ data: validData() });
    },
  });

  assert.equal(result.elements.length, 1);
  assert.deepEqual(calls, [PRIMARY, FALLBACK]);
});

test("uses the fallback after a successful response contains no elements", async () => {
  const calls = [];
  const result = await run({
    fetchImpl: async (endpoint) => {
      calls.push(endpoint);
      return response({
        data:
          endpoint === PRIMARY
            ? { elements: [], osm3s: { timestamp_osm_base: FRESH_TIMESTAMP } }
            : validData(),
      });
    },
  });

  assert.equal(result.elements.length, 1);
  assert.deepEqual(calls, [PRIMARY, FALLBACK]);
});

test("rejects a stale fallback and accepts a later fresh primary response", async () => {
  const calls = [];
  const attemptPlan = [
    { endpoint: FALLBACK, waitBeforeMs: 0 },
    { endpoint: PRIMARY, waitBeforeMs: 0 },
  ];

  const result = await run({
    attemptPlan,
    fetchImpl: async (endpoint) => {
      calls.push(endpoint);
      return response({ data: endpoint === FALLBACK ? validData(STALE_TIMESTAMP) : validData() });
    },
  });

  assert.equal(result.elements.length, 1);
  assert.deepEqual(calls, [FALLBACK, PRIMARY]);
});

test("reports every attempt when all retryable attempts fail", async () => {
  const attemptPlan = [
    { endpoint: PRIMARY, waitBeforeMs: 0 },
    { endpoint: FALLBACK, waitBeforeMs: 0 },
    { endpoint: PRIMARY, waitBeforeMs: 0 },
  ];
  let calls = 0;

  await assert.rejects(
    run({
      attemptPlan,
      fetchImpl: async () => {
        calls += 1;
        throw new Error("network unavailable");
      },
    }),
    (error) => {
      assert.match(error.message, /failed after 3 attempts/);
      assert.match(error.message, /Attempt 1/);
      assert.match(error.message, /Attempt 2/);
      assert.match(error.message, /Attempt 3/);
      return true;
    },
  );

  assert.equal(calls, 3);
});

test("does not retry an HTTP 400 query rejection", async () => {
  let calls = 0;

  await assert.rejects(
    run({
      fetchImpl: async () => {
        calls += 1;
        return response({ body: "parse error", status: 400, statusText: "Bad Request" });
      },
    }),
    /will not be retried: 400 Bad Request/,
  );

  assert.equal(calls, 1);
});

test("retries after an attempt reaches the client timeout", async () => {
  const calls = [];
  const result = await run({
    timeoutMs: 5,
    fetchImpl: async (endpoint, options) => {
      calls.push(endpoint);
      if (endpoint === FALLBACK) {
        return response({ data: validData() });
      }

      return new Promise((resolve, reject) => {
        options.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
      });
    },
  });

  assert.equal(result.elements.length, 1);
  assert.deepEqual(calls, [PRIMARY, FALLBACK]);
});
