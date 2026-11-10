import { formatDate, formatPeriod } from "../lib/dates";

/**
 * Content is authored with machine-readable ISO dates so the JSON API, the
 * JSON Resume export and the MCP server can emit real dates. The display
 * strings the pages render are derived here, so a date has one home.
 *
 * Education keeps its own hand-written `period` string: those entries have no
 * reliable month-level dates, and one has no date at all.
 */
type Dated = { start: string; end?: string };

function withPeriod<T extends Dated>(items: T[]): (T & { period: string })[] {
  return items.map((item) => ({
    ...item,
    period: formatPeriod(item.start, item.end),
  }));
}

/** Keeps the Patent discriminated union intact while adding display dates. */
function withFiledLabel<T extends { filed: string; granted?: string }>(
  items: T[],
): (T & { filedLabel: string; grantedLabel?: string })[] {
  return items.map((item) => ({
    ...item,
    filedLabel: formatDate(item.filed),
    ...(item.granted ? { grantedLabel: formatDate(item.granted) } : {}),
  }));
}

// Career start: Shoplogix, Jan 2011 — the first full-time professional role.
// Earlier work (MHMD, 2006–2010) predates this and is deliberately excluded.
const CAREER_START = { year: 2011, month: 0 }; // month is 0-indexed: 0 = January

function completedYearsSince({ year, month }: { year: number; month: number }) {
  const now = new Date();
  let years = now.getFullYear() - year;
  if (now.getMonth() < month) years -= 1;
  return years;
}

// Evaluated at build time, like the copyright year in src/components/Footer.astro.
export const yearsExperience = completedYearsSince(CAREER_START);

// Discriminated union: a "Granted" patent must carry its grant date, and a
// "Published" one must not — the grant chip in experience.astro depends on it.
export type Patent = {
  title: string;
  number: string;
  filed: string;
  url?: string;
} & (
  | { status: "Granted"; granted: string }
  | { status: "Published"; granted?: never }
);

// All filed with Loop Now Technologies, Inc. (Firework). Dates are filing
// dates, not priority dates. Numbers ending in B2 are granted; A1 are
// pre-grant publications.
const patentsData: Patent[] = [
  {
    title: "Livestream with large language model assist",
    number: "US20240422399A1",
    filed: "2024-08-30",
    status: "Published",
    url: "https://patents.google.com/patent/US20240422399A1",
  },
  {
    title: "Immediate livestreams in a short-form video ecommerce environment",
    number: "US20240289841A1",
    filed: "2024-05-03",
    status: "Published",
    url: "https://patents.google.com/patent/US20240289841A1",
  },
  {
    title: "Connected television livestream-to-mobile device handoff in an ecommerce environment",
    number: "US20240236434A1",
    filed: "2024-01-05",
    status: "Published",
    url: "https://patents.google.com/patent/US20240236434A1",
  },
  {
    title: "Multi-hosted livestream in an open web ecommerce environment",
    number: "US12393975B2",
    filed: "2023-11-02",
    status: "Granted",
    granted: "2025-08-19",
    url: "https://patents.google.com/patent/US12393975B2",
  },
  {
    title: "Dynamic population of contextually relevant videos in an ecommerce environment",
    number: "US20240119486A1",
    filed: "2023-10-09",
    status: "Published",
    url: "https://patents.google.com/patent/US20240119486A1",
  },
  {
    title: "Object highlighting in an ecommerce short-form video",
    number: "US20240119509A1",
    filed: "2023-10-04",
    status: "Published",
    url: "https://patents.google.com/patent/US20240119509A1",
  },
  {
    title: "Manipulating video livestream background images",
    number: "US12184947B2",
    filed: "2023-06-09",
    status: "Granted",
    granted: "2024-12-31",
    url: "https://patents.google.com/patent/US12184947B2",
  },
  {
    title: "Short-form video usage within a frame widget environment",
    number: "US20230377029A1",
    filed: "2023-05-19",
    status: "Published",
    url: "https://patents.google.com/patent/US20230377029A1",
  },
  {
    title: "Tokenizing a manipulated short-form video",
    number: "US20230343368A1",
    filed: "2023-04-14",
    status: "Published",
    url: "https://patents.google.com/patent/US20230343368A1",
  },
];

export const patents = withFiledLabel(patentsData);

export const patentCount = patents.length;
export const grantedPatentCount = patents.filter((p) => p.status === "Granted").length;

export const site = {
  name: "Mike Shoss",
  title: "Founder. Product Executive. AI Builder.",
  /**
   * Google truncates a search snippet at roughly 155-160 characters, and this
   * string is the default for every page's meta description, og:description,
   * twitter:description and the JSON-LD Person description. Keep it under 160.
   */
  description:
    `Mike Shoss ships AI products in industries where being wrong is expensive. Founder of Epilogue. ${patentCount} patents in AI. If his name's on it, it's a hit.`,
  url: "https://mikeshoss.com",
  linkedin: "https://www.linkedin.com/in/mikeshoss",
  github: "https://github.com/mikeshoss",
  email: "mike@epiloguelabs.com",
  location: "Milton, Ontario, Canada",
  blogUrl: "/blog",
};

export const hero = {
  headline: "I ship AI products in industries where being wrong is expensive.",
  /**
   * The one word the home page sets in italic amber. Must appear in the
   * headline verbatim; every other consumer (llms.txt, the API) ignores it.
   */
  headlineEmphasis: "expensive",
  /** Who, before what. The current employer is one clause, not the lead. */
  subheadline:
    `Founder, product leader and builder, ${yearsExperience}+ years in. I've led product at Caseware, Firework and VerticalScope, hold ${patentCount} patents in AI, and run Epilogue. I look at where business and AI are going, then build what works now.`,
  credibility:
    `The last stretch was audit — building and launching the Document Intelligence Agent at Caseware, which shipped as Verity Docs and cut document work by 75% against a 50% target, at 97% extraction accuracy and 100% weekly active use. Now it's legal. Before that, scaling product orgs at Firework (Softbank-backed, $150M Series B) and VerticalScope. ${patentCount} patents, ${grantedPatentCount} granted.`,
  /**
   * The three things happening at once, in the order they should be read. The
   * day job is one of them, deliberately not the first thing on the page.
   */
  now: [
    {
      label: "Building",
      title: "Epilogue",
      role: "Founder & Principal",
      blurb:
        "An AI consulting and product studio. The consulting arm decides what is worth building; the studio builds it and validates it with real users.",
      href: "/companies/epilogue",
    },
    {
      label: "Shipping",
      title: "Clio",
      role: "Staff Product Manager, Vincent Enterprise",
      blurb:
        "AI research and matter management for enterprise law firms — work that gets reviewed by people whose licence is on the line.",
      href: "/experience",
    },
    {
      label: "Backing",
      title: "Angel investing",
      role: "Angel Investor",
      blurb:
        "Early-stage Canadian AI, science and technology companies, through syndicates and funds so more capital reaches a founder faster.",
      href: "/companies/investing",
    },
  ],
  /** The argument behind the headline. Rendered as prose on the home page. */
  thesis: [
    "High-consequence work is document-dense, precedent-driven, and reviewed by people whose licence is on the line. You can't ship a confident guess into that. What you can ship is a system that knows what it knows, shows its work, and fails visibly instead of quietly — and that's a product problem long before it's a model problem.",
    "I build the governance alongside the product rather than after it. At Caseware that meant standing up an ISO/IEC 42001-aligned AI management system inside the release pipeline, which turned compliance from a blocker into a sales accelerant.",
  ],
  whatIDo: [
    "Take a persistent, expensive, document-heavy workflow and turn it into a product people use every week",
    "Build the platform underneath it — SDKs, telemetry, developer experience — so it scales past the first customer",
    "Put the governance in the pipeline, not in a policy document",
    "Move fast in the open: validated prototypes in 24 hours, production features in a week",
  ],
  philosophy: [
    "Strategy without execution is a hobby",
    "Ship products, not slide decks",
    "AI should solve real problems",
    "Build for outcomes, not applause",
  ],
};

/**
 * Outcomes with a number attached, newest work first. Deliberately separate
 * from `highlights`: those are career totals, these are individual results.
 */
export const selectedResults = [
  {
    value: "75%",
    label: "Less time on document work",
    detail:
      "Verity Docs at Caseware, against a 50% target — at 97% extraction accuracy and 100% weekly active use.",
  },
  {
    value: "80%",
    label: "Faster delivery cycles",
    detail: "Across a 43-person product organization.",
  },
  {
    value: "105%",
    label: "QoQ revenue growth",
    detail: "A new SaaS product, in its first quarter.",
  },
  {
    value: "56%",
    label: "Revenue growth at 2% churn",
    detail: "Through pricing and packaging work.",
  },
  {
    value: "50%",
    label: "Conversion lift",
    detail: "Alongside a 33% improvement in lifetime value.",
  },
];

