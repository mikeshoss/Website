export const site = {
  name: "Mike Shoss",
  title: "Founder. Product Executive. AI Builder.",
  description:
    "Mike Shoss is a founder, product executive, and builder of AI-native systems. Staff Product Manager at Clio, founder of Epilogue, 15+ years in product and software, and 9 patents in AI and video commerce.",
  url: "https://mikeshoss.com",
  linkedin: "https://www.linkedin.com/in/mikeshoss",
  github: "https://github.com/mikeshoss",
  email: "mike@epiloguelabs.com",
  location: "Milton, Ontario, Canada",
  blogUrl: "/blog",
};

export const hero = {
  headline: "Founder. Product Executive. AI Builder.",
  subheadline:
    "I build companies, lead product organizations, and ship AI systems that drive real business outcomes — not demos. 15+ years turning strategy into products that scale.",
  credibility:
    "Currently a Staff Product Manager at Clio building AI for enterprise legal, while running Epilogue, an AI consulting and product studio. Previously built and launched Verity Docs at Caseware, and scaled product orgs at Firework (Softbank-backed, $150M Series B) and VerticalScope. 9 patents (2 granted). 3 companies founded.",
  philosophy: [
    "Strategy without execution is a hobby",
    "Ship products, not slide decks",
    "AI should solve real problems",
    "Build for outcomes, not applause",
  ],
};

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
  { value: "15+", label: "Years in Product & Software" },
  { value: "3", label: "Companies Founded" },
  { value: "$150M+", label: "Fundraising Supported" },
  { value: "9", label: "Patents in AI & Video Commerce" },
];

export interface Company {
  name: string;
  role: string;
  description: string;
  period: string;
  url?: string;
  products?: {
    name: string;
    tagline: string;
    description: string;
    status: string;
  }[];
}

export const companies: Company[] = [
  {
    name: "ShossX",
    role: "Angel Investor",
    description:
      "Investing in early-stage Canadian science and technology companies, with a focus on AI. Canada builds world-class startups and then outsources their scale — the gap is in speed, risk appetite, and cheque size, not talent. Active through syndicates, angel networks, and funds: CedarPeak, Angel One, Sand Hill Angels, and N49P.",
    period: "Feb 2021 – Present",
  },
  {
    name: "Epilogue",
    role: "Founder & Principal — AI Consulting & Product Studio",
    description:
      "An AI company focused on turning complex business problems into practical, high-impact AI solutions. Epilogue operates across two tightly integrated arms: Consulting (AI strategy and roadmaps, AI-native product and platform design, pricing, monetization, and go-to-market) and Product Studio (building and validating AI-native products end to end, then spinning them out or integrating them into partner organizations). Client and partner work includes OneChart, Saucy Protein, TakeCare, CorLibra, SalesBop, ZheroTax, Protagonist Health, and UniversoleFit.",
    period: "Nov 2023 – Present",
    url: "https://epiloguelabs.com",
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
        name: "TrustFlow",
        tagline: "Automate admin, embed compliance.",
        description:
          "An AI-powered platform that automates administrative workflows for professional services teams, streamlining approvals, documentation, and record-keeping while embedding safeguards to reduce errors and support audit readiness.",
        status: "Active — Invite Only",
      },
    ],
  },

  {
    name: "Milton Innovation",
    role: "Founder",
    description:
      "This is a thriving hub where tech enthusiasts, innovators, and creators converge to share ideas, learn, and network.",
    period: "Nov 2023 – Present",
  },
];

export interface Project {
  name: string;
  description: string;
  period: string;
  status: string;
  association?: string;
  url?: string;
}

