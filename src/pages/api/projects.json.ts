import type { APIRoute } from "astro";
import { projects } from "../../data/content";
import { collection } from "../../lib/api";

export const prerender = true;

export const GET: APIRoute = () => collection(projects);
