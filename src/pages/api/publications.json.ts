import type { APIRoute } from "astro";
import { publications } from "../../data/content";
import { collection } from "../../lib/api";

export const prerender = true;

export const GET: APIRoute = () => collection(publications);
