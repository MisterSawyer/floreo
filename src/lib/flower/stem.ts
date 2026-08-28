import type { FlowerParams } from './types';
import { mulberry32 } from './prng';

export interface StemPoint {
	x: number;
	y: number;
}

export interface StandardLeafPlacement extends StemPoint {
	side: 1 | -1;
	scale: number;
	angle: number;
	stemProgress: number;
}

export interface CosmosLeafSegment {
	progress: number;
	side: 1 | -1;
	controlReach: number;
	reach: number;
	rise: number;
}

export interface CosmosLeafStructure {
	controlDrift: number;
	tipDrift: number;
	segments: CosmosLeafSegment[];
}

/** SVG paints later siblings on top, so render upper leaves first and lower leaves last. */
export function leafRenderOrder(leafCount: number): number[] {
	return Array.from({ length: leafCount }, (_, offset) => leafCount - offset - 1);
}

export interface LeafRenderLayers {
	behindStem: number[];
	inFrontOfStem: number[];
}

/**
 * Picks a seeded stem depth within the leaf stack. Keeping each side contiguous preserves the
 * rule that lower leaves paint above upper leaves while giving every plant a varied crossing.
 */
export function leafRenderLayers(seed: number, leafCount: number): LeafRenderLayers {
	const order = leafRenderOrder(leafCount);
	if (leafCount === 0) return { behindStem: [], inFrontOfStem: [] };

	const rng = mulberry32(seed ^ 0x4c454146);
	if (leafCount === 1) {
		return rng() < 0.5
			? { behindStem: order, inFrontOfStem: [] }
			: { behindStem: [], inFrontOfStem: order };
	}

	const stemDepth = 1 + Math.floor(rng() * (leafCount - 1));
	return {
		behindStem: order.slice(0, stemDepth),
		inFrontOfStem: order.slice(stemDepth)
	};
}

/** Cubic stem path ordered from the soil to the bloom so SVG drawing grows bottom-to-top. */
export function stemPath(flower: FlowerParams): string {
	const { length, curve } = flower.stem;
	return `M ${curve} ${length} C ${curve * 1.15} ${length * 0.67}, ${-curve * 0.5} ${length * 0.3}, 0 8`;
}

/** A point on the same cubic path, where t=0 is the soil and t=1 is the bloom. */
export function stemPointAt(flower: FlowerParams, t: number): StemPoint {
	const clampedT = Math.max(0, Math.min(1, t));
	const inverse = 1 - clampedT;
	const { length, curve } = flower.stem;

	return {
		x:
			inverse ** 3 * curve +
			3 * inverse ** 2 * clampedT * (curve * 1.15) +
			3 * inverse * clampedT ** 2 * (-curve * 0.5),
		y:
			inverse ** 3 * length +
			3 * inverse ** 2 * clampedT * (length * 0.67) +
			3 * inverse * clampedT ** 2 * (length * 0.3) +
			clampedT ** 3 * 8
	};
}

