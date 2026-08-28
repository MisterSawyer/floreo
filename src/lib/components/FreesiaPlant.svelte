<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { leafPath, petalPath, petalVeinPath } from '$lib/flower/petal';
	import { accentColor } from '$lib/flower/palette';
	import { leafRenderLayers } from '$lib/flower/stem';
	import {
		freesiaBloomAttachment,
		freesiaBranchPath,
		freesiaBudPlacement,
		freesiaLeafPlacement,
		freesiaStemPath
	} from '$lib/flower/freesia';
	import {
		freesiaBloomBranchStartMs,
		freesiaBloomSupportStartMs,
		freesiaBudBranchStartMs,
		freesiaBudStartMs,
		freesiaBudSupportStartMs,
		freesiaLeafStartMs,
		freesiaPetalStartMs,
		freesiaThroatStartMs,
		freesiaTubeStartMs
	} from '$lib/flower/animation';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();

	let layer = $derived(flower.layers[0]);
	let leafLayers = $derived(leafRenderLayers(flower.seed, flower.leafCount));
</script>

{#snippet renderLeaf(index: number)}
	{@const leaf = freesiaLeafPlacement(flower, index)}
	<g transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.side * 4})`}>
		<g class="leaf-unfurl" style={`animation-delay: ${freesiaLeafStartMs(flower, index)}ms`}>
			<path
				d={leafPath(flower.stem.leafLength - index * 3, 13, leaf.side)}
				fill={`url(#${id}-leaf)`}
				class="leaf-surface freesia-leaf"
			/>
			<path
				d={`M 0 0 Q ${leaf.side * 3} ${-flower.stem.leafLength * 0.48} ${leaf.side * flower.stem.leafLength * 0.18} ${-flower.stem.leafLength * 0.9}`}
				class="leaf-vein"
			/>
		</g>
	</g>
{/snippet}

<g class="freesia-plant">
	{#each leafLayers.behindStem as index (index)}
		{@render renderLeaf(index)}
	{/each}

	<path d={freesiaStemPath(flower)} pathLength="1" class="stem-shadow" />
	<path d={freesiaStemPath(flower)} pathLength="1" stroke={`url(#${id}-stem)`} class="stem" />
	<path d={freesiaStemPath(flower)} pathLength="1" class="stem-glint" />

	{#each leafLayers.inFrontOfStem as index (index)}
		{@render renderLeaf(index)}
	{/each}

	{#each flower.bloomNodes as node, nodeIndex (nodeIndex)}
		{@const attachment = freesiaBloomAttachment(flower, node)}
		{@const branchStart = freesiaBloomBranchStartMs(flower, nodeIndex)}
		{@const supportStart = freesiaBloomSupportStartMs(flower, nodeIndex)}
		{@const tubeStart = freesiaTubeStartMs(flower, nodeIndex)}
		{@const petalStart = freesiaPetalStartMs(flower, nodeIndex)}
		{@const throatStart = freesiaThroatStartMs(flower, nodeIndex)}
		<path
			d={freesiaBranchPath(flower, node)}
			pathLength="1"
			class="freesia-branch"
			stroke={accentColor(flower.palette, 39)}
			style={`animation-delay: ${branchStart}ms`}
		/>
		<circle
			cx={attachment.x}
			cy={attachment.y}
			r="2.2"
			fill={accentColor(flower.palette, 38)}
			class="freesia-junction freesia-stem-junction"
			style={`animation-delay: ${branchStart}ms`}
		/>
		<circle
			cx={node.x}
			cy={node.y}
			r="2.5"
			fill={accentColor(flower.palette, 39)}
			class="freesia-junction freesia-supported"
			style={`animation-delay: ${supportStart}ms`}
		/>
		<g transform={`translate(${node.x} ${node.y}) rotate(${node.rotation}) scale(${node.scale})`}>
			<path
				d="M -3 2 Q 2 -5 8 -3 L 8 4 Q 2 5 -3 2 Z"
				fill={accentColor(flower.palette, 37)}
				class="freesia-calyx freesia-supported"
				style={`animation-delay: ${supportStart}ms`}
			/>
			<g class="freesia-bloom">
				<path
					d="M -2 1 C 6 -2, 8 -9, 18 -10 L 22 10 C 10 10, 4 5, -2 1 Z"
					fill={`url(#${id}-petal-0)`}
					class="freesia-tube"
					style={`animation-delay: ${tubeStart}ms`}
				/>
				<g transform="translate(18 0)">
					{#each Array(layer.petalCount) as _, petalIndex (petalIndex)}
						<g
							transform={`rotate(${layer.rotationOffset + petalIndex * (360 / layer.petalCount)}) scale(${node.openness})`}
						>
							<g
								class="petal-bloom petal-bloom--freesia"
								style={`animation-delay: ${petalStart}ms`}
							>
								<path
									d={petalPath(layer.petal)}
									fill={`url(#${id}-petal-0)`}
									class="petal-surface freesia-petal"
								/>
								<path d={petalVeinPath(layer.petal, 0.72)} class="petal-fold" />
							</g>
						</g>
					{/each}
					<g class="freesia-throat-arrive" style={`animation-delay: ${throatStart}ms`}>
						<circle r="5.6" fill={`url(#${id}-throat)`} class="freesia-throat" />
					</g>
				</g>
			</g>
		</g>
	{/each}

	{#each Array(flower.details.budCount) as _, index (index)}
		{@const bud = freesiaBudPlacement(flower, index)}
		{@const branchStart = freesiaBudBranchStartMs(flower, index)}
		{@const supportStart = freesiaBudSupportStartMs(flower, index)}
		{@const budStart = freesiaBudStartMs(flower, index)}
		<circle
			cx={bud.x}
			cy={bud.y}
			r="2.3"
			fill={accentColor(flower.palette, 38)}
			class="freesia-junction freesia-stem-junction"
			style={`animation-delay: ${branchStart}ms`}
		/>
		<g transform={`translate(${bud.x} ${bud.y}) rotate(${bud.rotation})`}>
			<path
				d="M -1 0 Q 7 -1 12 -4"
				pathLength="1"
				class="freesia-branch"
				stroke={accentColor(flower.palette, 39)}
				style={`animation-delay: ${branchStart}ms`}
			/>
			<path
				d="M 8 -1 Q 12 -7 17 -6 L 17 -2 Q 12 2 8 -1 Z"
				fill={accentColor(flower.palette, 37)}
				class="freesia-calyx freesia-supported"
				style={`animation-delay: ${supportStart}ms`}
			/>
			<ellipse
				cx="15"
				cy="-5"
				rx="8"
				ry="4.6"
				fill={`url(#${id}-petal-0)`}
				class="freesia-bud"
				style={`animation-delay: ${budStart}ms`}
			/>
		</g>
	{/each}
</g>
