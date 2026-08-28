import { describe, expect, it } from 'vitest';
import {
	GROWTH_TIMING,
	freesiaBloomBranchStartMs,
	freesiaBloomSupportStartMs,
	freesiaBloomsCompleteMs,
	freesiaBudBranchStartMs,
	freesiaBudStartMs,
	freesiaBudSupportStartMs,
	freesiaLeafStartMs,
	freesiaPetalStartMs,
	freesiaThroatStartMs,
	freesiaTubeStartMs,
	hibiscusStigmaStartMs,
	hibiscusStyleBranchStartMs,
	leavesCompleteMs,
	lavenderSpikeCompleteMs,
	lavenderSpikeStartMs,
	lavenderWhorlStartMs,
	lilyAntherStartMs,
	lilyStamenStartMs,
	lilyThroatStartMs,
	petalLayerStartMs,
	petalsCompleteMs,
	plantMatureMs,
	primaryDetailStartMs,
	roseCoreStartMs,
	secondaryDetailStartMs,
	standardLeafStartMs,
	stemArrivalMs,
	stemCompleteMs
} from './animation';
import { generateFlower } from './flower';
import {
	freesiaBloomAttachment,
	freesiaBudPlacement,
	freesiaLeafPlacement,
	freesiaStemProgressAtY
} from './freesia';
import { leafRenderLayers, leafRenderOrder, standardLeafPlacement, stemPath } from './stem';

const flowers = Array.from({ length: 128 }, (_, seed) => generateFlower(seed));
const freesia = flowers.find((flower) => flower.kind === 'freesia')!;
const rose = flowers.find((flower) => flower.kind === 'rose')!;
const lily = flowers.find((flower) => flower.kind === 'lily')!;
const carnation = flowers.find((flower) => flower.kind === 'carnation')!;
const tulip = flowers.find((flower) => flower.kind === 'tulip')!;
const poppy = flowers.find((flower) => flower.kind === 'poppy')!;
const daisy = flowers.find((flower) => flower.kind === 'daisy')!;
const sunflower = flowers.find((flower) => flower.kind === 'sunflower')!;
const daffodil = flowers.find((flower) => flower.kind === 'daffodil')!;
const iris = flowers.find((flower) => flower.kind === 'iris')!;
const lavender = flowers.find((flower) => flower.kind === 'lavender')!;
const hibiscus = flowers.find((flower) => flower.kind === 'hibiscus')!;
const standardFlowers = [
	rose,
	lily,
	carnation,
	tulip,
	poppy,
	daisy,
	sunflower,
	daffodil,
	iris,
	lavender
];

