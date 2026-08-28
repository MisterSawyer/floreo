import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Seed } from '$lib/flower/types';

const GALLERY_ENDPOINT = '/api/gallery';
const LEGACY_STORAGE_KEY = 'floreo:gallery';
// ponytail: netlify functions aren't served by `vite dev`, so /api/gallery 404s locally.
const DEV_STORAGE_KEY = 'floreo:gallery:dev';

interface GalleryResponse {
	seeds: Seed[];
}

let confirmedSeeds: Seed[] = [];
const pendingChanges = new Map<Seed, boolean>();
let loadPromise: Promise<void> | undefined;
let mutationQueue = Promise.resolve();
let initializationPromise = Promise.resolve();

export const savedSeeds = writable<Seed[]>([]);
export const galleryLoading = writable(true);
export const galleryError = writable(false);

function isSeed(value: unknown): value is Seed {
	return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 2 ** 32 - 1;
}

function publishSeeds(): void {
	const seeds = new Set(confirmedSeeds);
	for (const [seed, saved] of pendingChanges) {
		if (saved) seeds.add(seed);
		else seeds.delete(seed);
	}
	savedSeeds.set([...seeds]);
}

function isGalleryResponse(value: unknown): value is GalleryResponse {
	return (
		typeof value === 'object' &&
		value !== null &&
		'seeds' in value &&
		Array.isArray(value.seeds) &&
		value.seeds.every(isSeed)
	);
}

function readStoredSeeds(key: string): Seed[] {
	try {
		const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
		return Array.isArray(value) ? [...new Set(value.filter(isSeed))] : [];
	} catch {
		return [];
	}
}

const readLegacySeeds = () => readStoredSeeds(LEGACY_STORAGE_KEY);

async function fetchGallery(): Promise<void> {
	galleryLoading.set(true);
	try {
		if (import.meta.env.DEV) {
			confirmedSeeds = readStoredSeeds(DEV_STORAGE_KEY);
		} else {
			const response = await fetch(GALLERY_ENDPOINT, { headers: { Accept: 'application/json' } });
			if (!response.ok) throw new Error(`Gallery request failed with ${response.status}`);

			const data: unknown = await response.json();
			if (!isGalleryResponse(data)) throw new Error('Gallery returned an invalid response');

			confirmedSeeds = data.seeds;
		}
		galleryError.set(false);
		publishSeeds();
	} catch (error) {
		console.error('Could not load the gallery', error);
		galleryError.set(true);
	} finally {
		galleryLoading.set(false);
	}
}

export function loadGallery(force = false): Promise<void> {
	if (!browser) return Promise.resolve();
	if (!loadPromise || force) loadPromise = fetchGallery();
	return loadPromise;
}

async function persistChange(seed: Seed, saved: boolean): Promise<boolean> {
	await loadGallery();

	try {
		if (!import.meta.env.DEV) {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: saved ? 'POST' : 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ seed })
			});
			if (!response.ok) throw new Error(`Gallery request failed with ${response.status}`);
		}

		confirmedSeeds = saved
			? [seed, ...confirmedSeeds.filter((savedSeed) => savedSeed !== seed)]
			: confirmedSeeds.filter((savedSeed) => savedSeed !== seed);
		if (import.meta.env.DEV) localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(confirmedSeeds));

		if (pendingChanges.get(seed) === saved) pendingChanges.delete(seed);
		galleryError.set(false);
		publishSeeds();
		return true;
	} catch (error) {
		console.error('Could not update the gallery', error);
		if (pendingChanges.get(seed) === saved) pendingChanges.delete(seed);
		galleryError.set(true);
		publishSeeds();
		return false;
	}
}

async function migrateLegacyGallery(): Promise<void> {
	const legacySeeds = readLegacySeeds();
	await loadGallery();
	if (legacySeeds.length === 0) return;

	for (const seed of legacySeeds) pendingChanges.set(seed, true);
	publishSeeds();

	let migrated = true;
	for (const seed of legacySeeds) {
		if (!(await persistChange(seed, true))) migrated = false;
	}

	if (migrated) {
		localStorage.removeItem(LEGACY_STORAGE_KEY);
		await loadGallery(true);
	} else {
		galleryError.set(true);
	}
}

function updateFlower(seed: Seed, saved: boolean): Promise<void> {
	pendingChanges.set(seed, saved);
	publishSeeds();

	mutationQueue = mutationQueue.then(
		async () => {
			await initializationPromise;
			await persistChange(seed, saved);
		},
		async () => {
			await initializationPromise;
			await persistChange(seed, saved);
		}
	);
	return mutationQueue;
}

export function saveFlower(seed: Seed): Promise<void> {
	return updateFlower(seed, true);
}

export function removeFlower(seed: Seed): Promise<void> {
	return updateFlower(seed, false);
}

if (browser) {
	initializationPromise = migrateLegacyGallery();
}
