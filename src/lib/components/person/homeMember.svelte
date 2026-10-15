<script lang="ts">
	import UserRound from '@lucide/svelte/icons/user-round';
	import Image from '$lib/components/Image.svelte';
	import { getMemberName, getMemberProfilePath, getMemberShortRole } from '$lib/data/Members';
	import type { Members } from '$lib/types';

	let { member }: { member: Members } = $props();
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
			class="itemTitle text-zinc-950 group-hover/member:text-[var(--brand-color)] group-focus-visible/member:text-[var(--brand-color)]"
		>
			{getMemberName(member)}
		</p>
		<p class="metaText mt-0.5 text-zinc-700 italic">{getMemberShortRole(member)}</p>
	</div>
{/snippet}

<a
	class="group/member flex min-w-0 flex-col items-center gap-2 rounded-lg text-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-color)]"
	href={getMemberProfilePath(member)}
	aria-label={`${getMemberName(member)} profile`}
>
	{@render profile()}
</a>
