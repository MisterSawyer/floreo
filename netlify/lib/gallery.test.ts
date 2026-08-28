import { describe, expect, it } from 'vitest';
import { parseSeed } from './gallery.ts';

describe('gallery seed validation', () => {
	it.each([0, 1, 2 ** 32 - 1])('accepts unsigned 32-bit seed %s', (seed) => {
		expect(parseSeed(seed)).toBe(seed);
	});

	it.each([-1, 2 ** 32, 1.5, Number.NaN, '123', null, undefined])(
		'rejects invalid seed %s',
		(seed) => {
			expect(parseSeed(seed)).toBeNull();
		}
	);
});
