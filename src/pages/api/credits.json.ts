import type { APIRoute } from "astro";
import { credits } from "../../data/content";
import { collection } from "../../lib/api";

export const prerender = true;

/** The discography on /credits: the work, the label, the credit, the result. */
export const GET: APIRoute = () => collection(credits);
