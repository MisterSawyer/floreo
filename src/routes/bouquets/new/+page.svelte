<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Flower from '$lib/components/Flower.svelte';
	import { FLOWER_KINDS, generateFlower } from '$lib/flower/flower';
	import { bouquetNameExists, bouquets, createBouquet } from '$lib/stores/bouquets';
	import { galleryLoading, savedSeeds } from '$lib/stores/gallery';
	import { t } from '$lib/i18n';
	import type { FlowerKind, Seed } from '$lib/flower/types';

	let selected = $state(new Set<Seed>());
	let selectedKind: FlowerKind | null = $state(null);
	let saving = $state(false);
	let saveFailed = $state(false);
	let duplicateName = $state(false);
	let name = $derived(page.url.searchParams.get('name')?.trim() ?? '');
	let nameTaken = $derived(bouquetNameExists(name, $bouquets));
	let nameUnavailable = $derived(nameTaken || duplicateName);
	let seedKinds = $derived($savedSeeds.map((seed) => ({ seed, kind: generateFlower(seed).kind })));
	let presentKinds = $derived(
		FLOWER_KINDS.filter((kind) => seedKinds.some((flower) => flower.kind === kind))
	);
	let filteredSeeds = $derived(
		selectedKind
			? seedKinds.filter((flower) => flower.kind === selectedKind).map((flower) => flower.seed)
			: $savedSeeds
	);

	function toggle(seed: Seed) {
		selected = new Set(selected);
		if (selected.has(seed)) selected.delete(seed);
		else selected.add(seed);
	}

	async function save() {
		saving = true;
		saveFailed = false;
		duplicateName = false;
		const result = await createBouquet(name, [...selected]);
		if (result === 'created') await goto('/bouquets');
		else {
			duplicateName = result === 'duplicate';
			saveFailed = !duplicateName;
			saving = false;
		}
	}
</script>

<svelte:head><title>{name || $t('ui.bouquetsHeading')} — Floreo</title></svelte:head>

<main
	class="min-h-dvh bg-[linear-gradient(155deg,#f5eee7_0%,#e9f1e6_54%,#d7e7d6_100%)] pb-28 text-emerald-950"
>
	<header class="mx-auto flex max-w-6xl items-start justify-between gap-4 px-4 py-6 sm:px-8">
		<div>
			<p class="m-0 text-[0.62rem] font-bold tracking-[0.15em] text-emerald-900/45 uppercase">
				{$t('ui.chooseFlowers')}
			</p>
			<h1 class="mt-1 font-serif text-3xl font-normal tracking-tight">
				{name || $t('ui.nameYourBouquet')}
			</h1>
			<p class="mt-1 text-sm text-emerald-900/55">
				{$t('ui.flowersSelected', { count: selected.size })}
			</p>
		</div>
		<a
			href="/bouquets"
			aria-label={$t('ui.backToBouquets')}
			class="mt-4 grid size-12 shrink-0 place-items-center rounded-full border border-white/70 bg-white/45 shadow-sm backdrop-blur-md transition-colors hover:bg-white/65"
		>
			<svg viewBox="0 0 24 24" class="size-8" fill="none" aria-hidden="true">
				<rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" stroke-width="1.6" />
				<circle cx="9" cy="8" r="1.2" fill="currentColor" />
				<circle cx="15" cy="8" r="1.2" fill="currentColor" />
				<circle cx="9" cy="16" r="1.2" fill="currentColor" />
				<circle cx="15" cy="16" r="1.2" fill="currentColor" />
			</svg>
		</a>
	</header>

	<div class="mx-auto max-w-6xl">
		{#if $galleryLoading && $savedSeeds.length === 0}
			<p class="py-24 text-center font-serif text-2xl" role="status">{$t('ui.loadingGarden')}</p>
		{:else if $savedSeeds.length === 0}
			<div class="px-4 py-20 text-center">
				<p class="font-serif text-2xl">{$t('ui.bouquetNeedsFlowers')}</p>
				<a
					href="/"
					class="mt-5 inline-flex rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white"
				>
					{$t('ui.growFirstFlower')}
				</a>
			</div>
		{:else}
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

			<fieldset class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
				<legend class="sr-only">{$t('ui.chooseFlowers')}</legend>
				{#each filteredSeeds as seed (seed)}
					{@const flower = generateFlower(seed)}
					{@const displayName = $t(`flowerNames.${flower.kind}.${flower.displayNameIndex}`)}
					<label
						class="relative flex min-h-[24rem] cursor-pointer flex-col items-center overflow-hidden rounded-[2rem] border bg-white/45 p-4 shadow-[0_14px_50px_rgb(45_83_55/0.08)] transition-all duration-300 {selected.has(
							seed
						)
							? 'border-emerald-700 ring-2 ring-emerald-700/25'
							: 'border-white/80 hover:-translate-y-1 hover:bg-white/60'}"
					>
						<input
							type="checkbox"
							checked={selected.has(seed)}
							onchange={() => toggle(seed)}
							class="absolute top-4 right-4 z-10 size-5 accent-emerald-800"
						/>
						<div class="min-h-0 w-full flex-1"><Flower {flower} animated={false} /></div>
						<div class="pb-2 text-center">
							<span class="font-serif text-xl">{displayName}</span>
							<span class="mt-0.5 block font-serif text-xs text-emerald-900/45 italic">
								{flower.botanicalName}
							</span>
						</div>
					</label>
				{/each}
			</fieldset>
		{/if}
	</div>

	<div
		class="fixed inset-x-0 bottom-0 z-30 flex justify-center px-3"
		style:padding-bottom="calc(env(safe-area-inset-bottom) + 0.75rem)"
	>
		<div class="text-center">
			{#if nameUnavailable}
				<p
					class="mb-2 rounded-full bg-amber-50/90 px-4 py-2 text-sm text-amber-800/75"
					role="status"
				>
					{$t('ui.bouquetNameTaken')}
				</p>
			{:else if saveFailed}
				<p class="mb-2 rounded-full bg-rose-50/90 px-4 py-2 text-sm text-rose-800/75" role="alert">
					{$t('ui.bouquetSaveError')}
				</p>
			{/if}
			<button
				type="button"
				onclick={save}
				disabled={!name || nameUnavailable || selected.size === 0 || saving}
				class="min-h-14 rounded-full bg-emerald-950 px-8 text-sm font-semibold text-white shadow-[0_18px_55px_rgb(31_74_53/0.25)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
			>
				{saving ? $t('ui.savingBouquet') : $t('ui.saveBouquet')} · {selected.size}
			</button>
		</div>
	</div>
</main>
