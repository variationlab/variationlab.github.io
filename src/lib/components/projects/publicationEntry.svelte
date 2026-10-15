<script lang="ts">
	import {
		getAuthorName,
		getLabAuthorHomepage,
		getPublicationLinks,
		isLabAuthorForPublication,
		type LabAuthorMembership
	} from '$lib/data/Publications';
	import type { Publication } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import Trophy from '@lucide/svelte/icons/trophy';
	import PublicationLinkButton from './publicationLinkButton.svelte';
	import PublicationTeaser, { teaserRowClass } from './publicationTeaser.svelte';

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

<article class="publicationText min-w-0">
	<div class={publication.teaser ? teaserRowClass : ''}>
		{#if publication.teaser}
			<PublicationTeaser
				class="w-full max-w-sm"
				src={publication.teaser}
				title={publication.title}
				link={publicationLinks[0]}
			/>
		{/if}
		<div class="min-w-0">
			<h3 class="itemTitle text-zinc-950">{publication.title}</h3>
			<p class="bodyText mt-0.5 text-zinc-800">
				{#each publication.authors as author, index (author.publicationName)}
					{@const homepage = getLabAuthorHomepage(author, publication, labAuthorMemberships)}
					{#if index > 0}<span>, </span>{/if}
					{#if homepage}
						<a
							class="font-semibold text-zinc-950 link-underline transition-colors hover:text-(--brand-color)"
							href={homepage}
							target="_blank"
							rel="external noopener noreferrer">{getAuthorName(author)}</a
						>
					{:else}
						<span
							class={isLabAuthorForPublication(author, publication, labAuthorMemberships)
								? 'font-semibold text-zinc-950'
								: ''}>{getAuthorName(author)}</span
						>
					{/if}
				{/each}
			</p>
			<p class="bodyText text-zinc-700">
				<span class="italic">{publication.venue.fullName}, {publication.year}</span
				>{#if publication.affiliation}
					<span class="linkSeparator">·</span>{publication.affiliation}{/if}
			</p>
			{#if awardLabel}
				<p class="bodyText text-harvard mt-1 flex items-center gap-1.5">
					<Trophy aria-hidden="true" size={16} class="shrink-0" />
					{#if publication.awardLink}
						<Button
							variant="link"
							class="bodyText text-harvard h-auto border-0 p-0 font-normal"
							href={publication.awardLink}
							target="_blank"
							rel="external noopener noreferrer"><span>{awardLabel}</span></Button
						>
					{:else}
						<span>{awardLabel}</span>
					{/if}
				</p>
			{/if}
			{#if publicationLinks.length > 0}
				<div class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
					{#each publicationLinks as link (link.url)}
						<PublicationLinkButton kind={link.kind} label={link.name} href={link.url} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</article>
