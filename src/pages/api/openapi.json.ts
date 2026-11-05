import type { APIRoute } from "astro";
import { buildOpenApi } from "../../lib/apiDocs";

export const prerender = true;

/**
 * OpenAPI 3.1 description of the whole API, for Swagger, Postman, Insomnia and
 * code generators. Built from the live route handlers, so the schemas are
 * exactly what each endpoint returns (see src/lib/apiDocs.ts). No envelope:
 * an OpenAPI document has to be the top-level object.
 */
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildOpenApi(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
