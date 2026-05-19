<script lang="ts">
	import CurrentMember from '$lib/components/person/currentMember.svelte';
	import OtherMember from '$lib/components/person/otherMember.svelte';
	import type { Members } from '$lib/types';
	import { getMemberName, getMemberStatus } from '$lib/data/Members';

	let { members }: { members: Members[] } = $props();

	let currentMembers = $derived(members.filter((member) => member.category !== 'alumni'));
	let alumniMembers = $derived(members.filter((member) => member.category === 'alumni'));
	let firstCurrentMembers = $derived(currentMembers.slice(0, 3));
	let remainingCurrentMembers = $derived(currentMembers.slice(3));
	let previewedMemberName = $state<string | undefined>();
	let openSocialMenuName = $state<string | undefined>();
	let socialMenuCloseTimer: ReturnType<typeof setTimeout> | undefined;
	let previewedMember = $derived(
		currentMembers.find((member) => getMemberName(member) === previewedMemberName)
	);

	function previewMember(member: Members) {
		previewedMemberName = getMemberName(member);
	}

	function clearPreview() {
		previewedMemberName = undefined;
	}

	function openSocialMenu(member: Members) {
		if (socialMenuCloseTimer) {
			clearTimeout(socialMenuCloseTimer);
		}

		openSocialMenuName = getMemberName(member);
	}

	function scheduleCloseSocialMenu(member: Members) {
		const memberName = getMemberName(member);

		if (socialMenuCloseTimer) {
			clearTimeout(socialMenuCloseTimer);
		}

		socialMenuCloseTimer = setTimeout(() => {
			if (openSocialMenuName === memberName) {
				openSocialMenuName = undefined;
			}
		}, 120);
	}

	function syncSocialMenu(member: Members, open: boolean) {
		if (open) {
			openSocialMenu(member);
			return;
		}

		if (openSocialMenuName === getMemberName(member)) {
			openSocialMenuName = undefined;
		}
	}
</script>

<section>
	<div class="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
		<h1 class="pageKicker text-zinc-500">People</h1>
	</div>

	<div class="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
		{#each firstCurrentMembers as member (getMemberName(member))}
			<CurrentMember
				{member}
				socialMenuOpen={openSocialMenuName === getMemberName(member)}
				onPreview={previewMember}
				onClearPreview={clearPreview}
				onOpenSocialMenu={openSocialMenu}
				onScheduleCloseSocialMenu={scheduleCloseSocialMenu}
				onSyncSocialMenu={syncSocialMenu}
			/>
		{/each}

		<aside
			class="col-span-full flex min-h-40 flex-col justify-center px-1 py-3 sm:col-span-3 lg:col-span-2 lg:min-h-0 lg:px-3 lg:py-2"
			aria-live="polite"
		>
			{#if previewedMember}
				<h2 class="personTitle text-zinc-950">
					{getMemberName(previewedMember)}
				</h2>
				<p class="bodyText mt-1 text-zinc-800 italic">
					{getMemberStatus(previewedMember)}
				</p>
				<p class="bodyText mt-1 text-zinc-700">
					{previewedMember.interests.join(', ')}
				</p>
			{:else}
				<p class="bodyText text-[#a51c30] italic">Augmenting human intelligence with variation</p>
			{/if}
		</aside>

		{#each remainingCurrentMembers as member (getMemberName(member))}
			<CurrentMember
				{member}
				socialMenuOpen={openSocialMenuName === getMemberName(member)}
				onPreview={previewMember}
				onClearPreview={clearPreview}
				onOpenSocialMenu={openSocialMenu}
				onScheduleCloseSocialMenu={scheduleCloseSocialMenu}
				onSyncSocialMenu={syncSocialMenu}
			/>
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
