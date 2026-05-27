<script lang="ts">
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import LinkIcon from '@lucide/svelte/icons/link';
	import Mail from '@lucide/svelte/icons/mail';
	import UserRound from '@lucide/svelte/icons/user-round';
	import { onDestroy } from 'svelte';
	import SocialLogo from '$lib/components/SocialLogo.svelte';
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
		Boolean(emailLink || googleScholarLink || githubLink) || hasMemberSocialLinks(member)
	);
	const actionCount = $derived(
		Number(Boolean(emailLink)) +
			Number(Boolean(googleScholarLink)) +
			Number(Boolean(githubLink)) +
			Number(socialLinks.length > 0)
	);
	const actionGapCount = $derived(Math.max(actionCount - 1, 0));

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
		'size-[var(--member-action-size)] text-zinc-600 transition-colors hover:text-[#a51c30] focus-visible:text-[#a51c30] [&_svg]:size-[var(--member-action-icon-size)]';
	const socialTriggerButtonClass = `${memberActionButtonClass} data-[state=open]:text-[#a51c30]`;
</script>

{#snippet memberSummary()}
	<div class="min-w-0">
		<h3
			class="personTitle truncate text-zinc-950 group-hover/alumni:text-[#a51c30] group-focus-visible/alumni:text-[#a51c30]"
		>
			{getMemberName(member)}
		</h3>
		{#if member.formerRole && member.currentRole}
			<div class="bodyText mt-0.5 text-zinc-800">
				<p>
					<span class="font-bold text-zinc-950">Former:</span>
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
		<img
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
		{#if websiteLink}
			<a
				class="group/alumni block rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#a51c30]"
				href={websiteLink.url}
				target="_blank"
				rel="external noopener noreferrer"
				aria-label={`${getMemberName(member)} website`}
			>
				{@render memberSummary()}
			</a>
		{:else}
			{@render memberSummary()}
		{/if}

		{#if hasLinks}
			<div
				class="memberRowActions mt-1.5 flex items-center gap-[var(--member-action-gap)]"
				style={`--member-action-count: ${actionCount}; --member-action-gap-count: ${actionGapCount};`}
			>
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
	</div>
</article>

<style>
	.memberRowActions {
		--member-action-source-width: 4rem;
		--member-action-default-size: 2rem;
		--member-action-gap: 0.25rem;
		--member-action-calculated-size: calc(
			(
					var(--member-action-source-width) -
						(var(--member-action-gap-count) * var(--member-action-gap))
				) /
				var(--member-action-count)
		);
		--member-action-size: min(
			var(--member-action-calculated-size),
			var(--member-action-default-size)
		);
		--member-action-icon-size: calc(var(--member-action-size) * 0.5);
	}
</style>
