<script lang="ts">
	import { goto } from '$app/navigation';
	import Flower from '$lib/components/Flower.svelte';
	import { generateFlower } from '$lib/flower/flower';
	import { bouquets, bouquetsError, bouquetsLoading, removeBouquet } from '$lib/stores/bouquets';
	import { navBar } from '$lib/stores/navBar.svelte';
	import { t } from '$lib/i18n';
	import type { Seed } from '$lib/flower/types';

	let previewSeed = $state<Seed | null>(null);
	let previewElement: HTMLDivElement;
	let holdTimer: ReturnType<typeof setTimeout> | undefined;
	let previewFlower = $derived(previewSeed === null ? null : generateFlower(previewSeed));
	let previewName = $derived(
		previewFlower ? $t(`flowerNames.${previewFlower.kind}.${previewFlower.displayNameIndex}`) : ''
	);

	function showPreview(seed: Seed) {
		previewSeed = seed;
		previewElement.showPopover();
	}

	function hidePreview() {
		clearTimeout(holdTimer);
		if (previewElement.matches(':popover-open')) previewElement.hidePopover();
		previewSeed = null;
	}

	function startHold(seed: Seed, event: PointerEvent) {
		if (event.pointerType !== 'mouse') holdTimer = setTimeout(() => showPreview(seed), 500);
	}

	function preventPreviewScroll(node: HTMLElement) {
		const prevent = (event: TouchEvent) => previewSeed !== null && event.preventDefault();
		node.addEventListener('touchmove', prevent, { passive: false });
		return { destroy: () => node.removeEventListener('touchmove', prevent) };
	}

	$effect(() => {
		navBar.trailing = trailingActions;
		return () => {
			if (navBar.trailing === trailingActions) navBar.trailing = null;
		};
	});
</script>

