<script lang="ts" module>
	export function getPublicationYearId(year: number): string {
		return `publications-${year}`;
	}
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	let { years, class: className = '' }: { years: number[]; class?: string } = $props();

	// Distance from the viewport top (below the sticky header) at which a year counts as active.
	const activeOffset = 120;

	let activeYear = $state<number | undefined>(undefined);
	let lockedYear: number | null = null;
	let unlockTimer: ReturnType<typeof setTimeout> | undefined;

	function getYearSection(year: number): HTMLElement | null {
		return document.getElementById(getPublicationYearId(year));
	}

	function syncActiveYear() {
		if (lockedYear !== null || years.length === 0) return;

		const atPageBottom =
			window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
		if (atPageBottom) {
			activeYear = years[years.length - 1];
			return;
		}

		let currentYear = years[0];
		for (const year of years) {
			const section = getYearSection(year);
			if (section && section.getBoundingClientRect().top <= activeOffset) currentYear = year;
		}
		activeYear = currentYear;
	}

	function unlock() {
		lockedYear = null;
		clearTimeout(unlockTimer);
	}

	function selectYear(year: number) {
		const section = getYearSection(year);
		if (!section) return;

		// Keep the clicked year highlighted while smooth scrolling passes other years.
		activeYear = year;
		lockedYear = year;
		clearTimeout(unlockTimer);
		unlockTimer = setTimeout(unlock, 1000);

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
	}

	onMount(() => {
		let frame = 0;
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(syncActiveYear);
		};

		syncActiveYear();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		window.addEventListener('scrollend', unlock);

		return () => {
			cancelAnimationFrame(frame);
			clearTimeout(unlockTimer);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			window.removeEventListener('scrollend', unlock);
		};
	});
</script>

<nav class={className} aria-label="Publication years">
	<ul class="flex flex-col">
		{#each years as year (year)}
			{@const isActive = activeYear === year}
			<li>
				<Button
					variant="link"
					size="sm"
					class={`bodyText h-7 w-full justify-start rounded-none border-0 border-l-3 px-3 ${
						isActive
							? 'border-(--brand-color) font-bold text-(--brand-color) hover:text-(--brand-color)'
							: 'border-transparent font-normal text-zinc-800 hover:text-(--brand-color)'
					}`}
					aria-current={isActive ? 'location' : undefined}
					onclick={() => selectYear(year)}
				>
					<span>{year}</span>
				</Button>
			</li>
		{/each}
	</ul>
</nav>
