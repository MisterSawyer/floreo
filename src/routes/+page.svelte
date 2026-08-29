<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import Flower from '$lib/components/Flower.svelte';
	import Controls from '$lib/components/Controls.svelte';
	import FallingPetals from '$lib/components/FallingPetals.svelte';
	import { generateFlower } from '$lib/flower/flower';
	import { canShareFlowerGif, renderFlowerGif, shareFlowerGif } from '$lib/flower/exportGif';
	import { savedSeeds, saveFlower, removeFlower } from '$lib/stores/gallery';
	import { t } from '$lib/i18n';
	import type { Seed } from '$lib/flower/types';

	function randomSeed(): Seed {
		return Math.floor(Math.random() * 2 ** 32);
	}

	function seedFromUrl(): Seed {
		const rawSeed = page.url.searchParams.get('seed');
		if (rawSeed === null) return randomSeed();
		const parsed = Number(rawSeed);
		return Number.isFinite(parsed) ? parsed >>> 0 : randomSeed();
	}

	let seed = $state(seedFromUrl());
	let bloomKey = $state(0);
	let flowerStage: HTMLButtonElement;
	let exportStatus = $state<'preparing' | 'ready' | 'sharing' | 'shared' | 'unavailable' | 'error'>(
		'preparing'
	);
	let preparedGif: Blob | undefined;
	let preparationVersion = 0;

	let flower = $derived(generateFlower(seed));
	let saved = $derived($savedSeeds.includes(seed));
	let displayName = $derived($t(`flowerNames.${flower.kind}.${flower.displayNameIndex}`));

	$effect(() => {
		goto(`?seed=${seed}`, { replaceState: true, keepFocus: true, noScroll: true });
	});

	onMount(() => void prepareFlowerGif());

	function regenerate() {
		seed = randomSeed();
		bloomKey++;
		void prepareFlowerGif();
	}

	function toggleSave() {
		if (saved) removeFlower(seed);
		else saveFlower(seed);
	}

	async function prepareFlowerGif() {
		const version = ++preparationVersion;
		const filename = `floreo-${seed}.gif`;
		preparedGif = undefined;
		if (!canShareFlowerGif(new Blob(['GIF89a'], { type: 'image/gif' }), filename)) {
			exportStatus = 'unavailable';
			return;
		}

		exportStatus = 'preparing';
		await tick();
		const svg = flowerStage.querySelector<SVGSVGElement>('svg.flower');
		if (!svg) return;
		try {
			const gif = await renderFlowerGif(svg, flower, () => version !== preparationVersion);
			if (version !== preparationVersion) return;
			preparedGif = gif;
			exportStatus = 'ready';
		} catch {
			if (version !== preparationVersion) return;
			exportStatus = 'error';
		}
	}

	async function shareFlower() {
		if (!preparedGif || exportStatus === 'sharing') return;
		exportStatus = 'sharing';
		exportStatus = await shareFlowerGif(preparedGif, `floreo-${seed}.gif`);
	}
</script>

<svelte:head>
	<title>{displayName} — Floreo</title>
	<meta name="description" content={$t('ui.metaDescription')} />
</svelte:head>

