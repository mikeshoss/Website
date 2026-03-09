import type { APIRoute } from "astro";
import { patents } from "../../data/content";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ data: patents, count: patents.length }), {
    headers: { "Content-Type": "application/json" },
  });
};
