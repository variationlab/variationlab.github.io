<script lang="ts">
	import {
		getAuthorName,
		getPublicationLinks,
		isLabAuthorForPublication,
		type LabAuthorMembership
	} from '$lib/data/Publications';
	import type { Publication } from '$lib/types';

	let {
		publication,
		labAuthorMemberships
	}: {
		publication: Publication;
		labAuthorMemberships: ReadonlyMap<string, LabAuthorMembership>;
	} = $props();

	const publicationLinks = $derived(getPublicationLinks(publication));
	const awardLabel = $derived(publication.awardText);
</script>

<article class="publicationItem">
	<div class="min-w-0">
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
			{#each publicationLinks as link, index (link.url)}
				{#if index > 0}<span class="linkSeparator">|</span>{/if}
				<a
					class="text-zinc-950 hover:text-[#a51c30]"
					href={link.url}
					target="_blank"
					rel="external noopener noreferrer">{link.name}</a
				>
			{/each}
			{#if awardLabel}
				{#if publicationLinks.length > 0}
					<span class="linkSeparator">|</span>
				{/if}
				<span class="font-semibold text-zinc-950">{awardLabel}</span>
			{/if}
		</p>
	</div>
</article>
