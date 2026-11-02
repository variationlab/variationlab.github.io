<script lang="ts">
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import LinkIcon from '@lucide/svelte/icons/link';
	import Mail from '@lucide/svelte/icons/mail';
	import UserRound from '@lucide/svelte/icons/user-round';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SocialLogo from '$lib/components/SocialLogo.svelte';
	import Image from '$lib/components/Image.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		getMemberEmailLink,
		getMemberGitHubLink,
		getMemberGivenName,
		getMemberGoogleScholarLink,
		getMemberName,
		getMemberProfilePath,
		getMemberSlug,
		getMemberSocialLinks,
		hasMemberSocialLinks
	} from '$lib/data/Members';
	import type { Members } from '$lib/types';

	type CurrentMemberProps = {
		member: Members;
		onPreview: (member: Members) => void;
		onClearPreview: () => void;
	};

	let { member, onPreview, onClearPreview }: CurrentMemberProps = $props();
	let tileWidth = $state(0);
	let isOpen = $state(false);

	function openPreview() {
		isOpen = true;
		onPreview(member);
	}

	function closePreview() {
		isOpen = false;
		onClearPreview();
	}

	// Keyboard users reach the profile through the tile link; this keeps a plain click on the
	// selectable name working the same way, while a drag that selects text stays put.
	function openProfileUnlessSelecting() {
		if (window.getSelection()?.isCollapsed ?? true) {
			goto(resolve('/people/[slug]', { slug: getMemberSlug(member) }));
		}
	}

	function previewOnKeyboardFocus(event: FocusEvent) {
		if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) {
			openPreview();
		}
	}

	const emailLink = $derived(getMemberEmailLink(member));
	const googleScholarLink = $derived(getMemberGoogleScholarLink(member));
	const githubLink = $derived(getMemberGitHubLink(member));
	const socialLinks = $derived(getMemberSocialLinks(member));
	const hasLinks = $derived(
		Boolean(emailLink || googleScholarLink || githubLink) || hasMemberSocialLinks(member)
	);
	const detailLinkButtonClass =
		'size-[var(--member-detail-link-button-size,2rem)] bg-zinc-100/75 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-[var(--brand-color)] focus-visible:text-[var(--brand-color)] [&_svg]:size-[var(--member-detail-link-icon-size,1rem)]';

	function clearPreviewIfFocusLeaves(event: FocusEvent) {
		const nextTarget = event.relatedTarget;
		const currentTarget = event.currentTarget;

		if (!(currentTarget instanceof HTMLElement)) {
			closePreview();
			return;
		}

		if (!(nextTarget instanceof Node) || !currentTarget.contains(nextTarget)) {
			closePreview();
		}
	}

	const actionCount = $derived(
		Number(Boolean(emailLink)) +
			Number(Boolean(googleScholarLink)) +
			Number(Boolean(githubLink)) +
			Number(socialLinks.length > 0)
	);
	const actionColumns = $derived(Math.min(2, actionCount));
	const buttonSize = $derived(
		actionCount > 0
			? Math.min(32, Math.max(0, (tileWidth - 8 - 4 * (actionColumns - 1)) / actionColumns))
			: 32
	);
</script>

<article
	bind:clientWidth={tileWidth}
	style={`--member-detail-link-button-size: ${buttonSize}px; --member-detail-link-icon-size: ${buttonSize * 0.5}px;`}
	class="memberTile group relative aspect-square overflow-visible rounded-lg bg-zinc-100 outline-none"
	onpointerenter={(event) => {
		if (event.pointerType !== 'touch') openPreview();
	}}
	onpointerleave={closePreview}
	onfocusin={previewOnKeyboardFocus}
	onfocusout={clearPreviewIfFocusLeaves}
