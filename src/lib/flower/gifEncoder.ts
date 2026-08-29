import { GIFEncoder, applyPalette, quantize } from 'gifenc';
import { GIF_FRAME_DELAY } from './gifConfig';

export type GifEncoder = ReturnType<typeof GIFEncoder>;

export function addGifFrame(
	gif: GifEncoder,
	pixels: Uint8ClampedArray,
	width: number,
	height: number
) {
	const palette = quantize(pixels, 128, { format: 'rgb444' });
	gif.writeFrame(applyPalette(pixels, palette, 'rgb444'), width, height, {
		palette,
		delay: GIF_FRAME_DELAY
	});
}

export function encodeGif(frames: Uint8ClampedArray[], width: number, height: number): Uint8Array {
	const gif = GIFEncoder();
	for (const frame of frames) addGifFrame(gif, frame, width, height);
	gif.finish();
	return gif.bytes();
}
