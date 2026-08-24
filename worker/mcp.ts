/**
 * Remote MCP server for mikeshoss.com, served by the Worker in ./index.ts.
 *
 * Transport: streamable HTTP, stateless. Every request is answered with a
 * single `application/json` JSON-RPC response rather than an SSE stream. The
 * spec permits this, and it matters here — Workers are request-scoped with no
 * durable state, so a session-based or streaming transport would need Durable
 * Objects for no benefit. Nothing this server does is long-running.
 *
 * The JSON-RPC handling is written out rather than pulled from the MCP SDK: the
 * SDK's transports assume Node stream primitives, which would mean enabling
 * nodejs_compat and bundling a lot of unused machinery into the Worker.
 *
 * Data is read from the prerendered /api/resume.json through the assets
 * binding, so the MCP payload and the JSON API cannot disagree — see
 * loadResume() below for why this is not a direct import of content.ts.
 */

export interface Assets {
  fetch(request: Request): Promise<Response>;
}

/** Shape of the `data` object in /api/resume.json. */
type Resume = Record<string, any>;

/**
 * Loads the prerendered resume through the assets binding.
 *
 * Importing src/data/content.ts directly would be the obvious move, but it is
 * wrong here: content.ts derives `yearsExperience` from `new Date()` at module
 * scope, and Cloudflare pins Date.now() to the last I/O — which, at module
 * initialization, has not happened. The value comes back as the epoch, so the
 * Worker would report a negative number of years and embed it in the summary
 * copy, while the site rendered the right one.
 *
 * Reading the built JSON avoids that whole class of build-time/runtime
 * divergence and makes the MCP payload byte-identical to /api/resume.json by
 * construction rather than by carefulness.
 */
async function loadResume(request: Request, assets: Assets): Promise<Resume> {
  const url = new URL("/api/resume.json", request.url);
  const response = await assets.fetch(new Request(url, { method: "GET" }));

  if (!response.ok) {
    throw new Error(`Could not load resume data (HTTP ${response.status}).`);
  }

  const body = (await response.json()) as { data: Resume };
  return body.data;
}

const SERVER_INFO = { name: "mikeshoss", version: "1.0.0" };

const LATEST_PROTOCOL = "2025-06-18";
const SUPPORTED_PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, MCP-Protocol-Version, Mcp-Session-Id",
  "Access-Control-Max-Age": "86400",
};

/* -------------------------------------------------------------------------- *
 * Data views
 * -------------------------------------------------------------------------- */

/** Section order as served by /api/resume.json. */
const SECTION_NAMES = [
  "basics",
  "highlights",
  "skills",
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
  "languages",
  "interests",
  "causes",
];

/* -------------------------------------------------------------------------- *
 * Tools
 * -------------------------------------------------------------------------- */

interface Tool {
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, any>, resume: Resume) => unknown;
}

/** Case-insensitive substring match over every string in a record. */
function matches(entry: unknown, query: string): boolean {
  return JSON.stringify(entry).toLowerCase().includes(query.toLowerCase());
}

const TOOLS: Record<string, Tool> = {
  get_resume: {
    description:
      "Get Mike Shoss's full structured resume: work history, companies founded, education, projects, patents, skills, volunteering and more. Use this for any broad question about his background, and pass `section` to retrieve just one part.",
    inputSchema: {
      type: "object",
      properties: {
        section: {
          type: "string",
          enum: SECTION_NAMES,
          description: "Return only this section. Omit to get the whole resume.",
        },
      },
      additionalProperties: false,
    },
    handler: ({ section }, resume) => {
      if (!section) return resume;
      if (!(section in resume)) {
        throw new Error(
          `Unknown section "${section}". Valid sections: ${SECTION_NAMES.join(", ")}.`,
        );
      }
      return { [section]: resume[section] };
    },
  },

  search_experience: {
    description:
      "Search Mike Shoss's professional history by keyword across employment, companies he founded, and volunteering. Matches job titles, employers, and the accomplishments listed under each role — use it for questions like 'where has he worked on AI governance' or 'what did he do at Firework'.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Keyword or phrase, e.g. 'AI governance', 'Firework', 'Series B'.",
        },
        current_only: {
          type: "boolean",
          description: "Only return roles that are still ongoing.",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    handler: ({ query, current_only }, resume) => {
      const find = (items: any[] = []) =>
        items.filter(
          (item) => (!current_only || !item.end) && matches(item, query),
        );

      const results = {
        experience: find(resume.experience),
        companies: find(resume.companies),
        volunteering: find(resume.volunteering),
      };

      return {
        query,
        count:
          results.experience.length +
          results.companies.length +
          results.volunteering.length,
        results,
      };
    },
  },

  list_patents: {
    description:
      "List Mike Shoss's granted and published patents, with patent numbers, filing dates, grant dates, and links to the public record. Optionally filter by keyword.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Filter by keyword in the patent title, number or status.",
        },
      },
      additionalProperties: false,
    },
    handler: ({ query }, resume) => {
      const patents: any[] = resume.patents ?? [];
      const data = query ? patents.filter((p) => matches(p, query)) : patents;
      return { count: data.length, patents: data };
    },
  },

  list_projects: {
    description:
      "List the projects and products Mike Shoss has built, including their status and the company they were built under. Filter by status to separate active work from archived work.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description:
            "Filter by status, matched loosely — e.g. 'Active', 'Archived', 'Exited'.",
        },
      },
      additionalProperties: false,
    },
    handler: ({ status }, resume) => {
      const projects: any[] = resume.projects ?? [];
      const data = status
        ? projects.filter((p) =>
            String(p.status).toLowerCase().includes(String(status).toLowerCase()),
          )
        : projects;
      return { count: data.length, projects: data };
    },
  },

  get_contact: {
    description:
      "Get Mike Shoss's contact details and public profile links (email, website, LinkedIn, GitHub, location). Use this when someone asks how to reach him.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    handler: (_args, resume) => {
      const { name, title, email, url, linkedin, github, location } =
        resume.basics ?? {};
      return { name, title, email, website: url, linkedin, github, location };
    },
  },
};

