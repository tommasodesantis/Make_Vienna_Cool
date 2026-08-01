import assert from "node:assert/strict";
import test from "node:test";

import {
  PRODUCTION_REPORT_ENDPOINT,
  PRODUCTION_TURNSTILE_SITE_KEY,
  isOfficialProductionHost,
  resolvePublicReportingConfig,
} from "../public-reporting-config.mjs";

test("recognizes the official custom and Cloudflare Pages hosts", () => {
  assert.equal(isOfficialProductionHost("makevienna.cool"), true);
  assert.equal(isOfficialProductionHost("make-vienna-cool.pages.dev"), true);
  assert.equal(isOfficialProductionHost("abc123.make-vienna-cool.pages.dev"), true);
  assert.equal(isOfficialProductionHost("localhost"), false);
  assert.equal(isOfficialProductionHost("make-vienna-cool.example"), false);
});

test("uses the public production reporting configuration on official hosts", () => {
  assert.deepEqual(resolvePublicReportingConfig({ hostname: "makevienna.cool" }), {
    reportEndpoint: PRODUCTION_REPORT_ENDPOINT,
    turnstileSiteKey: PRODUCTION_TURNSTILE_SITE_KEY,
  });
});

test("keeps reporting disabled on other hosts unless explicit overrides are provided", () => {
  assert.deepEqual(resolvePublicReportingConfig({ hostname: "localhost" }), {
    reportEndpoint: "",
    turnstileSiteKey: "",
  });

  assert.deepEqual(
    resolvePublicReportingConfig({
      hostname: "staging.example",
      reportEndpoint: " https://worker.example/report ",
      turnstileSiteKey: " test-site-key ",
    }),
    {
      reportEndpoint: "https://worker.example/report",
      turnstileSiteKey: "test-site-key",
    },
  );
});
