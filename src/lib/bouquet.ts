import type { Seed } from './flower/types';

export const MAX_BOUQUET_NAME_LENGTH = 60;

export interface Bouquet {
	id: string;
	name: string;
	seeds: Seed[];
}

export type BouquetInput = Omit<Bouquet, 'id'>;

function isSeed(value: unknown): value is Seed {
	return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 2 ** 32 - 1;
}

export function normalizeBouquetName(name: string): string {
	return name.normalize('NFKC').trim().toLowerCase();
}

export function parseBouquetName(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	const name = value.normalize('NFKC').trim();
	return name && name.length <= MAX_BOUQUET_NAME_LENGTH ? name : null;
}

export function parseBouquetInput(value: unknown): BouquetInput | null {
	if (
		typeof value !== 'object' ||
		value === null ||
		!('name' in value) ||
		!('seeds' in value) ||
		!Array.isArray(value.seeds)
	) {
		return null;
	}

	const name = parseBouquetName(value.name);
	const seeds = [...new Set(value.seeds.filter(isSeed))];
	return name && seeds.length ? { name, seeds } : null;
}

export function parseBouquets(value: unknown): Bouquet[] {
	if (!Array.isArray(value)) return [];

	const names = new Set<string>();
	return value.flatMap((entry) => {
		const input = parseBouquetInput(entry);
		if (
			!input ||
			typeof entry !== 'object' ||
			entry === null ||
			!('id' in entry) ||
			typeof entry.id !== 'string' ||
			!entry.id ||
			names.has(normalizeBouquetName(input.name))
		) {
			return [];
		}

		names.add(normalizeBouquetName(input.name));
		return [{ id: entry.id, ...input }];
	});
}

export function bouquetNameExists(name: string, bouquets: Bouquet[]): boolean {
	const normalized = normalizeBouquetName(name);
	return (
		normalized !== '' &&
		bouquets.some((bouquet) => normalizeBouquetName(bouquet.name) === normalized)
	);
}
