<script lang="ts">
	import './Flower.css';
	import type { FlowerParams } from '$lib/flower/types';
	import {
		accentColor,
		petalColor,
		petalHighlightColor,
		petalShadowColor,
		pollenColor
	} from '$lib/flower/palette';
	import Stem from './Stem.svelte';
	import RoseBloom from './RoseBloom.svelte';
	import LilyBloom from './LilyBloom.svelte';
	import CarnationBloom from './CarnationBloom.svelte';
	import FreesiaPlant from './FreesiaPlant.svelte';
	import TulipBloom from './TulipBloom.svelte';
	import PoppyBloom from './PoppyBloom.svelte';
	import DaisyBloom from './DaisyBloom.svelte';
	import SunflowerBloom from './SunflowerBloom.svelte';
	import DaffodilBloom from './DaffodilBloom.svelte';
	import IrisBloom from './IrisBloom.svelte';
	import LavenderBloom from './LavenderBloom.svelte';
	import CosmosBloom from './CosmosBloom.svelte';
	import HibiscusBloom from './HibiscusBloom.svelte';
	import ColumbineBloom from './ColumbineBloom.svelte';
	import BluebellBloom from './BluebellBloom.svelte';
	import { growthTimingStyle, plantMatureMs } from '$lib/flower/animation';
	import { t } from '$lib/i18n';

	let { flower, animated = true }: { flower: FlowerParams; animated?: boolean } = $props();

	let id = $derived(`flower-${flower.seed}`);
	let displayName = $derived($t(`flowerNames.${flower.kind}.${flower.displayNameIndex}`));
</script>

<svg
	viewBox="-145 -125 290 330"
	class={`flower flower--${flower.kind} ${animated ? '' : 'flower--static'}`}
	style={animated ? `--sway-duration: ${flower.swayDurationSeconds}s; ${growthTimingStyle()}` : ''}
	role="img"
	aria-label={$t('ui.proceduralAriaLabel', { name: displayName })}
	preserveAspectRatio="xMidYMid meet"
>
	<defs>
		<linearGradient id={`${id}-stem`} x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stop-color={accentColor(flower.palette, 22)} />
			<stop offset="0.42" stop-color={accentColor(flower.palette, 38)} />
			<stop offset="0.7" stop-color={accentColor(flower.palette, 48)} />
			<stop offset="1" stop-color={accentColor(flower.palette, 27)} />
		</linearGradient>
		<linearGradient id={`${id}-leaf`} x1="0" y1="1" x2="1" y2="0">
			<stop offset="0" stop-color={accentColor(flower.palette, 24)} />
			<stop offset="0.5" stop-color={accentColor(flower.palette, 42)} />
			<stop offset="0.82" stop-color={accentColor(flower.palette, 52)} />
			<stop offset="1" stop-color={accentColor(flower.palette, 31)} />
		</linearGradient>

		{#each flower.layers as layer, layerIndex (layerIndex)}
			<linearGradient id={`${id}-petal-${layerIndex}`} x1="0" y1="1" x2="0.38" y2="0">
				<stop offset="0" stop-color={petalShadowColor(flower.palette, layer.hueShift)} />
				<stop
					offset="0.19"
					stop-color={petalColor(
						flower.palette,
						Math.min(1, layer.depth + 0.18),
						-3,
						layer.hueShift
					)}
				/>
				<stop
					offset="0.63"
					stop-color={petalColor(flower.palette, layer.depth, 3, layer.hueShift)}
				/>
				<stop offset="0.94" stop-color={petalHighlightColor(flower.palette, layer.hueShift)} />
				<stop
					offset="1"
					stop-color={petalColor(
						flower.palette,
						Math.max(0, layer.depth - 0.2),
						-1,
						layer.hueShift
					)}
				/>
			</linearGradient>
		{/each}

		<radialGradient id={`${id}-center`} cx="38%" cy="32%">
			<stop offset="0" stop-color={petalHighlightColor(flower.palette)} />
			<stop offset="0.48" stop-color={petalColor(flower.palette, 1, 0)} />
			<stop offset="1" stop-color={petalShadowColor(flower.palette)} />
		</radialGradient>
		<radialGradient id={`${id}-throat`} cx="42%" cy="38%">
			<stop offset="0" stop-color={pollenColor(flower.palette, 82)} />
			<stop offset="0.45" stop-color={pollenColor(flower.palette, 63)} />
			<stop offset="1" stop-color={petalColor(flower.palette, 1, -7)} />
		</radialGradient>
		<filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="170%">
			<feDropShadow
				dx="0"
				dy="4"
				stdDeviation="4.5"
				flood-color={petalShadowColor(flower.palette)}
				flood-opacity="0.22"
			/>
		</filter>
	</defs>

	<g
		class="sway"
		style={`transform-origin: ${flower.stem.curve}px ${flower.stem.length}px`}
		filter={animated ? `url(#${id}-shadow)` : undefined}
	>
		{#if flower.kind === 'freesia'}
			<FreesiaPlant {flower} {id} />
		{:else}
			<Stem {flower} {id} />
			{#if flower.kind === 'rose'}
				<RoseBloom {flower} {id} />
			{:else if flower.kind === 'lily'}
				<LilyBloom {flower} {id} />
			{:else if flower.kind === 'carnation'}
				<CarnationBloom {flower} {id} />
			{:else if flower.kind === 'tulip'}
				<TulipBloom {flower} {id} />
			{:else if flower.kind === 'poppy'}
				<PoppyBloom {flower} {id} />
			{:else if flower.kind === 'daisy'}
				<DaisyBloom {flower} {id} />
			{:else if flower.kind === 'sunflower'}
				<SunflowerBloom {flower} {id} />
			{:else if flower.kind === 'daffodil'}
				<DaffodilBloom {flower} {id} />
			{:else if flower.kind === 'iris'}
				<IrisBloom {flower} {id} />
			{:else if flower.kind === 'lavender'}
				<LavenderBloom {flower} />
			{:else if flower.kind === 'cosmos'}
				<CosmosBloom {flower} {id} />
			{:else if flower.kind === 'hibiscus'}
				<HibiscusBloom {flower} {id} />
			{:else if flower.kind === 'columbine'}
				<ColumbineBloom {flower} {id} />
			{:else}
				<BluebellBloom {flower} />
			{/if}
		{/if}
	</g>

	<g class="pollen-field" aria-hidden="true" style={`animation-delay: ${plantMatureMs(flower)}ms`}>
		{#each flower.motes as mote, index (index)}
			<circle
				cx={mote.x}
				cy={mote.y}
				r={mote.radius}
				fill={pollenColor(flower.palette, 66 + (index % 3) * 6)}
				class="pollen-mote"
				style={`--mote-drift: ${mote.drift}px; animation-delay: ${mote.delay}s; animation-duration: ${mote.duration}s`}
			/>
		{/each}
	</g>
</svg>
