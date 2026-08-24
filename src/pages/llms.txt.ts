import type { APIRoute } from "astro";
import {
  site,
  hero,
  yearsExperience,
  skills,
  companies,
  experience,
  projects,
  volunteering,
  patentCount,
  grantedPatentCount,
  education,
  certifications,
} from "../data/content";

// Fully generated from src/data/content.ts — every section derives from the
// data, so this file needs no edits when content changes. The four sections
// that used to be hand-kept prose here (Current Roles, Companies, Notable
// Projects, Volunteering) had already drifted from the data they described.
const list = (lines: string[]) => lines.map((line) => `- ${line}`).join("\n");
export const prerender = true;

export const GET: APIRoute = () => {
  const current = experience.filter((role) => !role.end);
  const activeProjects = projects.filter((p) => p.status.startsWith("Active"));

  const body = `# ${site.name} — ${site.title}

## About
Mike Shoss is a founder, product executive, and builder of AI-native systems based in ${site.location}. He has ${yearsExperience}+ years of experience in product and software, ${patentCount} patents in AI and video commerce, and has supported over $150M in fundraising outcomes.

## Current Roles
${list([
  ...current.map((role) => `${role.title} at ${role.company} (${role.period})`),
  ...companies.map((company) => `${company.role} at ${company.name} (${company.period})`),
])}

## Structured data
This site publishes its content as JSON and over MCP.
- JSON API index: ${site.url}/api/index.json
- Full resume: ${site.url}/api/resume.json
- JSON Resume (jsonresume.org schema): ${site.url}/api/jsonresume.json
- MCP server: ${site.url}/mcp

## Companies
${companies
  .map((company) => {
    const products = company.products?.length
      ? `\nProducts:\n${list(
          company.products.map((p) => `${p.name}: ${p.tagline} (${p.status})`),
        )}`
      : "";
    return `### ${company.name}\n${company.role} — ${company.period}\n${company.description}${products}`;
  })
  .join("\n\n")}

## Expertise
${skills.map((s) => `- ${s}`).join("\n")}

## Notable Projects
${list(activeProjects.map((p) => `${p.name}: ${p.description}`))}

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
${list(
  volunteering
    .filter((role) => !role.end)
    .map((role) => `${role.title} at ${role.organization} (${role.period})`),
)}

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
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
