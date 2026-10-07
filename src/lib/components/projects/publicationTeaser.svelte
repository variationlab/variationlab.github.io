<script lang="ts" module>
	/** Row layout for an entry with a teaser: media above the text on phones, beside it from sm up. */
	export const teaserRowClass = 'grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4';
</script>

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { getTeaserKind } from '$lib/data/Publications';

	let {
		src,
		title,
		href,
		class: className = ''
	}: { src: string; title: string; href?: string; class?: string } = $props();

	const kind = $derived(getTeaserKind(src));
	// Teasers are 16:9. Media always spans the full width; extra height is cropped evenly
	// from top and bottom, and wider media sits centered inside the 16:9 frame.
	const mediaClass = 'block h-auto w-full max-w-none shrink-0';

	let video = $state<HTMLVideoElement>();
	let reduceMotion = $state(false);

	// Play teaser videos only while they are on screen, and never autoplay for reduced motion.
	$effect(() => {
		if (!video) return;
		const element = video;

		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion) return;

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				element.play().catch(() => {});
			} else {
				element.pause();
			}
		});
		observer.observe(element);

		return () => observer.disconnect();
	});
</script>

{#if kind}
	<!-- With an interactive version, the whole teaser links to it in a new tab. -->
	<svelte:element
		this={href ? 'a' : 'div'}
		class={`flex aspect-video items-center self-start overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 ${
			href
				? 'transition-colors outline-none hover:border-(--brand-color) focus-visible:ring-2 focus-visible:ring-(--brand-color)'
				: ''
		} ${className}`}
		{href}
		target={href ? '_blank' : undefined}
		rel={href ? 'external noopener noreferrer' : undefined}
		aria-label={href ? `Open interactive version of ${title}` : undefined}
	>
		{#if kind === 'video'}
			<video
				bind:this={video}
				class={mediaClass}
				{src}
				aria-label={`${title} teaser`}
				muted
				loop
				playsinline
				preload="metadata"
				controls={reduceMotion}
			></video>
		{:else}
			<Image class={mediaClass} {src} alt={`${title} teaser`} loading="lazy" />
		{/if}
	</svelte:element>
{/if}
