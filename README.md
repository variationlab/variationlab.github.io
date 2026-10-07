# sv

## Editing site content

- Set each person's display title with `currentRole` in `static/data/People.json`. It applies to current members and alumni. If omitted, the title uses a general label from `currentAcademicStatus`, without assuming a department or matching a name. Alumni `formerRole` may be any nonempty title.
- Edit branding, logos, introductory copy, and the people tagline in `src/lib/data/Site.json`. This configuration is imported at build time; rebuild to publish changes.
- Edit the home page Research Themes in `researchThemes` in `src/routes/+page.svelte`; each theme has a `title` and a `description`.
- Set brand colors in the `:root` variables in `src/routes/layout.css`.
- Publications are ordered by `publishDate`; JSON array order does not control recency. Set `"isSelected": true` on a publication to feature it in Selected Publications on the home page (all selected papers are shown, newest first). The footer copyright year fills in automatically with the visitor's current year, even if the page is prerendered or cached.

## Member images

Place member headshots in `static/images/members/`. Use `.jpg`, `.jpeg`, `.png`, or `.webp` files with a 1:1 aspect ratio and dimensions up to and including **650 × 650 pixels**.

In `static/data/People.json`, enter the full image path **including its actual file extension**, for example `"headshot": "/images/members/example.webp"`. Match the filename's spelling and case. Omit `headshot` if no image is available. Every file in the member image folder must be referenced by a member record.

`src/lib/components/Image.svelte` renders the supplied `src` unchanged and accepts standard image attributes, including `alt`, `class`, `width`, `height`, and `loading`. Member image constraints are enforced by the integrity tests, independently of this reusable component.

## Publication fields

Each entry in `static/data/Publications.json` requires `title`, `authors`, `venue` (`fullName`, `shortName`, `venueType`), `year`, `publishDate`, and `doi`. Set `doi` to the bare DOI of a published paper (for example `"10.1145/3613904.3642000"`, without `https://doi.org/`); it appears first as a "DOI" button. Leave it as `""` for unpublished work such as preprints. `venueType` is one of `conference`, `journal`, `workshop`, `arxiv`, `pending`, `competition`, `course`, `research`, or `other`. Optional fields:

- Links appear under the paper as icon link buttons, in this order and only when set: `doi` (DOI), `paperLink` (Paper, ideally the open-access PDF), `exploreLink` (Explore), `codeLink` (Code, with the GitHub mark for GitHub URLs), `videoLink` (Video), `presentationLink` (Presentation), `materialLink` (Materials), `slidesLink` (Slides). There are no custom-named links: put supplemental material such as a course or workshop website in `materialLink`, demos in `exploreLink`, and repositories in `codeLink`. A URL that repeats is shown once. Links must start with `http://`, `https://`, or `/`.
- `award` (`best-paper`, `honorable-mention`, or `other`) with `awardText` as the label, shown in crimson with a trophy above the link buttons; `awardLink` makes the label a link.
- `affiliation` appears after the venue, for example "Work done at Microsoft Research".
- `isSelected` features the paper on the home page.
- `teaser` is described below.

## Publication teasers

A publication can show an optional teaser beside its entry on the Publications page and in Recent Publications on the home page. Place the file in `static/images/publications/` and set the full path, **including its extension**, in `static/data/Publications.json`, for example `"teaser": "/images/publications/example.webp"`.

- Images: `.jpg`, `.jpeg`, `.png`, `.webp`, or `.gif` (animated GIFs play as-is).
- Short videos: `.mp4` or `.webm`. Videos play muted on a loop while on screen and show controls instead of autoplaying for visitors who prefer reduced motion. Keep them short and small; they have no audio.
- Teasers always display in a 16:9 frame, so use that aspect ratio for the best fit. The full width is always shown: taller media is cropped evenly from the top and bottom, and wider media is centered with a band above and below. When the publication has links, clicking the teaser opens the first one shown under the paper (for example DOI or Paper) in a new tab. Omit `teaser` if there is none; the integrity tests check that every teaser path has a supported extension and an existing file, and that every media file in the folder is referenced by a publication.

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.15.3 create --template minimal --types ts --add prettier eslint vitest="usages:component,unit" tailwindcss="plugins:typography" mdsvex sveltekit-adapter="adapter:auto" --install pnpm vlab-website
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
