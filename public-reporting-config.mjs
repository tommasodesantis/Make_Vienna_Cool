export const PRODUCTION_REPORT_ENDPOINT =
  "https://make-vienna-cool-report.tommaso-desantis.workers.dev";
export const PRODUCTION_TURNSTILE_SITE_KEY = "0x4AAAAAADsDjnnTeaV8UatM";

const normalize = (value) => (typeof value === "string" ? value.trim() : "");

export const isOfficialProductionHost = (hostname) => {
  const normalizedHostname = normalize(hostname).toLowerCase();

  return (
    normalizedHostname === "makevienna.cool" ||
    normalizedHostname === "www.makevienna.cool" ||
    normalizedHostname === "make-vienna-cool.pages.dev" ||
    normalizedHostname.endsWith(".make-vienna-cool.pages.dev")
  );
};

export const resolvePublicReportingConfig = ({
  reportEndpoint,
  turnstileSiteKey,
  hostname,
} = {}) => {
  const useProductionDefaults = isOfficialProductionHost(hostname);

  return {
    reportEndpoint:
      normalize(reportEndpoint) || (useProductionDefaults ? PRODUCTION_REPORT_ENDPOINT : ""),
    turnstileSiteKey:
      normalize(turnstileSiteKey) ||
      (useProductionDefaults ? PRODUCTION_TURNSTILE_SITE_KEY : ""),
  };
};
