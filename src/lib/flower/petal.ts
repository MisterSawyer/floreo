import type { PetalParams } from './types';

function n(value: number): string {
	return value.toFixed(2);
}

function ruffledPetalPath(params: PetalParams): string {
	const { length, width, curl, ruffle } = params;
	const steps = Math.max(14, ruffle * 2);
	const edge: string[] = [];

	for (let step = 0; step <= steps; step++) {
		const t = step / steps;
		const normalizedX = 1 - t * 2;
		const x = curl * 0.55 + normalizedX * width;
		const crown = 1 - Math.pow(Math.abs(normalizedX), 1.7);
		const scallop = Math.sin(t * Math.PI * ruffle) * length * 0.045;
		const y = -length * (0.76 + crown * 0.23) + scallop;
		edge.push(`${n(x)} ${n(y)}`);
	}

	return [
		'M 0 0',
		`C ${n(width * 0.35 + curl)} ${n(-length * 0.18)}, ${n(width * 0.98 + curl * 0.7)} ${n(-length * 0.54)}, ${edge[0]}`,
		`L ${edge.slice(1).join(' L ')}`,
		`C ${n(-width * 0.98 + curl * 0.7)} ${n(-length * 0.54)}, ${n(-width * 0.35 + curl)} ${n(-length * 0.18)}, 0 0 Z`
	].join(' ');
}

function rosePetalPath(params: PetalParams): string {
	const { length, width, curl } = params;
	const lip = -length * 0.94;
	const tipX = curl * 0.45;

	// Rose petals are broad and obovate. The shallow, irregular apical notch is
	// deliberately subtler than a heart shape, and reads as a softly reflexed rim.
	return [
		'M 0 0',
		`C ${n(width * 0.48 + curl)} ${n(-length * 0.16)}, ${n(width * 1.02 + curl * 0.75)} ${n(-length * 0.5)}, ${n(width * 0.88 + curl * 0.55)} ${n(-length * 0.75)}`,
		`C ${n(width * 0.78 + curl * 0.5)} ${n(-length * 0.91)}, ${n(width * 0.35 + curl * 0.42)} ${n(-length)}, ${n(width * 0.1 + tipX)} ${n(lip)}`,
		`Q ${n(tipX)} ${n(-length * 0.9)} ${n(-width * 0.1 + tipX)} ${n(lip)}`,
		`C ${n(-width * 0.35 + curl * 0.42)} ${n(-length)}, ${n(-width * 0.78 + curl * 0.5)} ${n(-length * 0.91)}, ${n(-width * 0.88 + curl * 0.55)} ${n(-length * 0.75)}`,
		`C ${n(-width * 1.02 + curl * 0.75)} ${n(-length * 0.5)}, ${n(-width * 0.48 + curl)} ${n(-length * 0.16)}, 0 0 Z`
	].join(' ');
}

function tepalPath(params: PetalParams): string {
	const { length, width, curl } = params;
	return [
		'M 0 0',
		`C ${n(width * 0.58 + curl)} ${n(-length * 0.18)}, ${n(width + curl * 0.7)} ${n(-length * 0.55)}, ${n(width * 0.56 + curl * 0.5)} ${n(-length * 0.82)}`,
		`Q ${n(width * 0.24 + curl * 0.46)} ${n(-length * 0.95)} ${n(curl * 0.42)} ${n(-length)}`,
		`Q ${n(-width * 0.24 + curl * 0.46)} ${n(-length * 0.95)} ${n(-width * 0.56 + curl * 0.5)} ${n(-length * 0.82)}`,
		`C ${n(-width + curl * 0.7)} ${n(-length * 0.55)}, ${n(-width * 0.58 + curl)} ${n(-length * 0.18)}, 0 0 Z`
	].join(' ');
}

