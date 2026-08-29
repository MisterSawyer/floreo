import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { bouquetNameExists, parseBouquetInput, parseBouquets, type Bouquet } from '$lib/bouquet';
import type { Seed } from '$lib/flower/types';

const BOUQUETS_ENDPOINT = '/api/bouquets';
// ponytail: Netlify functions aren't served by `vite dev`, so bouquets stay local during development.
const DEV_STORAGE_KEY = 'floreo:bouquets';

export type CreateBouquetResult = 'created' | 'duplicate' | 'invalid' | 'error';

let confirmedBouquets: Bouquet[] = [];
let loadPromise: Promise<void> | undefined;

export const bouquets = writable<Bouquet[]>([]);
export const bouquetsLoading = writable(true);
export const bouquetsError = writable(false);

function readStoredBouquets(): Bouquet[] {
	try {
		return parseBouquets(JSON.parse(localStorage.getItem(DEV_STORAGE_KEY) ?? '[]'));
	} catch {
		return [];
	}
}

async function fetchBouquets(): Promise<void> {
	bouquetsLoading.set(true);
	try {
		if (import.meta.env.DEV) {
			confirmedBouquets = readStoredBouquets();
			localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(confirmedBouquets));
		} else {
			const response = await fetch(BOUQUETS_ENDPOINT, { headers: { Accept: 'application/json' } });
			if (!response.ok) throw new Error(`Bouquets request failed with ${response.status}`);

			const data: unknown = await response.json();
			if (
				typeof data !== 'object' ||
				data === null ||
				!('bouquets' in data) ||
				!Array.isArray(data.bouquets)
			) {
				throw new Error('Bouquets returned an invalid response');
			}
			confirmedBouquets = parseBouquets(data.bouquets);
		}
		bouquets.set(confirmedBouquets);
		bouquetsError.set(false);
	} catch (error) {
		console.error('Could not load bouquets', error);
		bouquetsError.set(true);
	} finally {
		bouquetsLoading.set(false);
	}
}

export function loadBouquets(force = false): Promise<void> {
	if (!browser) return Promise.resolve();
	if (!loadPromise || force) loadPromise = fetchBouquets();
	return loadPromise;
}

export async function createBouquet(name: string, seeds: Seed[]): Promise<CreateBouquetResult> {
	await loadBouquets();
	const input = parseBouquetInput({ name, seeds });
	if (!input) return 'invalid';
	if (bouquetNameExists(input.name, confirmedBouquets)) return 'duplicate';

	try {
		let bouquet: Bouquet;
		if (import.meta.env.DEV) {
			bouquet = { id: crypto.randomUUID(), ...input };
		} else {
			const response = await fetch(BOUQUETS_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(input)
			});
			if (response.status === 409) return 'duplicate';
			if (!response.ok) throw new Error(`Bouquets request failed with ${response.status}`);

			const data: unknown = await response.json();
			const parsed =
				typeof data === 'object' && data !== null && 'bouquet' in data
					? parseBouquets([data.bouquet])[0]
					: undefined;
			if (!parsed) throw new Error('Bouquets returned an invalid response');
			bouquet = parsed;
		}

		confirmedBouquets = parseBouquets([bouquet, ...confirmedBouquets]);
		if (import.meta.env.DEV) {
			localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(confirmedBouquets));
		}
		bouquets.set(confirmedBouquets);
		bouquetsError.set(false);
		return 'created';
	} catch (error) {
		console.error('Could not save bouquet', error);
		bouquetsError.set(true);
		return 'error';
	}
}

export async function removeBouquet(bouquet: Bouquet): Promise<void> {
	await loadBouquets();

	try {
		if (!import.meta.env.DEV) {
			const response = await fetch(BOUQUETS_ENDPOINT, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: bouquet.name })
			});
			if (!response.ok) throw new Error(`Bouquets request failed with ${response.status}`);
		}

		confirmedBouquets = confirmedBouquets.filter(({ id }) => id !== bouquet.id);
		if (import.meta.env.DEV) {
			localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(confirmedBouquets));
		}
		bouquets.set(confirmedBouquets);
		bouquetsError.set(false);
	} catch (error) {
		console.error('Could not remove bouquet', error);
		bouquetsError.set(true);
	}
}

if (browser) loadBouquets();

export { bouquetNameExists } from '$lib/bouquet';
export type { Bouquet } from '$lib/bouquet';
