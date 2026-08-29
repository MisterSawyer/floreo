<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { MAX_BOUQUET_NAME_LENGTH } from '$lib/bouquet';
	import Flower from '$lib/components/Flower.svelte';
	import { FLOWER_KINDS, generateFlower } from '$lib/flower/flower';
	import {
		bouquetNameExists,
		bouquets,
		bouquetsLoading,
		createBouquet,
		updateBouquet
	} from '$lib/stores/bouquets';
	import { galleryLoading, savedSeeds } from '$lib/stores/gallery';
	import { navBar } from '$lib/stores/navBar.svelte';
	import { t } from '$lib/i18n';
	import type { FlowerKind, Seed } from '$lib/flower/types';

	let selected = $state(new Set<Seed>());
	let selectedKind: FlowerKind | null = $state(null);
	let saving = $state(false);
	let saveFailed = $state(false);
	let duplicateName = $state(false);
	let showNameRequired = $state(false);
	let showNeedsSelection = $state(false);
	let initializedBouquetId = $state<string | null>(null);
	let name = $state(page.url.searchParams.get('name')?.trim() ?? '');
	let editingId = $derived(page.params.id);
	let bouquet = $derived(editingId ? $bouquets.find(({ id }) => id === editingId) : undefined);
	let nameTaken = $derived(bouquetNameExists(name, $bouquets, bouquet?.id));
	let nameUnavailable = $derived(nameTaken || duplicateName);
	let availableSeeds = $derived([...new Set([...$savedSeeds, ...(bouquet?.seeds ?? [])])]);
	let seedKinds = $derived(
		availableSeeds.map((seed) => ({ seed, kind: generateFlower(seed).kind }))
	);
	let presentKinds = $derived(
		FLOWER_KINDS.filter((kind) => seedKinds.some((flower) => flower.kind === kind))
	);
	let filteredSeeds = $derived(
		selectedKind
			? seedKinds.filter((flower) => flower.kind === selectedKind).map((flower) => flower.seed)
			: availableSeeds
	);
	let unchanged = $derived(
		!!bouquet &&
			name.trim() === bouquet.name &&
			selected.size === bouquet.seeds.length &&
			bouquet.seeds.every((seed) => selected.has(seed))
	);
	let blocked = $derived(nameUnavailable || saving || unchanged || (!!editingId && !bouquet));
	let looksDisabled = $derived(blocked || !name.trim() || selected.size === 0);

	$effect(() => {
		if (bouquet && initializedBouquetId !== bouquet.id) {
			name = bouquet.name;
			selected = new Set(bouquet.seeds);
			initializedBouquetId = bouquet.id;
		}
	});

	$effect(() => {
		if (name.trim()) showNameRequired = false;
	});

	$effect(() => {
		if (selected.size > 0) showNeedsSelection = false;
	});

	function toggle(seed: Seed) {
		selected = new Set(selected);
		if (selected.has(seed)) selected.delete(seed);
		else selected.add(seed);
	}

	function attemptSave() {
		if (blocked) return;
		if (!name.trim()) {
			showNameRequired = true;
			showNeedsSelection = false;
			return;
		}
		if (selected.size === 0) {
			showNeedsSelection = true;
			showNameRequired = false;
			return;
		}
		save();
	}

	async function save() {
		name = name.trim();
		if (editingId && !bouquet) return;
		saving = true;
		saveFailed = false;
		duplicateName = false;
		const result = bouquet
			? await updateBouquet(bouquet, name, [...selected])
			: await createBouquet(name, [...selected]);
		if (result === 'created' || result === 'updated') await goto('/bouquets');
		else {
			duplicateName = result === 'duplicate';
			saveFailed = !duplicateName;
			saving = false;
		}
	}

	$effect(() => {
		navBar.trailing = trailingActions;
		return () => {
			if (navBar.trailing === trailingActions) navBar.trailing = null;
		};
	});
</script>

<svelte:head><title>{name || $t('ui.bouquetsHeading')} — Floreo</title></svelte:head>

