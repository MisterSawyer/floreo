<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { accentColor } from '$lib/flower/palette';
	import { petalLayerStartMs, singleBloomStartMs } from '$lib/flower/animation';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();

	function angle(offset: number, index: number, layerIndex: number, depth: number) {
		const irregularity = Math.sin(flower.seed * 0.13 + index * 3.1 + layerIndex) * (8 - depth * 3);
		return offset + index * 137.508 + irregularity;
	}

	function petalScale(index: number, layerIndex: number, depth: number) {
		return 0.98 - depth * 0.23 + Math.sin(flower.seed * 0.07 + index * 2.4 + layerIndex) * 0.065;
	}

	function petalRadius(baseRadius: number, index: number, layerIndex: number, depth: number) {
		return (
			baseRadius + Math.sin(flower.seed * 0.19 + index * 1.9 + layerIndex) * (2.6 - depth * 1.5)
		);
	}

	function rimPath(length: number, width: number, curl: number) {
		return `M ${-width * 0.7 + curl * 0.45} ${-length * 0.79} Q ${curl * 0.45} ${-length * 1.02} ${width * 0.7 + curl * 0.45} ${-length * 0.79}`;
	}
</script>

<g class="bloom-head rose-head">
	<!-- Five persistent sepals form the star beneath a rose bloom. -->
	<g
		class="rose-calyx bloom-support-arrive"
		aria-hidden="true"
		style={`animation-delay: ${singleBloomStartMs()}ms`}
	>
		{#each Array(5) as _, index (index)}
			<path
				d="M -4 -2 Q -7 -24 0 -43 Q 7 -24 4 -2 Z"
				fill={accentColor(flower.palette, 34 + (index % 2) * 5)}
				transform={`rotate(${index * 72 + 7})`}
				class="rose-sepal"
			/>
		{/each}
	</g>
	{#each flower.layers as layer, layerIndex (layerIndex)}
		<g class="petal-layer" style={`--layer-depth: ${layer.depth}`}>
			{#each Array(layer.petalCount) as _, index (index)}
				<g
					transform={`rotate(${angle(layer.rotationOffset, index, layerIndex, layer.depth)}) translate(0 ${-petalRadius(layer.radius, index, layerIndex, layer.depth)}) scale(${petalScale(index, layerIndex, layer.depth)} ${layer.scaleY})`}
				>
					<g
						class="petal-bloom petal-bloom--rose"
						style={`--rose-fold: ${Math.max(0.12, 0.42 - layer.depth * 0.27)}; --rose-turn: ${(index % 2 ? 1 : -1) * (4 + layer.depth * 5)}deg; animation-delay: ${petalLayerStartMs(flower, layerIndex) + index * 16}ms`}
					>
						<path
							d={petalPath(layer.petal)}
							fill={`url(#${id}-petal-${layerIndex})`}
							class="petal-surface rose-petal"
						/>
						<path
							d={petalVeinPath(layer.petal, 0.72)}
							class="petal-fold"
							style={`opacity: ${flower.details.veinOpacity * 0.55 + layer.depth * 0.08}`}
						/>
						<path
							d={rimPath(layer.petal.length, layer.petal.width, layer.petal.curl)}
							class="rose-petal-rim"
							style={`opacity: ${0.24 + (1 - layer.depth) * 0.3}`}
						/>
					</g>
				</g>
			{/each}
		</g>
	{/each}
</g>