export const projects: Project[] = [
  {
    name: "Ultron | AI Chief of Staff",
    description:
      "A fully autonomous AI agent team running on a single Mac Mini. One orchestrator (Claude Opus), five specialist agents coordinating across Telegram, Slack, Gmail, and a custom kanban board — all self-hosted, no cloud infrastructure. The agents research, write, code, and ship while the human sleeps.",
    period: "Jan 2026 – Present",
    status: "Active",
    association: "Epilogue",
  },
  {
    name: "MilTastic | Milton's Community Mesh Network",
    description:
      "A decentralized, off-grid wireless mesh network to support community communication and resilience during outages and emergency scenarios. Led system architecture, RF planning, and node deployment across multiple neighbourhoods.",
    period: "Dec 2025 – Present",
    status: "Active",
  },
  {
    name: "Self-Hosted AI & Infrastructure Lab",
    description:
      "Built and operated a self-hosted lab environment to assess AI tools, automation workflows, and infrastructure patterns. Deployed containerised services across multiple machines using Docker and Portainer, evaluating local-first AI workflows and dedicated compute setups.",
    period: "Jan 2020 – Present",
    status: "Active",
  },
  {
    name: "ChatPTT",
    description:
      "Built a system that lets any basic handheld radio speak to an AI assistant and get a spoken reply over the air. Users key up on a single simplex channel; the system captures the audio, runs STT→LLM→TTS, then transmits the answer back — no apps or special radio features required.",
    period: "Jul 2025 – Jan 2026",
    status: "Archived",
    association: "Epilogue",
  },
  {
    name: "Disciples | Family AI Agent",
    description:
      "A modular, multi-user AI agent platform enabling task execution and workflow coordination through text-based interactions. Evolved into Ultron (AI Chief of Staff) — its multi-agent routing, role-based delegation, and orchestration framework became the architectural foundation.",
    period: "Mar 2025 – Jan 2026",
    status: "Archived — evolved into Ultron",
    association: "Epilogue",
  },
  {
    name: "Travel With RX",
    description:
      "Your Global Prescription Guide. Included MCP Server implementation and SaaS implementation.",
    period: "Aug 2024 – Dec 2025",
    status: "Exited",
    association: "Epilogue",
  },
  {
    name: "Project Cria",
    description:
      "A platform where self-hosted high-powered AI machines — scattered across the globe — unite to tackle demanding workloads in real time. Distributed intelligence with on-demand access to powerful models and a seamless matchmaking system.",
    period: "Feb 2025 – May 2025",
    status: "Archived",
    association: "Epilogue",
  },
  {
    name: "Liteworker",
    description:
      "A discovery platform that aggregates and curates AI tools, helping users explore new capabilities and stay current with emerging technologies.",
    period: "2023 – 2025",
    status: "No Longer Maintained",
    association: "Epilogue",
  },
];

export interface ExperienceRole {
  title: string;
  company: string;
  period: string;
  location?: string;
  highlights: string[];
  url?: string;
}

