/**
 * Worker entry for mikeshoss.com.
 *
 * The site itself is a static Astro build served from the `assets` binding.
 * This entry exists only to add one dynamic route — the MCP server at /mcp —
 * on the same origin, and to hand every other request straight to the assets.
 *
 * Requests that match a static asset are served by Cloudflare's asset layer
 * without invoking this Worker at all (`run_worker_first` is not set), so the
 * site's serving path, including the _headers and _redirects rules, is
 * unchanged by the presence of this file.
 *
 * The exception is staging (see `env.staging` in wrangler.jsonc), where every
 * request does come through here so the whole site can sit behind a password.
 * That gate is switched on by the presence of the STAGING_PASSWORD secret,
 * which only the staging Worker has — production has no such secret, so it
 * can never lock itself.
 */

import { type Assets, handleGet, handleOptions, handlePost } from "./mcp";

interface Env {
  ASSETS: Assets;
  /** Secret on the staging Worker only. When set, every request needs it. */
  STAGING_PASSWORD?: string;
}

const MCP_PATH = "/mcp";

/**
 * HTTP Basic Auth against `password`. Any username is accepted; only the
 * password is checked, in constant time so a wrong guess reveals nothing about
 * how wrong it was.
 */
function isAuthorized(request: Request, password: string): boolean {
  const header = request.headers.get("Authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;

  let credentials: string;
  try {
    credentials = atob(header.slice("Basic ".length));
  } catch {
    return false;
  }
  const supplied = credentials.slice(credentials.indexOf(":") + 1);

  const a = new TextEncoder().encode(supplied);
  const b = new TextEncoder().encode(password);
  let diff = a.byteLength ^ b.byteLength;
  for (let i = 0; i < a.byteLength; i++) diff |= a[i] ^ (b[i] ?? 0);
  return diff === 0;
}

function unauthorized(): Response {
  return new Response("Staging site — password required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="staging", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (env.STAGING_PASSWORD && !isAuthorized(request, env.STAGING_PASSWORD)) {
      return unauthorized();
    }

    const { pathname } = new URL(request.url);

    if (pathname === MCP_PATH) {
      switch (request.method) {
        case "POST":
          return handlePost(request, env.ASSETS);
        case "OPTIONS":
          return handleOptions();
        case "GET":
        case "HEAD":
          return handleGet(request);
        default:
          return new Response("Method not allowed", {
            status: 405,
            headers: { Allow: "GET, POST, OPTIONS" },
          });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
