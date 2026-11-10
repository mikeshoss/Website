import { companies, site } from "../data/content";
import { API_VERSION } from "./api";

/**
 * The API catalogue: one list that drives the OpenAPI document
 * (/api/openapi.json) and the human docs page (/api/).
 *
 * Schemas are not written by hand. At build time each route's own GET handler
 * is called and its JSON response is turned into a JSON Schema, so the docs
 * describe exactly what the API returns and cannot drift from it. Adding an
 * endpoint means adding its route file and one entry below.
 */

export type Group = "Start here" | "Career" | "Work" | "Writing and reference" | "Personal" | "Syndication";

export interface Endpoint {
  /** Route file name without `.json.ts`; also the schema name. */
  id: string;
  path: string;
  title: string;
  group: Group;
  description: string;
  /** `collection` = `{ data: [...], count, meta }`; `object` = `{ data: {...}, meta }`; `raw` = no envelope. */
  shape: "collection" | "object" | "raw";
}

export const GROUPS: Group[] = ["Start here", "Career", "Work", "Writing and reference", "Personal", "Syndication"];

const e = (id: string, title: string, group: Group, shape: Endpoint["shape"], description: string): Endpoint => ({
  id,
  path: `/api/${id}.json`,
  title,
  group,
  shape,
  description,
});

export const endpoints: Endpoint[] = [
  e("index", "Discovery", "Start here", "object", "Every endpoint, the MCP server and the per-venture feeds, as absolute URLs. Start here if you are writing a client."),
  e("profile", "Profile", "Start here", "object", "Name, title, location, links, the headline and the thesis. The short version of who Mike is."),
  e("resume", "Full resume", "Start here", "object", "Everything in one response: basics plus every section below. This is what the MCP server reads."),
  e("jsonresume", "JSON Resume", "Start here", "raw", "The resume in the jsonresume.org schema, for tools that already speak it. No envelope."),
  e("credits", "Credits", "Career", "collection", "The discography: the work, the label it came out on, what Mike did and what it achieved."),
  e("experience", "Experience", "Career", "collection", "Role by role, with dates, employer, location and accomplishments."),
  e("highlights", "Highlights", "Career", "collection", "The headline numbers: years in, companies founded, fundraising supported, patents."),
  e("education", "Education", "Career", "collection", "Degrees and programmes."),
  e("certifications", "Certifications", "Career", "collection", "Professional certifications, with issuer and date."),
  e("skills", "Skills", "Career", "collection", "Areas of expertise, as plain strings."),
  e("languages", "Languages", "Career", "collection", "Spoken languages and fluency."),
  e("companies", "Ventures", "Work", "collection", "The companies Mike runs or backs: role, tagline, status and links."),
  e("projects", "Projects", "Work", "collection", "Products and projects, with status and the company each was built under."),
  e("patents", "Patents", "Work", "collection", "Granted and published patents, with numbers, dates and links to the public record."),
  e("awards", "Awards", "Work", "collection", "Recognition, with issuer and date."),
  e("glossary", "AI glossary", "Writing and reference", "collection", "Straight definitions of the AI terms people misuse, each with what it means in practice and a test for telling the difference."),
  e("publications", "Publications", "Writing and reference", "collection", "Articles and papers."),
  e("recommendations", "Recommendations", "Writing and reference", "collection", "What people Mike has worked with say about him."),
  e("board", "Board profile", "Career", "object", "Board seats, advisory roles, a skills matrix with evidence, what Mike is looking for, declared affiliations and the two board bio PDFs. The data behind /boards."),
  e("volunteering", "Volunteering", "Personal", "collection", "Boards, mentoring and community roles."),
  e("organizations", "Organizations", "Personal", "collection", "Memberships and affiliations."),
  e("causes", "Where I give", "Personal", "collection", "The charities Mike gives to, with a link to donate."),
  e("interests", "Off the clock", "Personal", "collection", "Interests, each with keywords."),
  e("collection", "Card collection", "Personal", "object", "Pokémon set progress and graded slabs."),
];

/** The one parameterised route. */
export const ventureFeed = {
  id: "venture",
  path: "/api/companies/{slug}.json",
  title: "Venture feed",
  group: "Syndication" as Group,
  description:
    "One feed per venture: the company record joined to its projects and the founder block, so a venture's own site can render itself from this one.",
  slugs: companies.map((c) => c.slug),
};

