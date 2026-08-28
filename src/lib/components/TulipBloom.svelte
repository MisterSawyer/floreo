<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { accentColor, pollenColor } from '$lib/flower/palette';
	import {
		petalLayerStartMs,
		primaryDetailStartMs,
		secondaryDetailStartMs
	} from '$lib/flower/animation';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();
</script>

<g class="bloom-head tulip-head">
	{#each flower.layers as layer, layerIndex (layerIndex)}
		{#each Array(layer.petalCount) as _, index (index)}
			<g
				transform={`rotate(${layer.rotationOffset + index * 120}) translate(0 ${-layer.radius}) scale(${1 - layerIndex * 0.08} ${layer.scaleY})`}
			>
				<g
					class="petal-bloom petal-bloom--tulip"
					style={`--tepal-turn: ${(index - 1) * 4 + (layerIndex ? 2 : -2)}deg; animation-delay: ${petalLayerStartMs(flower, layerIndex) + index * 90}ms`}
				>
					<path
						d={petalPath(layer.petal)}
						fill={`url(#${id}-petal-${layerIndex})`}
						class="petal-surface tulip-tepal"
					/>
					<path
						d={petalVeinPath(layer.petal, 0.91)}
						class="tulip-vein"
						style={`opacity: ${flower.details.veinOpacity + 0.06}`}
					/>
					<path
						d={`M -${layer.petal.width * 0.3} -6 Q 0 -19 ${layer.petal.width * 0.3} -6`}
						class="tulip-basal-mark"
					/>
				</g>
			</g>
		{/each}
	{/each}

	<!-- Tulipa flowers have six stamens around a superior, three-carpelled ovary. -->
	<g class="tulip-stamens">
		{#each Array(6) as _, index (index)}
			<g transform={`rotate(${index * 60 + 30})`}>
				<path
					d="M 0 -5 Q 1 -15 0 -24"
					pathLength="1"
					stroke={pollenColor(flower.palette, 72)}
					class="stamen tulip-stamen"
					style={`animation-delay: ${primaryDetailStartMs(flower) + index * 35}ms`}
				/>
				<ellipse
					cy="-25"
					rx="2.4"
					ry="5"
					fill={pollenColor(flower.palette, 40)}
					class="anther tulip-anther"
					style={`animation-delay: ${secondaryDetailStartMs(flower) + index * 35}ms`}
				/>
			</g>
		{/each}
		<path
			d="M -4 2 Q -6 -6 -3 -13 L -5 -18 L 0 -15 L 5 -18 L 3 -13 Q 6 -6 4 2 Z"
			fill={accentColor(flower.palette, 54)}
			class="tulip-ovary"
			style={`animation-delay: ${secondaryDetailStartMs(flower)}ms`}
		/>
	</g>
</g>
