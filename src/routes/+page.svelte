<script lang="ts">
	import { browser } from '$app/environment';
	import { getRouteLabel, normalizeHash, type RouteId } from '$lib/HashRoutes';
	import { getMemberName, getMemberStatus } from '$lib/data/Members';
	import {
		getAuthorName,
		getLabAuthorMemberships,
		getPublicationLinks,
		isLabAuthorForPublication
	} from '$lib/data/Publications';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ContactPage from './contact/contactPage.svelte';
	import CoursesPage from './courses/coursesPage.svelte';
	import PeoplePage from './people/peoplePage.svelte';
	import PublicationsPage from './publications/publicationsPage.svelte';

	let { data }: { data: PageData } = $props();

	let activeRouteId = $state<RouteId>(browser ? normalizeHash(window.location.hash) : 'home');
	let pageTitle = $derived(
		activeRouteId === 'home'
			? 'Harvard Variation Lab'
			: `${getRouteLabel(activeRouteId)} | Harvard Variation Lab`
	);

	let recentPublications = $derived(data.publications.slice(0, 5));
	let featuredMembers = $derived(
		data.members.filter((member) => member.category !== 'alumni' && member.headshot)
	);
	let labAuthorMemberships = $derived(getLabAuthorMemberships(data.members));

	function syncActiveRoute() {
		activeRouteId = normalizeHash(window.location.hash);
	}

	onMount(() => {
		syncActiveRoute();
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
	<section class="grid gap-8 md:items-start">
		<div class="max-w-full">
			<p class="heroLead mt-4 text-zinc-700">
				We are the <span class="pageKicker text-harvard">Variation lab</span> from Harvard SEAS. We build AI-resilient interfaces that help people notice, evaluate, and recover from AI
				choices during open-ended work like reading, writing, ideating, and sensemaking.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<a class="homeLink" href="#/publications">View Publications</a>
				<a class="homeLink homeLinkSecondary" href="#/people">Meet People</a>
			</div>
		</div>
	</section>

	<section class="mt-10 border-t border-zinc-200 pt-6">
		<div class="mb-4 flex items-baseline justify-between gap-4">
			<h2 class="sectionLabel text-zinc-950">Recent Publications</h2>
			<a class="smallLink text-harvard hover:text-zinc-950" href="#/publications">View all papers</a
			>
		</div>
		<div class="space-y-5">
			{#each recentPublications as publication (publication.title)}
				<article class="grid gap-2 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-5">
					<div class="yearLabel text-zinc-950">{publication.year}</div>
					<div>
						<h3 class="itemTitle text-zinc-950">{publication.title}</h3>
						<p class="metaText text-zinc-800">
							{#each publication.authors as author, index (author.publicationName)}
								{#if index > 0}<span>, </span>{/if}
								<span
									class={isLabAuthorForPublication(author, publication, labAuthorMemberships)
										? 'font-semibold text-zinc-950'
										: ''}>{getAuthorName(author)}</span
								>
							{/each}
						</p>
						<p class="metaText text-zinc-700 italic">
							{publication.venue.fullName}, {publication.year}
						</p>
						<p class="smallLink mt-1">
							{#each getPublicationLinks(publication) as link, index (link.url)}
								{#if index > 0}<span class="linkSeparator">|</span>{/if}
								<a
									class="text-zinc-950 hover:text-[#a51c30]"
									href={link.url}
									target="_blank"
									rel="external noopener noreferrer">{link.name}</a
								>
							{/each}
						</p>
					</div>
				</article>
			{/each}
		</div>
	</section>
{/if}