/* ------------------------------------------------------------------ samples */

type Route = { GET: (ctx: any) => Response | Promise<Response> };
const routes = import.meta.glob<Route>(
  ["../pages/api/*.json.ts", "!../pages/api/openapi.json.ts"],
  { eager: true },
);
const ventureRoute = import.meta.glob<Route>("../pages/api/companies/*.json.ts", { eager: true });

/** Calls a route's own handler and returns its parsed body. */
export async function sample(id: string): Promise<unknown> {
  const route = routes[`../pages/api/${id}.json.ts`];
  if (!route) throw new Error(`apiDocs: no route file for "${id}"`);
  const res = await route.GET({ props: {}, params: {} });
  return res.json();
}

export async function ventureSample(slug = ventureFeed.slugs[0]): Promise<unknown> {
  const route = Object.values(ventureRoute)[0];
  const company = companies.find((c) => c.slug === slug);
  const res = await route.GET({ props: { company }, params: { slug } });
  return res.json();
}

/* ------------------------------------------------------------------ schemas */

export type Schema = Record<string, any>;

const typeOf = (v: unknown) =>
  v === null ? "null" : Array.isArray(v) ? "array" : Number.isInteger(v) ? "integer" : typeof v;

/** Merges two inferred schemas into one that accepts both. */
function merge(a: Schema | undefined, b: Schema): Schema {
  if (!a) return b;
  const ta = [a.type].flat(), tb = [b.type].flat();
  if (a.type === "object" && b.type === "object") {
    const keys = new Set([...Object.keys(a.properties), ...Object.keys(b.properties)]);
    const properties: Schema = {};
    for (const k of keys) properties[k] = merge(a.properties[k], b.properties[k] ?? a.properties[k]);
    const required = (a.required ?? []).filter((k: string) => (b.required ?? []).includes(k));
    return { type: "object", properties, ...(required.length ? { required } : {}) };
  }
  if (a.type === "array" && b.type === "array") {
    return { type: "array", items: b.items ? merge(a.items, b.items) : a.items };
  }
  const types = [...new Set([...ta, ...tb])];
  if (types.length === 2 && types.includes("integer") && types.includes("number")) return { type: "number" };
  const out: Schema = { type: types.length === 1 ? types[0] : types };
  if (a.format && a.format === b.format) out.format = a.format;
  return out;
}

/** Infers a JSON Schema from a value. Formats are noted where obvious. */
export function infer(value: unknown): Schema {
  const t = typeOf(value);
  if (t === "object") {
    const obj = value as Record<string, unknown>;
    const properties: Schema = {};
    for (const [k, v] of Object.entries(obj)) properties[k] = infer(v);
    const required = Object.keys(obj);
    return { type: "object", properties, ...(required.length ? { required } : {}) };
  }
  if (t === "array") {
    const items = (value as unknown[]).reduce<Schema | undefined>((acc, v) => merge(acc, infer(v)), undefined);
    return { type: "array", items: items ?? {} };
  }
  if (t === "string") {
    const s = value as string;
    if (/^https?:\/\//.test(s)) return { type: "string", format: "uri" };
    if (/^mailto:/.test(s)) return { type: "string", format: "uri" };
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return { type: "string", format: "date-time" };
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { type: "string", format: "date" };
    return { type: "string" };
  }
  return { type: t };
}

/** Human type label for the docs page: `string`, `string[]`, `object`, `uri`… */
export function typeLabel(s: Schema | undefined): string {
  if (!s) return "any";
  if (s.type === "array") return `${typeLabel(s.items)}[]`;
  if (Array.isArray(s.type)) return s.type.join(" | ");
  if (s.format) return s.format === "uri" ? "url" : s.format;
  return s.type ?? "any";
}

/** The schema of the useful part of a response: `data` (or its items), or the whole body. */
export function payloadSchema(endpoint: Pick<Endpoint, "shape">, body: any): Schema {
  if (endpoint.shape === "raw") return infer(body);
  const data = infer(body.data);
  return data;
}

/** Fields to list on the docs page: the record's top-level properties. */
export function fields(endpoint: Pick<Endpoint, "shape">, body: any): { name: string; type: string; always: boolean }[] {
  let s = payloadSchema(endpoint, body);
  if (s.type === "array") s = s.items;
  if (s?.type !== "object") return [];
  return Object.entries(s.properties as Schema).map(([name, p]) => ({
    name,
    type: typeLabel(p),
    always: (s.required ?? []).includes(name),
  }));
}

/** A short, readable example: lists cut to their first item, long strings trimmed. */
export function excerpt(body: any, endpoint: Pick<Endpoint, "shape">): string {
  const trim = (v: any, depth: number): any => {
    if (Array.isArray(v)) {
      if (v.length === 0) return [];
      const head = trim(v[0], depth + 1);
      return v.length > 1 ? [head, `… ${v.length - 1} more`] : [head];
    }
    if (v && typeof v === "object") {
      const out: Record<string, any> = {};
      const entries = Object.entries(v);
      const keep = depth > 2 ? entries.slice(0, 6) : entries;
      for (const [k, x] of keep) out[k] = trim(x, depth + 1);
      if (keep.length < entries.length) out["…"] = `${entries.length - keep.length} more fields`;
      return out;
    }
    if (typeof v === "string" && v.length > 110) return v.slice(0, 107) + "…";
    return v;
  };
  const shown = endpoint.shape === "raw" ? trim(body, 0) : { ...body, data: trim(body.data, 0), meta: "{ … }" };
  return JSON.stringify(shown, null, 2).replace(/"… (\d+) more"/g, "/* … $1 more */").replace(/"meta": "\{ … \}"/, '"meta": { … }');
}

/* ------------------------------------------------------------------ OpenAPI */

export const metaSchema: Schema = {
  type: "object",
  description: "Present on every enveloped response.",
  properties: {
    generatedAt: { type: "string", format: "date-time", description: "Build time. The API is static, so this is also the last deploy." },
    source: { type: "string", format: "uri" },
    license: { type: "string", examples: ["Apache-2.0"] },
    version: { type: "string", description: "API version. Bumped when a response shape changes in a way that could break clients." },
  },
  required: ["generatedAt", "source", "license", "version"],
};

const pascal = (id: string) => id.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());

