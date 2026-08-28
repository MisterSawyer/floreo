<script lang="ts">
	import { goto } from '$app/navigation';
	import Garden from '$lib/components/Garden.svelte';
	import { savedSeeds } from '$lib/stores/gallery';
	import { FLOWER_KINDS, generateFlower } from '$lib/flower/flower';
	import { t } from '$lib/i18n';
	import type { Seed } from '$lib/flower/types';

	function select(seed: Seed) {
		goto(`/?seed=${seed}`);
	}

	let collectedCount = $derived(
		new Set($savedSeeds.map((seed) => generateFlower(seed).kind)).size
	);
</script>

<svelte:head>
	<title>{$t('ui.gardenTitle')} — Floreo</title>
</svelte:head>

<main
	class="min-h-dvh bg-[linear-gradient(155deg,#f5eee7_0%,#e9f1e6_54%,#d7e7d6_100%)] pb-12 text-emerald-950"
>
	<header class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-8">
		<div>
			<p class="m-0 text-[0.62rem] font-bold tracking-[0.15em] text-emerald-900/45 uppercase">
				{$t('ui.yourCollection')}
			</p>
			<h1 class="mt-1 font-serif text-3xl font-normal tracking-tight">
				{$t('ui.seedGardenHeading')}
			</h1>
			{#if $savedSeeds.length > 0}
				<div class="mt-2">
					<div
						class="h-2.5 w-40 overflow-hidden rounded-full border border-white/70 bg-white/40 shadow-inner backdrop-blur-md sm:w-56"
					>
						<div
							class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-700 shadow-[0_0_8px_rgba(4,120,87,0.5)] transition-[width] duration-700 ease-out"
							style="width: {(collectedCount / FLOWER_KINDS.length) * 100}%"
						></div>
					</div>
					<p class="mt-1 text-sm text-emerald-900/55">
						{$t('ui.speciesCollected', { count: collectedCount, total: FLOWER_KINDS.length })}
					</p>
				</div>
			{/if}
		</div>
		<a
			href="/"
			aria-label={$t('ui.growAnotherFlower')}
			class="grid size-12 shrink-0 place-items-center rounded-full border border-white/40 bg-white/35 text-emerald-950 shadow-[0_18px_55px_rgb(31_74_53/0.18),inset_0_1px_rgb(255_255_255/0.6)] backdrop-blur-2xl backdrop-saturate-150 transition-transform active:scale-95"
		>
			<svg viewBox="0 0 24 24" class="size-9" aria-hidden="true">
				<g fill="currentColor">
					{#each [0, 60, 120, 180, 240, 300] as angle}
						<ellipse
							cx="12"
							cy="6.8"
							rx="2.1"
							ry="3.4"
							transform="rotate({angle} 12 12)"
							opacity="0.9"
						/>
					{/each}
				</g>
				<circle cx="12" cy="12" r="2.6" fill="white" />
				<circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="0.6" />
			</svg>
		</a>
	</header>

	<div class="mx-auto max-w-6xl">
		{#if $savedSeeds.length === 0}
			<div
				class="mx-4 mt-16 rounded-[2rem] border border-white/70 bg-white/40 px-6 py-16 text-center sm:mx-8"
			>
				<p class="font-serif text-2xl">{$t('ui.gardenWaitingTitle')}</p>
				<p class="mt-2 text-sm text-emerald-900/55">{$t('ui.gardenWaitingSubtitle')}</p>
				<a
					href="/"
					class="mt-6 inline-flex min-h-11 items-center rounded-full bg-emerald-950 px-5 text-sm font-semibold text-white"
				>
					{$t('ui.growFirstFlower')}
				</a>
			</div>
		{:else}
			<Garden seeds={$savedSeeds} onSelect={select} />
		{/if}
	</div>
</main>
