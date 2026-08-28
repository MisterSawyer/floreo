import type { FlowerKind, FlowerParams } from './types';
import {
	freesiaBloomAttachment,
	freesiaBudPlacement,
	freesiaLeafPlacement,
	freesiaStemProgressAtY
} from './freesia';
import { standardLeafPlacement } from './stem';

export const GROWTH_TIMING = {
	stemDelay: 50,
	stemDuration: 1000,
	leafDuration: 240,
	roseRachisDuration: 380,
	branchDuration: 180,
	supportDuration: 90,
	freesiaTubeDuration: 180,
	lavenderSpikeDuration: 520,
	bluebellRacemeDuration: 560,
	budDuration: 300,
	petalDuration: {
		rose: 430,
		lily: 650,
		carnation: 420,
		freesia: 360,
		tulip: 720,
		poppy: 520,
		daisy: 560,
		sunflower: 560,
		daffodil: 650,
		iris: 680,
		lavender: 420,
		cosmos: 560,
		hibiscus: 680,
		columbine: 620,
		bluebell: 430
	} satisfies Record<FlowerKind, number>,
	detailDuration: 180,
	stamenDuration: 360,
	antherDuration: 220,
	hibiscusStyleBranchStagger: 35
} as const;

export function stemCompleteMs(): number {
	return GROWTH_TIMING.stemDelay + GROWTH_TIMING.stemDuration;
}

export function stemArrivalMs(progress: number): number {
	return GROWTH_TIMING.stemDelay + GROWTH_TIMING.stemDuration * Math.max(0, Math.min(1, progress));
}

export function standardLeafStartMs(flower: FlowerParams, index: number): number {
	return stemArrivalMs(standardLeafPlacement(flower, index).stemProgress);
}

export function freesiaLeafStartMs(flower: FlowerParams, index: number): number {
	return stemArrivalMs(freesiaLeafPlacement(flower, index).stemProgress);
}

export function leavesCompleteMs(flower: FlowerParams): number {
	if (flower.leafCount <= 0) return GROWTH_TIMING.stemDelay;
	const starts = Array.from({ length: flower.leafCount }, (_, index) =>
		flower.kind === 'freesia'
			? freesiaLeafStartMs(flower, index)
			: standardLeafStartMs(flower, index)
	);
	return (
		Math.max(...starts) +
		(flower.kind === 'rose' ? GROWTH_TIMING.roseRachisDuration : 0) +
		GROWTH_TIMING.leafDuration
	);
}

export function singleBloomStartMs(): number {
	return stemCompleteMs();
}

export function petalLayerStartMs(flower: FlowerParams, layerIndex: number): number {
	return singleBloomStartMs() + layerIndex * GROWTH_TIMING.petalDuration[flower.kind];
}

export function petalsCompleteMs(flower: FlowerParams): number {
	return singleBloomStartMs() + flower.layers.length * GROWTH_TIMING.petalDuration[flower.kind];
}

export function primaryDetailStartMs(flower: FlowerParams): number {
	return petalsCompleteMs(flower);
}

export function secondaryDetailStartMs(flower: FlowerParams): number {
	return primaryDetailStartMs(flower) + GROWTH_TIMING.detailDuration;
}

export function roseCoreStartMs(flower: FlowerParams): number {
	return secondaryDetailStartMs(flower) + GROWTH_TIMING.petalDuration.rose;
}

export function lilyThroatStartMs(flower: FlowerParams): number {
	return petalsCompleteMs(flower) + GROWTH_TIMING.detailDuration;
}

export function lilyStamenStartMs(flower: FlowerParams): number {
	return lilyThroatStartMs(flower) + GROWTH_TIMING.detailDuration;
}

export function lilyAntherStartMs(flower: FlowerParams): number {
	return lilyStamenStartMs(flower) + GROWTH_TIMING.stamenDuration;
}

export function hibiscusStyleBranchStartMs(flower: FlowerParams, index: number): number {
	return (
		primaryDetailStartMs(flower) +
		GROWTH_TIMING.stamenDuration +
		index * GROWTH_TIMING.hibiscusStyleBranchStagger
	);
}

export function hibiscusStigmaStartMs(flower: FlowerParams, index: number): number {
	return hibiscusStyleBranchStartMs(flower, index) + GROWTH_TIMING.detailDuration;
}

