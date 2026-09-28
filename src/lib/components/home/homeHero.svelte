<script lang="ts">
	import site from '$lib/data/Site';
</script>

<section class="pt-10 pb-2 sm:pt-14" aria-labelledby="home-hero-title">
	<h1 id="home-hero-title" class="heroTitle text-zinc-950">{site.labName}</h1>
	<p class="heroLead mt-4 max-w-3xl text-zinc-700">
		{site.home.introPrefix} <span class="font-bold text-harvard">{site.home.highlight}</span>
		{site.home.introSuffix}
	</p>
</section>
