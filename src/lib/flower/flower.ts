import type { BloomNode, FlowerKind, FlowerParams, PetalLayer, PollenMote, Seed } from './types';
import { intRange, mulberry32, pick, range } from './prng';
import { generatePalette } from './palette';
import translations from '$lib/i18n/translations.json';

export const FLOWER_KINDS: readonly FlowerKind[] = [
	'rose',
	'freesia',
	'lily',
	'carnation',
	'tulip',
	'poppy',
	'daisy',
	'sunflower',
	'daffodil',
	'iris',
	'lavender',
	'cosmos',
	'hibiscus',
	'columbine',
	'bluebell'
];

const BOTANICAL_NAMES: Record<FlowerKind, string> = {
	rose: 'Rosa × hybrida',
	freesia: 'Freesia refracta',
	lily: 'Lilium orientale',
	carnation: 'Dianthus caryophyllus',
	tulip: 'Tulipa gesneriana',
	poppy: 'Papaver rhoeas',
	daisy: 'Bellis perennis',
	sunflower: 'Helianthus annuus',
	daffodil: 'Narcissus pseudonarcissus',
	iris: 'Iris × germanica',
	lavender: 'Lavandula angustifolia',
	cosmos: 'Cosmos bipinnatus',
	hibiscus: 'Hibiscus rosa-sinensis',
	columbine: 'Aquilegia vulgaris',
	bluebell: 'Hyacinthoides non-scripta'
};

/** How many name variants translations.json offers for each kind, read straight from the file. */
const NAME_VARIANT_COUNTS: Record<FlowerKind, number> = Object.fromEntries(
	FLOWER_KINDS.map((kind) => [kind, translations.en.flowerNames[kind].length])
) as Record<FlowerKind, number>;

export const FLOWER_LABELS: Record<FlowerKind, string> = {
	rose: 'Rose',
	freesia: 'Freesia',
	lily: 'Lily',
	carnation: 'Carnation',
	tulip: 'Tulip',
	poppy: 'Poppy',
	daisy: 'Daisy',
	sunflower: 'Sunflower',
	daffodil: 'Daffodil',
	iris: 'Bearded iris',
	lavender: 'English lavender',
	cosmos: 'Cosmos',
	hibiscus: 'Hibiscus',
	columbine: 'Columbine',
	bluebell: 'English bluebell'
};

function roseLayers(rng: () => number): PetalLayer[] {
	// Cultivated double roses retain a five-petal outer plan, then pack transformed
	// stamens into a dense, offset spiral toward the centre.
	const counts = [5, 8, 11, 13, 9, 5].slice(0, intRange(rng, 5, 6));
	return counts.map((petalCount, index) => {
		const depth = index / (counts.length - 1);
		return {
			petalCount: petalCount + (index > 0 && rng() > 0.78 ? 1 : 0),
			radius: 3.8 - index * 0.45 + range(rng, -0.35, 0.35),
			rotationOffset: range(rng, -8, 8) + index * 137.5,
			petal: {
				length: 58 - index * 8.2 + range(rng, -1.8, 1.8),
				width: 31 - index * 3.8 + range(rng, -1, 1),
				curl: range(rng, -2.8, 2.8),
				pointedness: 0,
				shape: 'rose',
				ruffle: 0
			},
			depth,
			scaleY: 0.9 + depth * 0.08,
			hueShift: range(rng, -4, 4)
		};
	});
}

function tulipLayers(rng: () => number): PetalLayer[] {
	return [0, 1].map((index) => ({
		petalCount: 3,
		radius: index === 0 ? 1.5 : 3,
		rotationOffset: range(rng, -5, 5) + index * 60,
		petal: {
			length: range(rng, 64, 72) - index * 4,
			width: range(rng, 24, 28) - index,
			curl: range(rng, -2.2, 2.2),
			pointedness: range(rng, 0.34, 0.52),
			shape: 'tepal',
			ruffle: 0
		},
		depth: index,
		scaleY: index === 0 ? 0.96 : 0.9,
		hueShift: range(rng, -2.5, 2.5)
	}));
}

