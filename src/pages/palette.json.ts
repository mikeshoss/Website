import type { APIRoute } from "astro";
import { companies, interests, site } from "../data/content";
import { glossary } from "../data/glossary";
import { endpoints } from "../lib/apiDocs";

export const prerender = true;

/**
 * The index behind the ⌘K command menu (src/components/CommandPalette.astro).
 * Built from the same content as the pages, so it never goes stale, and
 * fetched only the first time the menu opens.
 *
 * Item keys are short on purpose: t title, h hint, g group, u url, k extra
 * search words, x external link, a action ('copy' | 'tag'), v action value.
 * The cheat codes are not here: they live in the component, unlisted.
 * Shape: { items (flat, for search), menu (tree, for the numbered browse) }.
 */
type Item = { t: string; h?: string; g: string; u?: string; k?: string; x?: true; a?: "copy" | "tag"; v?: string };

const pages: Item[] = [
  { t: "Home", u: "/", k: "start index" },
  { t: "Credits", u: "/credits/", k: "work discography shipped hits" },
  { t: "Ventures", u: "/companies/", k: "companies businesses" },
  { t: "Projects", u: "/projects/", k: "builds products" },
  { t: "Experience", u: "/experience/", k: "career resume cv jobs" },
  { t: "Contact", u: "/contact/", k: "email reach hire talk" },
  { t: "Off the clock", u: "/off-the-clock/", k: "hobbies interests side b" },
  { t: "Glossary", u: "/glossary/", k: "ai terms definitions" },
  { t: "Brand", u: "/brand/", k: "style guide logo colours press kit" },
  { t: "API", u: "/api/", k: "json openapi swagger developers docs" },
  { t: "Accessibility", u: "/accessibility/", k: "wcag a11y" },
].map((p) => ({ ...p, g: "Pages", h: "Page" }));

const sections: Item[] = [
  ...[
    ["Now", "now", "building epilogue clio investing"],
    ["Selected credits", "credits", "work"],
    ["The machine room", "machine-room", "infrastructure"],
    ["Where it's going", "calls", "predictions"],
    ["Who I am", "who-i-am", "about photo sleeve"],
    ["Where I give", "give", "charity donate sickkids yamnuska ovc"],
  ].map(([t, id, k]) => ({ t, h: "Home", u: `/#${id}`, k })),
  ...[
    ["Career", "career", "jobs roles"],
    ["Patents", "patents", "inventions ip"],
    ["Community", "community", "boards mentoring volunteering"],
    ["Education", "education", "school degrees"],
    ["Outside work", "outside", "interests"],
  ].map(([t, id, k]) => ({ t, h: "Experience", u: `/experience/#${id}`, k })),
  { t: "Pokémon sets", h: "Cards", u: "/off-the-clock/cards/#pokemon", k: "base jungle fossil promos" },
  { t: "Porygon master set", h: "Cards", u: "/off-the-clock/cards/#porygon", k: "pokemon" },
  { t: "Commander decks", h: "Cards", u: "/off-the-clock/cards/#magic", k: "magic mtg" },
  { t: "The fleet", h: "Homelab", u: "/off-the-clock/homelab/#fleet", k: "servers machines ai box" },
  { t: "House rules", h: "Homelab", u: "/off-the-clock/homelab/#rules", k: "ops deploy" },
  ...[
    ["The idea", "the-idea"], ["The mark", "the-mark"], ["Producer tag", "producer-tag"], ["Misuse", "misuse"],
    ["Colour", "colour"], ["Type and case", "type-and-case"], ["Panel parts", "panel-parts"], ["Voice", "voice"],
    ["Layout", "layout"], ["In use", "in-use"], ["Press kit", "downloads"],
  ].map(([t, id]) => ({ t, h: "Brand", u: `/brand/#${id}`, k: "brand" })),
  { t: "MCP server", h: "API", u: "/api/#mcp", k: "agents claude tools" },
].map((s) => ({ ...s, g: "Sections" }) as Item);

