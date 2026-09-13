<script lang="ts">
	import UserRound from '@lucide/svelte/icons/user-round';
	import Image from '$lib/components/Image.svelte';
	import { getMemberName, getMemberStatus } from '$lib/data/Members';
	import type { Members } from '$lib/types';

	let { member }: { member: Members } = $props();
</script>

{#snippet memberSummary()}
	<div class="min-w-0">
		<h3 class="personTitle truncate text-zinc-950">
			{getMemberName(member)}
		</h3>
		{#if member.formerRole && member.currentRole}
			<div class="bodyText mt-0.5 text-zinc-800">
				<p>
					<span class="font-bold text-zinc-950">Prev:</span>
					{member.formerRole}
				</p>
				<p>
					<span class="font-bold text-zinc-950">Now:</span>
					{member.currentRole}
				</p>
			</div>
		{:else}
			<p class="bodyText mt-0.5 text-zinc-800">{getMemberStatus(member)}</p>
		{/if}
	</div>
{/snippet}

<article class="flex min-w-0 items-start gap-4 py-1">
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

	<div class="min-w-0 flex-1">
		{@render memberSummary()}
	</div>
</article>
