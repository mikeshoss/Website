import {
  awards,
  certifications,
  education,
  experience,
  hero,
  interests,
  languages,
  patents,
  projects,
  publications,
  recommendations,
  site,
  skills,
  volunteering,
} from "../data/content";

/**
 * Maps the site's content onto the JSON Resume schema (jsonresume.org, v1.0.0)
 * so the data works with the existing ecosystem of resume themes, validators,
 * and importers.
 *
 * This is a projection, not a second source of truth — everything here is
 * derived from src/data/content.ts. The schema's date fields accept "YYYY",
 * "YYYY-MM", or "YYYY-MM-DD", which is exactly what content authors write.
 */

const COUNTRY_CODES: Record<string, string> = {
  Canada: "CA",
  "United States": "US",
};

function location() {
  const [city, region, country] = site.location.split(",").map((s) => s.trim());
  return {
    city,
    region,
    countryCode: COUNTRY_CODES[country] ?? country,
  };
}

/** Omits `endDate` for ongoing entries, which the schema reads as "current". */
function dates(entry: { start: string; end?: string }) {
  return entry.end
    ? { startDate: entry.start, endDate: entry.end }
    : { startDate: entry.start };
}

export function buildJsonResume() {
  return {
    $schema:
      "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",

    basics: {
      name: site.name,
      label: site.title,
      email: site.email,
      url: site.url,
      summary: hero.subheadline,
      location: location(),
      profiles: [
        { network: "LinkedIn", username: "mikeshoss", url: site.linkedin },
        { network: "GitHub", username: "mikeshoss", url: site.github },
      ],
    },

    work: experience.map((role) => ({
      name: role.company,
      position: role.title,
      location: role.location,
      url: role.url,
      ...dates(role),
      highlights: role.highlights,
    })),

    volunteer: volunteering.map((role) => ({
      organization: role.organization,
      position: role.title,
      url: role.url,
      ...dates(role),
      summary: role.description,
    })),

    // The schema's date fields are optional, which matters here: these entries
    // carry a hand-written `period` at best ("2018") and one has no date at
    // all, so emitting startDate/endDate would mean inventing them.
    education: education.map((entry) => ({
      institution: entry.institution,
      studyType: entry.credential,
      area: entry.detail,
    })),

    // Patents are the bulk of the credential story here, so they are surfaced
    // as awards alongside any explicit awards.
    awards: [
      ...patents.map((patent) => ({
        title: patent.title,
        date: patent.filed,
        awarder: "United States Patent and Trademark Office",
        summary:
          patent.status === "Granted"
            ? `Patent ${patent.number}, granted ${patent.grantedLabel}`
            : `Patent application ${patent.number}`,
      })),
      ...awards.map((award) => ({
        title: award.title,
        date: award.date,
        awarder: award.awarder,
        summary: award.summary,
      })),
    ],

    certificates: certifications.map((cert) => ({
      name: cert.name,
      issuer: cert.issuer,
    })),

    publications: publications.map((pub) => ({
      name: pub.title,
      publisher: pub.publisher,
      releaseDate: pub.date,
      url: pub.url,
      summary: pub.summary,
    })),

    skills: skills.map((name) => ({ name })),

    languages: languages.map((entry) => ({
      language: entry.language,
      fluency: entry.fluency,
    })),

    interests: interests.map((entry) => ({
      name: entry.name,
      keywords: entry.keywords,
    })),

    references: recommendations.map((rec) => ({
      name: rec.name,
      reference: rec.text,
    })),

    projects: projects.map((project) => ({
      name: project.name,
      description: project.description,
      ...dates(project),
      url: project.url,
      entity: project.association,
    })),
  };
}
