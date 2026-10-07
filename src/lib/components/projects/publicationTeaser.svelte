<script lang="ts" module>
	/** Row layout for an entry with a teaser: media above the text on phones, beside it from sm up. */
	export const teaserRowClass = 'grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4';
</script>

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { getTeaserKind, type PublicationLink } from '$lib/data/Publications';

	let {
		src,
		title,
		link,
		class: className = ''
	}: { src: string; title: string; link?: PublicationLink; class?: string } = $props();

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
	<!-- The teaser opens the publication's first link (DOI, Paper, ...) in a new tab. -->
	<svelte:element
		this={link ? 'a' : 'div'}
		class={`flex aspect-video items-center self-start overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 ${
			link
				? 'transition-colors outline-none hover:border-(--brand-color) focus-visible:ring-2 focus-visible:ring-(--brand-color)'
				: ''
		} ${className}`}
		href={link?.url}
		target={link ? '_blank' : undefined}
		rel={link ? 'external noopener noreferrer' : undefined}
		aria-label={link ? `${link.name}: ${title}` : undefined}
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
