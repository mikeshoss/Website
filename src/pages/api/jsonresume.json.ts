import type { APIRoute } from "astro";
import { buildJsonResume } from "../../lib/jsonresume";

export const prerender = true;

/**
 * JSON Resume (jsonresume.org) v1.0.0. Served bare rather than in the usual
 * envelope, because tooling expects the schema document at the top level.
 */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildJsonResume(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