function poppyLayers(rng: () => number): PetalLayer[] {
	// Papaver has four broad petals, arranged as two crossing pairs.
	return [0, 1].map((index) => ({
		petalCount: 2,
		radius: index === 0 ? 1 : 2.5,
		rotationOffset: range(rng, -5, 5) + index * 90,
		petal: {
			length: range(rng, 58, 66) - index * 2,
			width: range(rng, 38, 43) - index,
			curl: range(rng, -4, 4),
			pointedness: 0,
			shape: 'poppy',
			ruffle: intRange(rng, 5, 7)
		},
		depth: index,
		scaleY: range(rng, 0.94, 1.02),
		hueShift: range(rng, -3, 3)
	}));
}

function daisyLayers(rng: () => number): PetalLayer[] {
	return [
		{
			petalCount: intRange(rng, 28, 38),
			radius: range(rng, 17, 20),
			rotationOffset: range(rng, 0, 12),
			petal: {
				length: range(rng, 39, 47),
				width: range(rng, 5.2, 7),
				curl: range(rng, -1.5, 1.5),
				pointedness: 0.1,
				shape: 'ray',
				ruffle: 3
			},
			depth: 0,
			scaleY: 1,
			hueShift: range(rng, -2, 3)
		}
	];
}

function lilyLayers(rng: () => number): PetalLayer[] {
	return [0, 1].map((index) => ({
		petalCount: 3,
		radius: index === 0 ? 2 : 4,
		rotationOffset: range(rng, -8, 8) + index * 60,
		petal: {
			length: range(rng, 76, 88) - index * 3,
			width: range(rng, 21, 26) - index,
			curl: range(rng, -4, 4),
			pointedness: range(rng, 0.76, 0.96),
			shape: 'lance',
			ruffle: 0
		},
		depth: index,
		scaleY: index === 0 ? 0.94 : 1,
		hueShift: range(rng, -3, 4)
	}));
}

function carnationLayers(rng: () => number): PetalLayer[] {
	const counts = [9, 11, 13, 15, 12, 9].slice(0, intRange(rng, 4, 6));
	return counts.map((petalCount, index) => {
		const depth = index / (counts.length - 1);
		return {
			petalCount: petalCount + intRange(rng, 0, 2),
			radius: 1.5 + index * 1.25,
			rotationOffset: range(rng, 0, 360) + index * 17,
			petal: {
				length: 55 - index * 8.2 + range(rng, -2, 2),
				width: 24 - index * 2.4 + range(rng, -1.5, 1.5),
				curl: range(rng, -5, 5),
				pointedness: 0.25,
				shape: 'ruffled',
				ruffle: intRange(rng, 6, 10)
			},
			depth,
			scaleY: range(rng, 0.88, 1.02),
			hueShift: range(rng, -6, 6)
		};
	});
}

function freesiaLayers(rng: () => number): PetalLayer[] {
	return [
		{
			// Iridaceae flowers have two whorls of three petaloid tepals.
			petalCount: 6,
			radius: 2,
			rotationOffset: range(rng, 0, 50),
			petal: {
				length: range(rng, 18, 23),
				width: range(rng, 7, 9.5),
				curl: range(rng, -1.5, 1.5),
				pointedness: 0.25,
				shape: 'trumpet',
				ruffle: 0
			},
			depth: 0,
			scaleY: 1,
			hueShift: range(rng, -3, 3)
		}
	];
}