/** A branch begins as soon as the main stalk reaches its own attachment point. */
export function freesiaBloomBranchStartMs(flower: FlowerParams, nodeIndex: number): number {
	const attachment = freesiaBloomAttachment(flower, flower.bloomNodes[nodeIndex]);
	return stemArrivalMs(freesiaStemProgressAtY(flower, attachment.y));
}

export function freesiaBloomSupportStartMs(flower: FlowerParams, nodeIndex: number): number {
	return freesiaBloomBranchStartMs(flower, nodeIndex) + GROWTH_TIMING.branchDuration;
}

export function freesiaTubeStartMs(flower: FlowerParams, nodeIndex: number): number {
	return freesiaBloomSupportStartMs(flower, nodeIndex) + GROWTH_TIMING.supportDuration;
}

export function freesiaPetalStartMs(flower: FlowerParams, nodeIndex: number): number {
	return freesiaTubeStartMs(flower, nodeIndex) + GROWTH_TIMING.freesiaTubeDuration;
}

export function freesiaThroatStartMs(flower: FlowerParams, nodeIndex: number): number {
	return freesiaPetalStartMs(flower, nodeIndex) + GROWTH_TIMING.petalDuration.freesia;
}

export function freesiaBloomsCompleteMs(flower: FlowerParams): number {
	if (flower.bloomNodes.length === 0) return GROWTH_TIMING.stemDelay;
	return Math.max(
		...flower.bloomNodes.map(
			(_, nodeIndex) => freesiaThroatStartMs(flower, nodeIndex) + GROWTH_TIMING.detailDuration
		)
	);
}

/** Lavender extends its flowering spike only after the leafy main stalk is complete. */
export function lavenderSpikeStartMs(): number {
	return stemCompleteMs();
}

export function lavenderSpikeCompleteMs(): number {
	return lavenderSpikeStartMs() + GROWTH_TIMING.lavenderSpikeDuration;
}

/** A flower whorl opens when the growing spike reaches its own attachment height. */
export function lavenderWhorlStartMs(flower: FlowerParams, nodeIndex: number): number {
	const node = flower.bloomNodes[nodeIndex];
	const spikeBottomY = 8;
	const spikeTopY = -72;
	const progress = Math.max(0, Math.min(1, (spikeBottomY - node.y) / (spikeBottomY - spikeTopY)));
	return lavenderSpikeStartMs() + GROWTH_TIMING.lavenderSpikeDuration * progress;
}

/** The bluebell's flowering raceme rises only after its basal scape is complete. */
export function bluebellRacemeStartMs(): number {
	return stemCompleteMs();
}

export function bluebellRacemeCompleteMs(): number {
	return bluebellRacemeStartMs() + GROWTH_TIMING.bluebellRacemeDuration;
}

export function bluebellBranchStartMs(flower: FlowerParams, nodeIndex: number): number {
	const node = flower.bloomNodes[nodeIndex];
	const racemeBottomY = 8;
	const racemeTopY = -78;
	const progress = Math.max(
		0,
		Math.min(1, (racemeBottomY - node.y) / (racemeBottomY - racemeTopY))
	);
	return bluebellRacemeStartMs() + GROWTH_TIMING.bluebellRacemeDuration * progress;
}

export function bluebellFlowerStartMs(flower: FlowerParams, nodeIndex: number): number {
	return bluebellBranchStartMs(flower, nodeIndex) + GROWTH_TIMING.branchDuration;
}

/** A bud branch begins as soon as the main stalk reaches that bud's junction. */
export function freesiaBudBranchStartMs(flower: FlowerParams, budIndex: number): number {
	const bud = freesiaBudPlacement(flower, budIndex);
	return stemArrivalMs(freesiaStemProgressAtY(flower, bud.y));
}

export function freesiaBudSupportStartMs(flower: FlowerParams, budIndex: number): number {
	return freesiaBudBranchStartMs(flower, budIndex) + GROWTH_TIMING.branchDuration;
}

export function freesiaBudStartMs(flower: FlowerParams, budIndex: number): number {
	return freesiaBudSupportStartMs(flower, budIndex) + GROWTH_TIMING.supportDuration;
}

