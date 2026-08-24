import type { APIRoute } from "astro";
import { volunteering } from "../../data/content";
import { collection } from "../../lib/api";

export const prerender = true;

export const GET: APIRoute = () => collection(volunteering);
