# Agent instructions

See [README.md](README.md) for setup and content-editing guidance.

## Project structure

- This is a SvelteKit app using Svelte 5 runes and Tailwind CSS 4.
- Top-level pages are real paths: `/people`, `/publications`, `/courses`, and `/contact`. Do not use hash routes.
- Keep each page's UI in a lower camelCase component such as `peoplePage.svelte`, imported by that folder's `+page.svelte`.
- Use PascalCase for classes, modules, and components and camelCase for variables/functions. Page UI filenames are the lower camelCase exception described above.

## Development and validation

- Use `pnpm` for package-manager execution such as checks, tests, and builds.
- Do NOT write browser tests: no Vitest browser mode, Playwright, `vitest-browser-svelte`, or `*.svelte.test.ts`/`*.svelte.spec.ts` files. Keep tests as Node-environment unit and data-integrity tests (for example under `src/tests/`), and test logic through plain TypeScript helpers instead of rendering components.
- Do not start local dev or preview servers for this project, including `pnpm run dev`, `pnpm dev`, `pnpm run preview`, or Vite server commands. The user will run the server when needed; only start one if the user explicitly asks for it.

## Visual design and typography

- Strict design requirement: keep global/page backgrounds plain white; avoid global background colors, gradients, and tinted page washes.
- Typography must follow a clear view hierarchy using the shared role classes in `layout.css`, largest to smallest: `pageTitle` (page heading), `sectionTitle` (section heading inside a page), `personTitle` (profile page name), `itemTitle` (every item or person name, including publication titles), `detailTitle`/`yearLabel` (group headings such as alumni groups and publication years), `bodyText` (prose and item descriptions, including publication authors, venues, awards, and link buttons), and `metaText` (secondary details such as roles and contact details, plus the People page's member details: status as semibold, interests and short bio, matching the alumni Prev/Now lines) with `smallLink` for compact text links. Equivalent parts on different pages use the same role; do not add one-off font sizes unless a component has a specific local need.
- Never render text in all capital letters. Do not use `text-transform: uppercase`, Tailwind `uppercase`, `small-caps`, or uppercase-typed copy for labels, headings, buttons, navigation, or the brand wordmark; use sentence or title case, and drop the wide letter-spacing that only suits caps. Acronyms and proper names (PhD, HCI, CHI, GitHub) keep their normal spelling.
- Font sizes and line heights come only from the `--text-*` and `--leading-*` scale in `@theme` (`src/routes/layout.css`); the default text size is 16px (`--text-base: 1rem`, also applied to `body`), and publication text is 15px (`--text-md`) by wrapping publication entries and the publication list in `publicationText`, which swaps the base size so the usual role classes still apply; typography classes reference those tokens instead of raw `rem` values, and responsive size changes use `@variant sm { ... }`.

## Publications

- Publications use only the standard fields on the `Publication` type (enforced by the data-integrity test): no custom-named links or ad hoc fields. There is one Paper link, `paperLink` (preferably the open-access PDF); the publisher page belongs in `doi`, not a second paper link. Map each link to a standard field (`paperLink`, `exploreLink`, `codeLink`, `videoLink`, `presentationLink`, `materialLink`, `slidesLink`); supplemental links without a dedicated field (course or workshop sites, appendices, datasets) go in `materialLink`.
- `venueType` uses only the standard categories, and `conference` means a paper in published conference proceedings, including CHI Extended Abstracts, adjunct, companion, and Findings volumes. The venue line comes from `getVenueLabel`: the official series `fullName` (no year) followed by the abbreviation and year in brackets, with "Proc." for proceedings papers ("ACM CHI Conference on Human Factors in Computing Systems (Proc. CHI 2026)", "(Proc. CHI EA 2024)"); extended abstracts, late-breaking work, courses, and workshop proposals in CHI EA use `shortName: "CHI EA"` and `venueType: "conference"`, workshops use `"<Workshop> @ <Conference>"`, and preprint servers whose full name is the abbreviation show only "arXiv 2026".
- Shared authorship goes on the author entry as `equalContribution: 'co-first' | 'co-last'` (at least two authors per value), rendered as an asterisk after the name.
- Awards come from `award` (`Best Paper Award`, `Honorable Mention Award`); `awardText` is only for `award: 'other'`.
- Publication `teaser` is an optional `/images/teaser/` path; its extension selects image/GIF (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`) or muted looping video (`.mp4`, `.webm`) rendering via `publicationTeaser.svelte`, shown uncropped in a 16:9 frame to the right of the entry text from `sm` up and hidden on phones.
- Every publication list (home page Selected Publications and each Publications year) renders through the shared `publicationList.svelte` → `publicationEntry.svelte`; do not build page-specific publication markup.

## People

- Member records use `startTime` and optional `endTime` date windows (`YYYY-MM-DD`) for lab-time-aware publication highlighting.
- People contact controls use shadcn-svelte `Button`/`DropdownMenu`: email, website globe, and Google Scholar are direct buttons; only GitHub/LinkedIn/Twitter/Bluesky social links go in the dropdown.

## Components and interactions

- Keep generated shadcn components in `src/lib/components/ui/` close to default; prefer call-site styling/config over editing generated primitives.
- Every button, including text-style buttons such as "View all…" links, paper links (PDF, Code), and the publication year nav, uses the shadcn-svelte `Button` (`href` renders a link); do not add native `<button>` elements or button-styled `<a>` tags. Use `variant="link"` for text buttons and override size at the call site (for example `h-auto border-0 p-0` for inline text). Button content must be vertically centered in every style: always wrap a Button's text label in a `<span>` (for example `<Icon /> <span>{label}</span>`), because `layout.css` trims `[data-slot='button'] > span` to the cap height so label text lines up with icons; bare text in a Button sits about 1px high.
- Text buttons and text links underline on hover and keyboard focus. shadcn `variant="link"` provides this; plain content links (names, alumni) use the `link-underline` utility, or `link-underline-base` with `group-hover:decoration-current` for text inside a group link. Crimson text (brand text buttons such as "View all…" and the header brand) keeps its color on hover and only gains the underline; do not darken or recolor it. Header/footer navigation keeps `.navLink`. Do not prefix custom utilities with `text-`, because tailwind-merge in `Button` treats them as text colors and drops them.
- Use Simple Icons for social/company logos when available; keep non-navigation links opening in a new tab and site navigation in the same tab.
