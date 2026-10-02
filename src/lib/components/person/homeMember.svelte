<script lang="ts">
	import UserRound from '@lucide/svelte/icons/user-round';
	import Image from '$lib/components/Image.svelte';
	import { getMemberName, getMemberShortRole, getMemberWebsiteLink } from '$lib/data/Members';
	import type { Members } from '$lib/types';

	let { member }: { member: Members } = $props();

	const websiteLink = $derived(getMemberWebsiteLink(member));
</script>

{#snippet profile()}
	{#if member.headshot}
		<Image
			class="h-32 w-32 rounded-lg object-cover"
			src={member.headshot}
			alt={`${getMemberName(member)} headshot`}
		/>
	{:else}
		<div class="flex h-32 w-32 items-center justify-center rounded-lg bg-zinc-100">
			<UserRound aria-hidden="true" size={56} strokeWidth={1.6} class="text-zinc-400" />
		</div>
	{/if}

	<div class="min-w-0">
		<p
			class="metaText font-semibold text-zinc-950 group-hover/member:text-[var(--brand-color)] group-focus-visible/member:text-[var(--brand-color)]"
		>
			{getMemberName(member)}
		</p>
		<p class="metaText mt-0.5 text-zinc-700 italic">{getMemberShortRole(member)}</p>
	</div>
{/snippet}

{#if websiteLink}
	<a
		class="group/member flex min-w-0 flex-col items-center gap-2 rounded-lg text-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-color)]"
		href={websiteLink.url}
		target="_blank"
		rel="external noopener noreferrer"
		aria-label={`${getMemberName(member)} website`}
	>
		{@render profile()}
	</a>
{:else}
	<div class="flex min-w-0 flex-col items-center gap-2 text-center">
		{@render profile()}
	</div>
{/if}