>
	{#if member.headshot}
		<Image
			class="h-full w-full rounded-lg object-cover transition-opacity duration-200 {isOpen
				? 'opacity-70'
				: 'opacity-100'}"
			src={member.headshot}
			alt={`${getMemberName(member)} headshot`}
		/>
	{:else}
		<div
			class="flex h-full w-full items-center justify-center rounded-lg transition-opacity duration-200 {isOpen
				? 'opacity-70'
				: 'opacity-100'}"
		>
			<UserRound aria-hidden="true" size={42} strokeWidth={1.6} class="text-zinc-400" />
		</div>
	{/if}

	<a
		class="absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-color)]"
		href={getMemberProfilePath(member)}
		aria-label={`${getMemberName(member)} profile`}
	></a>

	<span
		class="itemTitle pointer-events-none absolute inset-x-0 bottom-0 z-20 rounded-b-lg bg-gradient-to-t from-zinc-950/80 to-transparent px-2 pt-10 pb-2 text-white"
	>
		<!-- Only the name text takes the pointer, so it can be selected; a plain click still opens the profile. -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<span
			class="pointer-events-auto cursor-pointer select-text"
			onclick={openProfileUnlessSelecting}
		>
			{getMemberGivenName(member)}
		</span>
	</span>

	{#if hasLinks}
		<div
			inert={!isOpen}
			style={`grid-template-columns: repeat(${actionColumns}, var(--member-detail-link-button-size));`}
			class="memberActions absolute top-1 right-1 z-30 grid items-start gap-1 transition {isOpen
				? 'opacity-100'
				: 'pointer-events-none opacity-0'}"
		>
			{#if emailLink}
				<Button
					variant="ghost"
					size="icon-sm"
					class={detailLinkButtonClass}
					href={emailLink.url}
					target="_blank"
					rel="external noopener noreferrer"
					aria-label={`Email ${getMemberName(member)}`}
				>
					<Mail aria-hidden="true" />
				</Button>
			{/if}

			{#if googleScholarLink}
				<Button
					variant="ghost"
					size="icon-sm"
					class={detailLinkButtonClass}
					href={googleScholarLink.url}
					target="_blank"
					rel="external noopener noreferrer"
					aria-label={`${getMemberName(member)} Google Scholar`}
				>
					<GraduationCap aria-hidden="true" />
				</Button>
			{/if}

			{#if githubLink}
				<Button
					variant="ghost"
					size="icon-sm"
					class={detailLinkButtonClass}
					href={githubLink.url}
					target="_blank"
					rel="external noopener noreferrer"
					aria-label={`${getMemberName(member)} GitHub`}
				>
					<SocialLogo kind="github" />
				</Button>
			{/if}

			{#if hasMemberSocialLinks(member)}
				<div class="group/social relative">
					<Button
						variant="ghost"
						size="icon-sm"
						class={detailLinkButtonClass}
						aria-label={`${getMemberName(member)} social links`}
						aria-haspopup="menu"
						onmousedown={(event) => event.preventDefault()}
					>
						<LinkIcon aria-hidden="true" />
					</Button>
					<div
						class="pointer-events-none absolute top-full right-0 w-max pt-1 text-zinc-800 opacity-0 transition group-focus-within/social:pointer-events-auto group-focus-within/social:opacity-100 group-hover/social:pointer-events-auto group-hover/social:opacity-100"
						role="menu"
						aria-label={`${getMemberName(member)} social links`}
					>
						<div class="w-max rounded-md bg-zinc-100/75 p-1 backdrop-blur-[2px]">
							{#each socialLinks as link (link.kind)}
								<a
									class="metaText ml-auto flex w-full items-center justify-end gap-2 rounded-sm px-2 py-1.5 text-right outline-none hover:bg-white/60 hover:text-[var(--brand-color)] focus-visible:bg-white/60 focus-visible:text-[var(--brand-color)]"
									href={link.url}
									target="_blank"
									rel="external noopener noreferrer"
									role="menuitem"
								>
									<span>{link.label}</span>
									<SocialLogo kind={link.kind} />
								</a>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</article>
