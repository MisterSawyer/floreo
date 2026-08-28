import type { Seed } from './types';

/** Deterministic seeded RNG (mulberry32). Same seed -> same output stream, always. */
export function mulberry32(seed: Seed): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Hashes an arbitrary string to a 32-bit int, for turning share-friendly seeds into numbers. */
export function hashSeed(input: string): Seed {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
	}
	return hash >>> 0;
}

/** Random number in [min, max). */
export function range(rng: () => number, min: number, max: number): number {
	return min + rng() * (max - min);
}

/** Random integer in [min, max]. */
export function intRange(rng: () => number, min: number, max: number): number {
	return Math.floor(range(rng, min, max + 1));
}

/** Picks a random element from a non-empty array. */
export function pick<T>(rng: () => number, items: readonly T[]): T {
	return items[Math.floor(rng() * items.length)];
}
