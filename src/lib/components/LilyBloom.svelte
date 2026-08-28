<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { petalShadowColor, pollenColor } from '$lib/flower/palette';
	import {
		GROWTH_TIMING,
		lilyAntherStartMs,
		lilyStamenStartMs,
		lilyThroatStartMs,
		petalLayerStartMs
	} from '$lib/flower/animation';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();

	let spotsPerPetal = $derived(Math.ceil(flower.details.spotCount / 6));

	function angle(offset: number, count: number, index: number) {
		return offset + (index * 360) / count;
	}

	function spotPosition(petalIndex: number, spotIndex: number, length: number, width: number) {
		const wave = Math.sin(flower.seed * 0.013 + petalIndex * 4.17 + spotIndex * 8.31);
		const t = 0.27 + (spotIndex / Math.max(1, spotsPerPetal - 1)) * 0.43;
		return {
			x: wave * width * (0.18 + (spotIndex % 3) * 0.08),
			y: -length * t,
			r: 0.8 + ((petalIndex + spotIndex) % 3) * 0.25
		};
	}
</script>

<g class="bloom-head lily-head">
	{#each flower.layers as layer, layerIndex (layerIndex)}
		{#each Array(layer.petalCount) as _, index (index)}
			<g
				transform={`rotate(${angle(layer.rotationOffset, layer.petalCount, index)}) translate(0 ${-layer.radius}) scale(${1 + Math.sin(flower.seed + index) * 0.035} ${layer.scaleY})`}
			>
				<g
					class="petal-bloom petal-bloom--lily"
					style={`animation-delay: ${petalLayerStartMs(flower, layerIndex)}ms`}
				>
					<path
						d={petalPath(layer.petal)}
						fill={`url(#${id}-petal-${layerIndex})`}
						class="petal-surface lily-petal"
					/>
					<path
						d={petalVeinPath(layer.petal, 0.9)}
						class="lily-vein"
						style={`opacity: ${flower.details.veinOpacity + 0.18}`}
					/>
					{#each Array(spotsPerPetal) as _, spotIndex (spotIndex)}
						{@const spot = spotPosition(
							index + layerIndex * 3,
							spotIndex,
							layer.petal.length,
							layer.petal.width
						)}
						<circle
							cx={spot.x}
							cy={spot.y}
							r={spot.r}
							fill={petalShadowColor(flower.palette, 10)}
							class="lily-spot"
							style={`animation-delay: ${petalLayerStartMs(flower, layerIndex) + GROWTH_TIMING.petalDuration.lily}ms`}
						/>
					{/each}
				</g>
			</g>
		{/each}
	{/each}

	<circle
		r={flower.centerRadius + 3}
		fill={`url(#${id}-throat)`}
		class="lily-throat"
		style={`animation-delay: ${lilyThroatStartMs(flower)}ms`}
	/>
	<g class="stamens">
		{#each Array(flower.details.stamenCount) as _, index (index)}
			<g transform={`rotate(${index * (360 / flower.details.stamenCount) + 18})`}>
				<path
					d={`M 0 -2 Q ${index % 2 ? 5 : -5} -19 ${index % 2 ? 3 : -3} -38`}
					pathLength="1"
					class="stamen"
					stroke={pollenColor(flower.palette, 77)}
					style={`animation-delay: ${lilyStamenStartMs(flower)}ms`}
				/>
				<ellipse
					cx={index % 2 ? 3 : -3}
					cy="-39"
					rx="2.1"
					ry="4.3"
					fill={pollenColor(flower.palette, 47)}
					class="anther"
					style={`animation-delay: ${lilyAntherStartMs(flower)}ms`}
				/>
			</g>
		{/each}
		<circle
			r="3.1"
			fill={pollenColor(flower.palette, 68)}
			class="pistil"
			style={`animation-delay: ${lilyStamenStartMs(flower)}ms`}
		/>
	</g>
</g>
