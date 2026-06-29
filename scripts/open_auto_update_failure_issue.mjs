import crypto from "node:crypto";
import fs from "node:fs";

const {
  AUTO_UPDATE_LOG = "auto-update.log",
  AUTO_UPDATE_STAGE = "unknown",
  GITHUB_API_URL = "https://api.github.com",
  GITHUB_REPOSITORY,
  GITHUB_RUN_ID,
  GITHUB_SERVER_URL = "https://github.com",
  GITHUB_TOKEN,
} = process.env;

const titlePrefix = "[auto-update-failure]";
const title = `${titlePrefix} Source data automation failed`;
const maxLogChars = 12000;

const readLog = () => {
  if (!fs.existsSync(AUTO_UPDATE_LOG)) {
    return `No log file found at ${AUTO_UPDATE_LOG}.`;
  }

  const log = fs.readFileSync(AUTO_UPDATE_LOG, "utf8").trim();
  return log || "Log file was empty.";
};

const trimLog = (log) => {
  if (log.length <= maxLogChars) return log;
  return `[log truncated to last ${maxLogChars} characters]\n${log.slice(-maxLogChars)}`;
};

const fingerprintFor = (stage, log) =>
  crypto.createHash("sha256").update(`${stage}\n${log}`).digest("hex").slice(0, 16);

const githubRequest = async (path, options = {}) => {
  if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) {
    throw new Error("GITHUB_TOKEN and GITHUB_REPOSITORY are required to open the failure issue.");
  }

  const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "make-vienna-cool-auto-update",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${options.method ?? "GET"} ${path} failed: ${response.status} ${body}`);
  }

  return response.json();
};

const issueBody = ({ fingerprint, log, timestamp }) => {
  const runUrl =
    GITHUB_RUN_ID && GITHUB_REPOSITORY
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
      : "not available";

  return [
    "The weekly source-data automation failed. The website build should keep using the last committed data.",
    "",
    `Stage: ${AUTO_UPDATE_STAGE}`,
    `Timestamp: ${timestamp}`,
    `Workflow run: ${runUrl}`,
    `Fingerprint: ${fingerprint}`,
    "",
    "Log:",
    "```text",
    trimLog(log),
    "```",
  ].join("\n");
};

const main = async () => {
  const log = readLog();
  const timestamp = new Date().toISOString();
  const fingerprint = fingerprintFor(AUTO_UPDATE_STAGE, log);
  const body = issueBody({ fingerprint, log, timestamp });

  const openIssues = await githubRequest("/issues?state=open&per_page=100");
  const existing = openIssues.find(
    (issue) =>
      issue.title?.startsWith(titlePrefix) &&
      typeof issue.body === "string" &&
      issue.body.includes(`Fingerprint: ${fingerprint}`),
  );

  if (existing) {
    await githubRequest(`/issues/${existing.number}/comments`, {
      method: "POST",
      body: JSON.stringify({
        body: [
          `The same auto-update failure happened again at ${timestamp}.`,
          "",
          "Latest log:",
          "```text",
          trimLog(log),
          "```",
        ].join("\n"),
      }),
    });
    console.log(`Updated existing failure issue #${existing.number}.`);
    return;
  }

  const issue = await githubRequest("/issues", {
    method: "POST",
    body: JSON.stringify({ title, body }),
  });

  console.log(`Opened failure issue #${issue.number}: ${issue.html_url}`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
