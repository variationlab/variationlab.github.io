<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Building2 from '@lucide/svelte/icons/building-2';
	import Globe from '@lucide/svelte/icons/globe';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import Mail from '@lucide/svelte/icons/mail';
	import UserRound from '@lucide/svelte/icons/user-round';
	import Image from '$lib/components/Image.svelte';
	import SocialLogo from '$lib/components/SocialLogo.svelte';
	import site from '$lib/data/Site';
	import {
		getMemberEmailLink,
		getMemberName,
		getMemberProfileLinks,
		getMemberStatus,
		type MemberDirectLink,
		type MemberSocialLink
	} from '$lib/data/Members';
	import type { MemberProfileLinkIcon } from '$lib/types';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const member = $derived(data.member);
	const office = $derived(member.office?.trim() ?? '');
	const emailLink = $derived(getMemberEmailLink(member));
	const links = $derived(getMemberProfileLinks(member));
	const linkLabels = {
		github: 'GitHub',
		googleScholar: 'Google Scholar',
		linkedin: 'LinkedIn',
		twitter: 'Twitter',
		bluesky: 'Bluesky',
		website: 'Website'
	} as const;

	type ProfileLinkKind = MemberDirectLink['kind'] | MemberSocialLink['kind'];
</script>

{#snippet linkIcon(kind: ProfileLinkKind | MemberProfileLinkIcon)}
	{#if kind === 'website'}
		<Globe aria-hidden="true" size={16} />
	{:else if kind === 'googleScholar'}
		<GraduationCap aria-hidden="true" size={16} />
	{:else if kind === 'github' || kind === 'linkedin' || kind === 'twitter' || kind === 'bluesky'}
		<SocialLogo {kind} size={15} />
	{/if}
{/snippet}

<svelte:head>
	<title>{getMemberName(member)} | {site.title}</title>
	{#if member.bio}
		<meta name="description" content={member.bio} />
	{/if}
</svelte:head>

<article>
	<a class="homeLink homeLinkSecondary gap-2" href="/people">
		<ArrowLeft aria-hidden="true" size={16} />
		Back to People
	</a>

	<div class="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
		<div class="w-48 shrink-0 sm:w-64">
			{#if member.headshot}
				<Image
					class="h-48 w-48 rounded-lg object-cover sm:h-64 sm:w-64"
					src={member.headshot}
					alt={`${getMemberName(member)} headshot`}
				/>
			{:else}
				<div
					class="flex h-48 w-48 items-center justify-center rounded-lg bg-zinc-100 sm:h-64 sm:w-64"
				>
					<UserRound aria-hidden="true" size={64} strokeWidth={1.6} class="text-zinc-400" />
				</div>
			{/if}

			{#if office || emailLink}
				<div class="mt-3 flex flex-col items-center gap-2">
					{#if emailLink}
						<a
							class="metaText flex items-start justify-center gap-1.5 text-center text-zinc-700 hover:text-[var(--brand-color)]"
							href={emailLink.url}
						>
							<Mail aria-hidden="true" class="mt-0.5 shrink-0" size={16} />
							<span class="break-all">{member.email}</span>
						</a>
					{/if}
					{#if office}
						<p
							class="metaText flex items-start justify-center gap-1.5 text-center text-zinc-700"
						>
							<Building2 aria-hidden="true" class="mt-0.5 shrink-0" size={16} />
							<span>{office}</span>
						</p>
					{/if}
				</div>
			{/if}
		</div>

		<div class="min-w-0">
			<h1 class="personTitle text-zinc-950">{getMemberName(member)}</h1>
			<p class="bodyText mt-1 text-zinc-800 italic">{getMemberStatus(member)}</p>
			<p class="bodyText mt-1 text-zinc-700">{member.interests.join(', ')}</p>
			{#if member.bio}
				<hr class="my-4 max-w-2xl border-zinc-200" />
				<p class="bodyText max-w-2xl whitespace-pre-line text-zinc-700">{member.bio}</p>
			{/if}
			{#if links.length > 0}
				<div class="mt-4 flex flex-wrap gap-x-4 gap-y-2">
					{#each links as link (`${link.icon}:${link.title ?? ''}:${link.url}`)}
						<a
							class="smallLink inline-flex items-center gap-1.5 text-zinc-950 hover:text-[var(--brand-color)]"
							href={link.url}
							target="_blank"
							rel="external noopener noreferrer"
						>
							{@render linkIcon(link.icon)}
							{link.title || linkLabels[link.icon]}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</article>
