import type { APIRoute } from "astro";
import { certifications } from "../../data/content";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ data: certifications, count: certifications.length }), {
    headers: { "Content-Type": "application/json" },
  });
};
