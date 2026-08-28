<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { petalLayerStartMs, primaryDetailStartMs } from '$lib/flower/animation';
	import { carnationPetalPlacement, carnationSeamOccluderIndexes } from '$lib/flower/carnation';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();
</script>

<defs>
	{#each flower.layers as layer, layerIndex (layerIndex)}
		{@const lastPetal = carnationPetalPlacement(flower, layerIndex, layer.petalCount - 1)}
		<clipPath id={`${id}-carnation-seam-${layerIndex}`} clipPathUnits="userSpaceOnUse">
			<path
				d={petalPath(layer.petal)}
				transform={`rotate(${lastPetal.angle}) translate(0 ${-layer.radius}) scale(${lastPetal.scaleX} ${layer.scaleY})`}
			/>
		</clipPath>
		<mask
			id={`${id}-carnation-seam-occlusion-${layerIndex}`}
			maskUnits="userSpaceOnUse"
			maskContentUnits="userSpaceOnUse"
			x="-140"
			y="-140"
			width="280"
			height="280"
			style="mask-type: luminance"
		>
			<rect x="-140" y="-140" width="280" height="280" fill="white" />
			{#each carnationSeamOccluderIndexes(layer.petalCount) as index (index)}
				{@const occluder = carnationPetalPlacement(flower, layerIndex, index)}
				<path
					d={petalPath(layer.petal)}
					transform={`rotate(${occluder.angle}) translate(0 ${-layer.radius}) scale(${occluder.scaleX} ${layer.scaleY})`}
					fill="black"
				/>
			{/each}
		</mask>
	{/each}
</defs>

<g class="bloom-head carnation-head">
	{#each flower.layers as layer, layerIndex (layerIndex)}
		{#each Array(layer.petalCount) as _, index (index)}
			{@const petal = carnationPetalPlacement(flower, layerIndex, index)}
			<g
				transform={`rotate(${petal.angle}) translate(0 ${-layer.radius}) scale(${petal.scaleX} ${layer.scaleY})`}
			>
				<g
					class="petal-bloom petal-bloom--carnation"
					style={`animation-delay: ${petalLayerStartMs(flower, layerIndex)}ms`}
				>
					<path
						d={petalPath(layer.petal)}
						fill={`url(#${id}-petal-${layerIndex})`}
						class="petal-surface carnation-petal"
					/>
					<path
						d={petalVeinPath(layer.petal, 0.68)}
						class="petal-fold petal-fold--soft"
						style={`opacity: ${flower.details.veinOpacity}`}
					/>
				</g>
			</g>
		{/each}

		{@const firstPetal = carnationPetalPlacement(flower, layerIndex, 0)}
		<g
			clip-path={`url(#${id}-carnation-seam-${layerIndex})`}
			mask={`url(#${id}-carnation-seam-occlusion-${layerIndex})`}
			aria-hidden="true"
		>
			<g
				transform={`rotate(${firstPetal.angle}) translate(0 ${-layer.radius}) scale(${firstPetal.scaleX} ${layer.scaleY})`}
			>
				<g
					class="petal-bloom petal-bloom--carnation"
					style={`animation-delay: ${petalLayerStartMs(flower, layerIndex)}ms`}
				>
					<path
						d={petalPath(layer.petal)}
						fill={`url(#${id}-petal-${layerIndex})`}
						class="petal-surface carnation-petal carnation-seam-overlay"
					/>
				</g>
			</g>
		</g>
	{/each}
	<circle
		r="4.5"
		fill={`url(#${id}-center)`}
		class="carnation-core"
		style={`animation-delay: ${primaryDetailStartMs(flower)}ms`}
	/>
</g>