export function plantMatureMs(flower: FlowerParams): number {
	if (flower.kind === 'freesia') {
		const budsComplete = Array.from(
			{ length: flower.details.budCount },
			(_, index) => freesiaBudStartMs(flower, index) + GROWTH_TIMING.budDuration
		);
		return Math.max(
			stemCompleteMs(),
			leavesCompleteMs(flower),
			freesiaBloomsCompleteMs(flower),
			...budsComplete
		);
	}

	if (flower.kind === 'lily') {
		return Math.max(
			leavesCompleteMs(flower),
			lilyAntherStartMs(flower) + GROWTH_TIMING.antherDuration
		);
	}

	if (flower.kind === 'rose') {
		return Math.max(
			leavesCompleteMs(flower),
			roseCoreStartMs(flower) + GROWTH_TIMING.detailDuration
		);
	}

	if (flower.kind === 'hibiscus') {
		return Math.max(
			leavesCompleteMs(flower),
			hibiscusStigmaStartMs(flower, 4) + GROWTH_TIMING.antherDuration
		);
	}

	if (flower.kind === 'lavender') {
		const whorlsComplete = flower.bloomNodes.map(
			(_, nodeIndex) =>
				lavenderWhorlStartMs(flower, nodeIndex) + GROWTH_TIMING.petalDuration.lavender
		);
		return Math.max(
			leavesCompleteMs(flower),
			lavenderSpikeCompleteMs() + GROWTH_TIMING.petalDuration.lavender,
			...whorlsComplete
		);
	}

	if (flower.kind === 'bluebell') {
		const flowersComplete = flower.bloomNodes.map(
			(_, nodeIndex) =>
				bluebellFlowerStartMs(flower, nodeIndex) + GROWTH_TIMING.petalDuration.bluebell
		);
		return Math.max(
			leavesCompleteMs(flower),
			bluebellRacemeCompleteMs() + GROWTH_TIMING.budDuration,
			...flowersComplete
		);
	}

	return Math.max(
		leavesCompleteMs(flower),
		primaryDetailStartMs(flower) + GROWTH_TIMING.detailDuration
	);
}

export function growthTimingStyle(): string {
	return [
		`--stem-delay: ${GROWTH_TIMING.stemDelay}ms`,
		`--stem-duration: ${GROWTH_TIMING.stemDuration}ms`,
		`--leaf-duration: ${GROWTH_TIMING.leafDuration}ms`,
		`--rose-rachis-duration: ${GROWTH_TIMING.roseRachisDuration}ms`,
		`--branch-duration: ${GROWTH_TIMING.branchDuration}ms`,
		`--support-duration: ${GROWTH_TIMING.supportDuration}ms`,
		`--freesia-tube-duration: ${GROWTH_TIMING.freesiaTubeDuration}ms`,
		`--lavender-spike-duration: ${GROWTH_TIMING.lavenderSpikeDuration}ms`,
		`--bluebell-raceme-duration: ${GROWTH_TIMING.bluebellRacemeDuration}ms`,
		`--freesia-petal-duration: ${GROWTH_TIMING.petalDuration.freesia}ms`,
		`--bud-duration: ${GROWTH_TIMING.budDuration}ms`,
		`--rose-petal-duration: ${GROWTH_TIMING.petalDuration.rose}ms`,
		`--lily-petal-duration: ${GROWTH_TIMING.petalDuration.lily}ms`,
		`--carnation-petal-duration: ${GROWTH_TIMING.petalDuration.carnation}ms`,
		`--tulip-petal-duration: ${GROWTH_TIMING.petalDuration.tulip}ms`,
		`--poppy-petal-duration: ${GROWTH_TIMING.petalDuration.poppy}ms`,
		`--daisy-petal-duration: ${GROWTH_TIMING.petalDuration.daisy}ms`,
		`--sunflower-petal-duration: ${GROWTH_TIMING.petalDuration.sunflower}ms`,
		`--daffodil-petal-duration: ${GROWTH_TIMING.petalDuration.daffodil}ms`,
		`--iris-petal-duration: ${GROWTH_TIMING.petalDuration.iris}ms`,
		`--lavender-petal-duration: ${GROWTH_TIMING.petalDuration.lavender}ms`,
		`--cosmos-petal-duration: ${GROWTH_TIMING.petalDuration.cosmos}ms`,
		`--hibiscus-petal-duration: ${GROWTH_TIMING.petalDuration.hibiscus}ms`,
		`--columbine-petal-duration: ${GROWTH_TIMING.petalDuration.columbine}ms`,
		`--bluebell-petal-duration: ${GROWTH_TIMING.petalDuration.bluebell}ms`,
		`--detail-duration: ${GROWTH_TIMING.detailDuration}ms`,
		`--stamen-duration: ${GROWTH_TIMING.stamenDuration}ms`,
		`--anther-duration: ${GROWTH_TIMING.antherDuration}ms`
	].join('; ');
}