function sunflowerLayers(rng: () => number): PetalLayer[] {
	return [
		{
			// The apparent petals of an Asteraceae head are individual ray florets.
			petalCount: intRange(rng, 20, 34),
			radius: range(rng, 30, 35),
			rotationOffset: range(rng, 0, 12),
			petal: {
				length: range(rng, 45, 54),
				width: range(rng, 8.5, 11.5),
				curl: range(rng, -1.5, 1.5),
				pointedness: 0.34,
				shape: 'ray',
				ruffle: 3
			},
			depth: 0,
			scaleY: 1,
			hueShift: range(rng, -3, 3)
		}
	];
}

function daffodilLayers(rng: () => number): PetalLayer[] {
	// Narcissus has six petaloid tepals in two whorls of three behind its corona.
	return [0, 1].map((index) => ({
		petalCount: 3,
		radius: index === 0 ? 4 : 6,
		rotationOffset: range(rng, -3, 3) + index * 60,
		petal: {
			length: range(rng, 48, 55) - index * 2,
			width: range(rng, 18, 22) - index,
			curl: range(rng, -1.6, 1.6),
			pointedness: range(rng, 0.42, 0.58),
			shape: 'tepal',
			ruffle: 0
		},
		depth: index,
		scaleY: index === 0 ? 1 : 0.94,
		hueShift: range(rng, -2, 2)
	}));
}

function irisLayers(rng: () => number): PetalLayer[] {
	return [
		{
			// Three outer sepals form the spreading, bearded falls.
			petalCount: 3,
			radius: 4,
			rotationOffset: range(rng, -4, 4),
			petal: {
				length: range(rng, 59, 68),
				width: range(rng, 25, 30),
				curl: range(rng, -2.2, 2.2),
				pointedness: 0.08,
				shape: 'iris-fall',
				ruffle: 3
			},
			depth: 0,
			scaleY: 0.9,
			hueShift: range(rng, -3, 3)
		},
		{
			// Three inner petals rise as standards between the falls.
			petalCount: 3,
			radius: 2,
			rotationOffset: 60 + range(rng, -4, 4),
			petal: {
				length: range(rng, 42, 49),
				width: range(rng, 19, 23),
				curl: range(rng, -1.7, 1.7),
				pointedness: 0.3,
				shape: 'iris-standard',
				ruffle: 2
			},
			depth: 1,
			scaleY: 0.86,
			hueShift: range(rng, -4, 4)
		}
	];
}

function lavenderLayers(rng: () => number): PetalLayer[] {
	return [
		{
			// Each tiny mint-family corolla is fused, with two upper and three lower lobes.
			petalCount: 5,
			radius: 1,
			rotationOffset: 0,
			petal: {
				length: range(rng, 9, 12),
				width: range(rng, 3.5, 4.6),
				curl: range(rng, -0.8, 0.8),
				pointedness: 0.08,
				shape: 'rounded',
				ruffle: 0
			},
			depth: 0,
			scaleY: 1,
			hueShift: range(rng, -3, 3)
		}
	];
}

function cosmosLayers(rng: () => number): PetalLayer[] {
	return [
		{
			// The usual garden cosmos head carries eight broad ray florets around its disc.
			petalCount: 8,
			radius: range(rng, 15, 18),
			rotationOffset: range(rng, -5, 5),
			petal: {
				length: range(rng, 48, 57),
				width: range(rng, 18, 23),
				curl: range(rng, -2.2, 2.2),
				pointedness: 0.08,
				shape: 'ray',
				ruffle: 3
			},
			depth: 0,
			scaleY: range(rng, 0.95, 1.02),
			hueShift: range(rng, -3, 3)
		}
	];
}

function hibiscusLayers(rng: () => number): PetalLayer[] {
	return [
		{
			petalCount: 5,
			radius: range(rng, 3, 5),
			rotationOffset: range(rng, -7, 7),
			petal: {
				length: range(rng, 61, 70),
				width: range(rng, 31, 37),
				curl: range(rng, -3, 3),
				pointedness: 0,
				shape: 'hibiscus',
				ruffle: 7
			},
			depth: 0,
			scaleY: range(rng, 0.94, 1.02),
			hueShift: range(rng, -3, 3)
		}
	];
}

