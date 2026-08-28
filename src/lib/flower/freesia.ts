import type { BloomNode, FlowerParams } from './types';

const LOWEST_BUD_Y = -86;
const BUD_VERTICAL_SPAN = 25;

export interface FreesiaPoint {
	x: number;
	y: number;
}

export interface FreesiaLeafPlacement extends FreesiaPoint {
	side: 1 | -1;
	stemProgress: number;
}

/** Keeps any number of terminal buds on a compact arc instead of extending beyond the viewBox. */
export function freesiaBudPlacement(
	flower: FlowerParams,
	index: number
): FreesiaPoint & { rotation: number } {
	const lastIndex = Math.max(0, flower.details.budCount - 1);
	const progress = lastIndex === 0 ? 1 : index / lastIndex;
	const y = LOWEST_BUD_Y - progress * BUD_VERTICAL_SPAN;

	return {
		x: freesiaStemXAt(flower, y),
		y,
		rotation: 18 + progress * 18
	};
}

/** The stalk reaches the attachment point of the final, highest bud. */
export function freesiaStemTopY(flower: FlowerParams): number {
	return freesiaBudPlacement(flower, Math.max(0, flower.details.budCount - 1)).y;
}

/** Shared stalk curve used by the stalk itself and every attached element. */
export function freesiaStemXAt(flower: FlowerParams, y: number): number {
	const bottomY = flower.stem.length;
	const topY = LOWEST_BUD_Y - BUD_VERTICAL_SPAN;
	const progress = Math.max(0, Math.min(1, (bottomY - y) / (bottomY - topY)));
	const inverse = 1 - progress;
	const controlX = -8;
	const topX = 20 + flower.details.budCount * 1.35;

	return (
		inverse * inverse * flower.stem.curve +
		2 * inverse * progress * controlX +
		progress * progress * topX
	);
}

export function freesiaStemPath(flower: FlowerParams): string {
	const topY = freesiaStemTopY(flower);
	const topX = freesiaStemXAt(flower, topY);
	const controlY = (flower.stem.length + topY) * 0.5;
	return `M ${flower.stem.curve} ${flower.stem.length} Q -8 ${controlY.toFixed(2)}, ${topX.toFixed(2)} ${topY.toFixed(2)}`;
}

function freesiaStemPointAt(flower: FlowerParams, progress: number): FreesiaPoint {
	const clampedProgress = Math.max(0, Math.min(1, progress));
	const topY = freesiaStemTopY(flower);
	const y = flower.stem.length + (topY - flower.stem.length) * clampedProgress;
	return { x: freesiaStemXAt(flower, y), y };
}

/** Arc-length progress matches the normalized SVG dash used by the stalk animation. */
export function freesiaStemProgressAtY(flower: FlowerParams, y: number): number {
	const topY = freesiaStemTopY(flower);
	const parameterProgress = Math.max(
		0,
		Math.min(1, (flower.stem.length - y) / (flower.stem.length - topY))
	);
	const steps = 80;
	let totalLength = 0;
	let reachedLength = 0;
	let previous = freesiaStemPointAt(flower, 0);

	for (let index = 1; index <= steps; index++) {
		const segmentStart = (index - 1) / steps;
		const segmentEnd = index / steps;
		const current = freesiaStemPointAt(flower, segmentEnd);
		const segmentLength = Math.hypot(current.x - previous.x, current.y - previous.y);
		totalLength += segmentLength;

		if (parameterProgress >= segmentEnd) {
			reachedLength += segmentLength;
		} else if (parameterProgress > segmentStart) {
			const target = freesiaStemPointAt(flower, parameterProgress);
			reachedLength += Math.hypot(target.x - previous.x, target.y - previous.y);
		}

		previous = current;
	}

	return totalLength === 0 ? 0 : reachedLength / totalLength;
}

export function freesiaLeafPlacement(flower: FlowerParams, index: number): FreesiaLeafPlacement {
	const side: 1 | -1 = index % 2 === 0 ? -1 : 1;
	const progress = flower.leafCount === 1 ? 0 : index / (flower.leafCount - 1);
	const y = flower.stem.length - 27 - progress * (flower.stem.length - 48);

	return {
		side,
		x: freesiaStemXAt(flower, y),
		y,
		stemProgress: freesiaStemProgressAtY(flower, y)
	};
}

export function freesiaBloomAttachment(flower: FlowerParams, node: BloomNode): FreesiaPoint {
	const y = node.y + 8;
	return { x: freesiaStemXAt(flower, y), y };
}

export function freesiaBranchPath(flower: FlowerParams, node: BloomNode): string {
	const attachment = freesiaBloomAttachment(flower, node);
	return `M ${attachment.x} ${attachment.y} Q ${(attachment.x + node.x) * 0.5} ${node.y + 13}, ${node.x} ${node.y}`;
}
