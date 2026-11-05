/**
 * One rule for names that carry a qualifier, so nothing breaks mid-bracket:
 *
 *   "Charizard (Holo, Shadowless)"       → Charizard / Holo, Shadowless
 *   "Shoss V1 | NFT Project"             → Shoss V1 / NFT Project
 *   "Founder & Principal — AI Studio"    → Founder & Principal / AI Studio
 *   "Milton Community Resource Centre (MCRC)" stays on one line: a short
 *     acronym is glued to the word before it with a no-break space.
 *
 * The qualifier renders on its own line, smaller and muted (see Title.astro).
 */
export interface SplitTitle {
  main: string;
  qual?: string;
}

const NBSP = " ";

export function splitTitle(text: string): SplitTitle {
  const acronym = text.match(/^(.*) \(([A-Z0-9][A-Za-z0-9&./-]{1,7})\)$/);
  if (acronym && acronym[2] === acronym[2].toUpperCase()) return { main: `${acronym[1]}${NBSP}(${acronym[2]})` };
  for (const sep of [" | ", " — "]) {
    const at = text.indexOf(sep);
    if (at > 0) return { main: text.slice(0, at), qual: text.slice(at + sep.length) };
  }
  const bracket = text.match(/^(.*?) \((.+)\)$/);
  if (bracket) return { main: bracket[1], qual: bracket[2] };
  return { main: text };
}

/** For one-line places (chips, labels): the same rule, kept inline. */
export function inlineTitle(text: string): string {
  const { main, qual } = splitTitle(text);
  return qual ? `${main} · ${qual}` : main;
}
