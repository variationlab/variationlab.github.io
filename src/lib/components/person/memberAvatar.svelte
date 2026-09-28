<script lang="ts">
	import UserRound from '@lucide/svelte/icons/user-round';
	import Image from '$lib/components/Image.svelte';
	import { getMemberName, getMemberStatus, getMemberWebsiteLink } from '$lib/data/Members';
	import type { Members } from '$lib/types';

	let { member }: { member: Members } = $props();

	const websiteLink = $derived(getMemberWebsiteLink(member));
</script>

{#snippet avatar()}
	<span
		class="mx-auto block aspect-square w-full max-w-32 overflow-hidden rounded-full border-2 border-(--brand-color)/35 bg-zinc-100 p-0.5 transition-colors group-hover/avatar:border-(--brand-color) group-focus-visible/avatar:border-(--brand-color)"
	>
		{#if member.headshot}
			<Image
				class="h-full w-full rounded-full object-cover"
				src={member.headshot}
				alt={`${getMemberName(member)} headshot`}
				loading="lazy"
			/>
		{:else}
			<span class="flex h-full w-full items-center justify-center rounded-full bg-zinc-100">
				<UserRound aria-hidden="true" size={36} strokeWidth={1.6} class="text-zinc-400" />
			</span>
		{/if}
	</span>
	<span
		class="itemTitle mt-2 block text-zinc-950 link-underline-base transition-colors group-hover/avatar:text-(--brand-color) group-hover/avatar:decoration-current group-focus-visible/avatar:text-(--brand-color) group-focus-visible/avatar:decoration-current"
	>
		{getMemberName(member)}
	</span>
{/snippet}

<article class="flex w-full min-w-0 flex-col items-center text-center">
	{#if websiteLink}
		<a
			class="group/avatar block w-full rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-(--brand-color) focus-visible:ring-offset-2"
			href={websiteLink.url}
			target="_blank"
			rel="external noopener noreferrer"
		>
			{@render avatar()}
		</a>
	{:else}
		<div class="w-full">{@render avatar()}</div>
	{/if}
	<p class="metaText mt-0.5 wrap-anywhere text-zinc-600 italic">{getMemberStatus(member)}</p>
</article>
