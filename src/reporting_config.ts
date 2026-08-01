import { resolvePublicReportingConfig } from "../public-reporting-config.mjs";

const publicReportingConfig = resolvePublicReportingConfig({
  reportEndpoint: import.meta.env.VITE_REPORT_ENDPOINT,
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
  hostname: typeof window === "undefined" ? "" : window.location.hostname,
});

export const REPORT_ENDPOINT = publicReportingConfig.reportEndpoint;
export const TURNSTILE_SITE_KEY = publicReportingConfig.turnstileSiteKey;
