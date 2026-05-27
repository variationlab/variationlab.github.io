<script lang="ts">
	import Globe from '@lucide/svelte/icons/globe';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import LinkIcon from '@lucide/svelte/icons/link';
	import Mail from '@lucide/svelte/icons/mail';
	import UserRound from '@lucide/svelte/icons/user-round';
	import { onMount } from 'svelte';
	import SocialLogo from '$lib/components/SocialLogo.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		getMemberEmailLink,
		getMemberGitHubLink,
		getMemberGoogleScholarLink,
		getMemberName,
		getMemberSocialLinks,
		getMemberWebsiteLink,
		hasMemberSocialLinks
	} from '$lib/data/Members';
	import type { Members } from '$lib/types';

	type CurrentMemberProps = {
		member: Members;
		onPreview: (member: Members) => void;
		onClearPreview: () => void;
	};

	let { member, onPreview, onClearPreview }: CurrentMemberProps = $props();
	let memberTileElement: HTMLElement | undefined = $state();

	const emailLink = $derived(getMemberEmailLink(member));
	const websiteLink = $derived(getMemberWebsiteLink(member));
	const googleScholarLink = $derived(getMemberGoogleScholarLink(member));
	const githubLink = $derived(getMemberGitHubLink(member));
	const socialLinks = $derived(getMemberSocialLinks(member));
	const hasLinks = $derived(
		Boolean(emailLink || websiteLink || googleScholarLink || githubLink) ||
			hasMemberSocialLinks(member)
	);
	const detailLinkButtonClass =
		'size-[var(--member-detail-link-button-size,2rem)] bg-zinc-100/75 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-[#a51c30] focus-visible:text-[#a51c30] [&_svg]:size-[var(--member-detail-link-icon-size,1rem)]';

	function clearPreviewIfFocusLeaves(event: FocusEvent) {
		const nextTarget = event.relatedTarget;
		const currentTarget = event.currentTarget;

		if (!(currentTarget instanceof HTMLElement)) {
			onClearPreview();
			return;
		}

		if (!(nextTarget instanceof Node) || !currentTarget.contains(nextTarget)) {
			onClearPreview();
		}
	}

	const DETAIL_LINK_BUTTON_COUNT = 5;
	const DETAIL_LINK_BUTTON_GAP_PX = 4;
	const DETAIL_LINK_BUTTON_HORIZONTAL_PADDING_PX = 8;
	const DETAIL_LINK_BUTTON_DEFAULT_SIZE_PX = 32;

	function calculateUsableDetailLinkButtonSize(imageWidth: number) {
		const usableWidth =
			imageWidth -
			DETAIL_LINK_BUTTON_HORIZONTAL_PADDING_PX -
			DETAIL_LINK_BUTTON_GAP_PX * (DETAIL_LINK_BUTTON_COUNT - 1);
		const calculatedSize = usableWidth / DETAIL_LINK_BUTTON_COUNT;

		return Math.min(Math.max(calculatedSize, 0), DETAIL_LINK_BUTTON_DEFAULT_SIZE_PX);
	}

	function setPageDetailLinkButtonSize(imageWidth: number) {
		const buttonSize = calculateUsableDetailLinkButtonSize(imageWidth);

		document.documentElement.style.setProperty(
			'--member-detail-link-button-size',
			`${buttonSize}px`
		);
		document.documentElement.style.setProperty(
			'--member-detail-link-icon-size',
			`${buttonSize * 0.5}px`
		);
	}

	onMount(() => {
		if (!memberTileElement) {
			return;
		}

		setPageDetailLinkButtonSize(memberTileElement.getBoundingClientRect().width);

		const resizeObserver = new ResizeObserver(([entry]) => {
			setPageDetailLinkButtonSize(entry.contentRect.width);
		});

		resizeObserver.observe(memberTileElement);

		return () => {
			resizeObserver.disconnect();
		};
	});
</script>

<article
	bind:this={memberTileElement}
	class="memberTile group relative aspect-square overflow-visible rounded-lg bg-zinc-100 outline-none"
	onpointerenter={() => onPreview(member)}
	onpointerleave={onClearPreview}
	onfocusin={() => onPreview(member)}
	onfocusout={clearPreviewIfFocusLeaves}
>
	{#if member.headshot}
		<img
			class="h-full w-full rounded-lg object-cover transition-opacity duration-200 group-focus-within:opacity-70 group-hover:opacity-70"
			src={member.headshot}
			alt={`${getMemberName(member)} headshot`}
		/>
	{:else}
		<div
			class="flex h-full w-full items-center justify-center rounded-lg transition-opacity duration-200 group-focus-within:opacity-70 group-hover:opacity-70"
		>
			<UserRound aria-hidden="true" size={42} strokeWidth={1.6} class="text-zinc-400" />
		</div>
	{/if}

	<button
		type="button"
		class="absolute inset-0 z-10 cursor-default bg-transparent outline-none"
		aria-label={`Show details for ${getMemberName(member)}`}
		onfocus={() => onPreview(member)}
		onclick={() => onPreview(member)}
	></button>

	<span
		class="tileName pointer-events-none absolute inset-x-0 bottom-0 z-20 rounded-b-lg bg-gradient-to-t from-zinc-950/80 to-transparent px-2 pt-10 pb-2 text-white"
	>
		{member.firstName}
	</span>

	{#if hasLinks}
		<div
			class="memberActions absolute top-1 right-1 left-1 z-10 flex items-start justify-end gap-1 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100"
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

			{#if websiteLink}
				<Button
					variant="ghost"
					size="icon-sm"
					class={detailLinkButtonClass}
					href={websiteLink.url}
					target="_blank"
					rel="external noopener noreferrer"
					aria-label={`${getMemberName(member)} website`}
				>
					<Globe aria-hidden="true" />
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
									class="ml-auto flex w-full items-center justify-end gap-2 rounded-sm px-2 py-1.5 text-right text-sm outline-none hover:bg-white/60 hover:text-[#a51c30] focus-visible:bg-white/60 focus-visible:text-[#a51c30]"
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