describe('growth animation sequence', () => {
	it('paints upper leaves beneath the leaves below them', () => {
		expect(leafRenderOrder(5)).toEqual([4, 3, 2, 1, 0]);
		expect(leafRenderOrder(0)).toEqual([]);

		const layers = leafRenderLayers(42, 5);
		expect([...layers.behindStem, ...layers.inFrontOfStem]).toEqual([4, 3, 2, 1, 0]);
		expect(layers.behindStem.length).toBeGreaterThan(0);
		expect(layers.inFrontOfStem.length).toBeGreaterThan(0);
		expect(leafRenderLayers(42, 5)).toEqual(layers);
	});

	it('draws standard stems from the soil to the bloom', () => {
		for (const flower of standardFlowers) {
			const path = stemPath(flower);
			expect(path.startsWith(`M ${flower.stem.curve} ${flower.stem.length}`)).toBe(true);
			expect(path.endsWith(', 0 8')).toBe(true);
		}
	});

	it('starts each leaf exactly when the stalk reaches its root point', () => {
		for (const flower of standardFlowers) {
			for (let index = 0; index < flower.leafCount; index++) {
				const leaf = standardLeafPlacement(flower, index);
				expect(standardLeafStartMs(flower, index)).toBe(stemArrivalMs(leaf.stemProgress));
				expect(standardLeafStartMs(flower, index)).toBeLessThan(stemCompleteMs());
				if (index > 0) {
					if ((flower.kind === 'carnation' || flower.kind === 'lavender') && index % 2 === 1) {
						expect(standardLeafStartMs(flower, index)).toBe(standardLeafStartMs(flower, index - 1));
					} else {
						expect(standardLeafStartMs(flower, index)).toBeGreaterThan(
							standardLeafStartMs(flower, index - 1)
						);
					}
				}
			}
		}

		for (let index = 0; index < freesia.leafCount; index++) {
			const leaf = freesiaLeafPlacement(freesia, index);
			expect(freesiaLeafStartMs(freesia, index)).toBe(stemArrivalMs(leaf.stemProgress));
			expect(freesiaLeafStartMs(freesia, index)).toBeLessThan(stemCompleteMs());
			if (index > 0) {
				expect(freesiaLeafStartMs(freesia, index)).toBeGreaterThan(
					freesiaLeafStartMs(freesia, index - 1)
				);
			}
		}
	});

	it('starts a terminal bloom when the stalk reaches it while preserving internal dependencies', () => {
		for (const flower of standardFlowers) {
			expect(petalLayerStartMs(flower, 0)).toBe(stemCompleteMs());

			for (let index = 1; index < flower.layers.length; index++) {
				expect(petalLayerStartMs(flower, index)).toBe(
					petalLayerStartMs(flower, index - 1) + GROWTH_TIMING.petalDuration[flower.kind]
				);
			}

			expect(leavesCompleteMs(flower)).toBeGreaterThan(standardLeafStartMs(flower, 0));
		}

		expect(primaryDetailStartMs(carnation)).toBe(petalsCompleteMs(carnation));
		expect(secondaryDetailStartMs(rose)).toBe(
			primaryDetailStartMs(rose) + GROWTH_TIMING.detailDuration
		);
		expect(roseCoreStartMs(rose)).toBe(
			secondaryDetailStartMs(rose) + GROWTH_TIMING.petalDuration.rose
		);
		expect(lilyThroatStartMs(lily)).toBe(petalsCompleteMs(lily) + GROWTH_TIMING.detailDuration);
		expect(lilyStamenStartMs(lily)).toBe(lilyThroatStartMs(lily) + GROWTH_TIMING.detailDuration);
		expect(lilyAntherStartMs(lily)).toBe(lilyStamenStartMs(lily) + GROWTH_TIMING.stamenDuration);

		for (let index = 0; index < 5; index++) {
			expect(hibiscusStyleBranchStartMs(hibiscus, index)).toBe(
				primaryDetailStartMs(hibiscus) +
					GROWTH_TIMING.stamenDuration +
					index * GROWTH_TIMING.hibiscusStyleBranchStagger
			);
			expect(hibiscusStigmaStartMs(hibiscus, index)).toBe(
				hibiscusStyleBranchStartMs(hibiscus, index) + GROWTH_TIMING.detailDuration
			);
		}
		expect(plantMatureMs(hibiscus)).toBeGreaterThan(hibiscusStigmaStartMs(hibiscus, 4));
	});

	it('starts freesia branches at local stalk arrivals while preserving each child chain', () => {
		const bottomUpNodeIndexes = Array.from(
			{ length: freesia.bloomNodes.length },
			(_, order) => freesia.bloomNodes.length - order - 1
		);

		for (const nodeIndex of bottomUpNodeIndexes) {
			const attachment = freesiaBloomAttachment(freesia, freesia.bloomNodes[nodeIndex]);
			expect(freesiaBloomBranchStartMs(freesia, nodeIndex)).toBe(
				stemArrivalMs(freesiaStemProgressAtY(freesia, attachment.y))
			);
			expect(freesiaBloomSupportStartMs(freesia, nodeIndex)).toBe(
				freesiaBloomBranchStartMs(freesia, nodeIndex) + GROWTH_TIMING.branchDuration
			);
			expect(freesiaTubeStartMs(freesia, nodeIndex)).toBe(
				freesiaBloomSupportStartMs(freesia, nodeIndex) + GROWTH_TIMING.supportDuration
			);
			expect(freesiaPetalStartMs(freesia, nodeIndex)).toBe(
				freesiaTubeStartMs(freesia, nodeIndex) + GROWTH_TIMING.freesiaTubeDuration
			);
			expect(freesiaThroatStartMs(freesia, nodeIndex)).toBe(
				freesiaPetalStartMs(freesia, nodeIndex) + GROWTH_TIMING.petalDuration.freesia
			);
		}

		for (let order = 1; order < bottomUpNodeIndexes.length; order++) {
			const previousIndex = bottomUpNodeIndexes[order - 1];
			const currentIndex = bottomUpNodeIndexes[order];
			expect(freesiaBloomBranchStartMs(freesia, currentIndex)).toBeGreaterThan(
				freesiaBloomBranchStartMs(freesia, previousIndex)
			);
		}
		expect(freesiaBloomBranchStartMs(freesia, bottomUpNodeIndexes[1])).toBeLessThan(
			freesiaThroatStartMs(freesia, bottomUpNodeIndexes[0]) + GROWTH_TIMING.detailDuration
		);

		for (let index = 0; index < freesia.details.budCount; index++) {
			const bud = freesiaBudPlacement(freesia, index);
			expect(freesiaBudBranchStartMs(freesia, index)).toBe(
				stemArrivalMs(freesiaStemProgressAtY(freesia, bud.y))
			);
			expect(freesiaBudSupportStartMs(freesia, index)).toBe(
				freesiaBudBranchStartMs(freesia, index) + GROWTH_TIMING.branchDuration
			);
			expect(freesiaBudStartMs(freesia, index)).toBe(
				freesiaBudSupportStartMs(freesia, index) + GROWTH_TIMING.supportDuration
			);
			if (index > 0) {
				expect(freesiaBudBranchStartMs(freesia, index)).toBeGreaterThan(
					freesiaBudBranchStartMs(freesia, index - 1)
				);
			}
		}

		expect(freesiaBudBranchStartMs(freesia, 0)).toBeLessThan(freesiaBloomsCompleteMs(freesia));
		expect(plantMatureMs(freesia)).toBeGreaterThan(
			freesiaBudStartMs(freesia, freesia.details.budCount - 1)
		);
	});

	it('grows the lavender spike after its stalk and opens each whorl at local arrival', () => {
		expect(lavenderSpikeStartMs()).toBe(stemCompleteMs());
		expect(lavenderSpikeCompleteMs()).toBe(
			lavenderSpikeStartMs() + GROWTH_TIMING.lavenderSpikeDuration
		);

		for (let index = 0; index < lavender.bloomNodes.length; index++) {
			expect(lavenderWhorlStartMs(lavender, index)).toBeGreaterThan(lavenderSpikeStartMs());
			expect(lavenderWhorlStartMs(lavender, index)).toBeLessThan(lavenderSpikeCompleteMs());
			if (index > 0) {
				expect(lavenderWhorlStartMs(lavender, index)).toBeGreaterThan(
					lavenderWhorlStartMs(lavender, index - 1)
				);
			}
		}

		expect(plantMatureMs(lavender)).toBeGreaterThan(lavenderSpikeCompleteMs());
	});
});
