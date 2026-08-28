import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Seed } from '$lib/flower/types';

const STORAGE_KEY = 'floreo:gallery';

function readSeeds(): Seed[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as Seed[]) : [];
	} catch {
		return [];
	}
}

export const savedSeeds = writable<Seed[]>(readSeeds());

if (browser) {
	savedSeeds.subscribe((seeds) => localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds)));
}

export function saveFlower(seed: Seed): void {
	savedSeeds.update((seeds) => (seeds.includes(seed) ? seeds : [seed, ...seeds]));
}

export function removeFlower(seed: Seed): void {
	savedSeeds.update((seeds) => seeds.filter((saved) => saved !== seed));
}