function poppyPetalPath(params: PetalParams): string {
	const { length, width, curl, ruffle } = params;
	const edge: string[] = [];
	const steps = Math.max(12, ruffle * 2);

	for (let step = 0; step <= steps; step++) {
		const t = step / steps;
		const x = width * (1 - t * 2) + curl * 0.5;
		const y = -length * (0.88 + 0.06 * Math.cos((t - 0.5) * Math.PI));
		const crumple = Math.sin(t * Math.PI * ruffle + 0.7) * length * 0.025;
		edge.push(`${n(x)} ${n(y + crumple)}`);
	}

	return [
		'M 0 0',
		`C ${n(width * 0.28 + curl)} ${n(-length * 0.16)}, ${n(width * 0.92 + curl * 0.7)} ${n(-length * 0.46)}, ${edge[0]}`,
		`L ${edge.slice(1).join(' L ')}`,
		`C ${n(-width * 0.92 + curl * 0.7)} ${n(-length * 0.46)}, ${n(-width * 0.28 + curl)} ${n(-length * 0.16)}, 0 0 Z`
	].join(' ');
}

function rayFloretPath(params: PetalParams): string {
	const { length, width, curl } = params;
	const x = curl * 0.35;
	return [
		'M 0 0',
		`C ${n(width * 0.55 + curl)} ${n(-length * 0.16)}, ${n(width + curl * 0.6)} ${n(-length * 0.58)}, ${n(width * 0.82 + x)} ${n(-length * 0.9)}`,
		`L ${n(width * 0.38 + x)} ${n(-length * 0.96)}`,
		`L ${n(width * 0.18 + x)} ${n(-length)}`,
		`L ${n(x)} ${n(-length * 0.96)}`,
		`L ${n(-width * 0.18 + x)} ${n(-length)}`,
		`L ${n(-width * 0.38 + x)} ${n(-length * 0.96)}`,
		`L ${n(-width * 0.82 + x)} ${n(-length * 0.9)}`,
		`C ${n(-width + curl * 0.6)} ${n(-length * 0.58)}, ${n(-width * 0.55 + curl)} ${n(-length * 0.16)}, 0 0 Z`
	].join(' ');
}

function irisFallPath(params: PetalParams): string {
	const { length, width, curl } = params;
	// A narrow haft opens abruptly into the broad, reflexed blade of an iris fall.
	return [
		'M 0 0',
		`C ${n(width * 0.18 + curl)} ${n(-length * 0.16)}, ${n(width * 0.28 + curl * 0.8)} ${n(-length * 0.34)}, ${n(width * 0.7 + curl * 0.65)} ${n(-length * 0.47)}`,
		`C ${n(width * 1.08 + curl * 0.55)} ${n(-length * 0.61)}, ${n(width * 0.92 + curl * 0.45)} ${n(-length * 0.9)}, ${n(curl * 0.35)} ${n(-length)}`,
		`C ${n(-width * 0.92 + curl * 0.45)} ${n(-length * 0.9)}, ${n(-width * 1.08 + curl * 0.55)} ${n(-length * 0.61)}, ${n(-width * 0.7 + curl * 0.65)} ${n(-length * 0.47)}`,
		`C ${n(-width * 0.28 + curl * 0.8)} ${n(-length * 0.34)}, ${n(-width * 0.18 + curl)} ${n(-length * 0.16)}, 0 0 Z`
	].join(' ');
}

function irisStandardPath(params: PetalParams): string {
	const { length, width, curl } = params;
	return [
		'M 0 0',
		`C ${n(width * 0.42 + curl)} ${n(-length * 0.18)}, ${n(width * 0.92 + curl * 0.65)} ${n(-length * 0.54)}, ${n(width * 0.52 + curl * 0.42)} ${n(-length * 0.86)}`,
		`Q ${n(width * 0.18 + curl * 0.35)} ${n(-length * 1.02)} ${n(curl * 0.3)} ${n(-length)}`,
		`Q ${n(-width * 0.18 + curl * 0.35)} ${n(-length * 1.02)} ${n(-width * 0.52 + curl * 0.42)} ${n(-length * 0.86)}`,
		`C ${n(-width * 0.92 + curl * 0.65)} ${n(-length * 0.54)}, ${n(-width * 0.42 + curl)} ${n(-length * 0.18)}, 0 0 Z`
	].join(' ');
}

