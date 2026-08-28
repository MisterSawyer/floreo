import type { FlowerParams } from './types';

export interface CarnationPetalPlacement {
	index: number;
	angle: number;
	scaleX: number;
}

export function carnationPetalPlacement(
	flower: FlowerParams,
	layerIndex: number,
	index: number
): CarnationPetalPlacement {
	const layer = flower.layers[layerIndex];

	return {
		index,
		angle:
			layer.rotationOffset +
			(index * 360) / layer.petalCount +
			Math.sin(index * 5.7 + flower.seed) * (4 + layerIndex),
		scaleX: 0.92 + Math.sin(index + flower.seed) * 0.07
	};
}

/** Petals whose existing paint must continue to cover the first petal at the seam. */
export function carnationSeamOccluderIndexes(petalCount: number): number[] {
	return Array.from({ length: Math.max(0, petalCount - 2) }, (_, index) => index + 1);
}