const ventures: Item[] = companies.map((c) => ({ t: c.name, h: c.role ?? "Venture", g: "Ventures", u: `/companies/${c.slug}/`, k: c.tagline }));
const channels: Item[] = interests.map((i) => ({ t: i.name, h: i.status, g: "Off the clock", u: `/off-the-clock/${i.slug}/`, k: [i.aka ?? "", i.search ?? "", ...(i.keywords ?? [])].join(" ") }));
const terms: Item[] = glossary.map((t) => ({ t: t.term, h: "Glossary", g: "Glossary", u: `/glossary/${t.slug}/` }));
const api: Item[] = [
  { t: "OpenAPI spec", h: "JSON", g: "API", u: "/api/openapi.json", k: "swagger postman" },
  ...endpoints.map((e) => ({ t: e.title, h: e.path, g: "API", u: e.path, k: `endpoint json ${e.id}` })),
];
const actions: Item[] = [
  { t: "Copy my email", h: site.email, g: "Actions", a: "copy", v: site.email, k: "mail contact" },
  { t: "Open LinkedIn", h: "↗", g: "Actions", u: site.linkedin, x: true, k: "message dm" },
  { t: "Open GitHub", h: "↗", g: "Actions", u: site.github, x: true, k: "code" },
  { t: "Book the studio", h: "Epilogue ↗", g: "Actions", u: "https://epiloguelabs.com/?utm_source=mikeshoss&utm_medium=referral&utm_content=command-menu", x: true, k: "epilogue book work consulting hire studio" },
  { t: "Play the producer tag", h: "Sound", g: "Actions", a: "tag", k: "sound music hit" },
  { t: "Copy an API curl", h: "curl", g: "Actions", a: "copy", v: `curl ${site.url}/api/index.json`, k: "developer json" },
  { t: "Copy the MCP server URL", h: "MCP", g: "Actions", a: "copy", v: `${site.url}/mcp`, k: "agents claude" },
];

/**
 * The numbered menu shown before anything is typed: 1–9 open an item, and an
 * item with children (c) opens a submenu whose first entry opens the page
 * itself. Search ignores this tree and uses the flat list above.
 */
type Node = { t: string; h?: string; u?: string; x?: true; a?: "copy" | "tag"; v?: string; c?: Node[] };
const page = (t: string): Item => pages.find((p) => p.t === t)!;
const strip = ({ t, h, u, x, a, v }: Item): Node => ({ t, h, u, x, a, v });
const open = (t: string, u: string): Node => ({ t: `Open ${t}`, h: "Page", u });
const sectionsOf = (hint: string) => sections.filter((s) => s.h === hint).map(strip);

const menu: Node[] = [
  { t: "Home", h: "Sections", c: [open("Home", "/"), ...sectionsOf("Home")] },
  { ...strip(page("Credits")) },
  { t: "Ventures", h: "Companies", c: [open("Ventures", "/companies/"), ...ventures.map(strip)] },
  { ...strip(page("Projects")) },
  { t: "Experience", h: "Tabs", c: [open("Experience", "/experience/"), ...sectionsOf("Experience")] },
  {
    t: "Off the clock",
    h: "Channels",
    c: [
      open("Off the clock", "/off-the-clock/"),
      ...channels.map(strip),
      ...sectionsOf("Cards"),
      ...sectionsOf("Homelab"),
    ],
  },
  {
    t: "Contact",
    h: "Ways in",
    c: [open("Contact", "/contact/"), ...actions.filter((a) => /email|LinkedIn|GitHub|studio/.test(a.t)).map(strip)],
  },
  {
    t: "Reference",
    h: "Glossary, brand, API",
    c: [
      { t: "Glossary", h: "Terms", c: [open("Glossary", "/glossary/"), ...terms.map(strip)] },
      { t: "Brand", h: "Chapters", c: [open("Brand", "/brand/"), ...sectionsOf("Brand")] },
      { t: "API", h: "Endpoints", c: [open("API docs", "/api/"), ...sectionsOf("API"), ...api.map(strip)] },
      strip(page("Accessibility")),
    ],
  },
  { t: "Actions", h: "Do something", c: actions.map(strip) },
];

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ items: [...pages, ...sections, ...ventures, ...channels, ...terms, ...api, ...actions], menu }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
