# Variation Lab website

A SvelteKit website built with Svelte 5, TypeScript, and Tailwind CSS 4.

## Setup and validation

Use `pnpm` for package-manager commands:

```sh
pnpm install
pnpm check
pnpm exec vitest run
pnpm build
```

The build produces a static site in `build/`. To deploy it to GitHub Pages, run `pnpm run gh:deploy`.

For local development, run `pnpm dev` yourself. Coding agents must not start development or preview servers unless explicitly requested. Tests run in Node; do not add browser tests.

## Project structure

| Location                        | Purpose                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/routes/`                   | Pages and layouts; `/people`, `/publications`, `/courses`, and `/contact` use real paths. |
| `src/routes/layout.css`         | Shared colors, typography roles, and global styles.                                       |
| `src/lib/components/`           | Shared UI, including publication entries and lists.                                       |
| `src/lib/components/ui/`        | Generated shadcn-svelte components.                                                       |
| `src/lib/data/Site.json`        | Branding and shared site copy.                                                            |
| `static/data/People.json`       | Member and alumni records.                                                                |
| `static/data/Publications.json` | Publication records.                                                                      |
| `static/images/`                | Logos, member headshots, and publication teasers.                                         |
| `src/tests/`                    | Node unit and data-integrity tests.                                                       |

See [AGENTS.md](AGENTS.md) for implementation and design conventions.

## Editing site content

- Set each person's display title with `currentRole` in `static/data/People.json`. It applies to current members and alumni. If omitted, the title uses a general label from `currentAcademicStatus`, without assuming a department or matching a name. Alumni `formerRole` may be any nonempty title.
- Edit branding, logos, introductory copy, and the people tagline in `src/lib/data/Site.json`. This configuration is imported at build time; rebuild to publish changes.
- Edit the home page Research Themes in `researchThemes` in `src/routes/+page.svelte`; each theme has a `title` and a `description`.
- Set brand colors in the `:root` variables in `src/routes/layout.css`.
- Add or edit papers in `static/data/Publications.json`; see [Publications](#publications).

The footer copyright year uses the visitor's current year, even when the page is prerendered or cached.

## People

### Member images

Place member headshots in `static/images/members/`. Use `.jpg`, `.jpeg`, `.png`, or `.webp` files with a 1:1 aspect ratio and dimensions up to and including **650 × 650 pixels**.

In `static/data/People.json`, enter the full image path **including its actual file extension**, for example `"headshot": "/images/members/example.webp"`. Match the filename's spelling and case. Omit `headshot` if no image is available. Every file in the member image folder must be referenced by a member record.

`src/lib/components/Image.svelte` renders the supplied `src` unchanged and accepts standard image attributes, including `alt`, `class`, `width`, `height`, and `loading`. Member image constraints are enforced by the integrity tests, independently of this reusable component.

## Publications

All papers live in `static/data/Publications.json`, one object per paper. The Publications page groups them by year, and the home page shows the ones marked `isSelected`. Both pages render entries with the same components (`src/lib/components/projects/publicationList.svelte` → `publicationEntry.svelte`), so an entry looks the same everywhere.

### Adding a paper

1. Copy an existing entry of the same kind (a CHI paper, a journal article, an arXiv preprint, and so on) and edit it. Array order does not matter; papers are sorted by `publishDate`.
2. Check the title, author list, and venue against the official record (ACM Digital Library, DBLP, arXiv, or the publisher's page).
3. Add the links you have, and a teaser if the paper has a figure worth showing.
4. Run `pnpm exec vitest run` and `pnpm check`. The data-integrity tests catch missing fields, unknown fields, bad dates, malformed DOIs, and teaser files that are missing or unused.

Example:

```json
{
	"title": "ChainForge: A Visual Toolkit for Prompt Engineering and LLM Hypothesis Testing",
	"authors": [
		{ "firstName": "Ian", "lastName": "Arawjo", "publicationName": "Ian Arawjo" },
		{
			"firstName": "Elena",
			"middleName": "L.",
			"lastName": "Glassman",
			"publicationName": "Elena L. Glassman"
		}
	],
	"venue": {
		"fullName": "ACM CHI Conference on Human Factors in Computing Systems",
		"shortName": "CHI",
		"venueType": "conference"
	},
	"year": 2024,
	"publishDate": "2024-05-11",
	"doi": "10.1145/3613904.3642016",
	"award": "honorable-mention",
	"paperLink": "https://glassmanlab.seas.harvard.edu/papers/chainforge.pdf",
	"exploreLink": "https://chainforge.ai/",
	"codeLink": "https://github.com/ianarawjo/ChainForge",
	"teaser": "/images/teaser/chainforge-chi24.webp"
}
```

### Fields

Only the fields below are allowed; the tests reject any other key.

| Field              | Required | What it holds                                                                                                                                                           |
| ------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`            | yes      | The official title, with the paper's own capitalization.                                                                                                                |
| `authors`          | yes      | Authors in byline order (see [Authors](#authors)).                                                                                                                      |
| `venue`            | yes      | `fullName`, `shortName`, and `venueType` (see [Venues](#venues)).                                                                                                       |
| `year`             | yes      | Publication year, shown in the venue line and used for the year groups.                                                                                                 |
| `publishDate`      | yes      | `YYYY-MM-DD`. Use the first day of the conference, the journal's publication date, or the arXiv v1 date. Controls sort order and author highlighting.                   |
| `doi`              | yes      | Bare DOI such as `"10.1145/3613904.3642016"`, without `https://doi.org/`. Use `""` for preprints and venues without DOIs. arXiv's own `10.48550/...` DOIs do not count. |
| `paperLink`        | no       | Open-access copy of the paper: the lab-hosted PDF, an author's site, arXiv, or OSF. Never the publisher page; that is what `doi` is for.                                |
| `exploreLink`      | no       | Project website or live demo.                                                                                                                                           |
| `codeLink`         | no       | The authors' official repository.                                                                                                                                       |
| `videoLink`        | no       | Talk or video figure.                                                                                                                                                   |
| `presentationLink` | no       | Recorded presentation page.                                                                                                                                             |
| `slidesLink`       | no       | Slides.                                                                                                                                                                 |
| `materialLink`     | no       | Anything else: course or workshop site, appendix, dataset.                                                                                                              |
| `award`            | no       | `best-paper`, `honorable-mention`, or `other` (see [Awards](#awards)).                                                                                                  |
| `awardText`        | no       | The award name, only when `award` is `other`.                                                                                                                           |
| `awardLink`        | no       | Page announcing the award; makes the award label a link.                                                                                                                |
| `affiliation`      | no       | Note shown after the venue, for example `"Work done at Microsoft Research"`.                                                                                            |
| `isSelected`       | no       | `true` to feature the paper in Selected Publications on the home page (newest first).                                                                                   |
| `teaser`           | no       | Teaser image or video path (see [Teasers](#teasers)).                                                                                                                   |

### Authors

Each author has `firstName`, optional `middleName`, `lastName`, and `publicationName`, which is the name exactly as it should appear on the site. Use the spelling printed on the paper, including accents (Björn, Buçinca).

For lab members, `publicationName` must match their `publicationName` in `static/data/People.json` exactly (for example `"Elena L. Glassman"`, not `"Elena Glassman"`). A member is shown in bold, linked to their homepage, only when the name matches and `publishDate` falls within their `startTime`–`endTime` window.

Shared authorship uses `equalContribution: 'co-first' | 'co-last'` on each participating author. At least two authors must share each value. The site renders an asterisk after their names and explains it beneath the Publications heading.

### Venues

The venue line under each paper is built from `venue` and `year`: the full name, then the abbreviation and year in brackets. `venueType: "conference"` adds "Proc.":

| Kind of paper                            | `fullName`                                                                           | `shortName`     | `venueType`  | Shown as                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------ | --------------- | ------------ | ----------------------------------------------------------------------- |
| Full paper in the proceedings            | `ACM CHI Conference on Human Factors in Computing Systems`                           | `CHI`           | `conference` | ACM CHI Conference on … (Proc. CHI 2026)                                |
| Late-breaking work (published in CHI EA) | `Extended Abstracts of the ACM CHI Conference on Human Factors in Computing Systems` | `CHI EA`        | `conference` | Extended Abstracts of the ACM CHI Conference on … (Proc. CHI EA 2024)   |
| Workshop proposal or course in CHI EA    | `Extended Abstracts of the ACM CHI Conference on Human Factors in Computing Systems` | `CHI EA`        | `conference` | Extended Abstracts of the ACM CHI Conference on … (Proc. CHI EA 2026)   |
| Poster or demo in adjunct proceedings    | `Adjunct Proceedings of the ACM Symposium on User Interface Software and Technology` | `UIST Adjunct`  | `conference` | Adjunct Proceedings of the ACM Symposium on … (Proc. UIST Adjunct 2023) |
| Workshop paper                           | `Meaning in Context Workshop at NeurIPS`                                             | `MiC @ NeurIPS` | `workshop`   | Meaning in Context Workshop at NeurIPS (MiC @ NeurIPS 2021)             |
| Journal article                          | `ACM Transactions on Computer-Human Interaction`                                     | `TOCHI`         | `journal`    | ACM Transactions on Computer-Human Interaction (TOCHI 2024)             |
| Preprint                                 | `arXiv`                                                                              | `arXiv`         | `arxiv`      | arXiv 2026                                                              |

Rules of thumb:

- `fullName` is the official series name without a year or edition number ("ACM Symposium on User Interface Software and Technology", not "Proceedings of the 38th Annual…"). Copy it from an existing paper at the same venue so all papers there match.
- Use `conference` for any paper in published conference proceedings: the main proceedings, CHI Extended Abstracts (late-breaking work, workshop proposals, courses, meetups), adjunct proceedings (posters, demos, doctoral symposium), companion proceedings, and Findings of ACL. The full name says which kind it is. Workshop papers, journals, preprints, and non-archival symposia without proceedings (such as Computation + Journalism) use their own type and don't get "Proc.". The DOI's record on doi.org or Crossref names the proceedings a paper is in.
- When `fullName` and `shortName` are the same (arXiv, SSRN), only the short form and year are shown.
- The other allowed `venueType` values are `pending`, `competition`, and `research` (technical reports).

### Awards

Set `award` to `best-paper` or `honorable-mention`; the site labels them "Best Paper Award" and "Honorable Mention Award" with a trophy icon. Don't add `awardText` for these. For any other award, set `award` to `other` and put the name in `awardText`, for example `"Best Demo Award"`. Confirm an award against the venue's official awards list before adding it, and link that list with `awardLink` if there is one.

### Teasers

A teaser is a figure from the paper, usually Figure 1, shown to the right of the entry text. Teasers are hidden on phones, where the list is text only. Clicking a teaser opens the paper's first link (DOI, then Paper, and so on) in a new tab.

**File and path:**

- Put the file in `static/images/teaser/` and set `"teaser": "/images/teaser/<file>"`, including the extension.
- Name it after the system or first title words plus venue and two-digit year, in lowercase kebab-case: `chainforge-chi24.webp`, `overcode-tochi15.webp`.
- Supported formats: `.webp` (preferred), `.jpg`, `.jpeg`, `.png`, `.gif`, or a short silent `.mp4` / `.webm`. Videos play muted on a loop while on screen and show controls instead for visitors who prefer reduced motion.
- Every file in the folder must be used by a paper, and every `teaser` path must exist; the tests check both. Delete an image when you remove its paper.

**How it displays:** teasers sit in a 16:9 frame and are never cropped. The image fills the frame's height, or its width if it is wider than 16:9, and is centered on white. Any aspect ratio works, but very tall figures appear small, so crop tightly around the figure.

**Making one from the paper PDF:**

1. Crop the figure itself: no caption, paper title, or body text. Keep a little white margin around it.
2. Export at most 1600 px wide, as WebP at about quality 85. Files are usually 20–180 KB.

With [Poppler](https://poppler.freedesktop.org/) and [ImageMagick](https://imagemagick.org/) installed, for example:

```sh
# render page 1 at 300 dpi to page-1.png
pdftoppm -r 300 -f 1 -l 1 -png paper.pdf page
# crop WIDTHxHEIGHT+LEFT+TOP (in pixels of page-1.png), trim, pad, resize, and save as WebP
magick page-1.png -crop 2200x1100+150+300 +repage -fuzz 3% -trim +repage \
  -bordercolor white -border 12 -resize '1600x1600>' -quality 85 \
  static/images/teaser/example-chi26.webp
```

Leave `teaser` out if the paper has no suitable figure or no public version.
