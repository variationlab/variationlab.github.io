<script lang="ts">
	import site from '$lib/data/Site';
	import type { PageProps } from './$types';
	import PublicationsPage from './publicationsPage.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Publications | {site.title}</title>
</svelte:head>

<PublicationsPage members={data.members} publications={data.publications} />
