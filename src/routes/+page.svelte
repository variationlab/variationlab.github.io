<script lang="ts">
	import { browser } from '$app/environment';
	import { getRouteLabel, normalizeHash, type RouteId } from '$lib/HashRoutes';
	import site from '$lib/data/Site';
	import { getSelectedPublications, getLabAuthorMemberships } from '$lib/data/Publications';
	import { getMemberName, orderActiveMembers } from '$lib/data/Members';
	import MemberAvatar from '$lib/components/person/memberAvatar.svelte';
	import { Button } from '$lib/components/ui/button';
	import HomeHero from '$lib/components/home/homeHero.svelte';
	import PublicationEntry from '$lib/components/projects/publicationEntry.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ContactPage from './contact/contactPage.svelte';
	import CoursesPage from './courses/coursesPage.svelte';
	import PeoplePage from './people/peoplePage.svelte';
	import PublicationsPage from './publications/publicationsPage.svelte';

	let { data }: { data: PageData } = $props();

	let activeRouteId = $state<RouteId>(browser ? normalizeHash(window.location.hash) : 'home');
	let pageTitle = $derived(
		activeRouteId === 'home' ? site.title : `${getRouteLabel(activeRouteId)} | ${site.title}`
	);

	let selectedPublications = $derived(getSelectedPublications(data.publications));
	let labAuthorMemberships = $derived(getLabAuthorMemberships(data.members));
	let currentMembers = $derived(data.members.filter((member) => member.category !== 'alumni'));

	function syncActiveRoute() {
		activeRouteId = normalizeHash(window.location.hash);
	}

	onMount(() => {
		syncActiveRoute();
		// Shuffle only after hydration, matching the People page ordering.
		currentMembers = orderActiveMembers(data.members);
		window.addEventListener('hashchange', syncActiveRoute);

		return () => {
			window.removeEventListener('hashchange', syncActiveRoute);
		};
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{#if activeRouteId === 'people'}
	<PeoplePage members={data.members} />
{:else if activeRouteId === 'publications'}
	<PublicationsPage members={data.members} publications={data.publications} />
{:else if activeRouteId === 'courses'}
	<CoursesPage />
{:else if activeRouteId === 'contact'}
	<ContactPage />
{:else}
	<HomeHero />

	<section class="mt-8 border-t border-zinc-200 pt-6" aria-labelledby="research-themes-title">
		<h2 id="research-themes-title" class="sectionLabel mb-5 text-zinc-950">Research Themes</h2>
		<div class="grid gap-x-10 gap-y-6 md:grid-cols-3">
			{#each site.home.researchThemes as theme (theme.title)}
				<article>
					<h3 class="itemTitle text-harvard">{theme.title}</h3>
					<p class="bodyText mt-1 text-zinc-700">{theme.description}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="mt-10 border-t border-zinc-200 pt-6">
		<div class="mb-5 flex items-baseline justify-between gap-4">
			<h2 class="sectionLabel text-zinc-950">Team</h2>
			<Button variant="link" href="#/people" class="smallLink h-auto border-0 p-0 text-harvard">
				<span>View all people & alumni</span>
			</Button>
		</div>
		<div
			class="grid grid-cols-2 gap-x-4 gap-y-7 min-[420px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
		>
			{#each currentMembers as member (getMemberName(member))}
				<MemberAvatar {member} />
			{/each}
		</div>
	</section>

	<section class="mt-10 border-t border-zinc-200 pt-6">
		<div class="mb-4 flex items-baseline justify-between gap-4">
			<h2 class="sectionLabel text-zinc-950">Selected Publications</h2>
			<Button
				variant="link"
				href="#/publications"
				class="smallLink h-auto border-0 p-0 text-harvard"
			>
				<span>View all papers</span>
			</Button>
		</div>
		<div class="space-y-5">
			{#each selectedPublications as publication (publication.title)}
				<PublicationEntry {publication} {labAuthorMemberships} />
			{/each}
		</div>
	</section>
{/if}