{#snippet trailingActions()}
	<a
		href="/bouquets/new"
		aria-label={$t('ui.createBouquet')}
		class="grid size-10 shrink-0 place-items-center rounded-[1rem] bg-emerald-50 text-emerald-800 transition-transform hover:bg-emerald-100 active:scale-95"
	>
		<svg viewBox="0 0 24 24" class="size-5" fill="none" aria-hidden="true">
			<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
	</a>
{/snippet}

<svelte:head><title>{$t('ui.bouquetsTitle')} — Floreo</title></svelte:head>

<main
	use:preventPreviewScroll
	class="min-h-dvh bg-[linear-gradient(155deg,#f5eee7_0%,#e9f1e6_54%,#d7e7d6_100%)] pb-40 text-emerald-950"
>
	<header class="mx-auto max-w-6xl px-4 py-6 sm:px-8">
		<p class="m-0 text-[0.62rem] font-bold tracking-[0.15em] text-emerald-900/45 uppercase">
			{$t('ui.yourCollection')}
		</p>
		<div class="mt-1 flex items-center gap-3">
			<h1 class="font-serif text-3xl font-normal tracking-tight">
				{$t('ui.bouquetsHeading')}
			</h1>
			{#if $bouquets.length > 0}
				<span
					class="grid size-9 shrink-0 place-items-center rounded-full border border-white/70 bg-white/40 text-sm font-semibold shadow-inner backdrop-blur-md"
					aria-label={$t('ui.totalBouquetsCount', { count: $bouquets.length })}
				>
					{$bouquets.length}
				</span>
			{/if}
		</div>
	</header>

	<div class="mx-auto max-w-6xl px-4 sm:px-8">
		<section class="mt-2">
			{#if $bouquetsLoading}
				<p class="mt-2 text-sm text-emerald-900/55" role="status">
					{$t('ui.loadingBouquets')}
				</p>
			{:else if $bouquetsError}
				<p class="mt-2 text-sm text-rose-800/70" role="alert">
					{$t('ui.bouquetLoadError')}
				</p>
			{:else if $bouquets.length === 0}
				<p class="mt-2 text-sm text-emerald-900/55">{$t('ui.noBouquetsYet')}</p>
			{:else}
				<div class="mt-4 grid gap-4 sm:grid-cols-2">
					{#each $bouquets as bouquet (bouquet.id)}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions (The title link provides keyboard access.) -->
						<article
							onclick={(event) =>
								event.target instanceof Element &&
								!event.target.closest('button, a') &&
								goto(`/bouquets/${bouquet.id}`)}
							class="relative cursor-pointer rounded-[2rem] border border-white/70 bg-white/45 p-5 shadow-sm backdrop-blur-sm"
						>
							<button
								type="button"
								onclick={() => removeBouquet(bouquet)}
								aria-label={$t('ui.removeBouquetAriaLabel', { name: bouquet.name })}
								class="absolute top-3 right-3 grid size-8 shrink-0 place-items-center rounded-full bg-white/70 text-emerald-900/60 backdrop-blur-sm transition-colors hover:bg-white hover:text-rose-600 active:scale-95"
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
							<h3 class="pr-8 font-serif text-xl">
								<a href={`/bouquets/${bouquet.id}`}>{bouquet.name}</a>
							</h3>
							<p class="mt-1 text-xs font-semibold tracking-wide text-emerald-900/45 uppercase">
								{$t('ui.bouquetFlowerCount', { count: bouquet.seeds.length })}
							</p>
							<ul class="mt-4 flex max-h-42 flex-wrap gap-2 overflow-y-auto">
								{#each bouquet.seeds as seed (seed)}
									{@const flower = generateFlower(seed)}
									{@const displayName = $t(`flowerNames.${flower.kind}.${flower.displayNameIndex}`)}
									<li class="size-20 shrink-0">
										<button
											type="button"
											aria-label={`${displayName}, ${flower.botanicalName}`}
											aria-describedby="flower-preview"
											class="grid size-full touch-pan-y place-items-center overflow-hidden rounded-2xl border border-white/80 bg-emerald-50/70 p-1 shadow-inner select-none"
											onpointerenter={(event) => event.pointerType === 'mouse' && showPreview(seed)}
											onpointerleave={(event) => event.pointerType === 'mouse' && hidePreview()}
											onpointerdown={(event) => startHold(seed, event)}
											onpointerup={hidePreview}
											onpointercancel={(event) =>
												event.pointerType === 'touch' ? clearTimeout(holdTimer) : hidePreview()}
											ontouchend={hidePreview}
											ontouchcancel={hidePreview}
											onfocus={(event) =>
												event.currentTarget.matches(':focus-visible') && showPreview(seed)}
											onblur={hidePreview}
											oncontextmenu={(event) => event.preventDefault()}
										>
											<Flower {flower} animated={false} />
										</button>
									</li>
								{/each}
							</ul>
						</article>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</main>

<div
	bind:this={previewElement}
	id="flower-preview"
	popover="manual"
	role="tooltip"
	class="pointer-events-none m-auto h-[min(34rem,calc(100dvh-2rem))] w-[min(28rem,calc(100vw-2rem))] overflow-hidden rounded-[2rem] border border-white/80 bg-white/45 p-5 text-emerald-950 shadow-[0_24px_80px_rgb(31_74_53/0.3)] backdrop-blur-xl"
>
	{#if previewFlower}
		<div class="relative flex h-full flex-col items-center">
			<span
				class="absolute top-3 left-1/2 size-56 -translate-x-1/2 rounded-full border border-white/80"
				aria-hidden="true"
			></span>
			<div class="relative min-h-0 w-full flex-1 overflow-hidden [&_.flower]:h-full">
				<Flower flower={previewFlower} animated={false} />
			</div>
			<div class="relative pb-3 text-center">
				<p class="font-serif text-3xl">{previewName}</p>
				<p class="mt-1 font-serif text-base text-emerald-900/50 italic">
					{previewFlower.botanicalName}
				</p>
			</div>
		</div>
	{/if}
</div>
