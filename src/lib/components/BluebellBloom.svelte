<script lang="ts">
	import type { FlowerParams } from '$lib/flower/types';
	import {
		accentColor,
		petalColor,
		petalHighlightColor,
		petalShadowColor
	} from '$lib/flower/palette';
	import {
		GROWTH_TIMING,
		bluebellBranchStartMs,
		bluebellFlowerStartMs,
		bluebellRacemeCompleteMs,
		bluebellRacemeStartMs
	} from '$lib/flower/animation';

	let { flower }: { flower: FlowerParams } = $props();

	function bellPath(scale: number) {
		const width = 9 * scale;
		const length = 24 * scale;
		return [
			'M -3 0',
			`C ${-width * 0.85} ${length * 0.28} ${-width} ${length * 0.68} ${-width * 0.72} ${length * 0.84}`,
			`Q ${-width * 1.06} ${length * 1.02} ${-width * 0.52} ${length * 0.94}`,
			`Q ${-width * 0.35} ${length * 1.1} 0 ${length * 0.94}`,
			`Q ${width * 0.35} ${length * 1.1} ${width * 0.52} ${length * 0.94}`,
			`Q ${width * 1.06} ${length * 1.02} ${width * 0.72} ${length * 0.84}`,
			`C ${width} ${length * 0.68} ${width * 0.85} ${length * 0.28} 3 0 Z`
		].join(' ');
	}
</script>

<g class="bloom-head bluebell-head">
	<!-- The native bluebell raceme arches and bears all flowers on one side. -->
	<path
		d="M 0 8 C -1 -16 2 -43 8 -61 Q 12 -73 6 -82"
		pathLength="1"
		stroke={accentColor(flower.palette, 35)}
		class="bluebell-raceme-axis"
		style={`animation-delay: ${bluebellRacemeStartMs()}ms`}
	/>

	{#each flower.bloomNodes as node, nodeIndex (nodeIndex)}
		{@const attachmentX = Math.max(0, (8 - node.y) * 0.1)}
		<path
			d={`M ${attachmentX} ${node.y} Q ${node.x * 0.62} ${node.y - 2} ${node.x} ${node.y + 1}`}
			pathLength="1"
			stroke={accentColor(flower.palette, 37)}
			class="bluebell-branch"
			style={`animation-delay: ${bluebellBranchStartMs(flower, nodeIndex)}ms`}
		/>
		<g transform={`translate(${node.x} ${node.y}) rotate(${node.rotation}) scale(${node.scale})`}>
			<g
				class="bluebell-flower"
				style={`animation-delay: ${bluebellFlowerStartMs(flower, nodeIndex)}ms`}
			>
				<!-- Two slender bracts subtend each nodding, six-tepalled bell. -->
				<path d="M 0 1 L -8 -6 L -2 4 Z" fill={accentColor(flower.palette, 41)} />
				<path d="M 1 1 L 7 -4 L 3 5 Z" fill={accentColor(flower.palette, 35)} />
				<path
					d={bellPath(node.openness)}
					fill={petalColor(flower.palette, 0.45, -1)}
					class="bluebell-corolla"
				/>
				<path
					d={`M -2 1 Q 0 ${13 * node.openness} 1 ${20 * node.openness}`}
					class="bluebell-midvein"
				/>
				<ellipse
					cy={22 * node.openness}
					rx={4.8 * node.openness}
					ry={1.7 * node.openness}
					fill={petalHighlightColor(flower.palette)}
					opacity="0.46"
				/>
			</g>
		</g>
	{/each}

	<!-- The youngest flowers remain closed at the hooked tip. -->
	{#each Array(flower.details.budCount) as _, index (index)}
		<g transform={`translate(${8 - index * 1.5} ${-81 + index * 7}) rotate(${22 + index * 10})`}>
			<path
				d="M -3 0 Q -6 9 0 17 Q 6 9 3 0 Z"
				fill={petalShadowColor(flower.palette)}
				class="bluebell-bud"
				style={`animation-delay: ${bluebellRacemeCompleteMs() + index * 75}ms; --bud-duration: ${GROWTH_TIMING.budDuration}ms`}
			/>
		</g>
	{/each}
</g>
