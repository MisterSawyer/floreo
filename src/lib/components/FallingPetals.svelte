<script lang="ts">
	import { petalPath, petalVeinPath } from '$lib/flower/petal';
	import { petalColor, petalHighlightColor, petalShadowColor } from '$lib/flower/palette';
	import type { FlowerParams } from '$lib/flower/types';

	type Petal = {
		left: number;
		size: number;
		duration: number;
		delay: number;
		driftDuration: number;
		driftFrom: number;
		driftTo: number;
		flutterDuration: number;
		turnFrom: number;
		turnTo: number;
		opacity: number;
		blur: number;
	};

	let { flower }: { flower: FlowerParams } = $props();

	let sourceLayer = $derived(flower.layers[0]);
	let sourcePetal = $derived(sourceLayer.petal);
	let petalViewBox = $derived(
		`${-sourcePetal.width * 1.2} ${-sourcePetal.length * 1.08} ${sourcePetal.width * 2.4} ${sourcePetal.length * 1.14}`
	);

	const fallingPetals: Petal[] = [
		{
			left: 4,
			size: 13,
			duration: 19,
			delay: -7,
			driftDuration: 5.8,
			driftFrom: -11,
			driftTo: 19,
			flutterDuration: 2.7,
			turnFrom: -24,
			turnTo: 38,
			opacity: 0.38,
			blur: 0.2
		},
		{
			left: 14,
			size: 18,
			duration: 23,
			delay: -18,
			driftDuration: 7.1,
			driftFrom: -23,
			driftTo: 12,
			flutterDuration: 3.8,
			turnFrom: 18,
			turnTo: 82,
			opacity: 0.28,
			blur: 0.7
		},
		{
			left: 25,
			size: 11,
			duration: 16,
			delay: -3,
			driftDuration: 4.9,
			driftFrom: -8,
			driftTo: 27,
			flutterDuration: 2.4,
			turnFrom: -56,
			turnTo: 12,
			opacity: 0.46,
			blur: 0
		},
		{
			left: 36,
			size: 15,
			duration: 21,
			delay: -13,
			driftDuration: 6.3,
			driftFrom: -20,
			driftTo: 15,
			flutterDuration: 3.1,
			turnFrom: 32,
			turnTo: 94,
			opacity: 0.32,
			blur: 0.35
		},
		{
			left: 47,
			size: 10,
			duration: 18,
			delay: -15,
			driftDuration: 5.2,
			driftFrom: -16,
			driftTo: 18,
			flutterDuration: 2.2,
			turnFrom: -10,
			turnTo: 58,
			opacity: 0.42,
			blur: 0
		},
		{
			left: 58,
			size: 17,
			duration: 24,
			delay: -8,
			driftDuration: 7.6,
			driftFrom: -13,
			driftTo: 26,
			flutterDuration: 4.2,
			turnFrom: 44,
			turnTo: 108,
			opacity: 0.27,
			blur: 0.8
		},
		{
			left: 68,
			size: 12,
			duration: 17,
			delay: -11,
			driftDuration: 5.5,
			driftFrom: -25,
			driftTo: 9,
			flutterDuration: 2.8,
			turnFrom: -42,
			turnTo: 28,
			opacity: 0.4,
			blur: 0.1
		},
		{
			left: 78,
			size: 20,
			duration: 25,
			delay: -21,
			driftDuration: 8.2,
			driftFrom: -14,
			driftTo: 23,
			flutterDuration: 4.6,
			turnFrom: 9,
			turnTo: 76,
			opacity: 0.24,
			blur: 1
		},
		{
			left: 88,
			size: 12,
			duration: 18,
			delay: -5,
			driftDuration: 5.9,
			driftFrom: -20,
			driftTo: 14,
			flutterDuration: 2.6,
			turnFrom: -31,
			turnTo: 36,
			opacity: 0.44,
			blur: 0.15
		},
		{
			left: 96,
			size: 16,
			duration: 22,
			delay: -16,
			driftDuration: 6.8,
			driftFrom: -28,
			driftTo: 7,
			flutterDuration: 3.5,
			turnFrom: 21,
			turnTo: 87,
			opacity: 0.31,
			blur: 0.5
		}
	];
</script>

