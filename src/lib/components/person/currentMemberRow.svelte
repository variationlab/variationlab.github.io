<script lang="ts">
	import Globe from '@lucide/svelte/icons/globe';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import LinkIcon from '@lucide/svelte/icons/link';
	import Mail from '@lucide/svelte/icons/mail';
	import UserRound from '@lucide/svelte/icons/user-round';
	import { onDestroy } from 'svelte';
	import SocialLogo from '$lib/components/SocialLogo.svelte';
	import Image from '$lib/components/Image.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		getMemberEmailLink,
		getMemberGitHubLink,
		getMemberGoogleScholarLink,
		getMemberName,
		getMemberSocialLinks,
		getMemberStatus,
		getMemberWebsiteLink,
		hasMemberSocialLinks
	} from '$lib/data/Members';
	import type { Members } from '$lib/types';

	let { member }: { member: Members } = $props();

	let socialMenuOpen = $state(false);
	let socialMenuCloseTimer: ReturnType<typeof setTimeout> | undefined;

	const emailLink = $derived(getMemberEmailLink(member));
	const websiteLink = $derived(getMemberWebsiteLink(member));
	const googleScholarLink = $derived(getMemberGoogleScholarLink(member));
	const githubLink = $derived(getMemberGitHubLink(member));
	const socialLinks = $derived(getMemberSocialLinks(member));
	const hasLinks = $derived(
		Boolean(emailLink || websiteLink || googleScholarLink || githubLink) ||
			hasMemberSocialLinks(member)
	);

	function openSocialMenu() {
		if (socialMenuCloseTimer) {
			clearTimeout(socialMenuCloseTimer);
		}

		socialMenuOpen = true;
	}

	function scheduleCloseSocialMenu() {
		if (socialMenuCloseTimer) {
			clearTimeout(socialMenuCloseTimer);
		}

		socialMenuCloseTimer = setTimeout(() => {
			socialMenuOpen = false;
		}, 120);
	}

	function syncSocialMenu(open: boolean) {
		if (open) {
			openSocialMenu();
			return;
		}

		socialMenuOpen = false;
	}

	onDestroy(() => {
		if (socialMenuCloseTimer) {
			clearTimeout(socialMenuCloseTimer);
		}
	});

	const memberActionButtonClass =
		'size-(--member-action-size) text-zinc-600 transition-colors hover:text-(--brand-color) focus-visible:text-(--brand-color) [&_svg]:size-(--member-action-icon-size)';
	const socialTriggerButtonClass = `${memberActionButtonClass} data-[state=open]:text-(--brand-color)`;
</script>

{#snippet memberDetails()}
	<div class="min-w-0">
		<h2
			class="personTitle text-zinc-950 link-underline-base transition-colors group-hover/member:text-(--brand-color) group-hover/member:decoration-current group-focus-visible/member:text-(--brand-color) group-focus-visible/member:decoration-current"
		>
			{getMemberName(member)}
		</h2>
		<p class="bodyText mt-0.5 text-zinc-800 italic">{getMemberStatus(member)}</p>
		<p class="bodyText mt-0.5 text-zinc-700">{member.interests.join(', ')}</p>
	</div>
{/snippet}

<article class="flex min-w-0 items-start gap-4 py-1">
	{#if member.headshot}
		<Image
			class="h-28 w-28 shrink-0 rounded-sm object-cover"
			src={member.headshot}
			alt={`${getMemberName(member)} headshot`}
		/>
	{:else}
		<div class="flex h-28 w-28 shrink-0 items-center justify-center rounded-sm bg-zinc-100">
			<UserRound aria-hidden="true" size={36} strokeWidth={1.6} class="text-zinc-400" />
		</div>
	{/if}

	<div class="min-w-0 flex-1 pt-0.5">
		{#if websiteLink}
			<a
				class="group/member block rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-(--brand-color)"
				href={websiteLink.url}
				target="_blank"
				rel="external noopener noreferrer"
				aria-label={`${getMemberName(member)} website`}
			>
				{@render memberDetails()}
			</a>
		{:else}
			{@render memberDetails()}
		{/if}

		{#if hasLinks}
			<div class="mt-1.5 flex items-center gap-1.5">
				{#if emailLink}
					<Button
						variant="ghost"
						size="icon-sm"
						class={memberActionButtonClass}
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
						class={memberActionButtonClass}
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
						class={memberActionButtonClass}
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
						class={memberActionButtonClass}
						href={githubLink.url}
						target="_blank"
						rel="external noopener noreferrer"
						aria-label={`${getMemberName(member)} GitHub`}
					>
						<SocialLogo kind="github" />
					</Button>
				{/if}

				{#if hasMemberSocialLinks(member)}
					<DropdownMenu.Root open={socialMenuOpen} onOpenChange={syncSocialMenu}>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="ghost"
									size="icon-sm"
									class={socialTriggerButtonClass}
									aria-label={`${getMemberName(member)} social links`}
									onpointerenter={openSocialMenu}
									onpointerleave={scheduleCloseSocialMenu}
									onfocusin={openSocialMenu}
								>
									<LinkIcon aria-hidden="true" />
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							class="w-44"
							onpointerenter={openSocialMenu}
							onpointerleave={scheduleCloseSocialMenu}
						>
							{#each socialLinks as link (link.kind)}
								<DropdownMenu.Item>
									{#snippet child({ props })}
										<a
											{...props}
											class={`${props.class ?? ''} w-full text-zinc-800 link-underline hover:text-(--brand-color)`}
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
	</div>
</article>