export async function buildOpenApi(): Promise<Record<string, unknown>> {
  const schemas: Schema = { Meta: metaSchema };
  const paths: Schema = {};

  for (const ep of endpoints) {
    const body: any = await sample(ep.id);
    const name = pascal(ep.id);
    let responseSchema: Schema;
    if (ep.shape === "raw") {
      schemas[name] = infer(body);
      responseSchema = { $ref: `#/components/schemas/${name}` };
    } else {
      schemas[name] = infer(body.data);
      responseSchema = {
        type: "object",
        properties: {
          data: { $ref: `#/components/schemas/${name}` },
          ...(ep.shape === "collection" ? { count: { type: "integer" } } : {}),
          meta: { $ref: "#/components/schemas/Meta" },
        },
        required: ep.shape === "collection" ? ["data", "count", "meta"] : ["data", "meta"],
      };
    }
    paths[ep.path] = {
      get: {
        operationId: `get${name}`,
        summary: ep.title,
        description: ep.description,
        tags: [ep.group],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: responseSchema } } },
        },
      },
    };
  }

  const vb: any = await ventureSample();
  schemas.Venture = infer(vb.data);
  paths[ventureFeed.path] = {
    get: {
      operationId: "getVenture",
      summary: ventureFeed.title,
      description: ventureFeed.description,
      tags: [ventureFeed.group],
      parameters: [
        { name: "slug", in: "path", required: true, schema: { type: "string", enum: ventureFeed.slugs } },
      ],
      responses: {
        "200": {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { data: { $ref: "#/components/schemas/Venture" }, meta: { $ref: "#/components/schemas/Meta" } },
                required: ["data", "meta"],
              },
            },
          },
        },
        "404": { description: "No venture with that slug." },
      },
    },
  };

  return {
    openapi: "3.1.0",
    info: {
      title: `${site.name} API`,
      version: API_VERSION,
      summary: "Public, read-only JSON for everything on mikeshoss.com.",
      description:
        "Prerendered JSON, regenerated on every deploy. No key, no rate limit beyond Cloudflare's own, CORS open to any origin. The same data is available to AI agents over MCP at /mcp.",
      contact: { name: site.name, url: site.url },
      license: { name: "Apache-2.0", identifier: "Apache-2.0" },
    },
    servers: [{ url: site.url }],
    externalDocs: { description: "Human docs", url: `${site.url}/api/` },
    tags: GROUPS.map((name) => ({ name })),
    paths,
    components: { schemas },
  };
}
