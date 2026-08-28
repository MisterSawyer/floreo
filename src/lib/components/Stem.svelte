<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import {
		leafPath,
		columbineLeafletPath,
		cordateLeafPath,
		lobedLeafPath,
		serratedLeafPath,
		spatulateLeafPath,
		strapLeafPath,
		swordLeafPath,
		tulipLeafPath
	} from '$lib/flower/petal';
	import { GROWTH_TIMING, standardLeafStartMs } from '$lib/flower/animation';
	import {
		cosmosLeafStructure,
		leafRenderLayers,
		standardLeafPlacement,
		stemPath
	} from '$lib/flower/stem';

	let { flower, id }: { flower: FlowerParams; id: string } = $props();

	let leafLayers = $derived(leafRenderLayers(flower.seed, flower.leafCount));
</script>

{#snippet renderLeaf(index: number)}
	{@const leaf = standardLeafPlacement(flower, index)}
	{@const leafStart = standardLeafStartMs(flower, index)}
	<g transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle})`}>
		{#if flower.kind === 'rose'}
			<g transform={`scale(${leaf.scale})`}>
				<!-- A five-leaflet rose leaf: its rachis grows before each leaflet unfolds. -->
				<path
					d={`M 0 0 Q ${leaf.side * 3.5} ${-flower.stem.leafLength * 0.48} ${leaf.side * 6} ${-flower.stem.leafLength * 0.94}`}
					pathLength="1"
					class="leaf-rachis rose-leaf-rachis"
					style={`animation-delay: ${leafStart}ms`}
				/>
				{#each [0.38, 0.69] as progress, leafletIndex (leafletIndex)}
					{#each [1, -1] as leafletSide (leafletSide)}
						<g
							transform={`translate(${leaf.side * 6 * progress} ${-flower.stem.leafLength * progress}) rotate(${leafletSide * 61 + leaf.side * 4}) scale(${0.94 + leafletIndex * 0.06})`}
						>
							<g
								class="rose-leaflet-unfurl"
								style={`animation-delay: ${leafStart + GROWTH_TIMING.roseRachisDuration * progress}ms`}
							>
								<path
									d={serratedLeafPath(
										flower.stem.leafLength * 0.36,
										flower.stem.leafLength * 0.12,
										leafletSide as 1 | -1
									)}
									fill={`url(#${id}-leaf)`}
									class="leaf-surface rose-leaflet"
								/>
								<path
									d={`M 0 0 L ${leafletSide * flower.stem.leafLength * 0.06} ${-flower.stem.leafLength * 0.31}`}
									class="leaf-vein"
								/>
							</g>
						</g>
					{/each}
				{/each}
				<g
					transform={`translate(${leaf.side * 5.5} ${-flower.stem.leafLength * 0.84}) rotate(${leaf.side * 6}) scale(1.08)`}
				>
					<g
						class="rose-leaflet-unfurl"
						style={`animation-delay: ${leafStart + GROWTH_TIMING.roseRachisDuration * 0.84}ms`}
					>
						<path
							d={serratedLeafPath(
								flower.stem.leafLength * 0.4,
								flower.stem.leafLength * 0.135,
								leaf.side
							)}
							fill={`url(#${id}-leaf)`}
							class="leaf-surface rose-leaflet"
						/>
						<path
							d={`M 0 0 L ${leaf.side * flower.stem.leafLength * 0.065} ${-flower.stem.leafLength * 0.35}`}
							class="leaf-vein"
						/>
					</g>
				</g>
			</g>
		{:else}
			<g
				class="leaf-unfurl"
				style={`animation-delay: ${leafStart}ms`}
				transform={`scale(${leaf.scale})`}
			>
				{#if flower.kind === 'sunflower'}
					<!-- The coarse, cordate blade is carried on a distinct petiole. -->
					<path d="M 0 2 L 0 -12" class="leaf-rachis sunflower-petiole" />
					<g transform="translate(0 -11)">
						<path
							d={cordateLeafPath(flower.stem.leafLength, flower.stem.leafLength * 0.34, leaf.side)}
							fill={`url(#${id}-leaf)`}
							class="leaf-surface sunflower-leaf"
						/>
						<path
							d={`M 0 0 Q ${leaf.side * 4} ${-flower.stem.leafLength * 0.5} ${leaf.side * flower.stem.leafLength * 0.11} ${-flower.stem.leafLength * 0.95}`}
							class="leaf-vein sunflower-leaf-vein"
						/>
					</g>
				{:else if flower.kind === 'cosmos'}
					{@const structure = cosmosLeafStructure(
						flower.seed,
						index,
						flower.stem.leafLength
					)}
					<!-- Irregularly divided foliage with thread-like, alternating final segments. -->
					<path
						d={`M 0 1 Q ${leaf.side * structure.controlDrift} ${-flower.stem.leafLength * 0.48} ${leaf.side * structure.tipDrift} ${-flower.stem.leafLength}`}
						stroke={`url(#${id}-leaf)`}
						class="cosmos-leaf-rachis"
					/>
					{#each structure.segments as segment, segmentIndex (segmentIndex)}
						{@const baseX = leaf.side * structure.tipDrift * segment.progress}
						{@const baseY = -flower.stem.leafLength * segment.progress}
						<path
							d={`M ${baseX} ${baseY} Q ${baseX + segment.side * segment.controlReach} ${baseY - segment.rise * 0.52} ${baseX + segment.side * segment.reach} ${baseY - segment.rise}`}
							stroke={`url(#${id}-leaf)`}
							class="cosmos-leaf-segment"
						/>
					{/each}
				{:else if flower.kind === 'columbine'}
					<!-- A compact ternate unit represents the plant's twice-ternate basal leaf. -->
					<path
						d={`M 0 1 Q ${leaf.side * 4} -9 ${leaf.side * 6} -17`}
						class="leaf-rachis columbine-petiole"
					/>
					{#each [-34, 0, 34] as leafletAngle, leafletIndex (leafletIndex)}
						<g
							transform={`translate(${leaf.side * 6} -16) rotate(${leafletAngle}) scale(${0.82 + leafletIndex * 0.06})`}
						>
							<path
								d={columbineLeafletPath(
									flower.stem.leafLength * 0.58,
									flower.stem.leafLength * 0.24
								)}
								fill={`url(#${id}-leaf)`}
								class="leaf-surface columbine-leaflet"
							/>
						</g>
					{/each}
				{:else if flower.kind === 'hibiscus'}
					<path d="M 0 2 L 0 -9" class="leaf-rachis hibiscus-petiole" />
					<g transform="translate(0 -8)">
						<path
							d={serratedLeafPath(flower.stem.leafLength, flower.stem.leafLength * 0.32, leaf.side)}
							fill={`url(#${id}-leaf)`}
							class="leaf-surface hibiscus-leaf"
						/>
						<path
							d={`M 0 0 Q ${leaf.side * 4} ${-flower.stem.leafLength * 0.48} ${leaf.side * flower.stem.leafLength * 0.14} ${-flower.stem.leafLength * 0.92}`}
							class="leaf-vein hibiscus-leaf-vein"
						/>
					</g>
				{:else if flower.kind === 'iris'}
					<path
						d={swordLeafPath(flower.stem.leafLength, flower.stem.leafLength * 0.15, leaf.side)}
						fill={`url(#${id}-leaf)`}
						class="leaf-surface iris-leaf"
					/>
					<path
						d={`M 0 0 Q ${leaf.side * 2} ${-flower.stem.leafLength * 0.52} ${leaf.side * flower.stem.leafLength * 0.08} ${-flower.stem.leafLength * 0.94}`}
						class="leaf-vein iris-leaf-vein"
					/>
				{:else if flower.kind === 'daffodil' || flower.kind === 'bluebell'}
					<path
						d={strapLeafPath(flower.stem.leafLength, flower.stem.leafLength * 0.1, leaf.side)}
						fill={`url(#${id}-leaf)`}
						class={`leaf-surface ${flower.kind}-leaf`}
					/>
					<path
						d={`M 0 0 Q ${leaf.side} ${-flower.stem.leafLength * 0.5} ${leaf.side * flower.stem.leafLength * 0.06} ${-flower.stem.leafLength * 0.93}`}
						class={`leaf-vein ${flower.kind}-leaf-vein`}
					/>
				{:else if flower.kind === 'poppy'}
					<path
						d={lobedLeafPath(flower.stem.leafLength, flower.stem.leafLength * 0.25, leaf.side)}
						fill={`url(#${id}-leaf)`}
						class="leaf-surface poppy-leaf"
					/>
					<path
						d={`M 0 0 Q ${leaf.side * 4} ${-flower.stem.leafLength * 0.48} ${leaf.side * flower.stem.leafLength * 0.16} ${-flower.stem.leafLength * 0.92}`}
						class="leaf-vein"
					/>
				{:else if flower.kind === 'tulip'}
					<path
						d={tulipLeafPath(flower.stem.leafLength, flower.stem.leafLength * 0.3, leaf.side)}
						fill={`url(#${id}-leaf)`}
						class="leaf-surface tulip-leaf"
					/>
					{#each [-0.06, 0, 0.06] as veinOffset (veinOffset)}
						<path
							d={`M ${veinOffset * flower.stem.leafLength} 0 Q ${leaf.side * 4} ${-flower.stem.leafLength * 0.5} ${leaf.side * flower.stem.leafLength * (0.12 + veinOffset)} ${-flower.stem.leafLength * 0.9}`}
							class="leaf-vein tulip-leaf-vein"
						/>
					{/each}
				{:else if flower.kind === 'daisy'}
					<path
						d={spatulateLeafPath(flower.stem.leafLength, flower.stem.leafLength * 0.21, leaf.side)}
						fill={`url(#${id}-leaf)`}
						class="leaf-surface daisy-leaf"
					/>
					<path
						d={`M 0 0 Q ${leaf.side * 3} ${-flower.stem.leafLength * 0.5} ${leaf.side * flower.stem.leafLength * 0.15} ${-flower.stem.leafLength * 0.91}`}
						class="leaf-vein"
					/>
				{:else}
					{@const leafWidth =
						flower.kind === 'carnation'
							? flower.stem.leafLength * 0.085
							: flower.kind === 'lavender'
								? flower.stem.leafLength * 0.11
								: flower.kind === 'lily'
									? flower.stem.leafLength * 0.16
									: flower.stem.leafLength * 0.34}
					<path
						d={leafPath(flower.stem.leafLength, leafWidth, leaf.side)}
						fill={`url(#${id}-leaf)`}
						class={`leaf-surface ${flower.kind}-leaf`}
					/>
					<path
						d={`M 0 0 Q ${leaf.side * 5} ${-flower.stem.leafLength * 0.45} ${leaf.side * flower.stem.leafLength * 0.18} ${-flower.stem.leafLength * 0.91}`}
						class="leaf-vein"
					/>
				{/if}
			</g>
		{/if}
	</g>
{/snippet}

<g class="stem-system">
	{#each leafLayers.behindStem as index (index)}
		{@render renderLeaf(index)}
	{/each}

	<path d={stemPath(flower)} pathLength="1" class="stem-shadow" />
	<path d={stemPath(flower)} pathLength="1" stroke={`url(#${id}-stem)`} class="stem" />
	<path d={stemPath(flower)} pathLength="1" class="stem-glint" />

	{#each leafLayers.inFrontOfStem as index (index)}
		{@render renderLeaf(index)}
	{/each}
</g>
