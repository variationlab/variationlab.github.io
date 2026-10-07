<script lang="ts">
	import site from '$lib/data/Site';
	import type { PageProps } from './$types';
	import PeoplePage from './peoplePage.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>People | {site.title}</title>
</svelte:head>

<PeoplePage members={data.members} />