function hibiscusPetalPath(params: PetalParams): string {
	const { length, width, curl } = params;
	const edge: string[] = [];
	const steps = 18;
	for (let step = 0; step <= steps; step++) {
		const t = step / steps;
		const normalizedX = 1 - t * 2;
		const x = normalizedX * width + curl * 0.5;
		const shoulder = 1 - Math.pow(Math.abs(normalizedX), 2.1);
		const ripple = Math.sin(t * Math.PI * 7 + 0.45) * length * 0.018;
		edge.push(`${n(x)} ${n(-length * (0.86 + shoulder * 0.12) + ripple)}`);
	}

	// Hibiscus petals are broad, overlapping and delicately crinkled at the distal rim.
	return [
		'M 0 0',
		`C ${n(width * 0.38 + curl)} ${n(-length * 0.14)}, ${n(width * 0.92 + curl * 0.75)} ${n(-length * 0.5)}, ${edge[0]}`,
		`L ${edge.slice(1).join(' L ')}`,
		`C ${n(-width * 0.92 + curl * 0.75)} ${n(-length * 0.5)}, ${n(-width * 0.38 + curl)} ${n(-length * 0.14)}, 0 0 Z`
	].join(' ');
}

/** SVG path for a petal rooted at 0,0 and opening toward negative y. */
export function petalPath(params: PetalParams): string {
	const { length, width, curl, pointedness, shape } = params;
	if (shape === 'ruffled') return ruffledPetalPath(params);
	if (shape === 'rose') return rosePetalPath(params);
	if (shape === 'tepal') return tepalPath(params);
	if (shape === 'poppy') return poppyPetalPath(params);
	if (shape === 'ray') return rayFloretPath(params);
	if (shape === 'iris-fall') return irisFallPath(params);
	if (shape === 'iris-standard') return irisStandardPath(params);
	if (shape === 'hibiscus') return hibiscusPetalPath(params);

	const tipY = -length;
	const tipX = curl * 0.45;

	if (shape === 'heart') {
		return [
			'M 0 0',
			`C ${n(width * 0.86 + curl)} ${n(-length * 0.22)}, ${n(width * 1.06 + curl * 0.6)} ${n(-length * 0.7)}, ${n(width * 0.43 + curl * 0.45)} ${n(-length * 0.94)}`,
			`C ${n(width * 0.22 + curl * 0.4)} ${n(-length * 1.02)}, ${n(width * 0.08 + curl * 0.4)} ${n(-length * 0.88)}, ${n(tipX)} ${n(-length * 0.9)}`,
			`C ${n(-width * 0.08 + curl * 0.4)} ${n(-length * 0.88)}, ${n(-width * 0.22 + curl * 0.4)} ${n(-length * 1.02)}, ${n(-width * 0.43 + curl * 0.45)} ${n(-length * 0.94)}`,
			`C ${n(-width * 1.06 + curl * 0.6)} ${n(-length * 0.7)}, ${n(-width * 0.86 + curl)} ${n(-length * 0.22)}, 0 0 Z`
		].join(' ');
	}

	const lanceFactor = shape === 'lance' ? 0.5 : 1;
	const bulgeY = -length * (shape === 'trumpet' ? 0.28 : 0.42);
	const shoulder = width * lanceFactor;
	const tipWidth = width * (1 - pointedness * 0.72);

	return [
		'M 0 0',
		`C ${n(shoulder + curl)} ${n(bulgeY)}, ${n(tipWidth + curl * 0.55)} ${n(tipY * 0.88)}, ${n(tipX)} ${n(tipY)}`,
		`C ${n(-tipWidth + curl * 0.55)} ${n(tipY * 0.88)}, ${n(-shoulder + curl)} ${n(bulgeY)}, 0 0 Z`
	].join(' ');
}