function distance(a: StemPoint, b: StemPoint): number {
	return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Arc-length progress matches the normalized SVG dash used by the stalk animation. */
export function stemProgressAt(flower: FlowerParams, t: number): number {
	const clampedT = Math.max(0, Math.min(1, t));
	const steps = 80;
	let totalLength = 0;
	let reachedLength = 0;
	let previous = stemPointAt(flower, 0);

	for (let index = 1; index <= steps; index++) {
		const segmentStart = (index - 1) / steps;
		const segmentEnd = index / steps;
		const current = stemPointAt(flower, segmentEnd);
		const segmentLength = distance(previous, current);
		totalLength += segmentLength;

		if (clampedT >= segmentEnd) {
			reachedLength += segmentLength;
		} else if (clampedT > segmentStart) {
			reachedLength += distance(previous, stemPointAt(flower, clampedT));
		}

		previous = current;
	}

	return totalLength === 0 ? 0 : reachedLength / totalLength;
}

/** Seeded irregularity keeps each finely divided Cosmos leaf distinct without changing on rerender. */
export function cosmosLeafStructure(
	seed: number,
	index: number,
	leafLength: number
): CosmosLeafStructure {
	const rng = mulberry32(seed ^ Math.imul(index + 1, 0x9e3779b1) ^ 0x434f534d);
	const segmentCount = 6 + Math.floor(rng() * 6);
	let segmentSide: 1 | -1 = rng() < 0.5 ? -1 : 1;

	const segments = Array.from({ length: segmentCount }, (_, segmentIndex) => {
		if (segmentIndex > 0 && rng() < 0.78) segmentSide = segmentSide === 1 ? -1 : 1;

		const evenProgress = segmentIndex / Math.max(1, segmentCount - 1);
		const progress = 0.2 + evenProgress * 0.66 + (rng() - 0.5) * 0.035;
		const taper = 1 - Math.max(0, progress - 0.58) * 0.75;
		const reach = leafLength * (0.24 + rng() * 0.1) * taper;

		return {
			progress,
			side: segmentSide,
			controlReach: reach * (0.5 + rng() * 0.12),
			reach,
			rise: leafLength * (0.115 + rng() * 0.065)
		};
	});

	return {
		controlDrift: leafLength * (0.035 + rng() * 0.04),
		tipDrift: leafLength * (0.085 + rng() * 0.055),
		segments
	};
}

export function standardLeafPlacement(flower: FlowerParams, index: number): StandardLeafPlacement {
	const cosmosRng = mulberry32(flower.seed ^ Math.imul(index + 1, 0x51f15e5d) ^ 0x434f534d);
	let side: 1 | -1 = index % 2 === 0 ? 1 : -1;
	let t: number;

	if (flower.kind === 'daisy') {
		// Bellis grows a leafless flower stalk from a compact basal rosette.
		t = 0.025 + (index / Math.max(1, flower.leafCount - 1)) * 0.075;
	} else if (flower.kind === 'carnation') {
		// Dianthus leaves are opposite and decussate, so pairs share a node.
		const pairIndex = Math.floor(index / 2);
		const pairCount = Math.ceil(flower.leafCount / 2);
		t = 0.14 + (pairIndex / Math.max(1, pairCount - 1)) * 0.53;
	} else if (flower.kind === 'tulip') {
		t = 0.08 + (index / Math.max(1, flower.leafCount - 1)) * 0.34;
	} else if (flower.kind === 'poppy') {
		t = 0.12 + (index / Math.max(1, flower.leafCount - 1)) * 0.48;
	} else if (flower.kind === 'daffodil' || flower.kind === 'iris' || flower.kind === 'bluebell') {
		// Both genera carry foliage in a basal fan; their flowering scapes are leafless.
		t = 0.018 + (index / Math.max(1, flower.leafCount - 1)) * 0.055;
	} else if (flower.kind === 'columbine') {
		// Most Aquilegia foliage forms a low mound beneath the flowering stems.
		t = 0.035 + (index / Math.max(1, flower.leafCount - 1)) * 0.18;
	} else if (flower.kind === 'lavender') {
		// Lamiaceae leaves are opposite; both members of a pair share one node.
		const pairIndex = Math.floor(index / 2);
		const pairCount = Math.ceil(flower.leafCount / 2);
		t = 0.12 + (pairIndex / Math.max(1, pairCount - 1)) * 0.48;
	} else if (flower.kind === 'cosmos') {
		// Break up exact opposite pairs while keeping the leaves distributed along the lower stem.
		side = cosmosRng() < 0.5 ? -1 : 1;
		const slotProgress = (index + 0.5) / Math.max(1, flower.leafCount);
		t = 0.1 + slotProgress * 0.54 + (cosmosRng() - 0.5) * 0.05;
	} else if (flower.kind === 'sunflower') {
		t = 0.12 + (index / Math.max(1, flower.leafCount - 1)) * 0.54;
	} else {
		t = (index + 1.2) / (flower.leafCount + 1.8);
	}

	const point = stemPointAt(flower, t);
	const angle =
		flower.kind === 'daisy'
			? side * (48 + index * 4)
			: flower.kind === 'rose'
				? side * (34 + index * 4)
				: flower.kind === 'iris'
					? side * (5 + index * 4)
					: flower.kind === 'daffodil'
						? side * (3 + index * 2)
						: flower.kind === 'lavender'
							? side * 28
							: flower.kind === 'cosmos'
								? side * (20 + cosmosRng() * 14)
								: flower.kind === 'columbine'
									? side * (34 + index * 3)
									: flower.kind === 'bluebell'
										? side * (3 + index * 2)
										: flower.kind === 'hibiscus'
											? side * (30 + index * 3)
											: flower.kind === 'sunflower'
												? side * (28 + index * 3)
												: flower.kind === 'tulip'
													? side * (5 + index * 2)
													: flower.kind === 'carnation'
														? side * 14
														: side * (8 + index * 2.5);
	const scale =
		flower.kind === 'daisy'
			? 0.76 + (index % 3) * 0.07
			: flower.kind === 'tulip'
				? 1 - index * 0.12
				: flower.kind === 'iris'
					? 0.82 + (index % 3) * 0.09
					: flower.kind === 'daffodil'
						? 0.86 + (index % 2) * 0.08
						: flower.kind === 'bluebell'
							? 0.86 + (index % 2) * 0.07
						: flower.kind === 'columbine'
							? 0.78 + (index % 3) * 0.08
							: flower.kind === 'cosmos'
								? (1 - t * 0.24) * (0.84 + cosmosRng() * 0.22)
								: 1 - t * 0.24;

	return {
		...point,
		side,
		scale,
		angle,
		stemProgress: stemProgressAt(flower, t)
	};
}
