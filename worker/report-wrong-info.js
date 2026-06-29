const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

const corsHeaders = (request, env) => {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const allowOrigin = allowed.length === 0 || allowed.includes(origin) ? origin || "*" : allowed[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
};

const verifyTurnstile = async (token, request, env) => {
  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", request.headers.get("CF-Connecting-IP") || "");

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  return Boolean(result.success);
};

const assertRateLimit = async (request, env) => {
  if (!env.REPORT_RATE_LIMIT) return true;

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = `submission:${ip}`;
  const current = Number((await env.REPORT_RATE_LIMIT.get(key)) || "0");
  if (current >= 3) return false;

  await env.REPORT_RATE_LIMIT.put(key, String(current + 1), { expirationTtl: 3600 });
  return true;
};

const parseCsv = (value) =>
  String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const validPlaceTypes = new Set(["cool", "drinking", "water", "toilet"]);

const issueFooter = (env) => {
  const mentions = parseCsv(env.GITHUB_NOTIFY_USERS || "tommasodesantis")
    .map((user) => `@${user.replace(/^@/, "")}`)
    .join(" ");

  return mentions ? ["", `Notify: ${mentions}`] : [];
};

const wrongInfoIssueBody = (payload, request, env) => [
  "A visitor reported wrong information in the app.",
  "",
  `Place: ${payload.placeName}`,
  `Place ID: ${payload.placeId}`,
  `Dataset: ${payload.placeType}`,
  `Page URL: ${payload.pageUrl || "not provided"}`,
  `Reporter IP country: ${request.cf?.country || "unknown"}`,
  "",
  "Report:",
  payload.reportText,
  ...issueFooter(env),
].join("\n");

const missingPlaceIssueBody = (payload, request, env) => [
  "A visitor suggested a missing place for the app.",
  "",
  `Suggested place: ${payload.placeName}`,
  `Suggested dataset: ${payload.placeType}`,
  `Address or map link: ${payload.locationText}`,
  `Page URL: ${payload.pageUrl || "not provided"}`,
  `Reporter IP country: ${request.cf?.country || "unknown"}`,
  "",
  "Notes:",
  payload.notes,
  ...issueFooter(env),
].join("\n");

const createGitHubIssue = async (payload, request, env) => {
  const labels = parseCsv(env.GITHUB_LABELS);
  const assignees = parseCsv(env.GITHUB_ASSIGNEES || "tommasodesantis");
  const submissionType = payload.submissionType === "missing_place" ? "missing_place" : "wrong_info";
  const title =
    submissionType === "missing_place"
      ? `Missing place suggestion: ${payload.placeName}`
      : `Wrong info report: ${payload.placeName}`;
  const body =
    submissionType === "missing_place"
      ? missingPlaceIssueBody(payload, request, env)
      : wrongInfoIssueBody(payload, request, env);

  const response = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/issues`, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "make-vienna-cool-report-worker",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      title,
      body,
      ...(labels.length > 0 ? { labels } : {}),
      ...(assignees.length > 0 ? { assignees } : {}),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub issue creation failed: ${response.status} ${text}`);
  }

  return response.json();
};

const normalizePayload = (payload) => {
  const submissionType = payload.submissionType === "missing_place" ? "missing_place" : "wrong_info";

  if (submissionType === "missing_place") {
    return {
      submissionType,
      placeName: String(payload.placeName || "").trim(),
      placeType: String(payload.placeType || "").trim(),
      locationText: String(payload.locationText || "").trim(),
      notes: String(payload.notes || "").trim(),
      pageUrl: String(payload.pageUrl || "").trim(),
      turnstileToken: payload.turnstileToken,
      honeypot: payload.honeypot,
    };
  }

  return {
    submissionType,
    placeId: String(payload.placeId || "").trim(),
    placeName: String(payload.placeName || "").trim(),
    placeType: String(payload.placeType || "").trim(),
    pageUrl: String(payload.pageUrl || "").trim(),
    reportText: String(payload.reportText || "").trim(),
    turnstileToken: payload.turnstileToken,
    honeypot: payload.honeypot,
  };
};

const isValidPayload = (payload) => {
  if (!validPlaceTypes.has(payload.placeType)) return false;

  if (payload.submissionType === "missing_place") {
    return (
      payload.placeName.length >= 2 &&
      payload.placeName.length <= 160 &&
      payload.locationText.length >= 5 &&
      payload.locationText.length <= 500 &&
      payload.notes.length >= 12 &&
      payload.notes.length <= 1200
    );
  }

  return (
    payload.placeId.length > 0 &&
    payload.placeName.length > 0 &&
    payload.reportText.length >= 12 &&
    payload.reportText.length <= 1200
  );
};

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, cors);
    }

    try {
      const payload = normalizePayload(await request.json());

      if (payload.honeypot) {
        return json({ ok: false, error: "rejected" }, 400, cors);
      }

      if (!isValidPayload(payload)) {
        return json({ ok: false, error: "invalid_payload" }, 400, cors);
      }

      if (!payload.turnstileToken || !(await verifyTurnstile(payload.turnstileToken, request, env))) {
        return json({ ok: false, error: "turnstile_failed" }, 403, cors);
      }

      if (!(await assertRateLimit(request, env))) {
        return json({ ok: false, error: "rate_limited" }, 429, cors);
      }

      const issue = await createGitHubIssue(payload, request, env);
      return json({ ok: true, issueUrl: issue.html_url }, 201, cors);
    } catch (error) {
      return json({ ok: false, error: "server_error" }, 500, cors);
    }
  },
};
