<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Info from '@lucide/svelte/icons/info';
	import { Button } from '$lib/components/ui/button';
</script>

<aside
	class="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-(--brand-color)/15 bg-(--brand-color)/5 px-4 py-3 sm:px-5"
	aria-label="Join us"
>
	<p class="bodyText flex min-w-0 flex-1 items-center gap-2.5 text-zinc-800">
		<Info class="size-5 shrink-0 text-harvard" aria-hidden="true" />
		<span>We are always looking for motivated collaborators to work with us!</span>
	</p>
	<Button
		variant="link"
		href="#/contact"
		class="smallLink h-auto gap-1.5 border-0 p-0 text-harvard"
	>
		<ArrowRight aria-hidden="true" />
		<span>Contact us</span>
	</Button>
</aside>
