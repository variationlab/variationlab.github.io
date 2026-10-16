<script lang="ts">
	import PublicationList from '$lib/components/projects/publicationList.svelte';
	import PublicationYearNav, {
		getPublicationYearId
	} from '$lib/components/projects/publicationYearNav.svelte';
	import type { Members, Publication } from '$lib/types';
	import { getLabAuthorMemberships, groupPublicationsByYear } from '$lib/data/Publications';

	let { members, publications }: { members: Members[]; publications: Publication[] } = $props();

	let publicationGroups = $derived(groupPublicationsByYear(publications));
	let publicationYears = $derived(publicationGroups.map((group) => group.year));
	let labAuthorMemberships = $derived(getLabAuthorMemberships(members));
</script>

<section>
	<div class="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
		<h1 class="pageTitle text-zinc-950">Publications</h1>
	</div>

	<div class="publicationText md:grid md:grid-cols-[6rem_minmax(0,1fr)] md:gap-8">
		<PublicationYearNav
			years={publicationYears}
			class="sticky top-24 hidden max-h-[calc(100vh-7rem)] self-start overflow-y-auto md:block"
		/>

		<div class="space-y-8">
			{#each publicationGroups as group, index (group.year)}
				{#if index > 0}<hr class="border-zinc-200" />{/if}
				<section class="publicationYear scroll-mt-24" id={getPublicationYearId(group.year)}>
					<h2 class="yearLabel mb-3 text-zinc-950">{group.year}</h2>
					<PublicationList publications={group.publications} {labAuthorMemberships} />
				</section>
			{/each}
		</div>
	</div>
</section>
