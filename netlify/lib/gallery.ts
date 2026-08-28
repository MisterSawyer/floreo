import { getStore } from '@netlify/blobs';

const STORE_NAME = 'floreo-gallery';
const SEED_PREFIX = 'seeds/';
const MAX_SEED = 2 ** 32 - 1;

function getGalleryStore() {
	return getStore({ name: STORE_NAME, consistency: 'strong' });
}

export function parseSeed(value: unknown): number | null {
	return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= MAX_SEED
		? value
		: null;
}

function seedKey(seed: number): string {
	return `${SEED_PREFIX}${seed}`;
}

function seedFromKey(key: string): number | null {
	if (!key.startsWith(SEED_PREFIX)) return null;
	const rawSeed = key.slice(SEED_PREFIX.length);
	return /^\d+$/.test(rawSeed) ? parseSeed(Number(rawSeed)) : null;
}

export async function listSeeds(): Promise<number[]> {
	const { blobs } = await getGalleryStore().list({ prefix: SEED_PREFIX });

	return blobs
		.map(({ key }) => seedFromKey(key))
		.filter((seed): seed is number => seed !== null)
		.sort((first, second) => second - first);
}

export async function saveSeed(seed: number): Promise<boolean> {
	const { modified } = await getGalleryStore().setJSON(
		seedKey(seed),
		{ seed, savedAt: new Date().toISOString() },
		{ onlyIfNew: true }
	);

	return modified;
}

export async function removeSeed(seed: number): Promise<void> {
	await getGalleryStore().delete(seedKey(seed));
}
