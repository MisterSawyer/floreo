import { afterEach, describe, expect, it, vi } from 'vitest';
import { shareFlowerGif } from './exportGif';
import { encodeGif } from './gifEncoder';

afterEach(() => vi.unstubAllGlobals());

describe('GIF export', () => {
	it('encodes a valid GIF', () => {
		const bytes = encodeGif([new Uint8ClampedArray([238, 243, 233, 255])], 1, 1);
		expect(new TextDecoder().decode(bytes.slice(0, 6))).toBe('GIF89a');
		expect(bytes.at(-1)).toBe(0x3b);
	});

	it('shares a prepared GIF through the native share sheet', async () => {
		const share = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal('navigator', { share, canShare: () => true });

		await expect(shareFlowerGif(new Blob(['GIF89a']), 'flower.gif')).resolves.toBe('shared');
		expect(share).toHaveBeenCalledWith({ files: [expect.any(File)] });
	});
});