/* ------------------------------------------------------------------------- *
 * The producer framing (redesign draft, 2026-11)
 *
 * Read like liner notes: the work is the headline, the company is the label it
 * came out on, and the credit says what Mike did on it. Every fact here is
 * already stated elsewhere in this file; nothing is new.
 * ------------------------------------------------------------------------- */

export interface Credit {
  /** The work itself — the thing that shipped. */
  work: string;
  /** Who it was for: the "label". */
  label: string;
  year: string;
  /** What Mike did on it, in one or two words. */
  credit: "Produced" | "Founded" | "Built" | "Engineered" | "Inventor" | "Advised" | "Strategy";
  /** The result, with the number first where there is one. */
  result: string;
  href?: string;
}

export const credits: Credit[] = [
  {
    work: "Verity Docs",
    label: "Caseware",
    year: "2026",
    credit: "Produced",
    result: "75% less document work against a 50% target. 97% extraction accuracy. 100% weekly active use.",
  },
  {
    work: "Caseware Studio",
    label: "Caseware",
    year: "2025",
    credit: "Founded",
    result: "A 43-person product org shipping validated prototypes in 24 hours and production features in a week. Cycle times down 80%.",
  },
  {
    work: "ISO/IEC 42001 AI management system",
    label: "Caseware",
    year: "2025",
    credit: "Engineered",
    result: "Governance built into the release pipeline. Compliance turned from a blocker into a sales accelerant.",
  },
  {
    work: "ContractorOS",
    label: "FacilityOS",
    year: "2024",
    credit: "Produced",
    result: "0 to 1 in six months. 37% faster compliance, +20 NPS, 90% retention.",
  },
  {
    work: "The $150M Series B",
    label: "Firework",
    year: "2023",
    credit: "Strategy",
    result: "Product strategy and investment case behind a round led by SoftBank.",
  },
  {
    work: "AI across the player",
    label: "Firework",
    year: "2022",
    credit: "Produced",
    result: "Engagement up 400%, conversions doubled. A 60-person team across five product lines.",
  },
  {
    work: "Nine patents in AI and video commerce",
    label: "Firework",
    year: "2023–24",
    credit: "Inventor",
    result: "Livestream commerce, short-form video and LLM-assisted livestreams. Two granted.",
    href: "/experience#patents",
  },
  {
    work: "Self-serve SaaS",
    label: "Firework",
    year: "2021",
    credit: "Produced",
    result: "ARR up 10x.",
  },
  {
    work: "From ads to SaaS",
    label: "VerticalScope",
    year: "2020",
    credit: "Produced",
    result: "1,500+ sites unified on one platform. 17% month-over-month growth.",
  },
  {
    work: "SalesBop",
    label: "Advisory",
    year: "2025",
    credit: "Advised",
    result: "AI product strategy through to acquisition by FliteHouse.",
  },
  {
    work: "Canadian AI Sovereign Compute Strategy",
    label: "Government of Canada",
    year: "2024",
    credit: "Advised",
    result: "Contributed to the strategy guiding Canada's AI infrastructure.",
  },
  {
    work: "Epilogue",
    label: "Epilogue",
    year: "2023",
    credit: "Founded",
    result: "An AI consulting practice and product studio, run as one.",
    href: "/companies/epilogue",
  },
  {
    work: "Mugdock Castle, as it stood in 1640",
    label: "Independent",
    year: "2026",
    credit: "Built",
    result: "A scheduled monument rebuilt in 3D, where every wall carries its source and how sure we are of it.",
    href: "/projects",
  },
  {
    work: "Readback",
    label: "Independent",
    year: "2026",
    credit: "Built",
    result: "A map of every known licence-plate reader in Canada, each one carrying how it is known.",
    href: "https://readback.ofrecord.ca",
  },
];

/**
 * Calls: dated, blunt views on where business and AI are going, kept on the
 * record so they can be marked right or wrong later.
 *
 * Approved by Mike 2026-11-05. Set `draft` on any new call until he signs it
 * off; drafts show a "Draft" label on the home page.
 */
export interface Call {
  call: string;
  made: string;
  status: "Open" | "Right" | "Wrong";
  draft?: boolean;
}

/**
 * The studio: where the work is booked. This site is the producer; Epilogue
 * is the studio. "Book the studio" buttons point here, tagged with
 * withCampaign at each placement.
 */
export const studio = { name: "Epilogue", url: "https://epiloguelabs.com" };

export const calls: Call[] = [
  {
    call: "Governance stops being a document and becomes part of the build. The AI teams that win regulated buyers will ship their audit trail with every release.",
    made: "2026-11",
    status: "Open",
  },
  {
    call: "The scarce skill isn't prompting or picking a model. It's knowing which expensive, document-heavy workflow to point the machine at.",
    made: "2026-11",
    status: "Open",
  },
  {
    call: "In high-stakes work, the AI products that win will advertise what they don't know. Visible failure becomes a feature buyers ask for.",
    made: "2026-11",
    status: "Open",
  },
];

/**
 * The machine room: the systems that build the work. Public-safe on purpose:
 * no hostnames, addresses or anything that maps the homelab.
 */
export const machineRoom = [
  {
    name: "Agents on call",
    detail: "Coding agents started on any of my machines from my phone. Pick a machine, pick a project, tap start.",
  },
  {
    name: "Merge is deploy",
    detail: "A merge reaches production in about five minutes: database dump first, health check after, automatic rollback if it fails.",
  },
  {
    name: "One box runs the house",
    detail: "A Mac mini runs dozens of self-hosted services, with monitoring, phone alerts and a staging copy of every app. Local models on the machine next to it.",
  },
  {
    name: "One source, every surface",
    detail: "This site is one content file. It becomes these pages, a JSON API, a JSON Resume, llms.txt and an MCP server an AI can query directly.",
  },
  {
    name: "Antennas on the roof",
    detail: "Repeaters and digipeaters for APRS, LoRa APRS, Meshtastic and MeshCore, and a receiver tracking the aircraft overhead. Software that watches the world, built because I wanted it.",
  },
];

/** Who Mike is, in his own words (from the 2026-11 brief). */
export const about = [
  "I'm the first one in. I work hard, I look further out than is comfortable, and I care about the work and the people doing it.",
  "That's why I serve on the board of the Milton Community Resource Centre and mentor founders. Getting good at something is only half the job; the other half is making sure the people around you are taken care of.",
  "People who've worked with me will tell you I'm a pain in the ass. They'll also tell you they'd follow me to the next thing, because they trust my judgment.",
];

export const skills = [
  "Product Strategy & Execution",
  "AI Strategy & Governance",
  "Venture Building & Scaling",
  "Enterprise AI Systems",
  "Team Building & Leadership",
  "AI Agents & Orchestration",
  "Go-to-Market & Growth",
  "Rapid Prototyping & Delivery",
];


export interface CompanyProduct {
  name: string;
  tagline: string;
  description: string;
  status: string;
  url?: string;
}

/**
 * A distinct line of business inside a venture. Epilogue runs two, and the
 * venture page renders them side by side.
 */
export interface CompanyArm {
  name: string;
  description: string;
  services: string[];
}

export interface Company {
  /**
   * URL segment for /companies/<slug>. Unique, and stable once shipped — these
   * are indexed pages, so renaming one costs its search ranking.
   */
  slug: string;
  name: string;
  role: string;
  /** One line. Used on cards and as the venture page's meta description. */
  tagline: string;
  /** Card-length summary, one paragraph. */
  description: string;
  /** Long-form paragraphs, shown only on the venture page. */
  body?: string[];
  start: string;
  end?: string;
  url?: string;
  arms?: CompanyArm[];
  products?: CompanyProduct[];
  /** Named client and partner engagements. */
  clients?: string[];
  /** Syndicates, angel networks and funds invested through. */
  networks?: string[];
  /**
   * For a holding company: the slugs of the ventures it owns. Each must be
   * another entry in this list; the venture page links to them.
   */
  holdings?: string[];
}

