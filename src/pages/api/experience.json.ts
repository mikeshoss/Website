import type { APIRoute } from "astro";
import { experience } from "../../data/content";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ data: experience, count: experience.length }), {
    headers: { "Content-Type": "application/json" },
  });
};
