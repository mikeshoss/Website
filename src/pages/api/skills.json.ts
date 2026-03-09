import type { APIRoute } from "astro";
import { skills, highlights } from "../../data/content";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ skills, highlights }), {
    headers: { "Content-Type": "application/json" },
  });
};