<main class="garden-scene">
	<div class="sun-wash" aria-hidden="true"></div>
	<div class="meadow-haze meadow-haze--left" aria-hidden="true"></div>
	<div class="meadow-haze meadow-haze--right" aria-hidden="true"></div>
	<FallingPetals {flower} />

	<section class="specimen" aria-labelledby="flower-name">
		<button
			bind:this={flowerStage}
			type="button"
			onclick={() => bloomKey++}
			aria-label={$t('ui.replayBloomAnimation')}
			class="flower-stage"
		>
			<span class="halo halo--one" aria-hidden="true"></span>
			<span class="halo halo--two" aria-hidden="true"></span>
			{#key bloomKey}
				<Flower {flower} />
			{/key}
		</button>

		<div class="specimen-label">
			<div class="species-row">
				<span class="species-pill">{flower.botanicalName}</span>
			</div>
			<h1 id="flower-name">{displayName}</h1>
			<span class="seed-label">{$t('ui.seed')} {flower.seed}</span>
		</div>
	</section>
</main>

<Controls
	onRegenerate={regenerate}
	onSave={toggleSave}
	onExport={shareFlower}
	{exportStatus}
	{saved}
/>

<style>
	:global(html) {
		background: #eaf2e6;
	}

	:global(body) {
		margin: 0;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		color: #173d2c;
	}

	.garden-scene {
		position: relative;
		display: grid;
		height: 100dvh;
		overflow: hidden;
		place-items: center;
		padding: 1rem 1rem 7rem;
		background:
			radial-gradient(circle at 50% 27%, rgb(255 255 249 / 0.96) 0 14%, transparent 43%),
			linear-gradient(165deg, #f5eee6 0%, #edf4e9 50%, #d7e7d6 100%);
	}

	.garden-scene::after {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.13'/%3E%3C/svg%3E");
		content: '';
		mix-blend-mode: soft-light;
		opacity: 0.26;
	}

	.sun-wash {
		position: absolute;
		top: -18rem;
		left: 50%;
		width: 38rem;
		height: 38rem;
		transform: translateX(-50%);
		border-radius: 50%;
		background: rgb(255 245 207 / 0.68);
		filter: blur(45px);
	}

	.meadow-haze {
		position: absolute;
		bottom: -9rem;
		width: 24rem;
		height: 22rem;
		border-radius: 50%;
		background: rgb(92 137 94 / 0.16);
		filter: blur(38px);
	}

	.meadow-haze--left {
		left: -12rem;
	}
	.meadow-haze--right {
		right: -10rem;
		bottom: -5rem;
		background: rgb(191 146 126 / 0.13);
	}

	.specimen {
		position: relative;
		z-index: 2;
		display: grid;
		width: min(100%, 52rem);
		place-items: center;
	}

	.flower-stage {
		position: relative;
		display: grid;
		width: min(92vw, 58dvh, 26rem);
		cursor: pointer;
		place-items: center;
		border: 0;
		background: transparent;
		-webkit-tap-highlight-color: transparent;
	}
	.flower-stage:focus-visible {
		border-radius: 50%;
		outline: 2px solid rgb(31 92 66 / 0.55);
		outline-offset: 4px;
	}

	.halo {
		position: absolute;
		top: 8%;
		left: 50%;
		width: 18rem;
		height: 18rem;
		transform: translateX(-50%);
		border: 1px solid rgb(255 255 255 / 0.58);
		border-radius: 50%;
	}
	.halo--one {
		animation: halo-breathe 7s ease-in-out infinite alternate;
	}
	.halo--two {
		width: 22rem;
		height: 22rem;
		border-color: rgb(255 255 255 / 0.25);
		animation: halo-breathe 7s ease-in-out -2.4s infinite alternate-reverse;
	}

	.specimen-label {
		z-index: 2;
		margin-top: 0.5rem;
		text-align: center;
	}
	.species-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.65rem;
	}
	.seed-label {
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}
	.species-pill {
		padding: 0.28rem 0.6rem;
		border: 1px solid rgb(38 91 65 / 0.12);
		border-radius: 999px;
		background: rgb(255 255 255 / 0.4);
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 0.72rem;
		font-style: italic;
		letter-spacing: 0.015em;
		opacity: 0.68;
	}
	.seed-label {
		display: block;
		margin-top: 0.75rem;
		opacity: 0.38;
	}
	.specimen-label h1 {
		margin: 0.5rem 0 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2rem, 7vw, 3.25rem);
		font-weight: 400;
		line-height: 1;
		letter-spacing: -0.035em;
	}
	@keyframes halo-breathe {
		from {
			transform: translateX(-50%) scale(0.96);
			opacity: 0.5;
		}
		to {
			transform: translateX(-50%) scale(1.04);
			opacity: 1;
		}
	}
	@keyframes mark-turn {
		to {
			transform: rotate(360deg);
		}
	}
</style>
