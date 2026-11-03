<script lang="ts">
	const linkClass = 'font-semibold text-harvard link-underline';
	const elenaEmail = 'glassman@seas.harvard.edu';

	type DescriptionPart = { text: string; graduate?: boolean };

	const courses: {
		code: string;
		title: string;
		term: string;
		termNote: string;
		description: DescriptionPart[];
	}[] = [
		{
			code: 'CS 1780 / CS 2780',
			title: 'Usable Interactive Systems',
			term: 'Spring 2026',
			termNote: 'is the CS 2780 addition for graduate students.',
			description: [
				{
					text: 'Students learn critical techniques, concepts, and technologies for building usable '
				},
				{ text: 'novel', graduate: true },
				{
					text: ' interactive systems, alone and in teams. Assignments provide hands-on experiences with different modern frameworks, platforms, and libraries while conceptual commonalities and distinctions are annotated and explained at multiple levels, from the programming environments to the interfaces users interact with. Discussions grounded in readings will also cover human cognitive capabilities, iterative prototyping, and human-AI interaction. The final research project requires iteratively designing and building a '
				},
				{ text: 'novel', graduate: true },
				{
					text: ' interactive system informed by pilot user studies and a final evaluation with target users. Designed for advanced undergraduates. '
				},
				{
					text: 'Designed for PhD students interested in HCI or using interactive systems as tools for discovery in other fields.',
					graduate: true
				}
			]
		},
		{
			code: 'CS 2790R',
			title: '',
			term: 'Fall 2025',
			termNote: '',
			description: []
		}
	];
</script>

<section>
	<div class="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
		<h1 class="pageTitle text-zinc-950">Courses</h1>
	</div>

	<p class="bodyText text-zinc-700">
		These classes will be taught again starting in the 2027-2028 academic year. Interested students
		can submit petitions through my.harvard and find more instructions on the respective Canvas pages
		once they are live. Harvard undergraduates and graduate students interested in doing a CS 91R or
		CS 2990R, respectively, with Elena should
		<a class={linkClass} href="mailto:{elenaEmail}">email her directly</a>.
	</p>
</section>

{#each courses as course (course.code)}
	<section class="mt-8">
		<h2 class="sectionTitle text-zinc-950">
			{course.code}{course.title ? `: ${course.title}` : ''}
		</h2>
		<p class="metaText mt-1 text-zinc-600">
			{course.term}{#if course.termNote}
				<span> — <span class="underline">Underlined text</span> {course.termNote}</span>
			{/if}
		</p>
		{#if course.description.length}
			<p class="bodyText mt-3 text-zinc-700">
				{#each course.description as part, index (index)}{#if part.graduate}<span class="underline"
						>{part.text}</span
					>{:else}{part.text}{/if}{/each}
			</p>
		{/if}
	</section>
{/each}