// Display order, not chronology: the ventures index and the home page both read
// this array top-down, so the flagship leads.
const companiesData: Company[] = [
  {
    slug: "epilogue",
    name: "Epilogue",
    role: "Founder & Principal — AI Consulting & Product Studio",
    tagline: "Turning complex business problems into practical AI systems.",
    description:
      "An AI company that turns complex business problems into practical, high-impact solutions. Epilogue runs two tightly integrated arms: a consulting practice that sets AI strategy and product direction, and a product studio that builds and validates AI-native products end to end.",
    body: [
      "Most AI work stalls in the gap between a promising demo and something a business will actually run on. Epilogue exists to close that gap. The consulting arm decides what is worth building, how it should be priced, and how it goes to market. The studio arm builds it, validates it with real users, and then either spins it out or hands it to the partner organization to operate.",
      "The two arms feed each other. Client work surfaces problems common enough to productize, and the studio's products give the consulting practice working systems to point at instead of slideware.",
      "The studio builds its own AI products, and has sold two. Of Record, AI Edge Briefing and SignalPrep are live; Parleh is coming back invite-only; TrustFlow and Travel With RX were built and sold.",
    ],
    start: "2023-11",
    url: "https://epiloguelabs.com",
    arms: [
      {
        name: "Consulting",
        description:
          "For teams that need to decide what to build, what to buy, and what to leave alone.",
        services: [
          "AI strategy and roadmaps",
          "AI-native product and platform design",
          "Pricing and monetization",
          "Go-to-market",
        ],
      },
      {
        name: "Product Studio",
        description:
          "Building and validating AI-native products end to end, then spinning them out or integrating them into partner organizations.",
        services: [
          "0-to-1 product development",
          "Multi-agent systems and orchestration",
          "Rapid validation with real users",
          "Spin-out and hand-off",
        ],
      },
    ],
    // Mirrors epiloguelabs.com/ventures (checked 2026-11-06), in its order:
    // live, coming back, paused, sold, wound down. Status words are the ones
    // that page uses. Parleh differs on purpose: Epilogue still says paused,
    // but it is coming back invite-only (Mike, 2026-11-06).
    products: [
      {
        name: "Of Record",
        tagline: "See what your council decided.",
        description:
          "Every motion, who moved it, how each councillor voted and who showed up, read from each Ontario council's own minutes, checked against them and linked back to the source. Free to read, with no account and no ads; businesses that watch councils pay for a plan. Launched October 2026.",
        status: "Live",
        url: "https://ofrecord.ca",
      },
      {
        name: "AI Edge Briefing",
        tagline: "Daily, fact-first frontier AI, in writing and as a podcast.",
        description:
          "A daily digest of frontier AI: the capabilities, the research, and how it is being used for good and for harm. Every claim checked against its primary source, every number quoted exactly, caveats stated plainly. Free, no ads, CC BY 4.0.",
        status: "Live",
        url: "https://aiedgebriefing.com",
      },
      {
        name: "SignalPrep",
        tagline: "Canada's amateur radio exam practice, in English and French.",
        description:
          "Free practice tests for the Canadian Basic and Advanced amateur radio exams, drawn from the question banks ISED publishes. Every one of the 1,533 questions carries a plain-language explanation. Used by radio clubs across the country.",
        status: "Live",
        url: "https://signalprep.ca",
      },
      {
        name: "Parleh",
        tagline: "Meetings that do the work.",
        description:
          "Type // in any meeting and Parleh does the work while you keep talking: it files the ticket, answers the question, books the follow-up and drafts every next step for one-tap approval. Coming back as an invite-only build.",
        status: "Invite only",
        url: "https://parleh.ai",
      },
      {
        name: "Cria",
        tagline: "Share GPU compute.",
        description:
          "Powerful AI hardware sits idle in homes and labs while people rent the same capacity from a cloud. Cria lets providers share their local AI servers behind an OpenAI-compatible API. Built, shipped to real users, and paused while the live products get the time.",
        status: "Paused",
      },
      {
        name: "TrustFlow",
        tagline: "Automate admin, embed compliance.",
        description:
          "Administrative workflow automation for professional services teams: approvals, documentation and record-keeping, with audit safeguards built into the flow. December 2024 to June 2026, then sold; the acquirer is under NDA.",
        status: "Sold",
      },
      {
        name: "Travel With RX",
        tagline: "A global prescription guide for travellers.",
        description:
          "A SaaS closed beta from August 2024 to May 2025, then an invite-only MCP server until December 2025, when it was sold; the acquirer is under NDA.",
        status: "Sold",
      },
      {
        name: "Fractal",
        tagline: "One source of truth for product.",
        description:
          "A product-truth platform: code, design and product artefacts in one living source, with role-specific views generated from it, so documentation stopped drifting from what was built. January 2025 to June 2026.",
        status: "Wound down",
      },
      {
        name: "Liteworker",
        tagline: "A curated directory of AI tools.",
        description:
          "AI tools aggregated and curated, so people could find out what a new capability actually did without reading every launch post. 2023 to 2025.",
        status: "No longer maintained",
      },
    ],
    clients: [
      "OneChart",
      "Saucy Protein",
      "TakeCare",
      "CorLibra",
      "SalesBop",
      "ZheroTax",
      "Protagonist Health",
      "UniversoleFit",
    ],
  },
  {
    // Placeholder name. The investing is done through a numbered company that
    // does not have a trading name yet. When it gets one, change `name` (and
    // `role` if needed) but keep the slug: it is the indexed URL.
    slug: "investing",
    name: "Angel investing",
    role: "Angel Investor",
    tagline: "Backing early-stage Canadian AI, science and technology companies.",
    description:
      "Investing in early-stage Canadian science and technology companies, with a focus on AI. Canada builds world-class startups and then outsources their scale — the gap is in speed, risk appetite, and cheque size, not talent.",
    body: [
      "Canada builds world-class startups and then outsources their scale. I would like that to stop. The constraint has never been talent; it is speed, risk appetite, and cheque size at exactly the stage where those three decide whether a company stays here.",
      "I invest through syndicates, angel networks and funds rather than alone. That gets more capital to a founder faster than any single cheque would, and it puts operators around the table alongside the money.",
    ],
    start: "2021-02",
    networks: ["CedarPeak", "Angel One", "Sand Hill Angels", "N49P"],
  },
  {
    slug: "shossx",
    name: "ShossX",
    role: "Founder",
    tagline: "The holding company behind Epilogue, Milton Innovation and the angel investing.",
    description:
      "The holding company. ShossX owns Epilogue, Milton Innovation and the investment company through which the angel investing is done — one structure, so each can be run on its own terms.",
    body: [
      "ShossX is the entity that owns the others. Epilogue is where the consulting and product work happens, Milton Innovation is the community, and the investing runs through its own company. Keeping them under one holding company means each can have the structure it needs — a studio, a non-profit-shaped community, an investment vehicle — without any of them having to be all three.",
    ],
    start: "2021-02",
    holdings: ["epilogue", "milton-innovation", "investing"],
  },
  {
    slug: "milton-innovation",
    name: "Milton Innovation",
    role: "Founder",
    tagline: "A community hub for technologists, innovators and creators in Milton.",
    description:
      "A thriving hub where tech enthusiasts, innovators, and creators converge to share ideas, learn, and network.",
    start: "2023-11",
  },
];

export interface Project {
  name: string;
  description: string;
  start: string;
  end?: string;
  status: string;
  association?: string;
  /** The project's own site, where it has one. */
  url?: string;
  /**
   * Public source. Only set this once the repository is actually public — a
   * link to a private repo is a 404 for everyone but the author.
   */
  repo?: string;
}

