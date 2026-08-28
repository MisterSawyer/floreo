<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { accentColor } from '$lib/flower/palette';
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
		const radius = Math.sqrt(progress) * flower.centerRadius * 0.9;
		return {
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius,
			rotation: index * 137.508,
			progress
		};
	}

	function discFloretPath(radius: number) {
		const points = Array.from({ length: 10 }, (_, index) => {
			const angle = (index * Math.PI) / 5 - Math.PI / 2;
			const r = index % 2 === 0 ? radius : radius * 0.6;
			return `${Math.cos(angle) * r} ${Math.sin(angle) * r}`;
		});
		return `M ${points.join(' L ')} Z`;
	}
</script>

<g class="bloom-head sunflower-head">
	<!-- Narrow, overlapping involucral bracts cup the composite head. -->
	<g
		class="sunflower-involucre bloom-support-arrive"
		aria-hidden="true"
		style={`animation-delay: ${singleBloomStartMs()}ms`}
	>
		{#each Array(21) as _, index (index)}
			<path
				d="M -4 1 Q -6 -18 0 -32 Q 6 -18 4 1 Z"
				fill={accentColor(flower.palette, 29 + (index % 4) * 3)}
				transform={`rotate(${index * (360 / 21)}) translate(0 ${-flower.centerRadius * 0.72})`}
				class="sunflower-bract"
			/>
		{/each}
	</g>

	{#each Array(layer.petalCount) as _, index (index)}
		<g
			transform={`rotate(${layer.rotationOffset + index * (360 / layer.petalCount)}) translate(0 ${-layer.radius}) scale(${0.95 + (index % 4) * 0.018} ${0.94 + (index % 3) * 0.025})`}
		>
			<g
				class="petal-bloom petal-bloom--sunflower"
				style={`animation-delay: ${petalLayerStartMs(flower, 0) + index * 22}ms`}
			>
				<path
					d={petalPath(layer.petal)}
					fill={`url(#${id}-petal-0)`}
					class="petal-surface sunflower-ray"
				/>
				<path
					d={petalVeinPath(layer.petal, 0.9)}
					class="sunflower-ray-vein"
					style={`opacity: ${flower.details.veinOpacity}`}
				/>
			</g>
		</g>
	{/each}

	<circle
		r={flower.centerRadius}
		fill={`hsl(${flower.palette.throatHue} 58% 25%)`}
		class="sunflower-disc-base"
		style={`animation-delay: ${primaryDetailStartMs(flower)}ms`}
	/>
	<g class="sunflower-disc">
		{#each Array(flower.details.discFloretCount) as _, index (index)}
			{@const floret = discPosition(index, flower.details.discFloretCount)}
			<g transform={`translate(${floret.x} ${floret.y}) rotate(${floret.rotation})`}>
				<path
					d={discFloretPath(1.75 + (index % 3) * 0.12)}
					fill={`hsl(${flower.palette.throatHue + (index % 3) * 2} ${55 + (index % 4) * 5}% ${22 + floret.progress * 22}%)`}
					class="disc-floret sunflower-disc-floret"
					style={`animation-delay: ${primaryDetailStartMs(flower) + (index % 30) * 12}ms`}
				/>
			</g>
		{/each}
	</g>
</g>
