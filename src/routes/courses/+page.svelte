<script lang="ts">
	import site from '$lib/data/Site';
	import CoursesPage from './coursesPage.svelte';
</script>

<svelte:head>
	<title>Courses | {site.title}</title>
</svelte:head>

<CoursesPage />
