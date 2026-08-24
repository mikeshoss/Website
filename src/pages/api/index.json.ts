import type { APIRoute } from "astro";
import { site } from "../../data/content";
import { API_VERSION, json } from "../../lib/api";

export const prerender = true;

/**
 * Discovery document. Every endpoint listed here is public, read-only, CORS-
 * enabled, and regenerated on each deploy.
 *
 * The blog is deliberately absent: it is currently redirected off the site
 * (see public/_redirects), so advertising its posts here would be misleading.
 */
const SECTIONS = [
  "companies",
  "experience",
  "education",
  "projects",
  "patents",
  "certifications",
  "awards",
  "publications",
  "volunteering",
  "organizations",
  "recommendations",
  "skills",
  "highlights",
  "languages",
  "interests",
  "causes",
];

export const GET: APIRoute = () => {
  const base = site.url;

  return json({
    data: {
      name: `${site.name} API`,
      version: API_VERSION,
      description:
        "Public read-only API for mikeshoss.com. Prerendered JSON, regenerated on each deploy.",
      documentation: `${base}/api/index.json`,
      mcp: `${base}/mcp`,
      endpoints: {
        profile: `${base}/api/profile.json`,
        resume: `${base}/api/resume.json`,
        jsonresume: `${base}/api/jsonresume.json`,
        ...Object.fromEntries(
          SECTIONS.map((name) => [name, `${base}/api/${name}.json`]),
        ),
      },
    },
  });
};
