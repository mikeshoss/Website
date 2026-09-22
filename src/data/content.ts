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
    `Mike Shoss builds AI products for work where being wrong is expensive. Product executive, founder of Epilogue, ${patentCount} patents in AI. Currently at Clio.`,
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
    `Product executive and founder, ${yearsExperience}+ years in. I've built and led product at Firework, VerticalScope and Caseware, hold ${patentCount} patents in AI, and run Epilogue, an AI consulting and product studio. Right now I'm Staff Product Manager at Clio.`,
  credibility:
    `The last stretch was audit — building and launching the Document Intelligence Agent at Caseware, which shipped as Verity Docs and cut document work by 75% against a 50% target, at 97% extraction accuracy and 100% weekly active use. Now it's legal. Before that, scaling product orgs at Firework (Softbank-backed, $150M Series B) and VerticalScope. ${patentCount} patents (${grantedPatentCount} granted). 3 companies founded.`,
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
      title: "ShossX",
      role: "Angel Investor",
      blurb:
        "Early-stage Canadian AI, science and technology companies, through syndicates and funds so more capital reaches a founder faster.",
      href: "/companies/shossx",
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

export const highlights = [
  { value: `${yearsExperience}+`, label: "Years in Product & Software" },
  { value: "3", label: "Companies Founded" },
  { value: "$150M+", label: "Fundraising Supported" },
  { value: `${patentCount}`, label: "Patents in AI & Video Commerce" },
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
    products: [
      {
        name: "Parleh",
        tagline: "Meetings that do the work.",
        description:
          "An AI meeting companion built through a structured human + autonomous agent collaboration model. Turns notes into live action, workflows, and agent-triggered execution.",
        status: "Active",
      },
      {
        name: "Fractal",
        tagline: "One source of truth for product.",
        description:
          "An AI-agent-driven product-truth platform that unifies code, design, and product artefacts into a single living source of truth, generating role-specific views and reducing documentation drift.",
        status: "Active — Closed Beta",
      },
      {
        name: "Of Record Media",
        tagline: "An independent civic record.",
        description:
          "Municipalities and police services publish constantly — agendas, minutes, budgets, development files — and almost none of it is read. Of Record turns those published sources into a standing public record that can be checked against the document it came from.",
        status: "Active",
        url: "https://ofrecord.ca",
      },
      {
        name: "TrustFlow",
        tagline: "Automate admin, embed compliance.",
        description:
          "An AI-powered platform that automates administrative workflows for professional services teams, streamlining approvals, documentation, and record-keeping while embedding safeguards to reduce errors and support audit readiness.",
        status: "Active — Invite Only",
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
    slug: "shossx",
    name: "ShossX",
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
    description: "Built over eleven months under Epilogue Labs, and sunsetted in October 2020.",
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
      "An exploration of the traits, personality and characteristics of the characters in The Nearly Girl.",
    start: "2016-06",
    end: "2016-08",
    status: "Completed",
    association: "Personal",
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
    status: "Active",
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
      "Your Global Prescription Guide. Included MCP Server implementation and SaaS implementation.",
    start: "2024-08",
    end: "2025-12",
    status: "Exited",
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
    company: "ShossX",
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

export interface Interest {
  name: string;
  keywords?: string[];
}

export const interests: Interest[] = [
  {
    name: "Vintage Canadian steel bicycles",
    keywords: ["Restoration", "Framebuilding", "Cycling"],
  },
  {
    name: "Amateur radio",
    keywords: [
      "Meshtastic",
      "LoRa mesh",
      "APRS",
      "Digipeaters",
      "Emergency communications",
    ],
  },
  {
    name: "Homelab",
    keywords: [
      "Self-hosted infrastructure",
      "Local-first AI",
      "Docker",
      "Observability",
    ],
  },
];

export interface Cause {
  name: string;
  description?: string;
  url?: string;
}

export const causes: Cause[] = [];

export const organizations = withPeriod(organizationsData);
