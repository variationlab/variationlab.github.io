# Project Memory

- This is a SvelteKit app using Svelte 5 runes and Tailwind CSS 4.
- Use hash routing for top-level pages: `/#/people` and `/#/publications`.
- Keep hash-routed page components in separate folders under `src/routes/<page>/`.
- Hash-routed page components are normal imported components, not SvelteKit routes: do not rename them to `+page.svelte`; use lower camelCase filenames such as `peoplePage.svelte`.
- The authoritative content source for initial people and publication data is `https://github.com/eglassman/eglassman.github.io/blob/master/index.html`.
- Use `pnpm` for package-manager execution such as checks, tests, and builds.
- Do not start local dev or preview servers for this project, including `pnpm run dev`, `pnpm dev`, `pnpm run preview`, or Vite server commands. The user will run the server when needed; only start one if the user explicitly asks for it.
- Naming convention: PascalCase for classes/modules/components, camelCase for variables/functions.
- Strict design requirement: keep global/page backgrounds plain white; avoid global background colors, gradients, and tinted page washes.
- Typography must follow a clear view hierarchy: prefer shared typography classes for repeated roles such as hero titles, page/section labels, item titles, body text, meta text, and compact links; avoid scattering one-off font sizes unless a component has a specific local need.
- Member records use `startTime` and optional `endTime` date windows (`YYYY-MM-DD`) for lab-time-aware publication highlighting.
- People contact controls use shadcn-svelte `Button`/`DropdownMenu`: email, website globe, and Google Scholar are direct buttons; only GitHub/LinkedIn/Twitter/Bluesky social links go in the dropdown.
- Keep generated shadcn components in `src/lib/components/ui/` close to default; prefer call-site styling/config over editing generated primitives.
- Use Simple Icons for social/company logos when available; keep non-navigation links opening in a new tab and hash navigation same-tab.
