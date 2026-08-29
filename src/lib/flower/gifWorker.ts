import { GIFEncoder } from 'gifenc';
import { addGifFrame } from './gifEncoder';

const gif = GIFEncoder();

self.onmessage = (
	event: MessageEvent<
		{ type: 'frame'; pixels: ArrayBuffer; width: number; height: number } | { type: 'finish' }
	>
) => {
	try {
		if (event.data.type === 'frame') {
			addGifFrame(
				gif,
				new Uint8ClampedArray(event.data.pixels),
				event.data.width,
				event.data.height
			);
			postMessage({ type: 'ready' });
			return;
		}

		gif.finish();
		const bytes = gif.bytes().slice().buffer;
		postMessage({ type: 'done', bytes }, { transfer: [bytes] });
	} catch (error) {
		postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) });
	}
};
