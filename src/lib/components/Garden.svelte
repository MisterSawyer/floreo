<script lang="ts">
	import Flower from './Flower.svelte';
	import { generateFlower } from '$lib/flower/flower';
	import { removeFlower } from '$lib/stores/gallery';
	import { t } from '$lib/i18n';
	import type { Seed } from '$lib/flower/types';

	let { seeds, onSelect }: { seeds: Seed[]; onSelect: (seed: Seed) => void } = $props();
</script>

<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
	{#each seeds as seed (seed)}
		{@const flower = generateFlower(seed)}
		{@const displayName = $t(`flowerNames.${flower.kind}.${flower.displayNameIndex}`)}
		<div
			class="group relative flex min-h-[24rem] flex-col items-center justify-end overflow-hidden rounded-[2rem] border border-white/80 bg-white/45 p-4 shadow-[0_14px_50px_rgb(45_83_55/0.08)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_18px_55px_rgb(45_83_55/0.13)]"
		>
			<button
				type="button"
				onclick={() => removeFlower(seed)}
				aria-label={$t('ui.removeFlowerAriaLabel', { name: displayName })}
				class="absolute top-3 right-3 z-30 grid size-8 shrink-0 place-items-center rounded-full bg-white/70 text-emerald-900/60 backdrop-blur-sm transition-colors hover:bg-white hover:text-rose-600 active:scale-95"
			>
				<svg viewBox="0 0 24 24" class="size-4" fill="none" aria-hidden="true">
					<path
						d="M6 6l12 12M18 6L6 18"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</button>
			<button
				type="button"
				onclick={() => onSelect(seed)}
				class="absolute inset-0 z-10 flex flex-col items-center justify-end active:scale-[0.98]"
			>
				<span
					class="absolute top-8 left-1/2 size-48 -translate-x-1/2 rounded-full border border-white/60"
					aria-hidden="true"
				></span>
				<div class="relative z-10 w-full max-w-[18rem] flex-1">
					<Flower {flower} animated={false} />
				</div>
				<div class="relative z-20 pb-2 text-center">
					<h2 class="mt-1 font-serif text-xl text-emerald-950">{displayName}</h2>
					<p class="mt-0.5 font-serif text-xs text-emerald-900/45 italic">
						{flower.botanicalName}
					</p>
				</div>
			</button>
		</div>
	{/each}
</div>
