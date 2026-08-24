import { site } from "../data/content";

/**
 * Bumped when the response shape changes in a way that could break consumers.
 */
export const API_VERSION = "2.0.0";

/**
 * The API is public, read-only, and prerendered at build time, so it is safe to
 * allow any origin and to let caches hold responses until the next deploy.
 */
const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=300, s-maxage=3600",
};

/**
 * `generatedAt` is the build timestamp, not the request time — these routes are
 * static files, so it doubles as a "last deployed" marker.
 */
function meta() {
  return {
    generatedAt: new Date().toISOString(),
    source: site.url,
    license: "Apache-2.0",
    version: API_VERSION,
  };
}

/** Wraps a payload in the standard envelope. */
export function json(payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ ...payload, meta: meta() }, null, 2), {
    headers: HEADERS,
  });
}

/** Envelope for list endpoints: `{ data, count, meta }`. */
export function collection<T>(data: readonly T[]): Response {
  return json({ data, count: data.length });
}
