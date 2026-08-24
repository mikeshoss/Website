import type { APIRoute } from "astro";
import {
  awards,
  causes,
  certifications,
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
  volunteering,
} from "../../data/content";
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
    },
  });
