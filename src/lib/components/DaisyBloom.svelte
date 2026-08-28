<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath } from '$lib/flower/petal';
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
		const radius = Math.sqrt(progress) * flower.centerRadius * 0.88;
		return {
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius,
			rotation: index * 137.508
		};
	}

	function discFloretPath(radius: number) {
		const points = Array.from({ length: 10 }, (_, index) => {
			const angle = (index * Math.PI) / 5 - Math.PI / 2;
			const r = index % 2 === 0 ? radius : radius * 0.62;
			return `${Math.cos(angle) * r} ${Math.sin(angle) * r}`;
		});
		return `M ${points.join(' L ')} Z`;
	}
</script>

<g class="bloom-head daisy-head">
	<!-- A ring of involucral bracts supports the composite flower head. -->
	<g
		class="daisy-involucre bloom-support-arrive"
		aria-hidden="true"
		style={`animation-delay: ${singleBloomStartMs()}ms`}
	>
		{#each Array(13) as _, index (index)}
			<path
				d="M -3 0 Q -4 -17 0 -28 Q 4 -17 3 0 Z"
				fill={accentColor(flower.palette, 34 + (index % 3) * 4)}
				transform={`rotate(${index * (360 / 13)}) translate(0 -9)`}
				class="daisy-bract"
			/>
		{/each}
	</g>

	{#each Array(layer.petalCount) as _, index (index)}
		<g
			transform={`rotate(${layer.rotationOffset + index * (360 / layer.petalCount)}) translate(0 ${-layer.radius}) scale(${0.94 + (index % 5) * 0.018} ${0.94 + (index % 3) * 0.026})`}
		>
			<g
				class="petal-bloom petal-bloom--daisy"
				style={`animation-delay: ${petalLayerStartMs(flower, 0) + index * 24}ms`}
			>
				<path
					d={petalPath(layer.petal)}
					fill={`url(#${id}-petal-0)`}
					class="petal-surface daisy-ray"
				/>
				<path
					d={`M 0 -2 L ${layer.petal.curl * 0.3} ${-layer.petal.length * 0.88}`}
					class="daisy-ray-vein"
				/>
			</g>
		</g>
	{/each}

	<circle
		r={flower.centerRadius * 0.96}
		fill={pollenColor(flower.palette, 48)}
		class="daisy-disc-base"
		style={`animation-delay: ${primaryDetailStartMs(flower)}ms`}
	/>
	<g class="daisy-disc">
		{#each Array(flower.details.discFloretCount) as _, index (index)}
			{@const floret = discPosition(index, flower.details.discFloretCount)}
			<g transform={`translate(${floret.x} ${floret.y}) rotate(${floret.rotation})`}>
				<path
					d={discFloretPath(2.1 + (index % 3) * 0.16)}
					fill={pollenColor(flower.palette, 60 + (index % 4) * 5)}
					class="disc-floret"
					style={`animation-delay: ${primaryDetailStartMs(flower) + index * 11}ms`}
				/>
			</g>
		{/each}
	</g>
</g>
