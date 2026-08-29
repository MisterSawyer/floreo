<script lang="ts">
	import { goto } from '$app/navigation';
	import Garden from '$lib/components/Garden.svelte';
	import { galleryError, galleryLoading, loadGallery, savedSeeds } from '$lib/stores/gallery';
	import { FLOWER_KINDS, generateFlower } from '$lib/flower/flower';
	import { t } from '$lib/i18n';
	import type { FlowerKind, Seed } from '$lib/flower/types';

	function select(seed: Seed) {
		goto(`/?seed=${seed}`);
	}

	let selectedKind: FlowerKind | null = $state(null);

	let seedKinds = $derived($savedSeeds.map((seed) => ({ seed, kind: generateFlower(seed).kind })));
	let presentKinds = $derived(
		FLOWER_KINDS.filter((kind) => seedKinds.some((s) => s.kind === kind))
	);
	let collectedCount = $derived(new Set(seedKinds.map((s) => s.kind)).size);
	let filteredSeeds = $derived(
		selectedKind ? seedKinds.filter((s) => s.kind === selectedKind).map((s) => s.seed) : $savedSeeds
	);
</script>

<svelte:head>
	<title>{$t('ui.gardenTitle')} — Floreo</title>
</svelte:head>

<main
	class="min-h-dvh bg-[linear-gradient(155deg,#f5eee7_0%,#e9f1e6_54%,#d7e7d6_100%)] pb-28 text-emerald-950"
>
	<header class="mx-auto max-w-6xl px-4 py-6 sm:px-8">
		<div>
			<p class="m-0 text-[0.62rem] font-bold tracking-[0.15em] text-emerald-900/45 uppercase">
				{$t('ui.yourCollection')}
			</p>
			<div class="mt-1 flex items-center gap-3">
				<h1 class="font-serif text-3xl font-normal tracking-tight">
					{$t('ui.seedGardenHeading')}
				</h1>
				{#if $savedSeeds.length > 0}
					<span
						class="grid size-9 shrink-0 place-items-center rounded-full border border-white/70 bg-white/40 text-sm font-semibold shadow-inner backdrop-blur-md"
						aria-label={$t('ui.totalFlowersCount', { count: $savedSeeds.length })}
					>
						{$savedSeeds.length}
					</span>
				{/if}
			</div>
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
	</header>

	<div class="mx-auto max-w-6xl">
		{#if $galleryLoading && $savedSeeds.length === 0}
			<div class="px-6 py-24 text-center" role="status">
				<p class="font-serif text-2xl">{$t('ui.loadingGarden')}</p>
			</div>
		{:else if $galleryError && $savedSeeds.length === 0}
			<div
				class="mx-4 mt-16 rounded-[2rem] border border-white/70 bg-white/40 px-6 py-16 text-center sm:mx-8"
				role="alert"
			>
				<p class="font-serif text-2xl">{$t('ui.gardenLoadError')}</p>
				<button
					type="button"
					onclick={() => loadGallery(true)}
					class="mt-6 inline-flex min-h-11 items-center rounded-full bg-emerald-950 px-5 text-sm font-semibold text-white"
				>
					{$t('ui.retry')}
				</button>
			</div>
		{:else if $savedSeeds.length === 0}
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
			{#if $galleryError}
				<p class="mx-4 mb-2 text-center text-sm text-rose-800" role="alert">
					{$t('ui.gardenUpdateError')}
				</p>
			{/if}
			{#if presentKinds.length > 0}
				<div class="flex flex-wrap gap-2 px-4 pb-2 sm:px-8">
					<button
						type="button"
						onclick={() => (selectedKind = null)}
						class="min-h-9 rounded-full border border-white/70 px-4 text-sm font-medium backdrop-blur-md transition-colors {selectedKind ===
						null
							? 'bg-emerald-950 text-white'
							: 'bg-white/40 text-emerald-950 hover:bg-white/60'}"
					>
						{$t('ui.filterAllSpecies')}
					</button>
					{#each presentKinds as kind (kind)}
						<button
							type="button"
							onclick={() => (selectedKind = kind)}
							class="min-h-9 rounded-full border border-white/70 px-4 text-sm font-medium backdrop-blur-md transition-colors {selectedKind ===
							kind
								? 'bg-emerald-950 text-white'
								: 'bg-white/40 text-emerald-950 hover:bg-white/60'}"
						>
							{$t(`speciesNames.${kind}`)}
						</button>
					{/each}
				</div>
			{/if}
			<Garden seeds={filteredSeeds} onSelect={select} />
		{/if}
	</div>
</main>