// Grouped on /projects by `association` first, then Active vs past, so every
// entry needs an association. Within each group, array order is display order.
//
// Two optional links per project, both commented in on the entries that have
// them and left as a commented placeholder on the ones that do not:
//   url:  the project's own site
//   repo: public source only — a link to a private repo is a 404 for everyone
//         but the author
const projectsData: Project[] = [
  /* ---------------------------------------------------------------- Personal */
  {
    name: "Mugdock Castle 3D Reconstruction",
    description:
      "An evidence-based digital reconstruction of Mugdock Castle, a Scottish scheduled monument, as it stood in 1640. Government LiDAR, a 1963 national survey plan, archive photographs, historic maps and excavation reports, lined up to within about a metre and placed on real-world coordinates. Every wall and tower carries its source and a confidence level — surviving, documented, inferred or speculative — so anyone can check any part of it. One data file drives everything: an interactive web viewer, phone AR and print-ready 3D models, built to WCAG 2.2 AA with a tactile print planned for blind and low-vision visitors. Licensed archive material stays private until permission is granted; outreach is under way with Historic Environment Scotland, the country park and the Clan Graham Society.",
    start: "2026",
    status: "Active",
    association: "Personal",
    // url: not public yet — the viewer is self-hosted and goes public on Mike's go.
    // repo: "https://github.com/mikeshoss/",
  },
  {
    name: "Hangar",
    description:
      "Start Claude Code sessions on your own machines, from your phone. Pick a machine, pick a project, tap start — or just ask Claude to do it.",
    start: "2026-09",
    status: "Active",
    association: "Personal",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/",
  },
  {
    name: "Readback",
    description:
      "Who's scanning your plate? Every dot is a mapped automated licence plate reader in Canada — 58 published by the operating force itself, 162 operator-tagged, 116 unverified — and most scanning is not dots at all, but police fleets, which get their own layer. Each camera carries how it is known, so a claim can be checked rather than taken.",
    start: "2026-09",
    status: "Active",
    association: "Personal",
    url: "https://readback.ofrecord.ca",
    repo: "https://github.com/mikeshoss/Readback",
  },
  {
    name: "YTZ-Tracker",
    description:
      "ytzboard — a macOS menu-bar board for live movements at Billy Bishop Toronto City Airport (CYTZ/YTZ). The title shows the latest movement, holds it for two minutes, then goes quiet. Clicking gives the runway in use, the last ten movements with timestamps, and — behind Details — wind, visibility, ceiling and RVR. The dropdown is ordered by what changes a decision: the runway, and when it applies why nothing is moving, sit at the top; the instrumentation goes under Details, because knowing that the last poll was three seconds ago answers a question about the code, not about the airport.",
    start: "2026-08",
    status: "Active",
    association: "Personal",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/YTZ-Tracker",
  },
  {
    name: "Earshot",
    description:
      "An ADS-B display for one specific window, and for your ears. Most plane-spotting displays answer what is flying near me. Earshot answers two more useful questions. Can I actually see it from here — not \"is it within 2 km\", but is it above the roofline in the direction this window faces, and is there cloud in the way. And is that what I can hear — it estimates loudness at your ear, ranks by it, and tells you how many seconds behind the aircraft the sound is. It runs entirely against a local ADS-B receiver; routes and weather are the only things that ever touch the network, and both are optional.",
    start: "2026-08",
    status: "Active",
    association: "Personal",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/Earshot",
  },
  {
    name: "Skopos",
    description:
      "On-demand camera and microphone access to your own Macs, from your phone, over Tailscale. One menu bar agent per machine. No hub, no cloud, no app to install.",
    start: "2026-08",
    status: "Active",
    association: "Personal",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/Skopos",
  },
  {
    name: "GoTransit",
    description:
      "A small FastAPI service over the GO Transit / Metrolinx Open Data API. It hides the upstream's rough edges and exposes a clean, cached JSON API: departure boards, service alerts, stops, and live vehicles. The quirks it absorbs are the point — errors arrive as HTTP 200 with the real status buried in Metadata.ErrorCode, so a bad key returns 200 OK with a body saying 401. It caches everything, because Metrolinx disables keys that generate excessive traffic.",
    start: "2026-09",
    status: "Active",
    association: "Personal",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/Go-Transit",
  },
  {
    name: "Open-Weatheradio",
    description:
      "Weatheradio Canada's transmitters were shut down in the early hours of 31 March 2026. Around 230 VHF sites, reaching over 90 percent of the Canadian population, went off the air. The data that fed them did not go anywhere: every input Weatheradio consumed is still published, free, in machine-readable form — ECCC Datamart for weather products, NAADS for public alerting. What was cut was the last mile, a few hundred watts into an antenna. CAPCAST reassembles those streams into subscriber feeds, on amateur spectrum, for licensed operators.",
    start: "2026-04",
    status: "Active",
    association: "Personal",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/Open-Weatheradio",
  },
  {
    name: "Overlord MCP",
    description:
      "AI-controlled infrastructure: provision, command, destroy. An MCP server wrapping the Proxmox VE API, giving AI agents full control over virtual machine and container infrastructure — 83 tools covering the complete Proxmox surface across VMs, containers, networking, firewall, storage, backup, HA and monitoring, plus automated provisioning with 13 built-in recipes. Overlord is the orchestration layer that lets an agent provision its own infrastructure on demand, and it pairs with specialised servers like Reaper MCP: Overlord provisions the environment, Reaper operates inside it.",
    start: "2026-03",
    status: "Active",
    association: "Personal",
    repo: "https://github.com/mikeshoss/overlord-mcp",
    // url: "https://",
  },
  {
    name: "Reaper MCP",
    description:
      "Kali Linux security tools, summoned by AI. An MCP server that wraps Kali security testing tools so AI agents — Claude Desktop, Cursor, OpenClaw — can invoke them directly. Kali Linux, all 24 tools and the MCP server are packaged into a single Docker container, so there is no separate Kali install to maintain: docker build pulls the official kalilinux/kali-rolling image and installs everything automatically.",
    start: "2026-03",
    status: "Active",
    association: "Personal",
    repo: "https://github.com/mikeshoss/reaper-mcp",
    // url: "https://",
  },
  {
    name: "ReelMind",
    description:
      "A self-hosted recommendation engine for Plex. It learns what you like, finds more of it, downloads it, organizes it, and adds it to your library — all while staying out of the way when you're watching something. Powered by a local model via Ollama: no cloud services, no subscriptions, no data leaving your network. Six recommendation sources, from \"more like what you love\" to news headlines mapped to culturally relevant media, each with an optional auto-download mode; filling franchise gaps stays manual, because a model can hallucinate a sequel that does not exist. A playback guard pauses the whole pipeline while anyone is streaming.",
    start: "2026-03",
    status: "Active",
    association: "Personal",
    repo: "https://github.com/mikeshoss/reelmind",
    // url: "https://",
  },
  {
    name: "Personal AI Assistant",
    description:
      "The assistant I actually want, rebuilt each time the ceiling moved. Disciples came first: a modular, multi-user agent platform coordinating tasks and workflows over plain text. Ultron replaced it — a fully autonomous agent team on a single Mac Mini, one orchestrator and five specialists working across Telegram, Slack, Gmail and a custom kanban board, entirely self-hosted with no cloud infrastructure; its multi-agent routing, role-based delegation and orchestration framework came straight out of Disciples. Noesis is the third, and is being built as something larger than either.",
    start: "2025-03",
    status: "Active",
    association: "Personal",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/Noesis",
  },
  {
    name: "Self-Hosted AI & Infrastructure Lab",
    description:
      "Built and operated a self-hosted lab environment to assess AI tools, automation workflows, and infrastructure patterns. Deployed containerised services across multiple machines using Docker and Portainer, evaluating local-first AI workflows and dedicated compute setups.",
    start: "2020-01",
    status: "Active",
    association: "Personal",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/",
  },

  // Earlier work, newest first. Most predate the site and were sunsetted years
  // ago; they are here because the record should be complete, not because any
  // of them is still running.
  {
    name: "Shoss V1 | NFT Project",
    description:
      "A one-month experiment in shipping an NFT collection end to end.",
    start: "2022-03",
    end: "2022-03",
    status: "Discontinued",
    association: "Personal",
  },
  {
    name: "COVID Numbers Canada | Alexa Skill & Google Action",
    description:
      "Daily Canadian COVID-19 numbers from a smart speaker, as both an Alexa skill and a Google Action.",
    start: "2020-11",
    end: "2021-01",
    status: "Sunsetted",
    association: "Personal",
  },
  {
    name: "CellarSunday",
    description:
      "A platform for enthusiasts to catalogue, review and showcase their collection: a digital inventory, tasting notes, and curated lists for sharing and in-person experiences.",
    start: "2019-11",
    end: "2020-10",
    status: "Sunsetted",
    association: "Personal",
  },
  {
    name: "Techno Lingo | Alexa Skill",
    description:
      "An Alexa skill that explains technology jargon on request — a spoken glossary, years before the written one on this site.",
    start: "2018-08",
    end: "2020-02",
    status: "Sunsetted",
    association: "Personal",
  },
  {
    name: "Beau's Brewery | Alexa Skill",
    description: "An Alexa skill built for Beau's, the Ontario craft brewery.",
    start: "2018-07",
    end: "2020-02",
    status: "Sunsetted",
    association: "Personal",
  },
  {
    name: "Fresh Pots | Notification System",
    description: "A notification system that tells the office when a fresh pot of coffee is ready.",
    start: "2018-06",
    end: "2018-07",
    status: "Sunsetted",
    association: "Personal",
  },
  {
    name: "Character Analysis & Insights — The Nearly Girl",
    description:
      "An exploration of the traits, personality and characteristics of the characters in The Nearly Girl, the novel by Lisa de Nikolits.",
    start: "2016-06",
    end: "2016-08",
    status: "Completed",
    association: "Personal",
    url: "https://www.amazon.ca/Nearly-Girl-Lisa-Nikolits-ebook/dp/B01IFG44H0/",
  },
  {
    name: "Capstone Project | 2D Platformer",
    description:
      "A 2D platformer built in Unity3D with two teammates as the Sheridan College capstone.",
    start: "2012-09",
    end: "2012-12",
    status: "Completed",
    association: "Personal",
  },
  {
    name: "Custom Firmware | PSP, iOS & Android",
    description:
      "Custom system software for the PlayStation Portable from 2006, then for iOS and Android from 2009, built at MHMD.",
    start: "2006-01",
    end: "2010-09",
    status: "Sunsetted",
    association: "Personal",
  },

  /* ---------------------------------------------------------------- Epilogue */
  {
    name: "AI Edge Briefing & The AI Edge Podcast",
    description:
      "A daily sweep that was already happening by hand — frontier labs, arXiv, threat-intelligence reports, defence — turned into a published briefing and a podcast.",
    start: "2026-09",
    status: "Active",
    association: "Epilogue",
    repo: "https://github.com/mikeshoss/ainews",
    // url: "https://",
  },
  {
    name: "MCP Manifest Scanner",
    description:
      "Connects to a Model Context Protocol server, reads everything it exposes to an AI agent, and flags advertising, promotional content, and instructions aimed at the model rather than descriptions of the tool. Agent output is not ad inventory; this measures who is treating it that way. An MCP server hands an agent two kinds of text the model tends to trust implicitly — tool definitions and tool results — and either can carry instructions the model reads as authoritative. Three detection layers, every readable MCP surface scanned, a token-gated review board in Docker, portable capture bundles for the authenticated surface, and a fleet sweep over a committed target list. 413 tests. The name is a working title.",
    start: "2026-09",
    status: "Active",
    association: "Epilogue",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/MCP-Manifest-Scanner",
  },
  {
    name: "Cria",
    description:
      "Share GPU compute, access any AI model. A distributed marketplace where providers share their local AI servers and developers reach models through an OpenAI-compatible API — Ollama, LM Studio, LocalAI, vLLM, llama.cpp, or any OpenAI-compatible server, with no code changes.",
    start: "2026-06",
    status: "Paused",
    association: "Epilogue",
    url: "https://usecria.ai",
    // repo: "https://github.com/EpilogueLabs/Cria",
  },
  {
    name: "ChatPTT",
    description:
      "Built a system that lets any basic handheld radio speak to an AI assistant and get a spoken reply over the air. Users key up on a single simplex channel; the system captures the audio, runs STT→LLM→TTS, then transmits the answer back — no apps or special radio features required.",
    start: "2025-07",
    end: "2026-01",
    status: "Archived",
    association: "Epilogue",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/",
  },
  {
    name: "Travel With RX",
    description:
      "A global prescription guide for travellers. A SaaS closed beta from August 2024 to May 2025, then an invite-only MCP server until it was sold in December 2025.",
    start: "2024-08",
    end: "2025-12",
    status: "Sold",
    association: "Epilogue",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/TravelWithRX",
  },
  {
    name: "Liteworker",
    description:
      "A discovery platform that aggregates and curates AI tools, helping users explore new capabilities and stay current with emerging technologies.",
    start: "2023",
    end: "2025",
    status: "No Longer Maintained",
    association: "Epilogue",
    // url: "https://",
    // repo: "https://github.com/mikeshoss/",
  },
];

