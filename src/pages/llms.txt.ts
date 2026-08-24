import type { APIRoute } from "astro";
import {
  site,
  hero,
  yearsExperience,
  skills,
  patentCount,
  grantedPatentCount,
  education,
  certifications,
} from "../data/content";

// Partly generated from src/data/content.ts. These sections derive from the data
// and stay in sync automatically: About (location, years, patent count),
// Expertise, Patents, Education, Certifications, Contact, Philosophy.
//
// These are prose maintained by hand in THIS file and will not follow
// content.ts: Current Roles, Companies, Notable Projects, Volunteering.
// Update them here when the corresponding data changes.
export const GET: APIRoute = () => {
  const body = `# Mike Shoss — Personal Website

## About
Mike Shoss is a founder, product executive, and builder of AI-native systems based in ${site.location}. He has ${yearsExperience}+ years of experience in product and software, ${patentCount} patents in AI and video commerce, and has supported over $150M in fundraising outcomes.

## Current Roles
- Staff Product Manager, Vincent Enterprise at Clio
- Founder & Principal at Epilogue (AI Consulting & Product Studio)
- Angel Investor at ShossX
- Founder at Milton Innovation

## Companies

### Epilogue
AI company focused on turning complex business problems into practical, high-impact AI solutions. Operates across two arms — Consulting (AI strategy and roadmaps, AI-native product and platform design, pricing and go-to-market) and Product Studio (building and validating AI-native products end to end). Products include:
- Parleh: AI meeting companion that turns notes into live action and agent-triggered execution
- Fractal: AI-agent-driven product-truth platform (Closed Beta)
- TrustFlow: AI-powered administrative workflow automation (Invite Only)

### ShossX
Angel investing in early-stage Canadian science and technology companies, with a focus on AI. Active through syndicates, angel networks, and funds: CedarPeak, Angel One, Sand Hill Angels, and N49P.

### Milton Innovation
A community hub where tech enthusiasts, innovators, and creators converge to share ideas, learn, and network.

## Expertise
${skills.map((s) => `- ${s}`).join("\n")}

## Notable Projects
- Ultron: Autonomous AI agent team (AI Chief of Staff)
- MilTastic: Decentralized community mesh network
- Self-Hosted AI & Infrastructure Lab
- ChatPTT: Radio-to-AI voice system
- Project Cria: Distributed AI compute platform

## Patents
${patentCount} patents in AI, video commerce, and livestream technology (${grantedPatentCount} granted), filed through Loop Now Technologies (Firework)

## Education
${education
  .map(
    (e) =>
      `- ${e.institution} — ${e.credential}${e.detail ? ` (${e.detail})` : ""}${e.period ? `, ${e.period}` : ""}`,
  )
  .join("\n")}

## Certifications
${certifications.map((c) => `- ${c.name}`).join("\n")}

## Volunteering & Mentoring
- Expert-in-Residence at DMZ
- Board Member at Milton Community Resource Centre
- Lead Mentor at The Forge McMaster
- Mentor at Platform Calgary
- Organizer at ProductTank Toronto
- Consultant to the Government of Canada on AI Compute Strategy

## Contact
- Website: ${site.url}
- LinkedIn: ${site.linkedin}
- GitHub: ${site.github}
- Epilogue: https://epiloguelabs.com
- Email: ${site.email}

## Philosophy
${hero.philosophy.map((p) => `- ${p}`).join("\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
