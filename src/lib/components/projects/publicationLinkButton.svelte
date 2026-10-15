<script lang="ts" module>
	import BookMarked from '@lucide/svelte/icons/book-marked';
	import Code from '@lucide/svelte/icons/code';
	import FileText from '@lucide/svelte/icons/file-text';
	import FolderOpen from '@lucide/svelte/icons/folder-open';
	import Images from '@lucide/svelte/icons/images';
	import Mic from '@lucide/svelte/icons/mic';
	import Search from '@lucide/svelte/icons/search';
	import Video from '@lucide/svelte/icons/video';
	import type { Component } from 'svelte';
	import type { PublicationLinkKind } from '$lib/data/Publications';

	/** One icon per publication field; Code links to GitHub use the GitHub mark instead. */
	const icons = {
		doi: BookMarked,
		paperLink: FileText,
		exploreLink: Search,
		codeLink: Code,
		videoLink: Video,
		presentationLink: Mic,
		materialLink: FolderOpen,
		slidesLink: Images
	} satisfies Record<PublicationLinkKind, Component>;
</script>

<script lang="ts">
	import SocialLogo from '$lib/components/SocialLogo.svelte';
	import { Button } from '$lib/components/ui/button';
	let { kind, label, href }: { kind: PublicationLinkKind; label: string; href: string } = $props();

	const Icon = $derived(icons[kind]);
	const isGitHub = $derived(kind === 'codeLink' && /^https?:\/\/(www\.)?github\.com\//i.test(href));
</script>

<Button
	variant="link"
	class="bodyText h-auto gap-1.5 border-0 p-0 font-normal text-zinc-800 hover:text-(--brand-color)"
	{href}
	target="_blank"
	rel="external noopener noreferrer"
>
	{#if isGitHub}
		<SocialLogo kind="github" />
	{:else}
		<Icon aria-hidden="true" />
	{/if}
	<span>{label}</span>
</Button>
