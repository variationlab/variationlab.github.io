<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { browser } from '$app/environment';
	import TextAlignJustify from '@lucide/svelte/icons/text-align-justify';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { hashRoutes, normalizeHash, type RouteId } from '$lib/HashRoutes';
	import { onMount } from 'svelte';

	let { children } = $props();

	let activeRouteId = $state<RouteId>(browser ? normalizeHash(window.location.hash) : 'home');

	function syncActiveRoute() {
		activeRouteId = normalizeHash(window.location.hash);
	}

	onMount(() => {
		syncActiveRoute();
		window.addEventListener('hashchange', syncActiveRoute);

		return () => {
			window.removeEventListener('hashchange', syncActiveRoute);
		};
	});
</script>

<div class="flex min-h-screen max-w-full flex-col bg-white">
	<header class="sticky top-0 z-50 border-b border-zinc-200 bg-white">
		<div
			class="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-3 font-sans sm:px-5 lg:px-6"
		>
			<a
				class="group flex shrink-0 items-center gap-3"
				href="#/"
				aria-label="The Variation Lab home"
			>
				<img class="h-10 w-auto" src="/images/harvard-hci-logo.png" alt="Harvard HCI" />
				<span
					class="navBrand border-b border-transparent text-zinc-950 transition-colors group-hover:border-zinc-300 group-hover:text-[#a51c30] group-focus-visible:border-zinc-300 group-focus-visible:text-[#a51c30]"
				>
					<span class="text-harvard">Harvard</span> Variation Lab
				</span>
			</a>
			<nav
				class="navText ml-auto hidden flex-wrap items-baseline justify-end gap-x-4 gap-y-2 text-zinc-600 sm:flex"
				aria-label="Primary"
			>
				{#each hashRoutes as route (route.id)}
					<a
						class={activeRouteId === route.id
							? 'text-harvard border-b border-current font-semibold'
							: 'border-b border-transparent hover:border-zinc-300 hover:text-[#a51c30]'}
						href={'#' + route.href.slice(1)}
						aria-current={activeRouteId === route.id ? 'page' : undefined}>{route.label}</a
					>
				{/each}
			</nav>

			<div class="ml-auto sm:hidden">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="ghost"
								size="icon"
								class="text-zinc-700 hover:text-[#a51c30] data-[state=open]:text-[#a51c30]"
								aria-label="Open navigation menu"
							>
								<TextAlignJustify aria-hidden="true" size={22} />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-44">
						{#each hashRoutes as route (route.id)}
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a
										{...props}
										class={`${props.class ?? ''} w-full ${
											activeRouteId === route.id
												? 'font-semibold text-[#a51c30]'
												: 'text-zinc-700 hover:text-[#a51c30]'
										}`}
										href={'#' + route.href.slice(1)}
										aria-current={activeRouteId === route.id ? 'page' : undefined}
									>
										{route.label}
									</a>
								{/snippet}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</header>

	<div class="mx-auto w-full max-w-5xl flex-1 px-4 py-5 font-sans sm:px-5 lg:px-6">
		<main class="w-full">
			{@render children()}
		</main>
	</div>

	<footer class="mt-12 bg-[#303a46] px-4 py-9 font-sans text-white sm:px-5 lg:px-6">
		<div class="mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
			<div class="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
				<div class="footerBrand text-right">
					<span class="block">Variation</span>
					<span class="block">Lab</span>
				</div>
				<div class="h-16 w-px bg-white/30"></div>
				<img class="h-16 w-auto max-w-72" src="/images/harvard-seas.svg" alt="Harvard SEAS" />
			</div>

			<nav
				class="footerNav flex flex-wrap items-center justify-center gap-x-2 gap-y-2"
				aria-label="Footer"
			>
				{#each hashRoutes as route, index (route.id)}
					{#if index > 0}<span class="text-white/60">/</span>{/if}
					<a class="text-white hover:text-white/75" href={'#' + route.href.slice(1)}>
						{route.label}
					</a>
				{/each}
			</nav>

			<p class="footerCopyright text-center text-white/55">
				Copyright © 2026 The President and Fellows of Harvard College
			</p>
		</div>
	</footer>
</div>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
