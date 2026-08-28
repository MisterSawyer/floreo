<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { accentColor, pollenColor } from '$lib/flower/palette';
	import {
		petalLayerStartMs,
		primaryDetailStartMs,
		secondaryDetailStartMs,
		singleBloomStartMs
	} from '$lib/flower/animation';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();

	function stigmaPath(radius: number, rays: number) {
		const points = Array.from({ length: rays * 2 }, (_, index) => {
			const angle = (index * Math.PI) / rays - Math.PI / 2;
			const r = index % 2 === 0 ? radius : radius * 0.42;
			return `${Math.cos(angle) * r} ${Math.sin(angle) * r}`;
		});
		return `M ${points.join(' L ')} Z`;
	}
</script>

<g class="bloom-head poppy-head">
	<!-- Keep the two protective sepals attached behind the open bloom. -->
	{#each [-1, 1] as side (side)}
		<path
			d="M -7 2 Q -12 -34 0 -55 Q 12 -34 7 2 Z"
			fill={accentColor(flower.palette, 35)}
			transform={`rotate(${side * 18})`}
			class="poppy-sepal"
			style={`animation-delay: ${singleBloomStartMs()}ms`}
		/>
	{/each}

	{#each flower.layers as layer, layerIndex (layerIndex)}
		{#each Array(layer.petalCount) as _, index (index)}
			<g
				transform={`rotate(${layer.rotationOffset + index * 180}) translate(0 ${-layer.radius}) scale(${1 + Math.sin(flower.seed + index * 2.8) * 0.035} ${layer.scaleY})`}
			>
				<g
					class="petal-bloom petal-bloom--poppy"
					style={`--poppy-turn: ${(index ? 1 : -1) * (7 + layerIndex * 3)}deg; animation-delay: ${petalLayerStartMs(flower, layerIndex) + index * 115}ms`}
				>
					<path
						d={petalPath(layer.petal)}
						fill={`url(#${id}-petal-${layerIndex})`}
						class="petal-surface poppy-petal"
					/>
					<path
						d="M -15 -5 Q -13 -22 0 -29 Q 13 -22 15 -5 Q 7 -11 0 -8 Q -7 -11 -15 -5 Z"
						class="poppy-blotch"
					/>
					<path
						d={petalVeinPath(layer.petal, 0.86)}
						class="poppy-crease"
						style={`opacity: ${flower.details.veinOpacity}`}
					/>
				</g>
			</g>
		{/each}
	{/each}

	<g class="poppy-stamens">
		{#each Array(flower.details.stamenCount) as _, index (index)}
			{@const stamenAngle = index * (360 / flower.details.stamenCount) + (index % 3) * 2.4}
			{@const reach = 17 + (index % 4) * 1.7}
			<g transform={`rotate(${stamenAngle})`}>
				<path
					d={`M 0 -7 Q ${index % 2 ? 1.5 : -1.5} -13 0 ${-reach}`}
					pathLength="1"
					class="stamen poppy-stamen"
					style={`animation-delay: ${primaryDetailStartMs(flower) + (index % 6) * 25}ms`}
				/>
				<ellipse
					cy={-reach - 1}
					rx="1.3"
					ry="2.8"
					fill={pollenColor(flower.palette, 48)}
					class="anther poppy-anther"
					style={`animation-delay: ${secondaryDetailStartMs(flower) + (index % 6) * 25}ms`}
				/>
			</g>
		{/each}
	</g>
	<circle
		r={flower.centerRadius}
		fill={accentColor(flower.palette, 52)}
		class="poppy-ovary"
		style={`animation-delay: ${primaryDetailStartMs(flower)}ms`}
	/>
	<path
		d={stigmaPath(flower.centerRadius * 0.86, 9)}
		fill={accentColor(flower.palette, 26)}
		class="poppy-stigma"
		style={`animation-delay: ${secondaryDetailStartMs(flower)}ms`}
	/>
</g>
