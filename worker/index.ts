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
 */

import { type Assets, handleGet, handleOptions, handlePost } from "./mcp";

interface Env {
  ASSETS: Assets;
}

const MCP_PATH = "/mcp";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
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
