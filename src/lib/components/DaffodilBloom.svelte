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

	function coronaRimPath(radius: number) {
		const points = Array.from({ length: 24 }, (_, index) => {
			const angle = (index * Math.PI * 2) / 24 - Math.PI / 2;
			const r = radius * (index % 2 === 0 ? 1 : 0.91);
			return `${Math.cos(angle) * r} ${Math.sin(angle) * r}`;
		});
		return `M ${points.join(' L ')} Z`;
	}
</script>

<g class="bloom-head daffodil-head">
	<!-- The papery spathe remains at the junction of flower and leafless scape. -->
	<path
		d="M -3 7 Q -13 20 -7 38 Q 1 26 5 9 Q 1 14 -3 7 Z"
		fill={accentColor(flower.palette, 49)}
		class="daffodil-spathe bloom-support-arrive"
		style={`animation-delay: ${singleBloomStartMs()}ms`}
	/>

	{#each flower.layers as layer, layerIndex (layerIndex)}
		{#each Array(layer.petalCount) as _, index (index)}
			<g
				transform={`rotate(${layer.rotationOffset + index * 120}) translate(0 ${-layer.radius}) scale(${1 - layerIndex * 0.04} ${layer.scaleY})`}
			>
				<g
					class="petal-bloom petal-bloom--daffodil"
					style={`animation-delay: ${petalLayerStartMs(flower, layerIndex) + index * 75}ms`}
				>
					<path
						d={petalPath(layer.petal)}
						fill={`url(#${id}-petal-${layerIndex})`}
						class="petal-surface daffodil-tepal"
					/>
					<path
						d={petalVeinPath(layer.petal, 0.89)}
						class="daffodil-vein"
						style={`opacity: ${flower.details.veinOpacity}`}
					/>
				</g>
			</g>
		{/each}
	{/each}

	<!-- The projecting trumpet (corona) is shown foreshortened, with a six-lobed, crimped rim. -->
	<g class="daffodil-corona" style={`animation-delay: ${primaryDetailStartMs(flower)}ms`}>
		<circle r={flower.centerRadius * 0.88} fill={pollenColor(flower.palette, 46)} />
		<path
			d={coronaRimPath(flower.centerRadius)}
			fill={pollenColor(flower.palette, 61)}
			class="daffodil-corona-rim"
		/>
		<circle r={flower.centerRadius * 0.54} fill={pollenColor(flower.palette, 34)} />
		<ellipse
			cy={-flower.centerRadius * 0.08}
			rx={flower.centerRadius * 0.4}
			ry={flower.centerRadius * 0.3}
			fill={pollenColor(flower.palette, 27)}
		/>
	</g>

	<!-- Six stamens surround a three-lobed stigma inside the corona. -->
	<g class="daffodil-stamens">
		{#each Array(6) as _, index (index)}
			<g transform={`rotate(${index * 60 + 30})`}>
				<path
					d={`M 0 -3 Q 1 -7 0 ${-flower.centerRadius * 0.38}`}
					pathLength="1"
					class="stamen daffodil-stamen"
					style={`animation-delay: ${secondaryDetailStartMs(flower) + index * 24}ms`}
				/>
				<ellipse
					cy={-flower.centerRadius * 0.42}
					rx="1.2"
					ry="2.3"
					fill={pollenColor(flower.palette, 79)}
					class="anther"
					style={`animation-delay: ${secondaryDetailStartMs(flower) + 100 + index * 24}ms`}
				/>
			</g>
		{/each}
		<path
			d="M 0 1 L 0 -7 M 0 -7 L -2.5 -10 M 0 -7 L 2.5 -10 M 0 -7 L 0 -11"
			class="stamen daffodil-style"
			pathLength="1"
			style={`animation-delay: ${secondaryDetailStartMs(flower)}ms`}
		/>
	</g>
</g>
