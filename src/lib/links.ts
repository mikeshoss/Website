import { site } from "../data/content";

/**
 * Campaign tagging for outbound links to properties whose analytics we own.
 *
 * A link from here to epiloguelabs.com currently arrives as an anonymous
 * referral at best — referrers are dropped by some privacy settings, stripped
 * by some clients, and carry no information about *where* on this site the
 * click came from. Tagging makes the same click attributable, and tells the
 * difference between the footer link that appears on all 23 pages and the
 * deliberate click from the Epilogue venture page.
 *
 * Only owned domains are tagged. GitHub, LinkedIn, Clio and Google Patents
 * expose no analytics to us, so parameters there would be noise on someone
 * else's URL.
 */
const OWNED_DOMAINS = ["epiloguelabs.com", "miltonrecord.ca"];

const CAMPAIGN = "personal-site";

function isOwned(hostname: string): boolean {
  return OWNED_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
}

/**
 * Adds campaign parameters to an owned-domain URL, and returns every other URL
 * untouched — so it is safe to apply to any href without checking first.
 *
 * `content` identifies the placement, e.g. "footer" or "venture-epilogue".
 *
 * Deliberately NOT for structured data, the JSON API or llms.txt: those URLs
 * are identifiers, and a tagged one is a different string for the same thing.
 * Tag what a person clicks, never what a machine resolves.
 */
export function withCampaign(rawUrl: string | undefined, content: string) {
  if (!rawUrl) return rawUrl;

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return rawUrl;
  }

  if (!isOwned(url.hostname)) return rawUrl;

  // A URL that already carries a source was tagged upstream on purpose.
  if (url.searchParams.has("utm_source")) return rawUrl;

  url.searchParams.set("utm_source", new URL(site.url).hostname);
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", CAMPAIGN);
  url.searchParams.set("utm_content", content);

  return url.href;
}

/** Stable placement slug from a project or venture name. */
export function placement(prefix: string, name: string) {
  return `${prefix}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}
