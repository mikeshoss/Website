import type { APIRoute } from "astro";
import { glossary } from "../../data/glossary";
import { collection } from "../../lib/api";

export const prerender = true;

export const GET: APIRoute = () => collection(glossary);