export const experience: ExperienceRole[] = [
  {
    title: "Staff Product Manager, Vincent Enterprise",
    company: "Clio",
    period: "Aug 2026 – Present",
    highlights: [
      "Working on AI research and matter management for enterprise law firms.",
    ],
  },
  {
    title: "Principal Product Manager, Ecosystem AI",
    company: "Caseware",
    period: "Nov 2025 – Jul 2026",
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
    period: "Jun 2025 – Nov 2025",
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
    period: "Feb 2025 – Present",
    highlights: [],
  },
  {
    title: "Senior Product Manager, New Ventures",
    company: "FacilityOS (formerly iLobby)",
    period: "Apr 2024 – May 2025",
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
    period: "Jan 2024 – Present",
    highlights: [],
  },
  {
    title: "Advisor (Exited via Acquisition)",
    company: "SalesBop",
    period: "Jan 2024 – Feb 2025",
    highlights: [
      "Advised SalesBop on AI product strategy and scaling initiatives leading up to acquisition.",
      "SalesBop was acquired by FliteHouse.com in 2025.",
    ],
  },
  {
    title: "Director of Product Management, Experience Platform & Artificial Intelligence",
    company: "Firework",
    period: "Feb 2022 – Sep 2023",
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
    period: "Aug 2021 – Jan 2022",
    location: "Toronto / San Francisco",
    highlights: [
      "Scaled content initiatives, growing DAUs 500x; expanded Fortune 500 partnerships.",
      "Pioneered live-shopping experience, boosting conversions 21% and setting the industry standard.",
    ],
  },
  {
    title: "Senior Product Manager, Web Player & Business Portal",
    company: "Firework",
    period: "Feb 2021 – Jul 2021",
    location: "Toronto / San Francisco",
    highlights: [
      "Transitioned platform to self-serve SaaS, growing ARR 10x and enhancing customer acquisition.",
      "Implemented AI playlist optimization, reducing churn 11.4%, enhancing accessibility by 275%.",
    ],
  },
  {
    title: "Senior Product Manager, Platform & Machine Learning",
    company: "VerticalScope Inc.",
    period: "Dec 2019 – Feb 2021",
    location: "Toronto, Ontario, Canada",
    highlights: [
      "Transformed platform from ad-based to SaaS, unifying 1500+ sites; achieved 17% MoM growth.",
      "Launched ML-driven recommendation engine, increasing user engagement by 50% CTR.",
    ],
  },
  {
    title: "Founder & CEO [Rebranded]",
    company: "Epilogue Labs",
    period: "Nov 2018 – Jan 2020",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Product Manager, Web & Artificial Intelligence",
    company: "GryphTech",
    period: "Sep 2018 – Nov 2019",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Business Mentor & Fractional Product Manager",
    company: "ShossX",
    period: "Dec 2017 – Sep 2018",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Product Manager & Senior Web Developer",
    company: "Classlete",
    period: "Oct 2013 – Sep 2014",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Product Manager & Producer, Web",
    company: "Rogers Communications",
    period: "May 2013 – Sep 2017",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Founder & Digital Marketer",
    company: "Form Follows Function",
    period: "Jan 2013 – Dec 2017",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Web Developer",
    company: "SOTI",
    period: "Jan 2013 – May 2013",
    location: "Mississauga, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Web Developer",
    company: "RBC Capital Markets",
    period: "Apr 2012 – Aug 2012",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Senior Web Developer & Scrum Master",
    company: "Shoplogix — A Constellation Software Inc. Company",
    period: "Jan 2011 – Apr 2012",
    location: "Mississauga, Ontario, Canada",
    highlights: [],
  },
  {
    title: "Software Developer - iOS, Android and PSPOS",
    company: "MHMD",
    period: "Jan 2006 – Aug 2010",
    location: "Toronto, Ontario, Canada",
    highlights: [],
  },
];

export interface Patent {
  title: string;
  number: string;
  filed: string;
  status: "Granted" | "Published";
  granted?: string;
  url?: string;
}

// All filed with Loop Now Technologies, Inc. (Firework). Dates are filing
// dates, not priority dates. Numbers ending in B2 are granted; A1 are
// pre-grant publications.
export const patents: Patent[] = [
  {
    title: "Livestream with large language model assist",
    number: "US20240422399A1",
    filed: "Aug 30, 2024",
    status: "Published",
    url: "https://patents.google.com/patent/US20240422399A1",
  },
  {
    title: "Immediate livestreams in a short-form video ecommerce environment",
    number: "US20240289841A1",
    filed: "May 3, 2024",
    status: "Published",
    url: "https://patents.google.com/patent/US20240289841A1",
  },
  {
    title: "Connected television livestream-to-mobile device handoff in an ecommerce environment",
    number: "US20240236434A1",
    filed: "Jan 5, 2024",
    status: "Published",
    url: "https://patents.google.com/patent/US20240236434A1",
  },
  {
    title: "Multi-hosted livestream in an open web ecommerce environment",
    number: "US12393975B2",
    filed: "Nov 2, 2023",
    status: "Granted",
    granted: "Aug 19, 2025",
    url: "https://patents.google.com/patent/US12393975B2",
  },
  {
    title: "Dynamic population of contextually relevant videos in an ecommerce environment",
    number: "US20240119486A1",
    filed: "Oct 9, 2023",
    status: "Published",
    url: "https://patents.google.com/patent/US20240119486A1",
  },
  {
    title: "Object highlighting in an ecommerce short-form video",
    number: "US20240119509A1",
    filed: "Oct 4, 2023",
    status: "Published",
    url: "https://patents.google.com/patent/US20240119509A1",
  },
  {
    title: "Manipulating video livestream background images",
    number: "US12184947B2",
    filed: "Jun 9, 2023",
    status: "Granted",
    granted: "Dec 31, 2024",
    url: "https://patents.google.com/patent/US12184947B2",
  },
  {
    title: "Short-form video usage within a frame widget environment",
    number: "US20230377029A1",
    filed: "May 19, 2023",
    status: "Published",
    url: "https://patents.google.com/patent/US20230377029A1",
  },
  {
    title: "Tokenizing a manipulated short-form video",
    number: "US20230343368A1",
    filed: "Apr 14, 2023",
    status: "Published",
    url: "https://patents.google.com/patent/US20230343368A1",
  },
];

