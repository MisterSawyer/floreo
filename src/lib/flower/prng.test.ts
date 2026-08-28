import { describe, expect, it } from 'vitest';
import { hashSeed, intRange, mulberry32, pick, range } from './prng';

describe('mulberry32', () => {
	it('is deterministic for a given seed', () => {
		const a = mulberry32(42);
		const b = mulberry32(42);
		const seqA = Array.from({ length: 5 }, () => a());
		const seqB = Array.from({ length: 5 }, () => b());
		expect(seqA).toEqual(seqB);
	});

	it('produces different streams for different seeds', () => {
		const a = mulberry32(1)();
		const b = mulberry32(2)();
		expect(a).not.toBe(b);
	});

	it('stays within [0, 1)', () => {
		const rng = mulberry32(7);
		for (let i = 0; i < 1000; i++) {
			const value = rng();
			expect(value).toBeGreaterThanOrEqual(0);
			expect(value).toBeLessThan(1);
		}
	});
});

describe('hashSeed', () => {
	it('is deterministic for a given string', () => {
		expect(hashSeed('floreo')).toBe(hashSeed('floreo'));
	});

	it('differs for different strings', () => {
		expect(hashSeed('floreo')).not.toBe(hashSeed('flower'));
	});
});

describe('range/intRange/pick', () => {
	const rng = mulberry32(99);

	it('range stays within bounds', () => {
		for (let i = 0; i < 200; i++) {
			const value = range(rng, 10, 20);
			expect(value).toBeGreaterThanOrEqual(10);
			expect(value).toBeLessThan(20);
		}
	});

	it('intRange stays within inclusive integer bounds', () => {
		for (let i = 0; i < 200; i++) {
			const value = intRange(rng, 1, 3);
			expect(Number.isInteger(value)).toBe(true);
			expect(value).toBeGreaterThanOrEqual(1);
			expect(value).toBeLessThanOrEqual(3);
		}
	});

	it('pick only returns items from the input array', () => {
		const items = ['a', 'b', 'c'];
		for (let i = 0; i < 50; i++) {
			expect(items).toContain(pick(rng, items));
		}
	});
});
