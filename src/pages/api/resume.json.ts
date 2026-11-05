import type { APIRoute } from "astro";
import {
  awards,
  causes,
  cardSets,
  magic,
  porygon,
  certifications,
  credits,
  companies,
  education,
  experience,
  hero,
  highlights,
  interests,
  languages,
  organizations,
  patents,
  projects,
  publications,
  recommendations,
  site,
  skills,
  slabs,
  volunteering,
} from "../../data/content";
import { glossary } from "../../data/glossary";
import { json } from "../../lib/api";

export const prerender = true;

/**
 * The whole profile in a single request. Consumers that want one section
 * should use the per-section endpoints listed in /api/index.json.
 */
export const GET: APIRoute = () =>
  json({
    data: {
      basics: { ...site, ...hero },
      highlights,
      credits,
      skills,
      companies,
      experience,
      education,
      projects,
      patents,
      certifications,
      awards,
      publications,
      volunteering,
      organizations,
      recommendations,
      languages,
      interests,
      causes,
      collection: { sets: cardSets, porygon, slabs, magic },
      glossary,
    },
  });
