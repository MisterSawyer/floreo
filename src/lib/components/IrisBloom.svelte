<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { pollenColor } from '$lib/flower/palette';
	import { petalLayerStartMs, primaryDetailStartMs } from '$lib/flower/animation';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();
</script>

<g class="bloom-head iris-head">
	{#each flower.layers as layer, layerIndex (layerIndex)}
		{#each Array(layer.petalCount) as _, index (index)}
			<g
				transform={`rotate(${layer.rotationOffset + index * 120}) translate(0 ${-layer.radius}) scale(${1 + (index % 2) * 0.025} ${layer.scaleY})`}
			>
				<g
					class="petal-bloom petal-bloom--iris"
					style={`animation-delay: ${petalLayerStartMs(flower, layerIndex) + index * 100}ms`}
				>
					<path
						d={petalPath(layer.petal)}
						fill={`url(#${id}-petal-${layerIndex})`}
						class={`petal-surface ${layerIndex === 0 ? 'iris-fall' : 'iris-standard'}`}
					/>
					<path
						d={petalVeinPath(layer.petal, layerIndex === 0 ? 0.91 : 0.86)}
						class="iris-vein"
						style={`opacity: ${flower.details.veinOpacity + 0.12}`}
					/>
					{#if layerIndex === 0}
						<!-- A dense line of colored trichomes is the diagnostic beard of this hybrid. -->
						<g class="iris-beard">
							{#each Array(9) as _, beardIndex (beardIndex)}
								<ellipse
									cx={(beardIndex % 2 ? 1 : -1) * (1.1 + (beardIndex % 3) * 0.35)}
									cy={-10 - beardIndex * 2.7}
									rx="1.7"
									ry="2.6"
									fill={pollenColor(flower.palette, 67 + (beardIndex % 3) * 6)}
								/>
							{/each}
						</g>
					{/if}
				</g>
			</g>
		{/each}
	{/each}

	<!-- Three petaloid style arms arch over the three falls; each shelters one stamen. -->
	<g class="iris-style-arms" style={`animation-delay: ${primaryDetailStartMs(flower)}ms`}>
		{#each Array(3) as _, index (index)}
			<g transform={`rotate(${flower.layers[0].rotationOffset + index * 120})`}>
				<path
					d="M -3 -2 C -7 -11 -8 -24 0 -35 C 8 -24 7 -11 3 -2 Z"
					fill={`url(#${id}-petal-1)`}
					class="iris-style-arm"
				/>
				<ellipse cy="-21" rx="1.5" ry="5" fill={pollenColor(flower.palette, 61)} />
			</g>
		{/each}
	</g>
</g>
