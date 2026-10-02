<script lang="ts">
	import site from '$lib/data/Site';
	import {
		getAuthorName,
		sortPublicationsByDate,
		getLabAuthorMemberships,
		getPublicationLinks,
		isLabAuthorForPublication
	} from '$lib/data/Publications';
	import { getMemberName, orderActiveMembers } from '$lib/data/Members';
	import HomeMember from '$lib/components/person/homeMember.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let currentMembers = $derived(orderActiveMembers(data.members));
	let recentPublications = $derived(
		sortPublicationsByDate(data.publications).slice(0, site.home.recentPublicationsLimit)
	);
	let labAuthorMemberships = $derived(getLabAuthorMemberships(data.members));
</script>

<svelte:head>
	<title>{site.title}</title>
</svelte:head>

<section class="grid gap-8 md:items-start">
	<div class="max-w-full">
		<p class="heroLead mt-4 text-zinc-700">
			{site.home.introPrefix} <span class="pageKicker text-harvard">{site.home.highlight}</span>
			{site.home.introSuffix}
		</p>
		<ul class="mt-6 flex items-start gap-4 overflow-x-auto lg:overflow-visible">
			{#each currentMembers as member (getMemberName(member))}
				<li class="w-36 shrink-0 lg:w-auto lg:min-w-0 lg:flex-1">
					<HomeMember {member} />
				</li>
			{/each}
		</ul>
		<div class="mt-6 space-y-4">
			<p class="bodyText text-zinc-700">
				AI is powerful, but it can be wrong, contextually inappropriate, or subjectively bad—and suppress the user’s
                critical engagement and learning at the same time. The Variation Lab’s research is defining and refining our understanding
                of AI-resilient interfaces that help people use AI while (a) maintaining their ability to notice AI choices, e.g., 
                by spurring curiosity and cognitive engagement through surfacing variation in the data and/or the AI’s outputs and 
                (b) giving them the context necessary to evaluate whether those choices are wrong, or at least not right for them. 
                This is critical during context- and preference-dominated open-ended tasks, like ideating, searching, sensemaking, 
                and reading or writing text and code at scale. 
			</p>
			<p class="bodyText text-zinc-700">
				AI-resilient interfaces improve AI safety, usability, and utility by working with, not against, human perception, 
                attention, and cognition. To achieve this, we derive and disseminate design implications from cognitive science and 
                empirical studies of novel system prototypes, even and especially when these implications fly in the face of common usability guidelines.
			</p>
		</div>
		<div class="mt-6 flex flex-wrap gap-3">
			<a class="homeLink" href="/publications">View Publications</a>
			<a class="homeLink homeLinkSecondary" href="/people">Meet People</a>
		</div>
	</div>
</section>

<section class="mt-10 border-t border-zinc-200 pt-6">
	<div class="mb-4 flex items-baseline justify-between gap-4">
		<h2 class="sectionLabel text-zinc-950">Recent Publications</h2>
		<a class="smallLink text-harvard hover:text-zinc-950" href="/publications">View all papers</a>
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
								class="text-zinc-950 hover:text-[var(--brand-color)]"
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