export interface ExperienceRole {
  title: string;
  company: string;
  start: string;
  end?: string;
  location?: string;
  highlights: string[];
  url?: string;
}

const experienceData: ExperienceRole[] = [
  {
    title: "Staff Product Manager, Vincent Enterprise",
    company: "Clio",
    url: "https://www.clio.com",
    start: "2026-08",
    highlights: [
      "Working on AI research and matter management for enterprise law firms.",
    ],
  },
  {
    title: "Founder & Principal — AI Consulting & Product Studio",
    company: "Epilogue",
    url: "https://epiloguelabs.com",
    start: "2023-11",
    location: "Toronto, Ontario, Canada",
    highlights: [
      "An AI company that turns complex business problems into practical, high-impact solutions: a consulting practice that sets AI strategy and product direction, and a product studio that builds and validates AI-native products end to end.",
    ],
  },
  {
    title: "Principal Product Manager, Ecosystem AI",
    company: "Caseware",
    start: "2025-11",
    end: "2026-07",
    location: "Toronto, ON",
    highlights: [
      "Head of Caseware Studio, leading the enterprise AI and ecosystem mandate — AI strategy, platform extensibility, and the developer ecosystem across products, partners, and the broader audit-tech landscape.",
      "Built and launched the Document Intelligence Agent (shipped as Verity Docs): 75% time savings against a 50% target, 97% extraction accuracy, and 100% weekly active use.",
      "Contributed to the Verity platform launch and the MNP Agentic Pioneer Program founding partnership.",
      "Defined the company-wide ecosystem strategy across integrations, APIs, shared services, and marketplace readiness.",
      "Led platform foundations — SDKs, developer experience, and cross-product standards — to enable third-party and AI innovation at scale.",
      "Partnered with Business Development, Engineering, and Product on build/partner/co-develop decisions tied to growth metrics.",
      "Scaled Studio's delivery model across the org: validated prototypes in 24 hours, production-ready features in one week.",
      "Maintained the ISO/IEC 42001-aligned AI Management System as governance moved from rollout into steady-state release operations.",
      "Owned AI quality and impact metrics used for portfolio prioritization and investment decisions.",
    ],
  },
  {
    title: "Principal Product Manager, AI & Automation",
    company: "Caseware",
    start: "2025-06",
    end: "2025-11",
    location: "Toronto, ON",
    highlights: [
      "Hired to build Caseware's AI function from the ground up.",
      "Partnered with the CPO and CTO to define and operationalize the company-wide AI strategy and governance model, securing multi-year funding and executive buy-in across all product lines.",
      "Founded and scaled Caseware Studio, transforming R&D velocity by enabling a 43-person product org to ship validated prototypes within 24h and production-ready AI features within one week.",
      "Led rollout of a company-wide AI enablement stack (custom GPTs, Copilot, Replit) and internal training program; adoption reduced cycle times by 80% and freed 15+ hours per contributor weekly.",
      "Directed cross-platform product foundations—SDKs, design systems, and telemetry pipelines—to standardize delivery, experimentation, and measurable customer impact.",
      "Implemented ISO/IEC 42001-aligned AI Management System, integrating governance, risk assessment, and ethical AI practices into release pipelines; accelerated enterprise compliance and contract velocity.",
      "Instituted AI quality and impact metrics to guide prioritization, improve retention, and inform strategic investment decisions across the product portfolio.",
      "Sponsored cross-functional working groups to align Legal, Compliance, and Product under a unified AI governance framework.",
    ],
  },
  {
    title: "Advisor (AI & Business Strategy)",
    company: "Monark",
    start: "2025-02",
    highlights: [],
  },
  {
    title: "Senior Product Manager, New Ventures",
    company: "FacilityOS (formerly iLobby)",
    start: "2024-04",
    end: "2025-05",
    location: "Toronto, Ontario, Canada",
    highlights: [
      "Led 0-to-1 launch of ContractorOS, expanding FacilityOS into a multi-sided compliance marketplace.",
      "Established beta-testing, Customer Advisory Board, and validated market through 100+ interviews.",
      "Accelerated time-to-market by 50%; achieved beta in 6 months using Agile and Design Sprints.",
      "Delivered 37% faster compliance, 23% task reduction, +20 NPS, and 90% retention.",
      "Projected to surpass $1M ARR in the first year, driving strategic growth.",
      "Defined AI features for FacilityOS, cutting support tickets 15% and lifting user satisfaction 20%.",
      "Partnered with executives to launch 3 cross-product features, boosting retention 40% in 6 months.",
    ],
  },
  {
    title: "Advisor (AI & Business Strategy)",
    company: "OneChart",
    start: "2024-01",
    highlights: [],
  },
  {
    title: "Advisor (Exited via Acquisition)",
    company: "SalesBop",
    start: "2024-01",
    end: "2025-02",
    highlights: [
      "Advised SalesBop on AI product strategy and scaling initiatives leading up to acquisition.",
      "SalesBop was acquired by FliteHouse.com in 2025.",
    ],
  },
  {
    title: "Director of Product Management, Experience Platform & Artificial Intelligence",
    company: "Firework",
    start: "2022-02",
    end: "2023-09",
    location: "Toronto / San Francisco",
    highlights: [
      "Drove product strategy and investment instrumental in securing $150M Series B funding round led by Softbank; regularly briefed executives and board.",
      "Led AI integration initiatives, increasing user engagement 400% and doubling conversions.",
      "Built and scaled 60-member global team across five product lines.",
      "Increased informed purchase decisions by 108% and user engagement by 167% via OKRs.",
      "Additionally, served on the Social Committee.",
    ],
  },
  {
    title: "Senior Product Manager, Consumer Player & Content Creation",
    company: "Firework",
    start: "2021-08",
    end: "2022-01",
    location: "Toronto / San Francisco",
    highlights: [
      "Scaled content initiatives, growing DAUs 500x; expanded Fortune 500 partnerships.",
      "Pioneered live-shopping experience, boosting conversions 21% and setting the industry standard.",
    ],
  },
  {
    title: "Senior Product Manager, Web Player & Business Portal",
    company: "Firework",
    start: "2021-02",
    end: "2021-07",
    location: "Toronto / San Francisco",
    highlights: [
      "Transitioned platform to self-serve SaaS, growing ARR 10x and enhancing customer acquisition.",
      "Implemented AI playlist optimization, reducing churn 11.4%, enhancing accessibility by 275%.",
    ],
  },
  {
    title: "Angel Investor",
    // A numbered company with no trading name yet. Replace this with the
    // name when it has one; see the `investing` venture entry.
    company: "Private investment company",
    start: "2021-02",
    location: "Canada",
    highlights: [
      "Investing in early-stage Canadian science and technology companies, with a focus on AI, through syndicates, angel networks and funds.",
    ],
  },
  {
    title: "Senior Product Manager, Platform & Machine Learning",
    company: "VerticalScope Inc.",
    start: "2019-12",
    end: "2021-02",
    location: "Toronto, Ontario, Canada",
    highlights: [
      "Transformed platform from ad-based to SaaS, unifying 1500+ sites; achieved 17% MoM growth.",
      "Launched ML-driven recommendation engine, increasing user engagement by 50% CTR.",
    ],
  },
  {
    title: "Founder & CEO [Rebranded]",
    company: "Epilogue Labs",
    start: "2018-11",
    end: "2020-01",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Product Manager, Web & Artificial Intelligence",
    company: "GryphTech",
    start: "2018-09",
    end: "2019-11",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Business Mentor & Fractional Product Manager",
    company: "ShossX",
    start: "2017-12",
    end: "2018-09",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Product Manager & Senior Web Developer",
    company: "Classlete",
    start: "2013-10",
    end: "2014-09",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Product Manager & Producer, Web",
    company: "Rogers Communications",
    start: "2013-05",
    end: "2017-09",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Founder & Digital Marketer",
    company: "Form Follows Function",
    start: "2013-01",
    end: "2017-12",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Web Developer",
    company: "SOTI",
    start: "2013-01",
    end: "2013-05",
    location: "Mississauga, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Web Developer",
    company: "RBC Capital Markets",
    start: "2012-04",
    end: "2012-08",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Senior Web Developer & Scrum Master",
    company: "Shoplogix — A Constellation Software Inc. Company",
    start: "2011-01",
    end: "2012-04",
    location: "Mississauga, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Software Developer - iOS, Android and PSPOS",
    company: "MHMD",
    start: "2006-01",
    end: "2010-08",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
];

export interface VolunteerRole {
  title: string;
  organization: string;
  start: string;
  end?: string;
  description: string;
  category: "mentoring" | "community" | "advisory" | "governance";
  url?: string;
  /**
   * Role progression inside the same organization, newest first. Present only
   * where the title has changed; `title` above is always the current one, and
   * `start` is always the first of these entries' start.
   */
  timeline?: { role: string; start: string; end?: string }[];
}

const volunteeringData: VolunteerRole[] = [
  {
    title: "Expert-in-Residence — Artificial Intelligence & Product Management",
    organization: "DMZ",
    start: "2025-01",
    description:
      "Providing AI product strategy guidance to high-growth startups at one of Canada's top incubators. Advised 10+ startups on AI strategy, product-market fit, and scaling operations, and hosted speaking engagements for 50+ entrepreneurs, students, and industry professionals.",
    category: "mentoring",
  },
  {
    title: "Board Member & Chair, Business Development Committee",
    organization: "Milton Community Resource Centre (MCRC)",
    start: "2024-11",
    description:
      "MCRC is a not-for-profit, multi-service and multi-site organization serving children and families in Milton and the surrounding communities, alongside professionals working in Early Childhood Education. Advising on funding strategy, government partnerships, and operational improvements for a nonprofit serving 1,000+ families; supporting financial planning and grant applications for long-term sustainability; helping the organization navigate technology and AI adoption; and engaging policymakers and community leaders to expand impact across the Milton region.",
    category: "governance",
    timeline: [
      { role: "Chair, Business Development Committee", start: "2026-08" },
      {
        role: "Member, Business Development Committee",
        start: "2024-11",
        end: "2026-08",
      },
    ],
  },
  {
    title: "Member & Lead, Meshtastic / LoRa Mesh Working Group",
    organization: "Burlington Amateur Radio Club (BARC)",
    start: "2025-09",
    description:
      "Licensed amateur radio operator and member of BARC, a club serving Burlington, Halton and Hamilton that runs the VE3RSB repeater system, weekly Hackspace sessions, licensing courses, the annual Ontario Hamfest, and emergency and special-event communications support for non-profit and emergency services organizations. Leading the club's Meshtastic / LoRa mesh working group, chartered to recommend to the BARC Executive whether and how to deploy off-grid mesh networking infrastructure — covering hardware evaluation, solar and battery power budgeting for year-round Ontario operation, tower siting and RF integration, ISED licence-exempt compliance, long-term maintenance ownership, and cost. Also runs APRS igate and digipeater infrastructure, and experiments across Meshtastic, MeshCore and LoRa mesh networking.",
    category: "community",
  },
  {
    title: "Lead Mentor — Artificial Intelligence & Product Management",
    organization: "The Forge McMaster",
    start: "2025-04",
    description:
      "Mentoring early-stage founders at McMaster University's business incubator in Hamilton, ON on AI productization, business model optimization, GTM execution, and fundraising strategy.",
    category: "mentoring",
  },
  {
    title: "Advisor — Various Startups",
    organization: "Independent",
    start: "2018-07",
    description:
      "Specializing in AI, Product Management, Community Building, and startup strategy.",
    category: "advisory",
  },
  {
    title: "Mentor — AI & Product Management",
    organization: "Platform Calgary",
    start: "2024-03",
    end: "2025-12",
    description:
      "Mentoring founders and startups on AI adoption, product strategy, and execution.",
    category: "mentoring",
  },
  {
    title: "Independent Subject Matter Expert",
    organization: "Tegus",
    start: "2023-01",
    description:
      "Advising CEOs, investors, and senior leaders on AI, SaaS, and video commerce.",
    category: "advisory",
  },
  {
    title: "Independent Subject Matter Expert",
    organization: "GLG",
    start: "2023-01",
    description:
      "Advising CEOs, investors, and senior leaders on AI, SaaS, and video commerce.",
    category: "advisory",
  },
  {
    title: "Member",
    organization: "Angel One Investor Network",
    start: "2023-10",
    end: "2025-03",
    description:
      "Empowering Canadian startups by linking founders with funders.",
    category: "advisory",
  },
  {
    title: "Consultant — AI Compute",
    organization: "Government of Canada",
    start: "2024-06",
    end: "2024-09",
    description:
      "Contributed to the Canadian AI Sovereign Compute Strategy to guide Canada's efforts to develop AI infrastructure.",
    category: "advisory",
  },
  {
    title: "Co-Organizer",
    organization: "ProductTank Toronto",
    start: "2024-03",
    end: "2025-06",
    description:
      "Led and scaled Toronto's largest product leadership community, engaging senior product leaders across the city. Previously Organizer.",
    category: "community",
  },
  {
    title: "Mentor",
    organization: "Treefrog Accelerator",
    start: "2024-05",
    end: "2024-06",
    description:
      "Mentoring startups on scaling through product and AI strategy.",
    category: "mentoring",
  },
  {
    title: "Donor",
    organization: "Folding@home",
    start: "2020-04",
    description:
      "Contributing compute to distributed protein dynamics simulations for disease research.",
    category: "community",
  },
];

export interface Education {
  institution: string;
  credential: string;
  detail?: string;
  period?: string;
}

export const education: Education[] = [
  {
    institution: "Sheridan College",
    credential: "Ontario College Advanced Diploma, Computer Systems Technology",
    detail:
      "Software Development and Network Engineering Co-op — Mobile Stream",
  },
  {
    institution: "Product School",
    credential: "Software Product Management (SPM)",
    period: "2018",
  },
];

export interface Certification {
  name: string;
  issuer?: string;
}

export const certifications: Certification[] = [
  { name: "Certified ScrumMaster (CSM)" },
  { name: "Segment University — Advanced Products [Protocols]" },
  { name: "Advanced SEO" },
  { name: "Social Marketing" },
  { name: "Amateur Radio Operator Certificate" },
];

/** withPeriod(), extended to the nested role progression on a volunteer entry. */
function withVolunteerPeriods(items: VolunteerRole[]) {
  return withPeriod(items).map((item) => ({
    ...item,
    timeline: item.timeline?.map((entry) => ({
      ...entry,
      period: formatPeriod(entry.start, entry.end),
    })),
  }));
}

export const companies = withPeriod(companiesData);

// After companiesData, which it counts.
export const highlights = [
  { value: `${yearsExperience}+`, label: "Years in Product & Software" },
  { value: `${companiesData.length}`, label: "Companies Founded" },
  { value: "$150M+", label: "Fundraising Supported" },
  { value: `${patentCount}`, label: "Patents in AI & Video Commerce" },
];
export const projects = withPeriod(projectsData);
export const experience = withPeriod(experienceData);
export const volunteering = withVolunteerPeriods(volunteeringData);

/* ------------------------------------------------------------------------- *
 * Additional resume sections
 *
 * Typed and wired through to the JSON API, the JSON Resume export and the MCP
 * server, but empty until filled in. Add entries and they appear across every
 * consumer with no further changes.
 * ------------------------------------------------------------------------- */

export interface Award {
  title: string;
  awarder: string;
  /** ISO date the award was received. */
  date: string;
  summary?: string;
  url?: string;
}

export const awards: Award[] = [];

export interface Publication {
  title: string;
  publisher: string;
  /** ISO publication date. */
  date: string;
  summary?: string;
  url?: string;
}

export const publications: Publication[] = [];

export interface Recommendation {
  /** Who wrote it. */
  name: string;
  title?: string;
  organization?: string;
  /** How they worked with Mike, e.g. "Reported directly". */
  relationship?: string;
  text: string;
  url?: string;
}

export const recommendations: Recommendation[] = [];

export interface Language {
  language: string;
  /** e.g. "Native speaker", "Professional working proficiency". */
  fluency: string;
}

export const languages: Language[] = [];

export interface Organization {
  name: string;
  role?: string;
  start: string;
  end?: string;
  description?: string;
  url?: string;
}

const organizationsData: Organization[] = [];

/**
 * Off the clock. Each interest has its own page at /off-the-clock/<slug>/.
 * `summary` is one line in Mike's voice; keep it to what is true today.
 */
export interface Interest {
  slug: string;
  name: string;
  summary: string;
  /** The word beside the green light on its page: what is happening now. */
  status: string;
  /** A short line under the page title, for names that need one. */
  aka?: string;
  /** Extra words people might type for this page (⌘K search and the 404 guess). Not shown. */
  search?: string;
  keywords?: string[];
  /** Equipment that is running right now, shown as a panel of lights. */
  stations?: { name: string; role: string }[];
}

export const interests: Interest[] = [
  {
    slug: "bicycles",
    search: "bikes bike frames cycling",
    name: "Vintage Canadian steel bicycles",
    summary: "Canadian vintage steel, and a few good frames from elsewhere: restored, rebuilt and ridden. One is too rare to ride and hangs on my office wall.",
    status: "Restoring",
    keywords: ["Restoration", "Framebuilding", "Cycling"],
  },
  {
    slug: "amateur-radio",
    search: "ham radio aprs meshtastic adsb",
    name: "Amateur radio",
    summary: "Repeaters and digipeaters running at my house for APRS, LoRa APRS, Meshtastic and MeshCore, plus an ADS-B receiver tracking the aircraft overhead. Infrastructure other people's radios lean on.",
    status: "On air",
    keywords: [
      "APRS",
      "LoRa APRS",
      "Meshtastic",
      "MeshCore",
      "ADS-B",
      "Digipeaters",
    ],
    stations: [
      { name: "APRS", role: "Digipeater" },
      { name: "LoRa APRS", role: "Digipeater" },
      { name: "Meshtastic", role: "Repeater" },
      { name: "MeshCore", role: "Repeater" },
      { name: "ADS-B", role: "Receiver" },
    ],
  },
  {
    slug: "cards",
    search: "pokemon magic tcg collection slabs",
    name: "Trading cards",
    aka: "TCG · Pokémon and Magic: The Gathering",
    summary: "Vintage Pokémon, done properly: Wizards of the Coast-era sets, one card at a time, until the binder is full. And Commander decks, because building the deck is the fun part.",
    status: "Collecting",
    keywords: ["Wizards-era Pokémon", "Set completion", "Porygon master set", "Graded slabs", "Magic: The Gathering", "Commander"],
  },
  {
    slug: "homelab",
    search: "servers infrastructure lab",
    name: "Homelab",
    summary: "I should be able to do any work, anywhere, on any device. Five servers, over a hundred containers and a bench of local AI models make that true. Run like production, because some of it is.",
    status: "Running",
    keywords: [
      "Self-hosted infrastructure",
      "Local-first AI",
      "Docker",
      "Observability",
      "Backups",
    ],
  },
];

export interface Cause {
  name: string;
  description?: string;
  url?: string;
  /** Straight to the donation page: the point is one tap to give. */
  donate?: string;
}

// Where Mike gives. Shown on the home page with a Donate button each, so
// anyone who lands here is one tap from supporting them.
export const causes: Cause[] = [
  {
    name: "SickKids",
    description: "The Hospital for Sick Children in Toronto: care, research and training for children's health.",
    url: "https://www.sickkidsfoundation.com/",
    donate: "https://www.sickkidsfoundation.com/donate",
  },
  {
    name: "Yamnuska Wolfdog Sanctuary",
    description: "A sanctuary in Cochrane, Alberta, giving surrendered and unwanted wolfdogs a permanent home.",
    url: "https://www.yamnuskawolfdogsanctuary.com/",
    donate: "https://www.yamnuskawolfdogsanctuary.com/donate",
  },
  {
    name: "OVC Pet Trust",
    description: "Canada's first charitable fund for companion animal health, at the Ontario Veterinary College.",
    url: "https://pettrust.ca/",
    donate: "https://pettrust.ca/donate",
  },
];

/* ------------------------------------------------------------------------- *
 * The collection: Pokémon TCG sets and graded slabs, shown on /off-the-clock/cards/.
 *
 * Completion only — deliberately no values, prices or cert numbers. A list of
 * what a collector owns, next to their home town, is a burglary listing.
 * ------------------------------------------------------------------------- */

export interface CardSet {
  name: string;
  /** Release year, or span for a promo series. */
  year: string;
  /** Cards in the set. */
  total: number;
  /** Cards owned. Leave out while it is being counted. */
  owned?: number;
  note?: string;
}

export const cardSets: CardSet[] = [
  { name: "Base Set", year: "1999", total: 102, owned: 102 },
  { name: "Jungle", year: "1999", total: 64, owned: 64 },
  { name: "Fossil", year: "1999", total: 62, owned: 62 },
  {
    name: "Wizards Black Star Promos",
    year: "1999–2003",
    total: 53,
    owned: 28,
  },
  { name: "Best of Game", year: "2002", total: 9, owned: 0, note: "Next up" },
];

/**
 * The bikes, from Mike's build notes (2026). Each is drawn on its page as an
 * 8-bit sprite of the frame and fork only (src/components/BikeSprite.astro),
 * in the frame's real colours. `colour` null = not confirmed yet: the sprite
 * is drawn in bare-metal grey and says so.
 */
export interface Bike {
  slug: string;
  year: string;
  make: string;
  model: string;
  line: string;
  story: string;
  status: string;
  frame: string;
  size?: string;
  colour: string | null;
  build: string;
  sprite: { frame: string; shine: string; lugs: string; fork?: string; fixie?: boolean; tall?: boolean };
}

export const bikes: Bike[] = [
  {
    slug: "ccm-tour-du-monde",
    year: "1984",
    make: "CCM",
    model: "Tour du Monde",
    line: "Built in France by Peugeot, badged by Canada's CCM.",
    story: "By 1984 the original Canada Cycle & Motor Co. was leaving the bicycle business; this one was built by Peugeot on Reynolds 501 and came to me all original. Too rare to modify, so it was taken apart, cleaned and preserved. The frame and fork hang on my office wall.",
    status: "On the wall",
    frame: "Reynolds 501 steel",
    size: '22"',
    colour: "Burgundy with gold striping",
    build: "Preserved: SunTour 12-speed, Weinmann and Dia-Compe, 27-inch wheels, all boxed",
    sprite: { frame: "#9b1b2a", shine: "#c94355", lugs: "#d6a73e", tall: true },
  },
  {
    slug: "miele-uno-ls",
    year: "1988",
    make: "Miele",
    model: "Uno LS",
    line: "Built in Ontario: Canadian lugged steel with an Italian name.",
    story: "Miele built well-regarded lugged-steel frames around Toronto until cheap imports closed the doors in 1996. The Uno LS is light, lively Tange chromoly. Version 2 turns it into a fast fitness bike: bullhorns, Tiagra levers, white cork tape and a ride kit that means it's always ready to go.",
    status: "Riding · v2",
    frame: "Tange chromoly",
    size: "54 cm",
    colour: "Teal",
    build: "Fitness mode: bullhorn bars, Shimano 2×6, Sugino MP crank, 700×35C",
    sprite: { frame: "#139aa6", shine: "#58cdd4", lugs: "#d9d5cc" },
  },
  {
    slug: "nakamura-champion",
    year: "1987",
    make: "Nakamura",
    model: "Champion",
    line: "A budget-rack rescue on a quality Tange 900 frame.",
    story: "Not every good frame carries a famous name. This one came home cheap and was hiding double-butted Tange 900 chromoly, mid-'80s Japanese steel that rides far better than its price. Version 1 strips it back to a clean single-speed fixie on a flip-flop hub.",
    status: "Building · v1",
    frame: "Double-butted Tange 900 chromoly",
    colour: "Champagne gold",
    build: "Fixie: single-speed, flip-flop rear hub",
    sprite: { frame: "#b89c62", shine: "#e2cf9c", lugs: "#8c8478", fixie: true },
  },
];

/** Magic: The Gathering. Commander decks, with the bracket each one plays at. */
export interface CommanderDeck {
  commander: string;
  build: string;
  bracket: number;
}

export const magic: { format: string; decks: CommanderDeck[] } = {
  format: "Commander",
  decks: [
    { commander: "Captain America, Team Leader", build: "Precon", bracket: 2 },
    { commander: "Éowyn, Shieldmaiden", build: "Upgraded precon", bracket: 3 },
  ],
};

/**
 * The homelab, public-safe on purpose: roles, hardware and counts only. No
 * hostnames, addresses, ports, domains, software versions, locations, remote
 * consoles or anything that would map the network. Source: the stack
 * inventory of 2026-10-31.
 */
export const homelab = {
  why: "Any work, anywhere, on any device.",
  whyDetail:
    "Nothing important lives on the device in my hand. It lives here, so a phone, a borrowed laptop or the one in my bag can pick up exactly where I left off. That's the whole reason this exists.",
  readouts: [
    { value: "5", label: "Servers" },
    { value: "100+", label: "Containers" },
    { value: "50 TB", label: "Storage" },
    { value: "5", label: "Local LLMs" },
    { value: "122B", label: "Largest model" },
    { value: "20", label: "Domains" },
  ],
  machines: [
    {
      role: "The server",
      hardware: "Mac mini M4 · 32 GB",
      does: "Around 60 containers. The always-on heart of it: if a service matters, it runs here, watched, backed up and with a staging twin.",
      themes: [
        { name: "Media", detail: "The household photo library, with face and place search, and a media server for the house." },
        { name: "Monitoring", detail: "Metrics, logs and uptime checks for every machine, with alerts to my phone." },
        { name: "Automation", detail: "Workflows and scheduled jobs, each one logged and on a switchboard I can turn off from anywhere." },
        { name: "AI tooling", detail: "An MCP gateway with about 20 tools any agent can use, and one chat interface for every model." },
        { name: "Staging", detail: "A copy of every public app with its own data and its outbound switched off." },
        { name: "Data pipelines", detail: "The crawlers and publishers behind two public data sites." },
        { name: "Workbench", detail: "Spin up an experiment, share it with an end date, and it cleans itself up." },
      ],
    },
    {
      role: "The AI box",
      hardware: "Apple M3 Max · 128 GB",
      does: "A private AI lab. Several models on one machine, the right size for each job, behind one OpenAI-compatible router, so any app or agent can use them without knowing which is which. Nothing leaves the house unless I send it.",
      themes: [
        { name: "Language", detail: "Gemma 3 12B, gpt-oss 20B, Qwen 3.5 9B and 122B, Qwen 3.8 27B." },
        { name: "Router", detail: "One OpenAI-compatible endpoint in front of every model." },
        { name: "Speech", detail: "Whisper large-v3-turbo transcribing on the GPU." },
        { name: "Voice", detail: "Kokoro text-to-speech." },
        { name: "Images", detail: "ComfyUI for image generation." },
        { name: "Memory", detail: "Embedding models and a vector store for search and recall." },
        { name: "Agents", detail: "A local agent with its own MCP server." },
      ],
    },
    {
      role: "The public box",
      hardware: "Cloud server · 4 GB",
      does: "Five production apps and their databases, each behind its own tunnel. Nightly backups come home.",
    },
    {
      role: "The vault",
      hardware: "Raspberry Pi 4 · 8 GB · 17 TB",
      does: "Encrypted backups for every machine, Time Machine for the Macs, the photo store, DNS for the network, and the UPS that shuts everything down cleanly.",
    },
    {
      role: "The sky box",
      hardware: "Raspberry Pi 4 · 4 GB",
      does: "ADS-B feeders, mesh-radio monitoring, Reticulum and the sensor message bus. The radio page has the rest.",
    },
    {
      role: "The house",
      hardware: "Home Assistant",
      does: "Home automation, on the same network and the same alerts as everything else.",
    },
    {
      role: "The laptop",
      hardware: "MacBook Neo · disposable by design",
      does: "Not because I don't care about it: because nothing mission-critical lives on it. Lose it, wipe it, pick up any other device and keep working. That's the test the rest of the lab has to pass.",
    },
  ],
  /** How it is run. Each one is a rule the lab actually enforces. */
  rules: [
    { rule: "Merge is deploy.", detail: "A merge reaches production in about five minutes: database dump first, health check after, automatic rollback if it fails." },
    { rule: "Staging for everything.", detail: "Every public app has a staging copy with its own data and its outbound switched off: no email, no webhooks, no surprises." },
    { rule: "Nothing gets deleted.", detail: "Files go to the Trash and only I empty it. No script, job or agent may delete on its own." },
    { rule: "New jobs report first.", detail: "A new scheduled job runs report-only, and a human reads its log before it is allowed to change anything." },
    { rule: "Unreadable is not broken.", detail: "A permission error or a timeout stops the job. It is never taken as proof a file is damaged." },
    { rule: "One list.", detail: "Every service is in one registry. Ports, links and uptime checks are generated from it, so nothing runs that nobody knows about." },
  ],
  retired: "Retired this autumn: a Proxmox host and its two VMs, an old NAS whose disk moved into the vault, a laptop and a cyberdeck.",
};

/**
 * The Porygon English master set: every English printing and variant of
 * Porygon, Porygon2 and Porygon-Z. Snapshot of Mike's tracking sheet, counts
 * only (no prices). Owned includes cards in transit.
 */
export const porygon = {
  name: "Porygon English master set",
  updated: "2026-11-05",
  eras: [
    { era: "Wizards", owned: 4, total: 15 },
    { era: "e-Card", owned: 0, total: 6 },
    { era: "EX", owned: 2, total: 10 },
    { era: "Diamond & Pearl", owned: 2, total: 13 },
    { era: "HeartGold SoulSilver", owned: 2, total: 8 },
    { era: "Black & White", owned: 5, total: 8 },
    { era: "XY", owned: 7, total: 10 },
    { era: "Sun & Moon", owned: 12, total: 18 },
    { era: "Sword & Shield", owned: 5, total: 12 },
    { era: "Scarlet & Violet", owned: 10, total: 17 },
  ],
  /** The hard ones still missing. */
  hunting: [
    "Porygon2 · Great Encounters · Staff prerelease stamp",
    "Porygon-Z · BW Black Star Promo · Staff prerelease stamp",
    "Dark Porygon2 · Neo Destiny · 1st Edition holo",
    "Porygon2 · Neo Revelation · 1st Edition holo",
  ],
};

export interface Slab {
  card: string;
  /** Print and variant: holo, full art, language. Shown on its own line. */
  variant?: string;
  set: string;
  number?: string;
  year?: string;
  grader: string;
  grade: string;
  /** The grader's short label for the grade, as on the slab: MINT, NM, EX-MT, EX. */
  label: string;
  /** Set when the slab is a card in one of the set runs above, not a stand-alone. */
  partOf?: string;
}

/**
 * Graded cards. Grades only: no cert numbers, prices or values (the same rule
 * as the sets). Two are cards from the completed sets, kept in slabs.
 */
export const slabs: Slab[] = [
  { card: "Eevee & Snorlax GX", variant: "Full Art", set: "Team Up", number: "171", year: "2019", grader: "PSA", grade: "9", label: "MINT" },
  { card: "Bulbasaur", variant: "Illustration Rare", set: "Stellar Crown", number: "143/142", year: "2024", grader: "PSA", grade: "9", label: "MINT" },
  { card: "Rocket's Mewtwo", variant: "Holo · Japanese", set: "Gym Challenge", number: "150", grader: "PSA", grade: "7", label: "NM" },
  { card: "Charizard", variant: "Holo · Shadowless", set: "Base Set", number: "4", year: "1999", grader: "PSA", grade: "5", label: "EX", partOf: "Base Set" },
  { card: "Haunter", variant: "Holo", set: "Fossil", number: "6", year: "1999", grader: "PSA", grade: "6", label: "EX-MT", partOf: "Fossil" },
];

export const organizations = withPeriod(organizationsData);