<main
	class="min-h-dvh bg-[linear-gradient(155deg,#f5eee7_0%,#e9f1e6_54%,#d7e7d6_100%)] pb-40 text-emerald-950"
>
	<header class="mx-auto max-w-6xl px-4 py-6 sm:px-8">
		<p class="m-0 text-[0.62rem] font-bold tracking-[0.15em] text-emerald-900/45 uppercase">
			{$t('ui.chooseFlowers')}
		</p>
		<h1 class="sr-only">{name || $t('ui.nameYourBouquet')}</h1>
		<div class="relative mt-1 max-w-xl">
			<input
				id="bouquet-name"
				bind:value={name}
				required
				maxlength={MAX_BOUQUET_NAME_LENGTH}
				onkeydown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
				aria-label={$t('ui.nameYourBouquet')}
				aria-invalid={nameUnavailable || showNameRequired}
				aria-describedby={showNameRequired || nameUnavailable ? 'bouquet-name-warning' : undefined}
				placeholder={$t('ui.bouquetNamePlaceholder')}
				class="min-h-11 w-full rounded-full border border-white/80 bg-white/55 px-5 font-serif text-xl outline-none placeholder:text-emerald-900/35 focus:ring-2 focus:ring-emerald-700/35 sm:text-2xl"
			/>
			{#if showNameRequired || nameUnavailable}
				<p
					id="bouquet-name-warning"
					class="absolute top-full left-4 z-20 mt-2 rounded-full bg-amber-50/90 px-4 py-2 text-sm text-amber-800/75"
					role="status"
					transition:fly={{ y: -12, duration: 320 }}
				>
					{showNameRequired ? $t('ui.bouquetNameRequired') : $t('ui.bouquetNameTaken')}
				</p>
			{/if}
		</div>
		<p class="mt-1 text-sm text-emerald-900/55">
			{$t('ui.flowersSelected', { count: selected.size })}
		</p>
	</header>

	<div class="mx-auto max-w-6xl">
		{#if editingId && $bouquetsLoading}
			<p class="py-24 text-center font-serif text-2xl" role="status">
				{$t('ui.loadingBouquets')}
			</p>
		{:else if editingId && !bouquet}
			<p class="py-24 text-center font-serif text-2xl" role="alert">
				{$t('ui.bouquetLoadError')}
			</p>
		{:else if $galleryLoading && availableSeeds.length === 0}
			<p class="py-24 text-center font-serif text-2xl" role="status">{$t('ui.loadingGarden')}</p>
		{:else if availableSeeds.length === 0}
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

	{#if saveFailed}
		<div
			class="fixed inset-x-0 z-30 flex justify-center px-3"
			style:bottom="calc(env(safe-area-inset-bottom) + 9.25rem)"
		>
			<p class="rounded-full bg-rose-50/90 px-4 py-2 text-sm text-rose-800/75" role="alert">
				{$t('ui.bouquetSaveError')}
			</p>
		</div>
	{/if}
</main>

{#snippet trailingActions()}
	<div class="relative shrink-0">
		{#if showNeedsSelection}
			<p
				class="absolute -top-2 left-1/2 w-max -translate-x-1/2 -translate-y-full rounded-full bg-amber-50/90 px-4 py-2 text-sm whitespace-nowrap text-amber-800/75"
				role="status"
				transition:fly={{ y: 8, duration: 220 }}
			>
				{$t('ui.bouquetNeedsSelection')}
			</p>
		{/if}
		<button
			type="button"
			onclick={attemptSave}
			disabled={blocked}
			aria-label={saving ? $t('ui.savingBouquet') : $t('ui.saveBouquet')}
			class="grid size-10 shrink-0 place-items-center rounded-[1rem] bg-emerald-50 text-emerald-800 transition-transform active:scale-95 {looksDisabled
				? 'cursor-not-allowed opacity-40'
				: 'hover:bg-emerald-100'}"
		>
			{#if saving}
				<span
					class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
				></span>
			{:else}
				<svg viewBox="0 0 24 24" class="size-5" fill="none" aria-hidden="true">
					<path
						d="m5 12 4 4L19 6"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{/if}
		</button>
	</div>
{/snippet}
