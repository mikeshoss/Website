import type { APIRoute } from "astro";
import { cardSets, slabs } from "../../data/content";
import { json } from "../../lib/api";

export const prerender = true;

/**
 * The card collection on /collection: sets with completion, and graded slabs.
 * Completion only — no values or prices, by design (see content.ts).
 */
export const GET: APIRoute = () => json({ data: { sets: cardSets, slabs } });
