<script lang="ts">
	import site from '$lib/data/Site';
	import CurrentMember from '$lib/components/person/currentMember.svelte';
	import CurrentMemberRow from '$lib/components/person/currentMemberRow.svelte';
	import OtherMember from '$lib/components/person/otherMember.svelte';
	import type { Members } from '$lib/types';
	import {
		getMemberName,
		getMemberStatus,
		groupAlumniMembers,
		isCoreMember,
		orderActiveMembers
	} from '$lib/data/Members';

	let { members }: { members: Members[] } = $props();

	let currentMembers = $derived(orderActiveMembers(members));
	let coreMembers = $derived(currentMembers.filter((member) => isCoreMember(member)));
	let otherActiveMembers = $derived(currentMembers.filter((member) => !isCoreMember(member)));
	let alumniGroups = $derived(groupAlumniMembers(members));
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
		<h1 class="pageTitle text-zinc-950">Active Members</h1>
	</div>

	<div class="grid gap-y-5 sm:hidden">
		{#each currentMembers as member (getMemberName(member))}
			<CurrentMemberRow {member} />
		{/each}
	</div>

	<!-- Core cards keep the original column size: one sixth of this area from lg up, one
	     quarter below that. The bio panel uses the space beside the 3 by 2. -->
	<div class="memberBoard hidden min-w-0 sm:block">
	<div class="memberGrid">
		{#each coreMembers as member (getMemberName(member))}
			<CurrentMember {member} onPreview={previewMember} onClearPreview={clearPreview} />
		{/each}

		<aside
			class="relative col-start-4 row-span-2 row-start-1 min-h-0 min-w-0"
			aria-live="polite"
		>
			<div class="absolute inset-0 flex flex-col overflow-hidden px-1 py-2 lg:px-3">
				{#if previewedMember}
					<h2 class="itemTitle max-w-full [overflow-wrap:anywhere] break-words text-zinc-950">
						{getMemberName(previewedMember)}
					</h2>
					<p
						class="metaText mt-1 max-w-full font-semibold [overflow-wrap:anywhere] break-words text-zinc-700"
					>
						{getMemberStatus(previewedMember)}
					</p>
					<p class="metaText mt-0.5 max-w-full [overflow-wrap:anywhere] break-words text-zinc-600">
						{previewedMember.interests.join(', ')}
					</p>
					{#if previewedMember.bio}
						<div
							bind:this={bioBox}
							class="metaText mt-4 min-h-0 flex-1 overflow-hidden border-t border-zinc-200 pt-4 text-zinc-600"
						>
							<p
								class="[display:-webkit-box] overflow-hidden [overflow-wrap:anywhere] break-words [-webkit-box-orient:vertical]"
								style:-webkit-line-clamp={bioLines}
							>
								{previewedMember.bio}
							</p>
						</div>
					{/if}
				{:else}
					<p class="itemTitle text-harvard max-w-full [overflow-wrap:anywhere] break-words">
						{site.peopleTagline}
					</p>
					<p class="metaText mt-4 border-t border-zinc-200 pt-4 text-zinc-600">
						Hover over active member cards to read brief bios, or click for full profiles.
					</p>
				{/if}
			</div>
		</aside>

		<div class="col-span-3 flex items-start gap-(--member-gap)">
			{#each otherActiveMembers as member (getMemberName(member))}
				<div class="w-[calc(var(--member-card)*0.75)] shrink-0">
					<CurrentMember {member} onPreview={previewMember} onClearPreview={clearPreview} />
				</div>
			{/each}
		</div>
	</div>
	</div>
</section>

<style>
	/* The query container is the wrapper, so both the grid and the smaller cards
	   resolve cqi against this board rather than against themselves. */
	.memberBoard {
		container-type: inline-size;
	}

	.memberGrid {
		--member-gap: 0.5rem;
		/* Same width as one column of the previous four-column layout. */
		--member-card: calc((100cqi - 3 * var(--member-gap)) / 4);
		display: grid;
		gap: var(--member-gap);
		grid-template-columns: repeat(3, var(--member-card)) minmax(0, 1fr);
	}

	@media (min-width: 64rem) {
		.memberGrid {
			/* Same width as one column of the previous six-column layout. */
			--member-card: calc((100cqi - 5 * var(--member-gap)) / 6);
		}
	}
</style>

<section class="mt-8 border-t border-zinc-200 pt-6">
	<h2 class="sectionTitle text-zinc-950">Alumni</h2>
	<div class="mt-4 space-y-6">
		{#each alumniGroups as group (group.key)}
			<section>
				<h3 class="detailTitle text-zinc-950">{group.title}</h3>
				{#if group.key === 'masters' || group.key === 'interns' || group.key === 'affiliates'}
					<div class="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
						{#each group.members as member (getMemberName(member))}
							<OtherMember {member} compact />
						{/each}
					</div>
				{:else}
					<div class="mt-3 grid gap-x-8 gap-y-5 lg:grid-cols-2">
						{#each group.members as member (getMemberName(member))}
							<OtherMember {member} />
						{/each}
					</div>
				{/if}
			</section>
		{/each}
	</div>
</section>
