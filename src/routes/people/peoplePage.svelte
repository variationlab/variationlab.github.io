<script lang="ts">
	import site from '$lib/data/Site';
	import CurrentMember from '$lib/components/person/currentMember.svelte';
	import CurrentMemberRow from '$lib/components/person/currentMemberRow.svelte';
	import OtherMember from '$lib/components/person/otherMember.svelte';
	import type { Members } from '$lib/types';
	import { getMemberName, getMemberStatus, orderActiveMembers } from '$lib/data/Members';

	let { members }: { members: Members[] } = $props();

	let currentMembers = $derived(orderActiveMembers(members));
	let alumniMembers = $derived(members.filter((member) => member.category === 'alumni'));
	let previewedMemberName = $state<string | undefined>();
	let previewedMember = $derived(
		currentMembers.find((member) => getMemberName(member) === previewedMemberName)
	);

	function previewMember(member: Members) {
		previewedMemberName = getMemberName(member);
	}

	function clearPreview() {
		previewedMemberName = undefined;
	}
</script>

<section>
	<div class="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
		<h1 class="pageKicker text-zinc-950 sm:text-zinc-500">
			<span class="sm:hidden">Members</span>
			<span class="hidden sm:inline">People</span>
		</h1>
	</div>

	<div class="grid gap-y-5 sm:hidden">
		{#each currentMembers as member (getMemberName(member))}
			<CurrentMemberRow {member} />
		{/each}
	</div>

	<div class="hidden min-w-0 gap-2 sm:grid sm:grid-cols-4 lg:grid-cols-5">
		<aside
			class="row-start-1 flex min-h-0 max-w-full min-w-0 flex-col justify-start px-1 py-2 sm:col-span-2 sm:col-start-3 lg:col-start-4 lg:px-3"
			aria-live="polite"
		>
			{#if previewedMember}
				<h2 class="personTitle max-w-full [overflow-wrap:anywhere] break-words text-zinc-950">
					{getMemberName(previewedMember)}
				</h2>
				<p
					class="bodyText mt-1 max-w-full [overflow-wrap:anywhere] break-words text-zinc-800 italic"
				>
					{getMemberStatus(previewedMember)}
				</p>
				<p class="bodyText mt-1 max-w-full [overflow-wrap:anywhere] break-words text-zinc-700">
					{previewedMember.interests.join(', ')}
				</p>
			{:else}
				<p class="pageKicker text-harvard max-w-full [overflow-wrap:anywhere] break-words italic">
					{site.peopleTagline}
				</p>
			{/if}
		</aside>

		{#each currentMembers as member (getMemberName(member))}
			<CurrentMember {member} onPreview={previewMember} onClearPreview={clearPreview} />
		{/each}
	</div>
</section>

<section class="mt-8 border-t border-zinc-200 pt-6">
	<h2 class="sectionLabel text-zinc-950">Alumni</h2>
	<div class="mt-4 grid gap-x-8 gap-y-5 lg:grid-cols-2">
		{#each alumniMembers as member (getMemberName(member))}
			<OtherMember {member} />
		{/each}
	</div>
</section>
