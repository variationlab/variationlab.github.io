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
	let bioBox = $state<HTMLDivElement | undefined>();
	let bioLines = $state(0);

	$effect(() => {
		const box = bioBox;
		if (!box) return;

		const measure = () => {
			const style = getComputedStyle(box);
			const fontSize = parseFloat(style.fontSize) || 16;
			const parsedLineHeight = parseFloat(style.lineHeight);
			const lineHeight = Number.isFinite(parsedLineHeight) ? parsedLineHeight : fontSize * 1.32;
			const padding = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
			const contentHeight = box.clientHeight - padding;
			bioLines = Math.max(0, Math.floor(contentHeight / lineHeight));
		};

		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(box);
		return () => observer.disconnect();
	});

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
		<div class="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-3 lg:grid-cols-3">
			{#each currentMembers as member (getMemberName(member))}
				<CurrentMember {member} onPreview={previewMember} onClearPreview={clearPreview} />
			{/each}
		</div>

		<aside class="relative min-h-0 min-w-0 sm:col-span-2" aria-live="polite">
			<div class="absolute inset-0 flex flex-col overflow-hidden px-1 py-2 lg:px-3">
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
					{#if previewedMember.bio}
						<div
							bind:this={bioBox}
							class="bodyText mt-4 min-h-0 flex-1 overflow-hidden border-t border-zinc-200 pt-4 text-zinc-700"
						>
							<p
								class="overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [overflow-wrap:anywhere] break-words"
								style:-webkit-line-clamp={bioLines}
							>
								{previewedMember.bio}
							</p>
						</div>
					{/if}
				{:else}
					<p class="pageKicker text-harvard max-w-full [overflow-wrap:anywhere] break-words italic">
						{site.peopleTagline}
					</p>
				{/if}
			</div>
		</aside>
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
