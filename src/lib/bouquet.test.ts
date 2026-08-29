import { describe, expect, it } from 'vitest';
import { bouquetNameExists, parseBouquetInput, parseBouquetName, parseBouquets } from './bouquet';

describe('bouquet validation', () => {
	it('deduplicates seeds and normalized names', () => {
		const bouquets = parseBouquets([
			{ id: 'one', name: '  Summer table  ', seeds: [7, 7, 12, -1] },
			{ id: 'duplicate', name: 'summer table', seeds: [3] },
			{ id: 'no-flowers', name: 'No flowers', seeds: [] }
		]);

		expect(bouquets).toEqual([{ id: 'one', name: 'Summer table', seeds: [7, 12] }]);
		expect(bouquetNameExists(' SUMMER TABLE ', bouquets)).toBe(true);
		expect(bouquetNameExists(' SUMMER TABLE ', bouquets, 'one')).toBe(false);
	});

	it('rejects invalid bouquet input', () => {
		expect(parseBouquetInput({ name: '', seeds: [1] })).toBeNull();
		expect(parseBouquetInput({ name: 'Valid', seeds: [] })).toBeNull();
		expect(parseBouquetInput({ name: 'Valid', seeds: [2 ** 32] })).toBeNull();
		expect(parseBouquetName(null)).toBeNull();
		expect(parseBouquetName('   ')).toBeNull();
	});
});
