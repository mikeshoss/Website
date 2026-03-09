import type { APIRoute } from "astro";
import { site } from "../../data/content";

export const GET: APIRoute = () => {
  const base = site.url;

  return new Response(
    JSON.stringify({
      name: `${site.name} API`,
      version: "1.0.0",
      description: "Public API for mikeshoss.com — returns prerendered JSON data that updates on each deploy.",
      endpoints: {
        companies: `${base}/api/companies.json`,
        experience: `${base}/api/experience.json`,
        projects: `${base}/api/projects.json`,
        patents: `${base}/api/patents.json`,
        volunteering: `${base}/api/volunteering.json`,
        skills: `${base}/api/skills.json`,
      },
    }),
    { headers: { "Content-Type": "application/json" } },
  );
};
