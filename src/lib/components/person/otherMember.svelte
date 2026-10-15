<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import UserRound from '@lucide/svelte/icons/user-round';
	import Image from '$lib/components/Image.svelte';
	import {
		getMemberName,
		getMemberSocialLinks,
		getMemberStatus,
		getMemberWebsiteLink
	} from '$lib/data/Members';
	import type { Members } from '$lib/types';

	/** `compact` shows only the name and an arrow to the current position, for narrow grid columns. */
	let { member, compact = false }: { member: Members; compact?: boolean } = $props();

	// Without a website, the name links to the first social profile, such as LinkedIn.
	const nameLink = $derived(getMemberWebsiteLink(member) ?? getMemberSocialLinks(member)[0]);
</script>

{#snippet memberSummary()}
	<div class="min-w-0">
		<h4 class="itemTitle text-zinc-950 {compact ? 'break-words' : 'truncate'}">
			{#if nameLink}
				<a
					class="rounded-sm link-underline transition-colors outline-none hover:text-(--brand-color) focus-visible:text-(--brand-color) focus-visible:ring-2 focus-visible:ring-(--brand-color)"
					href={nameLink.url}
					target="_blank"
					rel="external noopener noreferrer">{getMemberName(member)}</a
				>
			{:else}
				{getMemberName(member)}
			{/if}
		</h4>
		{#if compact}
			<p class="metaText mt-0.5 flex items-start gap-1 text-zinc-600">
				<ArrowRight class="mt-[0.16em] size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
				<span class="sr-only">Now:</span>
				<span class="min-w-0">{getMemberStatus(member)}</span>
			</p>
		{:else if member.formerRole && member.currentRole}
			<div class="metaText mt-0.5 text-zinc-600">
				<p>
					<span class="font-semibold text-zinc-700">Prev:</span>
					{member.formerRole}
				</p>
				<p>
					<span class="font-semibold text-zinc-700">Now:</span>
					{member.currentRole}
				</p>
			</div>
		{:else}
			<p class="metaText mt-0.5 text-zinc-600">{getMemberStatus(member)}</p>
		{/if}
	</div>
{/snippet}

<article class="flex min-w-0 items-start gap-4 py-1">
	{#if !compact}
		{#if member.headshot}
			<Image
				class="h-16 w-16 shrink-0 rounded-lg object-cover"
				src={member.headshot}
				alt={`${getMemberName(member)} headshot`}
			/>
		{:else}
			<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
				<UserRound aria-hidden="true" size={24} strokeWidth={1.6} class="text-zinc-400" />
			</div>
		{/if}
	{/if}

	<div class="min-w-0 flex-1">
		{@render memberSummary()}
	</div>
</article>