function columbineLayers(rng: () => number): PetalLayer[] {
	return [
		{
			// Five spreading, petal-like sepals form the outer star.
			petalCount: 5,
			radius: 3,
			rotationOffset: range(rng, -5, 5),
			petal: {
				length: range(rng, 45, 52),
				width: range(rng, 16, 20),
				curl: range(rng, -1.8, 1.8),
				pointedness: 0.72,
				shape: 'tepal',
				ruffle: 0
			},
			depth: 0,
			scaleY: 0.96,
			hueShift: range(rng, -3, 3)
		},
		{
			// Five shorter petal blades continue backward into hollow nectar spurs.
			petalCount: 5,
			radius: 5,
			rotationOffset: 36 + range(rng, -4, 4),
			petal: {
				length: range(rng, 25, 31),
				width: range(rng, 10, 13),
				curl: range(rng, -1, 1),
				pointedness: 0.12,
				shape: 'rounded',
				ruffle: 0
			},
			depth: 1,
			scaleY: 0.93,
			hueShift: range(rng, -6, 4)
		}
	];
}

function bluebellLayers(rng: () => number): PetalLayer[] {
	return [
		{
			petalCount: 6,
			radius: 1,
			rotationOffset: 0,
			petal: {
				length: range(rng, 15, 19),
				width: range(rng, 5, 6.5),
				curl: range(rng, -0.8, 0.8),
				pointedness: 0.38,
				shape: 'trumpet',
				ruffle: 0
			},
			depth: 0,
			scaleY: 1,
			hueShift: range(rng, -3, 3)
		}
	];
}

function freesiaNodes(rng: () => number, count: number): BloomNode[] {
	const topY = range(rng, -74, -67);
	const bottomY = range(rng, 45, 60);
	const reach = range(rng, 18, 29);

	return Array.from({ length: count }, (_, index) => {
		const progress = count === 1 ? 0 : index / (count - 1);
		return {
			x: 11 + progress * reach + range(rng, -1.8, 1.8),
			y: topY + progress * (bottomY - topY) + range(rng, -2.2, 2.2),
			scale: 0.78 + progress * 0.28 + range(rng, -0.035, 0.035),
			rotation: 42 - progress * 69 + range(rng, -6, 6),
			openness: Math.min(1, 0.6 + progress * 0.4 + range(rng, -0.025, 0.025))
		};
	});
}

function lavenderNodes(rng: () => number, count: number): BloomNode[] {
	const spikeLength = range(rng, 52, 59);
	return Array.from({ length: count }, (_, index) => {
		const progress = count === 1 ? 0 : index / (count - 1);
		return {
			x: range(rng, -1.2, 1.2),
			y: -7 - progress * spikeLength,
			scale: 1 - progress * 0.13 + range(rng, -0.025, 0.025),
			rotation: index % 2 === 0 ? range(rng, -3, 3) : 180 + range(rng, -3, 3),
			openness: Math.min(1, 0.72 + progress * 0.28)
		};
	});
}

function bluebellNodes(rng: () => number, count: number): BloomNode[] {
	const racemeLength = range(rng, 59, 68);
	return Array.from({ length: count }, (_, index) => {
		const progress = count === 1 ? 0 : index / (count - 1);
		return {
			// Native English bluebells carry their nodding flowers on one side.
			x: 10 + progress * range(rng, 4, 9) + range(rng, -1, 1),
			y: -3 - progress * racemeLength,
			scale: 1.02 - progress * 0.27 + range(rng, -0.025, 0.025),
			rotation: range(rng, -7, 7),
			openness: Math.min(1, 0.68 + (1 - progress) * 0.32)
		};
	});
}

