import type { APIRoute } from "astro";
import { interests } from "../../data/content";
import { collection } from "../../lib/api";

export const prerender = true;

export const GET: APIRoute = () => collection(interests);
