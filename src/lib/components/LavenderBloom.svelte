<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import { accentColor, petalColor, petalHighlightColor } from '$lib/flower/palette';
	import {
		lavenderSpikeCompleteMs,
		lavenderSpikeStartMs,
		lavenderWhorlStartMs
	} from '$lib/flower/animation';

	let { flower }: { flower: FlowerParams } = $props();

	const blossomAngles = [-28, 18, 152, 208];
</script>

<g class="bloom-head lavender-head">
	<!-- A terminal spike is built from compact, opposite-looking flower whorls. -->
	<path
		d="M 0 8 C -1 -17 1 -43 0 -72"
		pathLength="1"
		stroke={accentColor(flower.palette, 36)}
		class="lavender-spike-axis"
		style={`animation-delay: ${lavenderSpikeStartMs()}ms`}
	/>

	{#each flower.bloomNodes as node, nodeIndex (nodeIndex)}
		<g transform={`translate(${node.x} ${node.y}) rotate(${node.rotation}) scale(${node.scale})`}>
			<g
				class="lavender-whorl"
				style={`animation-delay: ${lavenderWhorlStartMs(flower, nodeIndex)}ms`}
			>
				<!-- Persistent, pointed bracts sit immediately below each verticillaster. -->
				<path d="M 0 2 L 13 8 L 5 -3 Z" fill={accentColor(flower.palette, 31)} />
				<path d="M 0 2 L -13 8 L -5 -3 Z" fill={accentColor(flower.palette, 35)} />

				{#each blossomAngles as blossomAngle, blossomIndex (blossomIndex)}
					<g transform={`rotate(${blossomAngle}) scale(${node.openness})`}>
						<!-- Five fused corolla lobes: two upper, three spreading lower lobes. -->
						<path
							d="M 0 -2 C 4 -3 7 -3 10 -1 C 13 -6 17 -6 19 -3 C 21 -5 24 -4 24 -1 C 27 0 26 4 23 5 C 21 8 17 7 17 4 C 14 7 10 6 10 2 C 6 3 3 3 0 2 Z"
							fill={petalColor(flower.palette, 0.32, blossomIndex % 2 ? 1 : -2)}
							class="lavender-corolla"
						/>
						<path
							d="M 0 -2 Q -4 0 0 2 L 7 2 L 7 -2 Z"
							fill={accentColor(flower.palette, 34)}
							class="lavender-calyx"
						/>
						<circle cx="19" cy="0" r="1.1" fill={petalHighlightColor(flower.palette)} />
					</g>
				{/each}
			</g>
		</g>
	{/each}

	<g transform="translate(0 -72)">
		<g
			class="lavender-whorl lavender-terminal-bud"
			style={`animation-delay: ${lavenderSpikeCompleteMs()}ms`}
		>
			{#each [-42, 0, 42] as angle (angle)}
				<ellipse
					cx={Math.sin((angle * Math.PI) / 180) * 6}
					cy={-Math.cos((angle * Math.PI) / 180) * 7}
					rx="3.2"
					ry="6.5"
					transform={`rotate(${angle})`}
					fill={petalColor(flower.palette, 0.65, -5)}
				/>
			{/each}
		</g>
	</g>
</g>