/** A center crease that follows the same sideways curl as the petal. */
export function petalVeinPath(params: PetalParams, reach = 0.82): string {
	return `M 0 -1 C ${n(params.curl * 0.08)} ${n(-params.length * 0.28)}, ${n(params.curl * 0.34)} ${n(-params.length * 0.57)}, ${n(params.curl * 0.42)} ${n(-params.length * reach)}`;
}

export function leafPath(length: number, width: number, side: 1 | -1): string {
	return [
		'M 0 0',
		`C ${n(side * width * 0.36)} ${n(-length * 0.2)}, ${n(side * width)} ${n(-length * 0.72)}, ${n(side * width * 0.18)} ${n(-length)}`,
		`C ${n(side * -width * 0.12)} ${n(-length * 0.7)}, ${n(side * -width * 0.08)} ${n(-length * 0.2)}, 0 0 Z`
	].join(' ');
}

function patternedLeafPath(
	length: number,
	width: number,
	side: 1 | -1,
	segments: number,
	profile: (t: number) => number
): string {
	const edge = (edgeSide: 1 | -1) => {
		const points: string[] = [];
		for (let index = 0; index <= segments; index++) {
			const t = index / segments;
			const centre = side * length * 0.16 * t ** 1.35;
			const halfWidth = width * profile(t);
			points.push(`${n(centre + edgeSide * halfWidth)} ${n(-length * t)}`);
		}
		return points;
	};

	const right = patternedWithoutRoot(edge(1));
	const left = edge(-1).reverse();
	return `M 0 0 L ${right.join(' L ')} L ${left.join(' L ')} Z`;
}

function patternedWithoutRoot(points: string[]): string[] {
	return points.slice(1);
}

/** Serrated ovate leaflet, used for each leaflet of the rose's compound leaf. */
export function serratedLeafPath(length: number, width: number, side: 1 | -1): string {
	return patternedLeafPath(length, width, side, 18, (t) => {
		const envelope = Math.pow(Math.sin(Math.PI * t), 0.72);
		const tooth = 1 + (Math.floor(t * 18) % 2 === 0 ? 0.13 : -0.04);
		return envelope * tooth;
	});
}

/** Deep pinnatifid lobes characteristic of a corn poppy leaf. */
export function lobedLeafPath(length: number, width: number, side: 1 | -1): string {
	return patternedLeafPath(length, width, side, 20, (t) => {
		const envelope = Math.pow(Math.sin(Math.PI * t), 0.78);
		const lobe = Math.sin(t * Math.PI * 10) > 0 ? 1 : 0.38;
		return envelope * (0.46 + lobe * 0.54);
	});
}

/** Broad, waxy, parallel-veined leaf that partially clasps a tulip stem. */
export function tulipLeafPath(length: number, width: number, side: 1 | -1): string {
	return [
		'M 0 4',
		`C ${n(side * width * 0.18)} ${n(-length * 0.12)}, ${n(side * width)} ${n(-length * 0.57)}, ${n(side * width * 0.3)} ${n(-length)}`,
		`Q ${n(side * width * 0.12)} ${n(-length * 1.05)} ${n(side * width * 0.03)} ${n(-length * 0.9)}`,
		`C ${n(side * -width * 0.13)} ${n(-length * 0.6)}, ${n(side * -width * 0.12)} ${n(-length * 0.12)}, 0 4 Z`
	].join(' ');
}

/** Spoon-shaped, softly crenate blade from the daisy's basal rosette. */
export function spatulateLeafPath(length: number, width: number, side: 1 | -1): string {
	return patternedLeafPath(length, width, side, 18, (t) => {
		const blade = Math.sin(Math.PI * t) * (0.25 + t * 0.9);
		const scallop = 1 + 0.08 * Math.sin(t * Math.PI * 12);
		return Math.max(0, blade * scallop);
	});
}

