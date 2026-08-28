import { describe, expect, it } from 'vitest';
import { generateFlower } from './flower';
import {
	freesiaBloomAttachment,
	freesiaBudPlacement,
	freesiaStemPath,
	freesiaStemTopY,
	freesiaStemXAt
} from './freesia';

describe('freesia geometry', () => {
	const freesias = Array.from({ length: 256 }, (_, seed) => generateFlower(seed)).filter(
		(flower) => flower.kind === 'freesia'
	);

	it('ends the main stalk exactly at the highest bud attachment', () => {
		for (const flower of freesias) {
			const highestBud = freesiaBudPlacement(flower, flower.details.budCount - 1);
			const topY = freesiaStemTopY(flower);

			expect(topY).toBe(highestBud.y);
			expect(freesiaStemXAt(flower, topY)).toBe(highestBud.x);
			expect(freesiaStemPath(flower)).toMatch(
				new RegExp(`${highestBud.x.toFixed(2)} ${highestBud.y.toFixed(2)}$`)
			);
		}
	});

	it('keeps every bloom and bud attachment on the shared stalk span', () => {
		for (const flower of freesias) {
			const topY = freesiaStemTopY(flower);

			for (const node of flower.bloomNodes) {
				const attachment = freesiaBloomAttachment(flower, node);
				expect(attachment.y).toBeGreaterThanOrEqual(topY);
				expect(attachment.y).toBeLessThanOrEqual(flower.stem.length);
				expect(attachment.x).toBe(freesiaStemXAt(flower, attachment.y));
			}

			for (let index = 0; index < flower.details.budCount; index++) {
				const bud = freesiaBudPlacement(flower, index);
				expect(bud.y).toBeGreaterThanOrEqual(topY);
				expect(bud.y).toBeLessThanOrEqual(flower.stem.length);
				expect(bud.x).toBe(freesiaStemXAt(flower, bud.y));
			}
		}
	});
});
