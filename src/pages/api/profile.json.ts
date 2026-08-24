import type { APIRoute } from "astro";
import { hero, site } from "../../data/content";
import { json } from "../../lib/api";

export const prerender = true;

export const GET: APIRoute = () => json({ data: { ...site, ...hero } });