/** Coarsely serrate, heart-based blade of a common sunflower. */
export function cordateLeafPath(length: number, width: number, side: 1 | -1): string {
	const edge = (edgeSide: 1 | -1) => {
		const points: string[] = [];
		for (let index = 1; index <= 20; index++) {
			const t = index / 20;
			const centre = side * length * 0.11 * t ** 1.45;
			const envelope = Math.sin(Math.PI * Math.pow(t, 0.72));
			const tooth = index % 2 === 0 ? 1.08 : 0.94;
			const halfWidth = width * envelope * tooth;
			points.push(`${n(centre + edgeSide * halfWidth)} ${n(-length * t)}`);
		}
		return points;
	};

	const right = edge(1);
	const left = edge(-1).reverse();
	return [
		'M 0 0',
		`Q ${n(width * 0.34)} ${n(length * 0.08)} ${right[0]}`,
		`L ${right.slice(1).join(' L ')}`,
		`L ${left.join(' L ')}`,
		`Q ${n(-width * 0.34)} ${n(length * 0.08)} 0 0 Z`
	].join(' ');
}

/** Flat, sharply pointed blade in the two-ranked basal fan of an iris. */
export function swordLeafPath(length: number, width: number, side: 1 | -1): string {
	return [
		'M 0 3',
		`C ${n(side * width * 0.24)} ${n(-length * 0.2)}, ${n(side * width * 0.55)} ${n(-length * 0.7)}, ${n(side * width * 0.08)} ${n(-length)}`,
		`C ${n(side * -width * 0.28)} ${n(-length * 0.68)}, ${n(side * -width * 0.17)} ${n(-length * 0.18)}, 0 3 Z`
	].join(' ');
}

/** Narrow, glaucous basal strap leaf of Narcissus. */
export function strapLeafPath(length: number, width: number, side: 1 | -1): string {
	return [
		'M 0 3',
		`C ${n(side * width * 0.16)} ${n(-length * 0.24)}, ${n(side * width * 0.48)} ${n(-length * 0.75)}, ${n(side * width * 0.1)} ${n(-length * 0.98)}`,
		`Q 0 ${n(-length * 1.03)} ${n(side * -width * 0.08)} ${n(-length * 0.96)}`,
		`C ${n(side * -width * 0.24)} ${n(-length * 0.68)}, ${n(side * -width * 0.14)} ${n(-length * 0.2)}, 0 3 Z`
	].join(' ');
}

/** Rounded, three-lobed leaflet used in the biternate foliage of columbine. */
export function columbineLeafletPath(length: number, width: number): string {
	return [
		'M 0 0',
		`C ${n(width * 0.34)} ${n(-length * 0.14)}, ${n(width * 0.92)} ${n(-length * 0.28)}, ${n(width * 0.78)} ${n(-length * 0.55)}`,
		`C ${n(width * 0.72)} ${n(-length * 0.75)}, ${n(width * 0.36)} ${n(-length * 0.72)}, ${n(width * 0.22)} ${n(-length * 0.66)}`,
		`C ${n(width * 0.38)} ${n(-length * 0.86)}, ${n(width * 0.18)} ${n(-length)} 0 ${n(-length * 0.82)}`,
		`C ${n(-width * 0.18)} ${n(-length)}, ${n(-width * 0.38)} ${n(-length * 0.86)}, ${n(-width * 0.22)} ${n(-length * 0.66)}`,
		`C ${n(-width * 0.36)} ${n(-length * 0.72)}, ${n(-width * 0.72)} ${n(-length * 0.75)}, ${n(-width * 0.78)} ${n(-length * 0.55)}`,
		`C ${n(-width * 0.92)} ${n(-length * 0.28)}, ${n(-width * 0.34)} ${n(-length * 0.14)}, 0 0 Z`
	].join(' ');
}
