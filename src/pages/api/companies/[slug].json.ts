import type { APIRoute, GetStaticPaths } from "astro";
import { companies, hero, projects, site } from "../../../data/content";
import { json } from "../../../lib/api";
import { byAssociation, splitByStatus } from "../../../lib/projects";

export const prerender = true;

/**
 * Syndication feed: everything one venture needs to render itself somewhere
 * else, in a single request.
 *
 * This is what keeps mikeshoss.com and a venture's own site in sync. The
 * venture site reads its feed instead of holding a second copy of the same
 * prose, so content is edited once — in src/data/content.ts — and both sites
 * pick it up. At build time it is a fetch in the consumer's build step; at
 * runtime it is a fetch in the browser. Either works: the response is static,
 * CORS-open, and cached for five minutes at the edge.
 *
 * `/api/companies.json` lists the venture records alone. These feeds add the
 * joined view — the company plus the projects that belong to it plus the
 * founder block — which is the part a venture site would otherwise duplicate.
 *
 * URLs here are deliberately untagged. `withCampaign()` marks a link a person
 * clicked; a feed is a machine resolving an identifier, and a tagged URL is a
 * different string for the same thing.
 */
export const getStaticPaths = (() =>
  companies.map((company) => ({
    params: { slug: company.slug },
    props: { company },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const company = props.company as (typeof companies)[number];
  const owned = byAssociation(projects, company.name);
  const { active, past } = splitByStatus(owned);

  return json({
    data: {
      slug: company.slug,
      /** Canonical page for this venture on mikeshoss.com. */
      page: `${site.url}/companies/${company.slug}/`,
      company,
      projects: { active, past, count: owned.length },
      /**
       * The founder block, so an "about the founder" section on the venture
       * site tracks the profile here rather than drifting from it.
       */
      founder: {
        name: site.name,
        title: site.title,
        headline: hero.headline,
        subheadline: hero.subheadline,
        thesis: hero.thesis,
        location: site.location,
        url: site.url,
        email: site.email,
        linkedin: site.linkedin,
        github: site.github,
      },
      /** Other feeds a venture site is likely to want. */
      related: {
        glossary: `${site.url}/api/glossary.json`,
        profile: `${site.url}/api/profile.json`,
        index: `${site.url}/api/index.json`,
      },
    },
  });
};
