import { getStore } from '@netlify/blobs';
import {
	normalizeBouquetName,
	parseBouquetInput,
	parseBouquets,
	type Bouquet,
	type BouquetInput
} from '../../src/lib/bouquet.ts';

const STORE_NAME = 'floreo-bouquets';
const BOUQUET_PREFIX = 'bouquets/';

function getBouquetStore() {
	return getStore({ name: STORE_NAME, consistency: 'strong' });
}

async function bouquetKey(name: string): Promise<string> {
	const digest = await crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(normalizeBouquetName(name))
	);
	return `${BOUQUET_PREFIX}${[...new Uint8Array(digest)]
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('')}`;
}

export async function listBouquets(): Promise<Bouquet[]> {
	const store = getBouquetStore();
	const { blobs } = await store.list({ prefix: BOUQUET_PREFIX });
	return parseBouquets(await Promise.all(blobs.map(({ key }) => store.get(key, { type: 'json' }))));
}

export async function saveBouquet(input: BouquetInput): Promise<Bouquet | null> {
	const parsed = parseBouquetInput(input);
	if (!parsed) return null;

	const bouquet = { id: crypto.randomUUID(), ...parsed };
	const { modified } = await getBouquetStore().setJSON(await bouquetKey(bouquet.name), bouquet, {
		onlyIfNew: true
	});
	return modified ? bouquet : null;
}

export async function removeBouquet(name: string): Promise<void> {
	await getBouquetStore().delete(await bouquetKey(name));
}
