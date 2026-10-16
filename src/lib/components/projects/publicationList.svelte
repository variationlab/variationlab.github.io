<script lang="ts">
	import type { LabAuthorMembership } from '$lib/data/Publications';
	import type { Publication } from '$lib/types';
	import PublicationEntry from './publicationEntry.svelte';

	/** Shared publication list for the home page's Selected Publications and each Publications year. */
	let {
		publications,
		labAuthorMemberships
	}: {
		publications: Publication[];
		labAuthorMemberships: ReadonlyMap<string, LabAuthorMembership>;
	} = $props();
</script>

<div class="publicationText space-y-6">
	{#each publications as publication (publication.title)}
		<PublicationEntry {publication} {labAuthorMemberships} />
	{/each}
</div>
