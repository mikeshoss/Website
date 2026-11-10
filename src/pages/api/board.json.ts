import type { APIRoute } from "astro";
import { board, site } from "../../data/content";
import { json } from "../../lib/api";

export const prerender = true;

/**
 * The board profile behind /boards: seats (board seats only), advisory roles,
 * the skills matrix, what Mike is looking for, declared affiliations and the
 * two board bio PDFs. Bio links are made absolute for clients off-site.
 */
export const GET: APIRoute = () =>
  json({
    data: {
      ...board,
      bio: board.bio.map((b) => ({ ...b, url: `${site.url}${b.url}` })),
    },
  });
