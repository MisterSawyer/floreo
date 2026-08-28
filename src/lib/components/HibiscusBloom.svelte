<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { petalShadowColor, pollenColor } from '$lib/flower/palette';
	import {
		hibiscusStigmaStartMs,
		hibiscusStyleBranchStartMs,
		petalLayerStartMs,
		primaryDetailStartMs,
		secondaryDetailStartMs,
		singleBloomStartMs
	} from '$lib/flower/animation';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();
	let layer = $derived(flower.layers[0]);
</script>

<g class="bloom-head hibiscus-head">
	<!-- Five narrow epicalyx bracts and five true sepals sit behind the corolla. -->
	<g
		class="hibiscus-calyx bloom-support-arrive"
		style={`animation-delay: ${singleBloomStartMs()}ms`}
	>
		{#each Array(10) as _, index (index)}
			<path
				d="M -2.5 2 Q -4 -18 0 -31 Q 4 -18 2.5 2 Z"
				fill={`hsl(${flower.palette.stemHue} 42% ${30 + (index % 3) * 5}%)`}
				transform={`rotate(${index * 36})`}
				class="hibiscus-sepal"
			/>
		{/each}
	</g>

	{#each Array(layer.petalCount) as _, index (index)}
		<g
			transform={`rotate(${layer.rotationOffset + index * 72}) translate(0 ${-layer.radius}) scale(${0.98 + (index % 2) * 0.035} ${layer.scaleY})`}
		>
			<g
				class="petal-bloom petal-bloom--hibiscus"
				style={`animation-delay: ${petalLayerStartMs(flower, 0) + index * 105}ms`}
			>
				<path
					d={petalPath(layer.petal)}
					fill={`url(#${id}-petal-0)`}
					class="petal-surface hibiscus-petal"
				/>
				<path
					d="M -13 -3 Q -10 -22 0 -30 Q 10 -22 13 -3 Q 5 -10 0 -8 Q -5 -10 -13 -3 Z"
					fill={petalShadowColor(flower.palette, -4)}
					class="hibiscus-eye"
				/>
				<path
					d={petalVeinPath(layer.petal, 0.88)}
					class="hibiscus-vein"
					style={`opacity: ${flower.details.veinOpacity + 0.08}`}
				/>
			</g>
		</g>
	{/each}

	<!-- The fused staminal column projects from the flower and carries many anthers. -->
	<g transform="rotate(28)">
		<path
			d="M 0 2 Q 5 -19 1 -48"
			pathLength="1"
			class="stamen hibiscus-column"
			style={`animation-delay: ${primaryDetailStartMs(flower)}ms`}
		/>
		{#each Array(flower.details.stamenCount) as _, index (index)}
			{@const progress = (index + 1) / (flower.details.stamenCount + 1)}
			{@const side = index % 2 === 0 ? 1 : -1}
			<circle
				cx={side * (2.3 + (index % 3) * 0.45) + Math.sin(progress * Math.PI) * 2.4}
				cy={-10 - progress * 32}
				r={1.15 + (index % 2) * 0.2}
				fill={pollenColor(flower.palette, 66 + (index % 3) * 5)}
				class="anther hibiscus-anther"
				style={`animation-delay: ${secondaryDetailStartMs(flower) + (index % 8) * 25}ms`}
			/>
		{/each}
		<!-- The style divides into five stigma branches beyond the anther-bearing tube. -->
		{#each Array(5) as _, index (index)}
			<g transform={`translate(1 -48) rotate(${index * 24 - 48})`}>
				<path
					d="M 0 0 Q 1 -5 0 -9"
					pathLength="1"
					class="stamen hibiscus-style-branch"
					style={`animation-delay: ${hibiscusStyleBranchStartMs(flower, index)}ms`}
				/>
				<circle
					cy="-10"
					r="2.2"
					fill={petalShadowColor(flower.palette, -8)}
					class="hibiscus-stigma"
					style={`animation-delay: ${hibiscusStigmaStartMs(flower, index)}ms`}
				/>
			</g>
		{/each}
	</g>
</g>
