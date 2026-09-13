# sv

## Editing site content

- Set each person's display title with `currentRole` in `static/data/People.json`. It applies to current members and alumni. If omitted, the title uses a general label from `currentAcademicStatus`, without assuming a department or matching a name. Alumni `formerRole` may be any nonempty title.
- Edit branding, logos, introductory copy, the people tagline, course/contact messages, and the recent-publication count in `static/data/Site.json`. This configuration is imported at build time; rebuild to publish changes.
- Set brand colors in the `:root` variables in `src/routes/layout.css`.
- Publications are ordered by `publishDate`; JSON array order does not control recency. The copyright year follows the current year when rendered.

## Member images

Place member headshots in `static/images/members/`. Use `.jpg`, `.jpeg`, `.png`, or `.webp` files with a 1:1 aspect ratio and dimensions up to and including **650 × 650 pixels**.

In `static/data/People.json`, enter the full image path **including its actual file extension**, for example `"headshot": "/images/members/example.webp"`. Match the filename's spelling and case. Omit `headshot` if no image is available. Every file in the member image folder must be referenced by a member record.

`src/lib/components/Image.svelte` renders the supplied `src` unchanged and accepts standard image attributes, including `alt`, `class`, `width`, `height`, and `loading`. Member image constraints are enforced by the integrity tests, independently of this reusable component.

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
