<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { pollenColor } from '$lib/flower/palette';
	import {
		petalLayerStartMs,
		primaryDetailStartMs,
		secondaryDetailStartMs,
		singleBloomStartMs
	} from '$lib/flower/animation';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();
	let innerLayer = $derived(flower.layers[1]);
</script>

<g class="bloom-head columbine-head">
	<!-- Each of the five true petals extends backward into a hooked nectar spur. -->
	<g
		class="columbine-spurs bloom-support-arrive"
		style={`animation-delay: ${singleBloomStartMs()}ms`}
	>
		{#each Array(5) as _, index (index)}
			<path
				d="M -5 -4 C -7 -20 -10 -41 -4 -55 Q 0 -63 5 -56 C 10 -41 7 -20 5 -4 Z"
				fill={`url(#${id}-petal-1)`}
				transform={`rotate(${innerLayer.rotationOffset + index * 72})`}
				class="columbine-spur"
			/>
		{/each}
	</g>

	{#each flower.layers as layer, layerIndex (layerIndex)}
		{#each Array(layer.petalCount) as _, index (index)}
			<g
				transform={`rotate(${layer.rotationOffset + index * 72}) translate(0 ${-layer.radius}) scale(${1 + (index % 2) * 0.025} ${layer.scaleY})`}
			>
				<g
					class="petal-bloom petal-bloom--columbine"
					style={`animation-delay: ${petalLayerStartMs(flower, layerIndex) + index * 75}ms`}
				>
					<path
						d={petalPath(layer.petal)}
						fill={`url(#${id}-petal-${layerIndex})`}
						class={`petal-surface ${layerIndex === 0 ? 'columbine-sepal' : 'columbine-petal'}`}
					/>
					<path
						d={petalVeinPath(layer.petal, 0.84)}
						class="columbine-vein"
						style={`opacity: ${flower.details.veinOpacity}`}
					/>
				</g>
			</g>
		{/each}
	{/each}

	<!-- Numerous stamens surround five free carpels. -->
	{#each Array(flower.details.stamenCount) as _, index (index)}
		{@const angle = index * (360 / flower.details.stamenCount)}
		{@const reach = 10 + (index % 4) * 1.4}
		<g transform={`rotate(${angle})`}>
			<path
				d={`M 0 -3 Q ${index % 2 ? 1 : -1} -7 0 ${-reach}`}
				pathLength="1"
				class="stamen columbine-stamen"
				style={`animation-delay: ${primaryDetailStartMs(flower) + (index % 6) * 24}ms`}
			/>
			<ellipse
				cy={-reach - 1}
				rx="1"
				ry="2"
				fill={pollenColor(flower.palette, 69)}
				class="anther"
				style={`animation-delay: ${secondaryDetailStartMs(flower) + (index % 6) * 24}ms`}
			/>
		</g>
	{/each}
	<g class="columbine-carpels" style={`animation-delay: ${secondaryDetailStartMs(flower)}ms`}>
		{#each Array(5) as _, index (index)}
			<path d="M 0 2 Q 2 -5 0 -13" transform={`rotate(${index * 72})`} />
		{/each}
	</g>
</g>
