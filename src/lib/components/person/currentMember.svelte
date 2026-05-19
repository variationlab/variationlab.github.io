<script lang="ts">
	import Globe from '@lucide/svelte/icons/globe';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import LinkIcon from '@lucide/svelte/icons/link';
	import Mail from '@lucide/svelte/icons/mail';
	import UserRound from '@lucide/svelte/icons/user-round';
	import SocialLogo from '$lib/components/SocialLogo.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		getMemberEmailLink,
		getMemberGoogleScholarLink,
		getMemberName,
		getMemberSocialLinks,
		getMemberWebsiteLink,
		hasMemberSocialLinks
	} from '$lib/data/Members';
	import type { Members } from '$lib/types';

	type CurrentMemberProps = {
		member: Members;
		socialMenuOpen: boolean;
		onPreview: (member: Members) => void;
		onClearPreview: () => void;
		onOpenSocialMenu: (member: Members) => void;
		onScheduleCloseSocialMenu: (member: Members) => void;
		onSyncSocialMenu: (member: Members, open: boolean) => void;
	};

	let {
		member,
		socialMenuOpen,
		onPreview,
		onClearPreview,
		onOpenSocialMenu,
		onScheduleCloseSocialMenu,
		onSyncSocialMenu
	}: CurrentMemberProps = $props();

	const emailLink = $derived(getMemberEmailLink(member));
	const websiteLink = $derived(getMemberWebsiteLink(member));
	const googleScholarLink = $derived(getMemberGoogleScholarLink(member));
	const socialLinks = $derived(getMemberSocialLinks(member));
	const hasLinks = $derived(
		Boolean(emailLink || websiteLink || googleScholarLink) || hasMemberSocialLinks(member)
	);

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

	const socialTriggerButtonClass =
		'w-8 text-zinc-600 transition-colors hover:text-[#a51c30] focus-visible:text-[#a51c30] data-[state=open]:text-[#a51c30]';
	const currentTileSocialTriggerButtonClass = `${socialTriggerButtonClass} bg-white/90 shadow-sm hover:bg-white focus-visible:bg-white data-[state=open]:bg-white`;
</script>

<article
	class="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100 shadow-sm ring-1 ring-zinc-200 outline-none"
	onpointerenter={() => onPreview(member)}
	onpointerleave={onClearPreview}
	onfocusin={() => onPreview(member)}
	onfocusout={clearPreviewIfFocusLeaves}
>
	{#if member.headshot}
		<img
			class="h-full w-full object-cover transition-opacity duration-200 group-focus-within:opacity-70 group-hover:opacity-70"
			src={member.headshot}
			alt={`${getMemberName(member)} headshot`}
		/>
	{:else}
		<div
			class="flex h-full w-full items-center justify-center transition-opacity duration-200 group-focus-within:opacity-70 group-hover:opacity-70"
		>
			<UserRound aria-hidden="true" size={42} strokeWidth={1.6} class="text-zinc-400" />
		</div>
	{/if}

	<button
		type="button"
		class="absolute inset-0 z-10 cursor-default bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#a51c30]"
		aria-label={`Show details for ${getMemberName(member)}`}
		onfocus={() => onPreview(member)}
		onclick={() => onPreview(member)}
	></button>

	<span
		class="tileName pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-zinc-950/80 to-transparent px-2 pt-10 pb-2 text-white"
	>
		{member.firstName}
	</span>

	{#if hasLinks}
		<div
			class="absolute top-2 left-2 z-[60] flex items-center gap-1 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100"
		>
			{#if emailLink}
				<Button
					variant="ghost"
					size="icon-sm"
					class="bg-white/90 text-zinc-700 shadow-sm hover:bg-white hover:text-[#a51c30]"
					href={emailLink.url}
					target="_blank"
					rel="external noopener noreferrer"
					aria-label={`Email ${getMemberName(member)}`}
				>
					<Mail aria-hidden="true" size={15} />
				</Button>
			{/if}

			{#if websiteLink}
				<Button
					variant="ghost"
					size="icon-sm"
					class="bg-white/90 text-zinc-700 shadow-sm hover:bg-white hover:text-[#a51c30]"
					href={websiteLink.url}
					target="_blank"
					rel="external noopener noreferrer"
					aria-label={`${getMemberName(member)} website`}
				>
					<Globe aria-hidden="true" size={15} />
				</Button>
			{/if}

			{#if googleScholarLink}
				<Button
					variant="ghost"
					size="icon-sm"
					class="bg-white/90 text-zinc-700 shadow-sm hover:bg-white hover:text-[#a51c30]"
					href={googleScholarLink.url}
					target="_blank"
					rel="external noopener noreferrer"
					aria-label={`${getMemberName(member)} Google Scholar`}
				>
					<GraduationCap aria-hidden="true" size={15} />
				</Button>
			{/if}

			{#if hasMemberSocialLinks(member)}
				<DropdownMenu.Root
					open={socialMenuOpen}
					onOpenChange={(open) => onSyncSocialMenu(member, open)}
				>
					<DropdownMenu.Trigger
						onpointerenter={() => onOpenSocialMenu(member)}
						onpointerleave={() => onScheduleCloseSocialMenu(member)}
						onfocusin={() => onOpenSocialMenu(member)}
					>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="ghost"
								size="icon-sm"
								class={currentTileSocialTriggerButtonClass}
								aria-label={`${getMemberName(member)} social links`}
							>
								<LinkIcon aria-hidden="true" size={15} />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="z-40 w-44"
						onpointerenter={() => onOpenSocialMenu(member)}
						onpointerleave={() => onScheduleCloseSocialMenu(member)}
					>
						{#each socialLinks as link (link.kind)}
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a
										{...props}
										class={`${props.class ?? ''} w-full text-zinc-800 hover:text-[#a51c30]`}
										href={link.url}
										target="_blank"
										rel="external noopener noreferrer"
									>
										<SocialLogo kind={link.kind} />
										<span>{link.label}</span>
									</a>
								{/snippet}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
		</div>
	{/if}
</article>
