import type { APIRoute } from "astro";
import { volunteering } from "../../data/content";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ data: volunteering, count: volunteering.length }), {
    headers: { "Content-Type": "application/json" },
  });
};
