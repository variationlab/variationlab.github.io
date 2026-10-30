<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import site from '$lib/data/Site';
	import { getSelectedPublications, getLabAuthorMemberships } from '$lib/data/Publications';
	import { getMemberName, orderActiveMembers } from '$lib/data/Members';
	import HomeMember from '$lib/components/person/homeMember.svelte';
	import PublicationList from '$lib/components/projects/publicationList.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const researchThemes = [
		{
			title: 'Designing for hard-to-measure value',
			description:
				'Recognizing activities whose value lies in the effort and experience itself, so AI assistance does not shortcut the meaning people would otherwise find.'
		},
		{
			title: 'AI-resilient interface design',
			description:
				'Helping people notice AI choices and giving them the context to judge whether those choices are wrong, or simply not right for them.'
		},
		{
			title: 'Theory-connected systems',
			description:
				'Building interfaces on theories of learning, attention, and emotion regulation, even when they defy common usability guidelines, and the infrastructure to do this across HCI.'
		}
	];

	let currentMembers = $derived(orderActiveMembers(data.members));
	let selectedPublications = $derived(getSelectedPublications(data.publications));
	let labAuthorMemberships = $derived(getLabAuthorMemberships(data.members));
</script>

<svelte:head>
	<title>{site.title}</title>
</svelte:head>

<section class="grid gap-8 md:items-start">
	<!-- min-w-0 lets this grid item shrink to narrow screens instead of growing to its content. -->
	<div class="min-w-0">
		<p class="bodyText mt-4 font-semibold text-zinc-900">
			We are the <span class="text-harvard">Variation Lab</span> from Harvard SEAS. We build AI-resilient
			interfaces that help people notice, evaluate, and recover from AI choices during open-ended work
			like reading, writing, ideating, and sensemaking.
		</p>
		<!-- As many 8rem (photo-width) columns as fit, up to 6 per row; the column width never drops
		     below a sixth of the row, so wide screens stop at 6. Members wrap onto further rows. -->
		<ul
			class="mt-6 grid grid-cols-[repeat(auto-fill,minmax(max(8rem,calc((100%_-_5rem)/6)),1fr))] items-start gap-x-4 gap-y-6"
		>
			{#each currentMembers as member (getMemberName(member))}
				<li class="min-w-0">
					<HomeMember {member} />
				</li>
			{/each}
		</ul>
		<div class="mt-6 space-y-4">
			<p class="bodyText text-zinc-700">
				AI is powerful, but it can be wrong, contextually inappropriate, or subjectively bad—and
				suppress the user’s critical engagement and learning at the same time. The Variation Lab’s
				research is defining and refining our understanding of AI-resilient interfaces that help
				people use AI while (a) maintaining their ability to notice AI choices, e.g., by spurring
				curiosity and cognitive engagement through surfacing variation in the data and/or the AI’s
				outputs and (b) giving them the context necessary to evaluate whether those choices are
				wrong, or at least not right for them. This is critical during context- and
				preference-dominated open-ended tasks, like ideating, searching, sensemaking, and reading or
				writing text and code at scale.
			</p>
			<p class="bodyText text-zinc-700">
				AI-resilient interfaces improve AI safety, usability, and utility by working with, not
				against, human perception, attention, and cognition. To achieve this, we derive and
				disseminate design implications from cognitive science and empirical studies of novel system
				prototypes, even and especially when these implications fly in the face of common usability
				guidelines.
			</p>
		</div>
		<div class="mt-6 flex flex-wrap gap-3">
			<a class="homeLink" href="/publications">View Publications</a>
			<a class="homeLink homeLinkSecondary" href="/people">Meet People</a>
		</div>
	</div>
</section>

<section class="mt-10 border-t border-zinc-200 pt-6" aria-labelledby="research-themes-title">
	<h2 id="research-themes-title" class="sectionTitle mb-5 text-zinc-950">Research Themes</h2>
	<div class="grid gap-x-10 gap-y-6 md:grid-cols-3">
		{#each researchThemes as theme (theme.title)}
			<article>
				<h3 class="itemTitle text-harvard">{theme.title}</h3>
				<p class="bodyText mt-1 text-zinc-700">{theme.description}</p>
			</article>
		{/each}
	</div>
</section>

<section class="mt-10 border-t border-zinc-200 pt-6">
	<div class="mb-4 flex items-baseline justify-between gap-4">
		<h2 class="sectionTitle text-zinc-950">Selected Publications</h2>
		<Button
			variant="link"
			href="/publications"
			class="smallLink text-harvard h-auto gap-1.5 border-0 p-0"
		>
			<ArrowRight aria-hidden="true" />
			<span>View all papers</span>
		</Button>
	</div>
	<PublicationList publications={selectedPublications} {labAuthorMemberships} />
</section>
