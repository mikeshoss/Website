import type { APIRoute } from "astro";
import { projects } from "../../data/content";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ data: projects, count: projects.length }), {
    headers: { "Content-Type": "application/json" },
  });
};
