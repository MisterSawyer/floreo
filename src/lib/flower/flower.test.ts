import { describe, expect, it } from 'vitest';
import { FLOWER_KINDS, generateFlower } from './flower';
import { petalPath } from './petal';

describe('generateFlower', () => {
	it('is deterministic for a given seed', () => {
		expect(generateFlower(1234)).toEqual(generateFlower(1234));
	});

	it('produces different flowers for different seeds', () => {
		expect(generateFlower(1)).not.toEqual(generateFlower(2));
	});

	it('keeps every layer/petal/palette value within its documented range', () => {
		for (const seed of [0, 1, 2, 3, 42, 1000, 999999]) {
			const flower = generateFlower(seed);

			expect(flower.layers.length).toBeGreaterThanOrEqual(1);
			expect(flower.layers.length).toBeLessThanOrEqual(6);

			for (const layer of flower.layers) {
				expect(layer.petalCount).toBeGreaterThanOrEqual(2);
				expect(layer.petal.length).toBeGreaterThan(0);
				expect(layer.petal.width).toBeGreaterThan(0);
				expect(layer.depth).toBeGreaterThanOrEqual(0);
				expect(layer.depth).toBeLessThanOrEqual(1);
			}

			expect(flower.palette.baseHue).toBeGreaterThanOrEqual(0);
			expect(flower.palette.baseHue).toBeLessThan(360);
			expect(flower.palette.saturation).toBeGreaterThanOrEqual(0);
			expect(flower.palette.saturation).toBeLessThanOrEqual(100);
			expect(flower.leafCount).toBeGreaterThanOrEqual(2);
			expect(flower.leafCount).toBeLessThanOrEqual(8);
			expect(flower.stem.length).toBeGreaterThan(150);
			expect(flower.motes.length).toBeGreaterThan(0);
			expect(flower.swayDurationSeconds).toBeGreaterThan(0);
		}
	});

	it('uses the full structural variation ranges across seeded flowers', () => {
		const flowers = Array.from({ length: 2048 }, (_, seed) => generateFlower(seed));
		const freesias = flowers.filter((flower) => flower.kind === 'freesia');
		const roses = flowers.filter((flower) => flower.kind === 'rose');
		const carnations = flowers.filter((flower) => flower.kind === 'carnation');
		const lilies = flowers.filter((flower) => flower.kind === 'lily');
		const tulips = flowers.filter((flower) => flower.kind === 'tulip');
		const poppies = flowers.filter((flower) => flower.kind === 'poppy');
		const daisies = flowers.filter((flower) => flower.kind === 'daisy');
		const sunflowers = flowers.filter((flower) => flower.kind === 'sunflower');
		const daffodils = flowers.filter((flower) => flower.kind === 'daffodil');
		const irises = flowers.filter((flower) => flower.kind === 'iris');
		const lavenders = flowers.filter((flower) => flower.kind === 'lavender');

		expect(new Set(freesias.map((flower) => flower.bloomNodes.length))).toEqual(
			new Set([3, 4, 5, 6, 7, 8])
		);
		expect(new Set(freesias.map((flower) => flower.details.budCount))).toEqual(
			new Set([1, 2, 3, 4, 5])
		);
		expect(new Set(freesias.map((flower) => flower.leafCount))).toEqual(
			new Set([2, 3, 4, 5, 6, 7])
		);
		expect(new Set(freesias.map((flower) => flower.layers[0].petalCount))).toEqual(new Set([6]));
		expect(new Set(roses.map((flower) => flower.layers.length))).toEqual(new Set([5, 6]));
		expect(new Set(carnations.map((flower) => flower.layers.length))).toEqual(new Set([4, 5, 6]));
		expect(new Set(lilies.map((flower) => flower.details.stamenCount))).toEqual(new Set([6]));
		expect(tulips.every((flower) => flower.layers.every((layer) => layer.petalCount === 3))).toBe(
			true
		);
		expect(tulips.every((flower) => flower.details.stamenCount === 6)).toBe(true);
		expect(new Set(tulips.map((flower) => flower.leafCount))).toEqual(new Set([2, 3, 4]));
		expect(
			poppies.every(
				(flower) => flower.layers.reduce((sum, layer) => sum + layer.petalCount, 0) === 4
			)
		).toBe(true);
		expect(Math.min(...poppies.map((flower) => flower.details.stamenCount))).toBe(24);
		expect(Math.max(...poppies.map((flower) => flower.details.stamenCount))).toBe(36);
		expect(Math.min(...daisies.map((flower) => flower.layers[0].petalCount))).toBe(28);
		expect(Math.max(...daisies.map((flower) => flower.layers[0].petalCount))).toBe(38);
		expect(Math.min(...daisies.map((flower) => flower.details.discFloretCount))).toBe(55);
		expect(Math.max(...daisies.map((flower) => flower.details.discFloretCount))).toBe(78);
		expect(Math.min(...sunflowers.map((flower) => flower.layers[0].petalCount))).toBe(20);
		expect(Math.max(...sunflowers.map((flower) => flower.layers[0].petalCount))).toBe(34);
		expect(Math.min(...sunflowers.map((flower) => flower.details.discFloretCount))).toBe(120);
		expect(Math.max(...sunflowers.map((flower) => flower.details.discFloretCount))).toBe(164);
		expect(
			daffodils.every(
				(flower) =>
					flower.layers.length === 2 &&
					flower.layers.every((layer) => layer.petalCount === 3) &&
					flower.details.stamenCount === 6
			)
		).toBe(true);
		expect(
			irises.every(
				(flower) =>
					flower.layers[0].petalCount === 3 &&
					flower.layers[0].petal.shape === 'iris-fall' &&
					flower.layers[1].petalCount === 3 &&
					flower.layers[1].petal.shape === 'iris-standard' &&
					flower.details.stamenCount === 3
			)
		).toBe(true);
		expect(
			lavenders.every(
				(flower) =>
					flower.layers[0].petalCount === 5 &&
					flower.details.stamenCount === 4 &&
					flower.leafCount % 2 === 0 &&
					flower.bloomNodes.length >= 6 &&
					flower.bloomNodes.length <= 8
			)
		).toBe(true);
	});

	it('draws species from the seeded random stream', () => {
		const generatedKinds = new Set(
			Array.from({ length: 128 }, (_, seed) => generateFlower(seed).kind)
		);
		expect(generatedKinds).toEqual(new Set(FLOWER_KINDS));
	});

	it('produces a valid closed SVG path for every layer petal', () => {
		const flowers = Array.from({ length: 256 }, (_, seed) => generateFlower(seed));
		for (const flower of flowers) {
			for (const layer of flower.layers) {
				const path = petalPath(layer.petal);
				expect(path.startsWith('M ')).toBe(true);
				expect(path.endsWith('Z')).toBe(true);
			}
		}
	});
});
