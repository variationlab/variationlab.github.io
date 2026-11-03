<script lang="ts">
	import Info from '@lucide/svelte/icons/info';

	const linkClass = 'font-semibold text-harvard link-underline';
	const labEmail = 'variation@g.harvard.edu';

	const fundingEmail = 'tdepodesta@seas.harvard.edu';
	type FaqAnswerPart = string | { text: string };
	const faqs: { question: string; answer: FaqAnswerPart[] }[] = [
		{
			question: 'Are there collaboration opportunities for non-Harvard affiliated students?',
			answer: [
				'If you are not affiliated with Harvard but would like to visit or collaborate with us (in person or remotely) for an extended period, maybe! Post-secondary students in the greater Boston area are especially encouraged to reach out. ',
				{
					text: 'Unfortunately, we do not have opportunities for high school/pre-college students.'
				}
			]
		},
		{
			question:
				'I have an idea for an interesting follow-up to a recent lab publication—who can I talk to?',
			answer: [
				'We love to talk to people with thoughts about our work! Most projects will list a corresponding author contact, but as a fallback you can email ',
				labEmail,
				'. The more brief and concrete you can make your description, the more likely we are to read it and get back to you.'
			]
		},
		{
			question: "How can I help fund the lab's research?",
			answer: [
				"Non-profits and philanthropists interested in funding the Variation Lab's research should reach out to ",
				labEmail,
				' or ',
				fundingEmail,
				', directly.'
			]
		},
		{
			question: 'Can I pay you to supervise a student?',
			answer: ['No.']
		}
	];
</script>

<section>
	<div class="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
		<h1 class="pageTitle text-zinc-950">Contact</h1>
	</div>

	<p class="bodyText text-zinc-700">
		We are always looking for motivated individuals to work with us! We aim to foster a vibrant,
		supportive community of undergraduates, master's students, PhD students, postdoctoral
		researchers, and collaborators who create open-source tools that augment human sensemaking and
		human-computer collaboration, as well as communal open-source resources like the
		<a
			class={linkClass}
			href="https://glassmanlab.seas.harvard.edu/theory-in-hci/"
			target="_blank"
			rel="external noopener noreferrer"
			>reading list and classroom activity examples for supporting HCI's engagement with theory</a
		>.
	</p>

	<aside
		class="mt-5 flex items-start gap-2.5 rounded-lg border border-zinc-200 px-4 py-3"
		aria-label="Course questions"
	>
		<Info class="text-harvard mt-0.5 size-5 shrink-0" aria-hidden="true" />
		<p class="bodyText text-zinc-800">
			<strong class="font-semibold text-zinc-950">Taking one of our classes?</strong> Please reach the
			course staff through the course's Canvas site or Ed discussion board instead of emailing the lab.
		</p>
	</aside>

	<p class="bodyText mt-5 text-zinc-700">
		<span class="underline">
			For all general + media inquiries, please email us at
			<a class={linkClass} href="mailto:{labEmail}">{labEmail}</a>.
		</span>
		This is an actively monitored inbox, but if we miss your email after one business week, feel free to bump!
		We are physically located on the second floor of Harvard's Science and Engineering Complex @ 150 Western Ave, Allston, MA 02134.
	</p>
</section>

<section class="mt-8">
	<h2 class="sectionTitle text-zinc-950">Postdoctoral Researchers</h2>
	<p class="bodyText mt-3 text-zinc-700">
		Interested postdocs should send an email to
		<a class={linkClass} href="mailto:{labEmail}">{labEmail}</a>.
	</p>
</section>

<section class="mt-8">
	<h2 class="sectionTitle text-zinc-950">PhD Students</h2>
	<p class="bodyText mt-3 text-zinc-700">
		We do not plan to recruit new PhD students for the Fall 2027 admissions cycle.
	</p>
	<p class="bodyText mt-3 text-zinc-700">
		If you are interested in applying in a future cycle, read
		<a
			class={linkClass}
			href="https://docs.google.com/document/d/1CTgkYFeM0JWyDfBiEkPl0LiIC0F81F9XGDyyCAiHDBA/edit?usp=sharing"
			target="_blank"
			rel="external noopener noreferrer"
			>more about what we're excited to pursue with new students</a
		>
		and browse our <a class={linkClass} href="/publications">publications</a> to find the directions that
		resonate with you.
	</p>
</section>

<section class="mt-8">
	<h2 class="sectionTitle text-zinc-950">Undergraduate, Master's, and Visiting Students</h2>
	<p class="bodyText mt-3 text-zinc-700">
		We <strong class="font-bold text-zinc-950">always welcome</strong> undergraduate, master's, and visiting
		students from a wide range of backgrounds. Visiting positions can be in person or remote.
	</p>
	<p class="bodyText mt-3 text-zinc-700">
		If you are interested in joining us, please email
		<a class={linkClass} href="mailto:{labEmail}">{labEmail}</a>
		or any of the <a class={linkClass} href="/people">current PhD students</a> whose interests align
		with yours. Please also fill out our
		<!-- TODO: link to the Google Form once it exists. -->
		<span class={linkClass}
			><a
				href="https://forms.gle/V272JwbmH95wWBNb7"
				target="_blank"
				rel="external noopener noreferrer">interest form</a
			></span
		> to help us get to know you better. We hope you can reach out to us with a goal in mind, and we will
		try our best to support you in this journey. We regularly review these requests, though we cannot
		guarantee a reply to every one.
	</p>
	<p class="bodyText mt-3 text-zinc-700">P.S. In person preferred!</p>
</section>

<section class="mt-8 border-t border-zinc-200 pt-6">
	<h2 class="sectionTitle text-zinc-950">FAQ</h2>
	<div class="mt-4 grid gap-x-6 gap-y-4 md:grid-cols-2">
		{#each faqs as faq (faq.question)}
			<div class="self-start">
				<h3 class="itemTitle bg-[var(--brand-surface)] px-4 py-3 text-zinc-950">
					<span class="text-harvard">Q:</span>
					{faq.question}
				</h3>
				<p class="bodyText px-4 py-3 text-zinc-800">
					<span class="text-harvard font-semibold">A:</span>
					{#each faq.answer as part, index (index)}{#if typeof part !== 'string'}<span
							class="underline">{part.text}</span
						>{:else if part.includes('@')}<a class={linkClass} href="mailto:{part}">{part}</a
						>{:else}{part}{/if}{/each}
				</p>
			</div>
		{/each}
	</div>
</section>
