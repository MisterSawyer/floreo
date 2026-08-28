<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { accentColor, pollenColor } from '$lib/flower/palette';
	import {
		petalLayerStartMs,
		primaryDetailStartMs,
		singleBloomStartMs
	} from '$lib/flower/animation';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();
	let layer = $derived(flower.layers[0]);

	function discPosition(index: number, count: number) {
		const progress = (index + 0.5) / count;
		const angle = index * 137.508 * (Math.PI / 180);
		const radius = Math.sqrt(progress) * flower.centerRadius * 0.86;
		return {
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius,
			rotation: index * 137.508
		};
	}
</script>

<g class="bloom-head cosmos-head">
	<!-- Two ranks of narrow involucral bracts support the composite head. -->
	<g
		class="cosmos-involucre bloom-support-arrive"
		style={`animation-delay: ${singleBloomStartMs()}ms`}
	>
		{#each Array(8) as _, index (index)}
			<path
				d="M -2.6 0 Q -3.5 -13 0 -24 Q 3.5 -13 2.6 0 Z"
				fill={accentColor(flower.palette, 34 + (index % 3) * 4)}
				transform={`rotate(${index * 45}) translate(0 -9)`}
				class="cosmos-bract"
			/>
		{/each}
	</g>

	{#each Array(layer.petalCount) as _, index (index)}
		<g
			transform={`rotate(${layer.rotationOffset + index * 45}) translate(0 ${-layer.radius}) scale(${0.96 + (index % 3) * 0.025} ${layer.scaleY})`}
		>
			<g
				class="petal-bloom petal-bloom--cosmos"
				style={`animation-delay: ${petalLayerStartMs(flower, 0) + index * 58}ms`}
			>
				<path
					d={petalPath(layer.petal)}
					fill={`url(#${id}-petal-0)`}
					class="petal-surface cosmos-ray"
				/>
				<path
					d={petalVeinPath(layer.petal, 0.9)}
					class="cosmos-ray-vein"
					style={`opacity: ${flower.details.veinOpacity}`}
				/>
			</g>
		</g>
	{/each}

	<circle
		r={flower.centerRadius}
		fill={pollenColor(flower.palette, 48)}
		class="cosmos-disc-base"
		style={`animation-delay: ${primaryDetailStartMs(flower)}ms`}
	/>
	{#each Array(flower.details.discFloretCount) as _, index (index)}
		{@const floret = discPosition(index, flower.details.discFloretCount)}
		<g transform={`translate(${floret.x} ${floret.y}) rotate(${floret.rotation})`}>
			<path
				d="M 0 -2.2 L 1.3 -0.7 L 2.1 0.8 L 0 1.7 L -2.1 0.8 L -1.3 -0.7 Z"
				fill={pollenColor(flower.palette, 58 + (index % 4) * 5)}
				class="disc-floret cosmos-disc-floret"
				style={`animation-delay: ${primaryDetailStartMs(flower) + (index % 18) * 18}ms`}
			/>
		</g>
	{/each}
</g>
