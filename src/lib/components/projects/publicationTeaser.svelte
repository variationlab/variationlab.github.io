<script lang="ts" module>
	/** Row layout for an entry with a teaser: text only on phones, media right of the text from sm up. */
	export const teaserRowClass = 'sm:grid sm:grid-cols-[minmax(0,1fr)_10rem] sm:gap-4';
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
	// Teasers sit in a 16:9 frame and are never cropped: media fills the frame's height first,
	// and media wider than 16:9 fills its width instead, centered on white.
	const mediaClass = 'block h-full w-full object-contain';

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
	<!-- The teaser opens the publication's first link (DOI, Paper, ...) in a new tab. It is hidden on
	     phones so the list stays text-only there. The border is transparent (keeping its width so the
	     media doesn't shift) and only shows on hover. -->
	<svelte:element
		this={link ? 'a' : 'div'}
		class={`hidden aspect-video items-center self-start overflow-hidden rounded-md border border-transparent bg-white sm:flex ${
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
