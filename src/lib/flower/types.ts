export type Seed = number;

export type FlowerKind =
	| 'rose'
	| 'freesia'
	| 'lily'
	| 'carnation'
	| 'tulip'
	| 'poppy'
	| 'daisy'
	| 'sunflower'
	| 'daffodil'
	| 'iris'
	| 'lavender'
	| 'cosmos'
	| 'hibiscus'
	| 'columbine'
	| 'bluebell';

export type PetalShape =
	| 'rounded'
	| 'heart'
	| 'lance'
	| 'ruffled'
	| 'trumpet'
	| 'rose'
	| 'tepal'
	| 'poppy'
	| 'ray'
	| 'iris-fall'
	| 'iris-standard'
	| 'hibiscus';

export interface ColorPalette {
	/** Dominant petal hue in degrees. */
	baseHue: number;
	/** A related hue used for translucent edges and inner petals. */
	secondaryHue: number;
	/** Natural green used by stems and leaves. */
	stemHue: number;
	saturation: number;
	centerLightness: number;
	tipLightness: number;
	/** Warm hue for pollen, stamens, and flower throats. */
	throatHue: number;
}

export interface PetalParams {
	/** Petal length along its own axis, in SVG units. */
	length: number;
	/** Petal half-width at its widest point, in SVG units. */
	width: number;
	/** Sideways bend, in SVG units. */
	curl: number;
	/** 0 = rounded tip, 1 = sharply pointed tip. */
	pointedness: number;
	shape: PetalShape;
	/** Number of edge waves on ruffled petals. */
	ruffle: number;
}

export interface PetalLayer {
	petalCount: number;
	radius: number;
	rotationOffset: number;
	petal: PetalParams;
	/** 0 = outermost, 1 = innermost. */
	depth: number;
	/** Slight squash creates a cupped, dimensional bloom. */
	scaleY: number;
	hueShift: number;
}

export interface StemParams {
	length: number;
	curve: number;
	width: number;
	leafLength: number;
}

export interface BloomNode {
	x: number;
	y: number;
	scale: number;
	rotation: number;
	openness: number;
}

export interface PollenMote {
	x: number;
	y: number;
	radius: number;
	delay: number;
	duration: number;
	drift: number;
}

export interface FlowerDetails {
	spotCount: number;
	stamenCount: number;
	/** Composite flowers are made from many individual disc florets. */
	discFloretCount: number;
	veinOpacity: number;
	budCount: number;
}

export interface FlowerParams {
	seed: Seed;
	kind: FlowerKind;
	displayNameIndex: number;
	botanicalName: string;
	layers: PetalLayer[];
	palette: ColorPalette;
	centerRadius: number;
	hasStem: boolean;
	leafCount: number;
	stem: StemParams;
	details: FlowerDetails;
	bloomNodes: BloomNode[];
	motes: PollenMote[];
	/** Seconds; prevents flowers from swaying in lockstep. */
	swayDurationSeconds: number;
}