function pollenMotes(rng: () => number, count: number): PollenMote[] {
	return Array.from({ length: count }, () => ({
		x: range(rng, -90, 90),
		y: range(rng, -85, 45),
		radius: range(rng, 0.7, 1.8),
		delay: range(rng, -8, 0),
		duration: range(rng, 5, 10),
		drift: range(rng, -14, 14)
	}));
}

/** Pure and deterministic: the same seed always produces the same complete plant. */
export function generateFlower(seed: Seed): FlowerParams {
	const normalizedSeed = seed >>> 0;
	const rng = mulberry32(normalizedSeed);
	const kind = pick(rng, FLOWER_KINDS);
	const palette = generatePalette(rng, kind);

	const layers =
		kind === 'rose'
			? roseLayers(rng)
			: kind === 'lily'
				? lilyLayers(rng)
				: kind === 'carnation'
					? carnationLayers(rng)
					: kind === 'freesia'
						? freesiaLayers(rng)
						: kind === 'tulip'
							? tulipLayers(rng)
							: kind === 'poppy'
								? poppyLayers(rng)
								: kind === 'daisy'
									? daisyLayers(rng)
									: kind === 'sunflower'
										? sunflowerLayers(rng)
										: kind === 'daffodil'
											? daffodilLayers(rng)
											: kind === 'iris'
												? irisLayers(rng)
												: kind === 'lavender'
													? lavenderLayers(rng)
													: kind === 'cosmos'
														? cosmosLayers(rng)
														: kind === 'hibiscus'
															? hibiscusLayers(rng)
															: kind === 'columbine'
																? columbineLayers(rng)
																: bluebellLayers(rng);

	const leafCount =
		kind === 'rose'
			? intRange(rng, 2, 3)
			: kind === 'lily'
				? intRange(rng, 5, 8)
				: kind === 'tulip'
					? intRange(rng, 2, 4)
					: kind === 'daisy'
						? intRange(rng, 5, 8)
						: kind === 'carnation'
							? intRange(rng, 2, 4) * 2
							: kind === 'sunflower'
								? intRange(rng, 4, 7)
								: kind === 'daffodil'
									? intRange(rng, 4, 6)
									: kind === 'iris'
										? intRange(rng, 5, 8)
										: kind === 'lavender'
											? intRange(rng, 3, 4) * 2
											: kind === 'cosmos'
												? intRange(rng, 2, 3) * 2
												: kind === 'hibiscus'
													? intRange(rng, 4, 6)
													: kind === 'columbine'
														? intRange(rng, 4, 6)
														: kind === 'bluebell'
															? intRange(rng, 3, 6)
															: intRange(rng, 2, 7);
	const stemLength =
		kind === 'freesia'
			? range(rng, 178, 194)
			: kind === 'daisy'
				? range(rng, 158, 175)
				: kind === 'poppy'
					? range(rng, 172, 194)
					: kind === 'sunflower'
						? range(rng, 178, 195)
						: kind === 'daffodil'
							? range(rng, 160, 179)
							: kind === 'iris'
								? range(rng, 164, 184)
								: kind === 'lavender'
									? range(rng, 176, 194)
									: kind === 'cosmos'
										? range(rng, 180, 196)
										: kind === 'hibiscus'
											? range(rng, 168, 185)
											: kind === 'columbine'
												? range(rng, 165, 184)
												: kind === 'bluebell'
													? range(rng, 172, 190)
													: range(rng, 165, 187);
	const budCount =
		kind === 'freesia' ? intRange(rng, 1, 5) : kind === 'bluebell' ? intRange(rng, 1, 3) : 0;
	const bloomCount = kind === 'freesia' ? intRange(rng, 3, 8) : 0;
	const lavenderWhorlCount = kind === 'lavender' ? intRange(rng, 6, 8) : 0;
	const bluebellBloomCount = kind === 'bluebell' ? intRange(rng, 7, 11) : 0;

	return {
		seed: normalizedSeed,
		kind,
		displayNameIndex: intRange(rng, 0, NAME_VARIANT_COUNTS[kind] - 1),
		botanicalName: BOTANICAL_NAMES[kind],
		layers,
		palette,
		centerRadius:
			kind === 'sunflower'
				? range(rng, 32, 38)
				: kind === 'daisy'
					? range(rng, 20, 25)
					: kind === 'daffodil'
						? range(rng, 18, 22)
						: kind === 'poppy'
							? range(rng, 9, 12)
							: kind === 'cosmos'
								? range(rng, 16, 20)
								: kind === 'lily'
									? range(rng, 5, 7.5)
									: range(rng, 6, 10),
		hasStem: true,
		leafCount,
		stem: {
			length: stemLength,
			curve:
				kind === 'sunflower' ||
				kind === 'daffodil' ||
				kind === 'iris' ||
				kind === 'lavender' ||
				kind === 'cosmos' ||
				kind === 'bluebell'
					? range(rng, -6, 6)
					: range(rng, -13, 13),
			width:
				kind === 'freesia' || kind === 'daisy'
					? range(rng, 2.2, 3.1)
					: kind === 'daffodil' || kind === 'iris'
						? range(rng, 2.8, 3.7)
						: kind === 'sunflower'
							? range(rng, 5, 6.2)
							: kind === 'cosmos' || kind === 'bluebell'
								? range(rng, 2.4, 3.2)
								: kind === 'columbine'
									? range(rng, 2.7, 3.5)
									: kind === 'hibiscus'
										? range(rng, 4.2, 5.2)
										: kind === 'poppy'
											? range(rng, 2.6, 3.5)
											: range(rng, 3.2, 4.4),
			leafLength:
				kind === 'freesia'
					? range(rng, 66, 82)
					: kind === 'daffodil'
						? range(rng, 79, 98)
						: kind === 'iris'
							? range(rng, 86, 108)
							: kind === 'tulip'
								? range(rng, 74, 94)
								: kind === 'sunflower'
									? range(rng, 48, 62)
									: kind === 'lavender'
										? range(rng, 28, 38)
										: kind === 'cosmos'
											? range(rng, 46, 58)
											: kind === 'hibiscus'
												? range(rng, 50, 64)
												: kind === 'columbine'
													? range(rng, 42, 52)
													: kind === 'bluebell'
														? range(rng, 84, 106)
														: kind === 'daisy'
															? range(rng, 30, 42)
															: range(rng, 38, 56)
		},
		details: {
			spotCount: kind === 'lily' ? intRange(rng, 24, 42) : 0,
			stamenCount:
				kind === 'lily'
					? 6
					: kind === 'tulip'
						? 6
						: kind === 'daffodil'
							? 6
							: kind === 'iris'
								? 3
								: kind === 'lavender'
									? 4
									: kind === 'hibiscus'
										? intRange(rng, 26, 34)
										: kind === 'columbine'
											? intRange(rng, 24, 32)
											: kind === 'bluebell'
												? 6
												: kind === 'poppy'
													? intRange(rng, 24, 36)
													: kind === 'rose'
														? intRange(rng, 8, 12)
														: 0,
			discFloretCount:
				kind === 'sunflower'
					? intRange(rng, 120, 164)
					: kind === 'daisy'
						? intRange(rng, 55, 78)
						: kind === 'cosmos'
							? intRange(rng, 48, 68)
							: 0,
			veinOpacity: range(rng, 0.18, 0.36),
			budCount
		},
		bloomNodes:
			kind === 'freesia'
				? freesiaNodes(rng, bloomCount)
				: kind === 'lavender'
					? lavenderNodes(rng, lavenderWhorlCount)
					: kind === 'bluebell'
						? bluebellNodes(rng, bluebellBloomCount)
						: [],
		motes: pollenMotes(rng, intRange(rng, 7, 11)),
		swayDurationSeconds: range(rng, 5.6, 8.4)
	};
}
