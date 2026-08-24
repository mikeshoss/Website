import type { APIRoute } from "astro";
import { education } from "../../data/content";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ data: education, count: education.length }), {
    headers: { "Content-Type": "application/json" },
  });
};