/* -------------------------------------------------------------------------- *
 * JSON-RPC
 * -------------------------------------------------------------------------- */

interface RpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, any>;
}

const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS = -32602;
const INTERNAL_ERROR = -32603;
const PARSE_ERROR = -32700;

function result(id: RpcRequest["id"], value: unknown) {
  return { jsonrpc: "2.0", id, result: value };
}

function failure(id: RpcRequest["id"], code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

async function handle(
  rpc: RpcRequest,
  loadData: () => Promise<Resume>,
): Promise<object> {
  const { id, method, params = {} } = rpc;

  switch (method) {
    case "initialize": {
      const asked = params.protocolVersion;
      return result(id, {
        protocolVersion: SUPPORTED_PROTOCOLS.includes(asked)
          ? asked
          : LATEST_PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "Structured resume and portfolio data for Mike Shoss. Start with get_resume for background questions, or search_experience to find specific roles and accomplishments.",
      });
    }

    case "ping":
      return result(id, {});

    case "tools/list":
      return result(id, {
        tools: Object.entries(TOOLS).map(([name, tool]) => ({
          name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      });

    case "tools/call": {
      const tool = TOOLS[params.name];
      if (!tool) {
        return failure(
          id,
          INVALID_PARAMS,
          `Unknown tool "${params.name}". Available: ${Object.keys(TOOLS).join(", ")}.`,
        );
      }

      try {
        const value = tool.handler(params.arguments ?? {}, await loadData());
        return result(id, {
          content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
        });
      } catch (error) {
        // Tool failures are reported in-band so the model can react to them,
        // rather than as protocol errors.
        return result(id, {
          content: [
            { type: "text", text: (error as Error).message ?? "Tool failed." },
          ],
          isError: true,
        });
      }
    }

    // Empty results keep clients that call these before checking capabilities
    // from treating the server as broken.
    case "resources/list":
      return result(id, { resources: [] });
    case "prompts/list":
      return result(id, { prompts: [] });

    default:
      return failure(id, METHOD_NOT_FOUND, `Unknown method "${method}".`);
  }
}

/* -------------------------------------------------------------------------- *
 * Handlers
 * -------------------------------------------------------------------------- */

/** CORS preflight. */
export const handleOptions = (): Response =>
  new Response(null, { status: 204, headers: CORS });

export async function handlePost(
  request: Request,
  assets: Assets,
): Promise<Response> {
  let body: RpcRequest | RpcRequest[];

  try {
    body = await request.json();
  } catch {
    return json(failure(null, PARSE_ERROR, "Parse error: body is not valid JSON."));
  }

  const batch = Array.isArray(body) ? body : [body];

  // A message without an `id` is a notification: acknowledge, return nothing.
  const calls = batch.filter(
    (rpc) => rpc && rpc.id !== undefined && rpc.id !== null,
  );

  if (calls.length === 0) {
    return new Response(null, { status: 202, headers: CORS });
  }

  // Fetched at most once per request, and only when a tool actually runs.
  let pending: Promise<Resume> | undefined;
  const loadData = () => (pending ??= loadResume(request, assets));

  const responses = [];
  for (const rpc of calls) {
    try {
      responses.push(await handle(rpc, loadData));
    } catch (error) {
      responses.push(failure(rpc.id, INTERNAL_ERROR, (error as Error).message));
    }
  }

  return json(Array.isArray(body) ? responses : responses[0]);
}

/** Browsers and curious humans land here; MCP clients POST. */
export const handleGet = (request: Request): Response => {
  const origin = new URL(request.url).origin;

  return json({
    name: SERVER_INFO.name,
    description: "MCP server for mikeshoss.com. Send JSON-RPC over HTTP POST.",
    protocolVersion: LATEST_PROTOCOL,
    transport: "streamable-http",
    tools: Object.keys(TOOLS),
    documentation: `${origin}/api/index.json`,
  });
};
