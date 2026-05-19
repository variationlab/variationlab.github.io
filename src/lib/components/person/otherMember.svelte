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
	const socialLinks = $derived(getMemberSocialLinks(member));

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

	const socialTriggerButtonClass =
		'w-8 text-zinc-600 transition-colors hover:text-[#a51c30] focus-visible:text-[#a51c30] data-[state=open]:text-[#a51c30]';
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

		{#if emailLink || googleScholarLink || hasMemberSocialLinks(member)}
			<div class="mt-1.5 flex items-center gap-1">
				{#if emailLink}
					<Button
						variant="ghost"
						size="icon-sm"
						class="text-zinc-600 hover:text-[#a51c30]"
						href={emailLink.url}
						target="_blank"
						rel="external noopener noreferrer"
						aria-label={`Email ${getMemberName(member)}`}
					>
						<Mail aria-hidden="true" size={15} />
					</Button>
				{/if}

				{#if googleScholarLink}
					<Button
						variant="ghost"
						size="icon-sm"
						class="text-zinc-600 hover:text-[#a51c30]"
						href={googleScholarLink.url}
						target="_blank"
						rel="external noopener noreferrer"
						aria-label={`${getMemberName(member)} Google Scholar`}
					>
						<GraduationCap aria-hidden="true" size={15} />
					</Button>
				{/if}

				{#if hasMemberSocialLinks(member)}
					<DropdownMenu.Root open={socialMenuOpen} onOpenChange={syncSocialMenu}>
						<DropdownMenu.Trigger
							onpointerenter={openSocialMenu}
							onpointerleave={scheduleCloseSocialMenu}
							onfocusin={openSocialMenu}
						>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="ghost"
									size="icon-sm"
									class={socialTriggerButtonClass}
									aria-label={`${getMemberName(member)} social links`}
								>
									<LinkIcon aria-hidden="true" size={15} />
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
