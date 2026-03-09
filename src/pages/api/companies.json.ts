import type { APIRoute } from "astro";
import { companies } from "../../data/content";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ data: companies, count: companies.length }), {
    headers: { "Content-Type": "application/json" },
  });
};
