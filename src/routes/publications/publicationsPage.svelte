<script lang="ts">
	import PublicationEntry from '$lib/components/projects/publicationEntry.svelte';
	import type { Members, Publication } from '$lib/types';
	import { getLabAuthorMemberships, groupPublicationsByYear } from '$lib/data/Publications';

	let { members, publications }: { members: Members[]; publications: Publication[] } = $props();

	let publicationGroups = $derived(groupPublicationsByYear(publications));
	let labAuthorMemberships = $derived(getLabAuthorMemberships(members));
</script>

<section>
	<div class="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
		<h1 class="pageKicker text-zinc-500">Publications</h1>
	</div>

	<div class="space-y-8">
		{#each publicationGroups as group (group.year)}
			<section class="publicationYear">
				<h2 class="yearLabel mb-3 text-zinc-950">{group.year}</h2>
				<div class="space-y-6">
					{#each group.publications as publication (publication.title)}
						<PublicationEntry {publication} {labAuthorMemberships} />
					{/each}
				</div>
			</section>
		{/each}
	</div>
</section>