<div class="petal-fall" aria-hidden="true">
	{#each fallingPetals as petal, index}
		<span
			class="petal-track"
			style={`--left: ${petal.left}%; --size: ${petal.size}px; --fall-duration: ${petal.duration}s; --fall-delay: ${petal.delay}s; --petal-opacity: ${petal.opacity};`}
		>
			<span
				class="petal-drift"
				style={`--drift-duration: ${petal.driftDuration}s; --drift-from: ${petal.driftFrom}px; --drift-to: ${petal.driftTo}px;`}
			>
				<svg
					class="petal"
					viewBox={petalViewBox}
					preserveAspectRatio="xMidYMid meet"
					style={`--flutter-duration: ${petal.flutterDuration}s; --turn-from: ${petal.turnFrom}deg; --turn-to: ${petal.turnTo}deg; --petal-blur: ${petal.blur}px;`}
				>
					<defs>
						<linearGradient
							id={`falling-petal-${flower.seed}-${index}`}
							x1="0"
							y1="0"
							x2="0.38"
							y2="1"
						>
							<stop
								offset="0"
								stop-color={petalHighlightColor(flower.palette, sourceLayer.hueShift)}
							/>
							<stop
								offset="0.42"
								stop-color={petalColor(flower.palette, 0.2, 2, sourceLayer.hueShift)}
							/>
							<stop
								offset="0.82"
								stop-color={petalColor(flower.palette, 0.62, 0, sourceLayer.hueShift)}
							/>
							<stop
								offset="1"
								stop-color={petalShadowColor(flower.palette, sourceLayer.hueShift)}
							/>
						</linearGradient>
					</defs>
					<path
						d={petalPath(sourcePetal)}
						fill={`url(#falling-petal-${flower.seed}-${index})`}
						stroke={petalShadowColor(flower.palette, sourceLayer.hueShift)}
						class="petal-surface"
					/>
					<path
						d={petalVeinPath(sourcePetal, 0.78)}
						stroke={petalHighlightColor(flower.palette, sourceLayer.hueShift)}
						class="petal-crease"
					/>
				</svg>
			</span>
		</span>
	{/each}
</div>

<style>
	.petal-fall {
		position: absolute;
		z-index: 1;
		inset: 0;
		overflow: hidden;
		contain: strict;
		pointer-events: none;
	}

	.petal-track {
		position: absolute;
		top: -2rem;
		left: var(--left);
		width: var(--size);
		opacity: 0;
		animation: petal-fall var(--fall-duration) linear var(--fall-delay) infinite;
	}

	.petal-drift {
		display: block;
		animation: petal-drift var(--drift-duration) ease-in-out infinite alternate;
		perspective: 80px;
	}

	.petal {
		display: block;
		width: var(--size);
		height: auto;
		overflow: visible;
		transform-origin: 50% 30%;
		filter: drop-shadow(0 2px 4px rgb(63 47 52 / 0.09)) blur(var(--petal-blur));
		animation: petal-flutter var(--flutter-duration) ease-in-out infinite alternate;
		backface-visibility: visible;
	}

	.petal-surface {
		stroke-width: 0.7px;
		stroke-opacity: 0.22;
		vector-effect: non-scaling-stroke;
	}

	.petal-crease {
		fill: none;
		stroke-width: 0.65px;
		stroke-linecap: round;
		stroke-opacity: 0.55;
		vector-effect: non-scaling-stroke;
	}

	@keyframes petal-fall {
		0% {
			transform: translate3d(0, 0, 0);
			opacity: 0;
		}
		7%,
		90% {
			opacity: var(--petal-opacity);
		}
		100% {
			transform: translate3d(0, calc(100dvh + 4rem), 0);
			opacity: 0;
		}
	}

	@keyframes petal-drift {
		from {
			transform: translate3d(var(--drift-from), 0, 0);
		}
		to {
			transform: translate3d(var(--drift-to), 0, 0);
		}
	}

	@keyframes petal-flutter {
		from {
			transform: rotate(var(--turn-from)) rotateX(18deg) rotateY(-52deg) scale(0.92);
		}
		to {
			transform: rotate(var(--turn-to)) rotateX(-28deg) rotateY(42deg) scale(1.04);
		}
	}

	@media (max-width: 42rem) {
		.petal-track:nth-child(2n + 1) {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.petal-fall {
			display: none;
		}
	}
</style>