export interface VolunteerRole {
  title: string;
  organization: string;
  period: string;
  description: string;
  category: "mentoring" | "community" | "advisory" | "governance";
  url?: string;
}

export const volunteering: VolunteerRole[] = [
  {
    title: "Expert-in-Residence — Artificial Intelligence & Product Management",
    organization: "DMZ",
    period: "Jan 2025 – Present",
    description:
      "Providing AI product strategy guidance to high-growth startups at one of Canada's top incubators. Advised 10+ startups on AI strategy, product-market fit, and scaling operations, and hosted speaking engagements for 50+ entrepreneurs, students, and industry professionals.",
    category: "mentoring",
  },
  {
    title: "Board Member",
    organization: "Milton Community Resource Centre (MCRC)",
    period: "Nov 2024 – Present",
    description:
      "Board member of a not-for-profit, multi-service and multi-site community organization focused on children and families.",
    category: "governance",
  },
  {
    title: "Lead Mentor — Artificial Intelligence & Product Management",
    organization: "The Forge McMaster",
    period: "Apr 2025 – Present",
    description:
      "Mentoring early-stage founders at McMaster University's business incubator in Hamilton, ON on AI productization, business model optimization, GTM execution, and fundraising strategy.",
    category: "mentoring",
  },
  {
    title: "Advisor — Various Startups",
    organization: "Independent",
    period: "Jul 2018 – Present",
    description:
      "Specializing in AI, Product Management, Community Building, and startup strategy.",
    category: "advisory",
  },
  {
    title: "Mentor — AI & Product Management",
    organization: "Platform Calgary",
    period: "Mar 2024 – Dec 2025",
    description:
      "Mentoring founders and startups on AI adoption, product strategy, and execution.",
    category: "mentoring",
  },
  {
    title: "Independent Subject Matter Expert",
    organization: "Tegus",
    period: "Jan 2023 – Present",
    description:
      "Advising CEOs, investors, and senior leaders on AI, SaaS, and video commerce.",
    category: "advisory",
  },
  {
    title: "Independent Subject Matter Expert",
    organization: "GLG",
    period: "Jan 2023 – Present",
    description:
      "Advising CEOs, investors, and senior leaders on AI, SaaS, and video commerce.",
    category: "advisory",
  },
  {
    title: "Member",
    organization: "Angel One Investor Network",
    period: "Oct 2023 – Mar 2025",
    description:
      "Empowering Canadian startups by linking founders with funders.",
    category: "advisory",
  },
  {
    title: "Consultant — AI Compute",
    organization: "Government of Canada",
    period: "Jun 2024 – Sep 2024",
    description:
      "Contributed to the Canadian AI Sovereign Compute Strategy to guide Canada's efforts to develop AI infrastructure.",
    category: "advisory",
  },
  {
    title: "Organizer",
    organization: "ProductTank Toronto",
    period: "Mar 2024 – Jun 2025",
    description:
      "Led and scaled Toronto's largest product leadership community.",
    category: "community",
  },
  {
    title: "Mentor",
    organization: "Treefrog Accelerator",
    period: "May 2024 – Jun 2024",
    description:
      "Mentoring startups on scaling through product and AI strategy.",
    category: "mentoring",
  },
  {
    title: "Donor",
    organization: "Folding@home",
    period: "Apr 2020 – Present",
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
