# Editing the site

You do not need a terminal, a local checkout, or Claude to change the text on
this site. You need a browser and about two minutes.

## The one thing to know first

**The `/api/*.json` files are output, not input.**

`mikeshoss.com/api/resume.json` and friends look like the place to edit content.
They are not. They are generated from the source on every build, so anything
typed into them is overwritten on the next deploy.

The real source is two TypeScript files:

| File | What is in it |
| --- | --- |
| `src/data/content.ts` | Everything except the glossary |
| `src/data/glossary.ts` | The glossary terms |

They are `.ts` rather than `.json` for one reason: JSON cannot hold comments, and
cannot compute anything. This site derives years of experience from a start date,
patent counts from the patent list, and every display date ("Nov 2023 – Present")
from machine-readable ISO dates. Editing a `.ts` file is no harder than JSON —
same quotes, same commas, same brackets — and you get a build that refuses to
ship a typo.

## Where each thing lives

All in `src/data/content.ts` unless noted:

| On the site | Edit this export |
| --- | --- |
| Headline (and its one emphasised word), the paragraph under it, the three "Now" cards, "What I actually do" | `hero` |
| The four big numbers on the home page | `highlights` |
| "Selected results" cards | `selectedResults` |
| Skill pills | `skills` |
| Ventures (`/companies/…`) | `companiesData` |
| Projects (`/projects`) | `projectsData` |
| Job history (`/experience`) | `experienceData` |
| Patents | `patentsData` |
| Volunteering & community | `volunteeringData` |
| Education, certifications | `education`, `certifications` |
| "Outside of work" | `interests` |
| Site name, email, location, the default meta description | `site` |
| Glossary terms | `glossary` in `src/data/glossary.ts` |

Empty and ready to fill if you ever want them: `awards`, `publications`,
`recommendations`, `languages`, `causes`, `organizations`.

## Editing from a browser

1. Open the file on GitHub — e.g.
   [`src/data/content.ts`](https://github.com/mikeshoss/Website/blob/main/src/data/content.ts)
2. Click the **pencil** icon (top right of the file).
3. Make the change.
4. Scroll down to **Commit changes**. Write a one-line description.
5. Choose **Create a new branch and start a pull request** if you want to see it
   first, or **Commit directly to the `main` branch** to publish immediately.
6. Click **Commit changes**.

Committing to `main` deploys to mikeshoss.com in about a minute. Committing to a
branch builds a preview URL instead, which Cloudflare posts on the pull request —
click that to check the change before merging.

> A faster route for bigger edits: open the repository on GitHub and press the
> **`.`** key. That opens the whole project in a VS Code editor in your browser,
> with no install.

## Rules that actually matter

The syntax is ordinary. Three things to respect:

**Text goes in double quotes.** Apostrophes inside are fine as-is — no escaping:

```ts
description: "Canada builds world-class startups and then outsources their scale.",
```

**Every entry ends with a comma.** Including the last one. A missing comma is the
single most common way to break the build.

**Brackets come in pairs.** `{` needs `}`, `[` needs `]`. The GitHub editor
highlights the matching one when you put the cursor next to it.

Curly quotes, em dashes and accents can be typed or pasted literally. The files
are UTF-8 and already contain plenty of both.

## If you get it wrong

**The live site stays up.** A broken file fails the build, and a failed build is
never deployed — Cloudflare keeps serving the previous version. You will see a red
✗ next to your commit on GitHub instead of a green ✓.

Click the ✗ to read what went wrong. It is usually a missing comma or bracket, and
the error names the line. Fix it with another commit, or revert yours from the
commit page.

There is no state to corrupt and no database to restore. Everything is rebuilt
from these files every time.

## Two common tasks

### Add a project

Copy an existing block in `projectsData` and change the fields. Only `name`,
`description`, `start` and `status` are required:

```ts
{
  name: "Thing I Built",
  description: "One or two sentences. This is what shows on the card.",
  start: "2026-09",              // YYYY-MM. Display date is derived from it.
  status: "Active",              // "Active" puts it in the top section
  url: "https://example.com",    // optional — adds a "Visit site" link
  repo: "https://github.com/…",  // optional — adds a "Source" link
},
```

Only add `repo` once the repository is **public**. A link to a private repo is a
404 for everyone but you.

### Add a glossary term

Copy an existing entry in `src/data/glossary.ts`. One object gets you a page at
`/glossary/<slug>`, a card on the index, structured data, a sitemap entry, a JSON
API entry and a line in `llms.txt` — nothing else to touch.

`question` is the page title, so write it the way somebody would type it into a
search box ("What is a harness in AI?"), not as a restatement of the term.

## What updates itself

Change a file, and all of this follows with no extra work:

- the page, and any card linking to it
- `/api/*.json` — every endpoint, including the whole-profile one
- `/api/jsonresume.json` — the JSON Resume export
- `/llms.txt`
- the sitemap
- the structured data in the page `<head>`
- the MCP server at `/mcp`
- the venture syndication feeds at `/api/companies/<slug>.json`

That last one is the two-site sync: a venture's own site reads its feed, so editing
`content.ts` here updates both. Add a product to Epilogue and it appears on this
site and on the Epilogue site, with no second edit.

## One thing to leave alone

`slug` values — on ventures and glossary terms — are the page's URL. Once a page
has been live and indexed, changing its slug costs that page its search ranking
and breaks any link to it. Treat them as permanent. Everything else is safe to
change freely.
