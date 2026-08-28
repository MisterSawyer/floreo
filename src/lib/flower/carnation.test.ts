import { describe, expect, it } from 'vitest';
import { carnationPetalPlacement, carnationSeamOccluderIndexes } from './carnation';
import { generateFlower } from './flower';

const carnations = Array.from({ length: 512 }, (_, seed) => generateFlower(seed)).filter(
	(flower) => flower.kind === 'carnation'
);

describe('carnation petal overlap', () => {
	it('keeps clockwise source order around every whorl', () => {
		for (const flower of carnations) {
			for (let layerIndex = 0; layerIndex < flower.layers.length; layerIndex++) {
				const layer = flower.layers[layerIndex];
				const petals = Array.from({ length: layer.petalCount }, (_, index) =>
					carnationPetalPlacement(flower, layerIndex, index)
				);

				expect(petals.map((petal) => petal.index)).toEqual(
					Array.from({ length: layer.petalCount }, (_, index) => index)
				);
				for (let index = 1; index < petals.length; index++) {
					expect(petals[index].angle).toBeGreaterThan(petals[index - 1].angle);
				}
			}
		}
	});

	it('keeps the first and last petals adjacent at the closing seam', () => {
		for (const flower of carnations) {
			for (let layerIndex = 0; layerIndex < flower.layers.length; layerIndex++) {
				const layer = flower.layers[layerIndex];
				const first = carnationPetalPlacement(flower, layerIndex, 0);
				const last = carnationPetalPlacement(flower, layerIndex, layer.petalCount - 1);
				const closingGap = first.angle + 360 - last.angle;

				expect(closingGap).toBeGreaterThan(0);
				expect(closingGap).toBeLessThan(60);
			}
		}
	});

	it('keeps every middle petal above the first-petal seam correction', () => {
		for (const flower of carnations) {
			for (const layer of flower.layers) {
				expect(carnationSeamOccluderIndexes(layer.petalCount)).toEqual(
					Array.from({ length: layer.petalCount - 2 }, (_, index) => index + 1)
				);
			}
		}
	});
});
