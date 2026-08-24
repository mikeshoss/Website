import type { APIRoute } from "astro";
import { awards } from "../../data/content";
import { collection } from "../../lib/api";

export const prerender = true;

export const GET: APIRoute = () => collection(awards);
