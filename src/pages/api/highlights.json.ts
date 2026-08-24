import type { APIRoute } from "astro";
import { highlights } from "../../data/content";
import { collection } from "../../lib/api";

export const prerender = true;

export const GET: APIRoute = () => collection(highlights);
