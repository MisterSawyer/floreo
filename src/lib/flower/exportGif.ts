import flowerCss from '$lib/components/Flower.css?raw';
import { GIF_FRAME_DELAY } from './gifConfig';
import { plantMatureMs } from './animation';
import type { FlowerParams } from './types';

const SIZE = 360;

type WorkerResponse =
	{ type: 'ready' } | { type: 'done'; bytes: ArrayBuffer } | { type: 'error'; message: string };

function createSnapshot(source: SVGSVGElement): (time: number) => Blob {
	const clone = source.cloneNode(true) as SVGSVGElement;
	const sourceElements = [source, ...source.querySelectorAll<SVGElement>('*')];
	const cloneElements = [clone, ...clone.querySelectorAll<SVGElement>('*')];
	const animations: { element: SVGElement; delay: string }[] = [];

	for (let index = 0; index < sourceElements.length; index++) {
		const computed = getComputedStyle(sourceElements[index]);
		if (computed.animationName === 'none') continue;
		cloneElements[index].style.animationPlayState = 'paused';
		animations.push({ element: cloneElements[index], delay: computed.animationDelay });
	}

	const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
	style.textContent = `${flowerCss}\n.flower, .flower * { filter: none !important; }`;
	clone.prepend(style);
	clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

	return (time) => {
		for (const animation of animations) {
			animation.element.style.animationDelay = animation.delay
				.split(',')
				.map((delay) => `calc(${delay} - ${time}ms)`)
				.join(',');
		}
		return new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' });
	};
}

function drawSvg(context: CanvasRenderingContext2D, svg: Blob): Promise<void> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(svg);
		const image = new Image();
		image.onload = () => {
			context.fillStyle = '#eef3e9';
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
			context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
			URL.revokeObjectURL(url);
			resolve();
		};
		image.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Could not render the flower'));
		};
		image.src = url;
	});
}

function idle(): Promise<void> {
	return new Promise((resolve) => {
		if ('requestIdleCallback' in window) {
			window.requestIdleCallback(() => resolve(), { timeout: 100 });
		} else {
			setTimeout(resolve);
		}
	});
}

function sendToWorker(
	worker: Worker,
	message:
		{ type: 'frame'; pixels: ArrayBuffer; width: number; height: number } | { type: 'finish' },
	transfer: Transferable[] = []
): Promise<WorkerResponse> {
	return new Promise((resolve, reject) => {
		worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
			if (data.type === 'error') reject(new Error(data.message));
			else resolve(data);
		};
		worker.onerror = () => reject(new Error('GIF worker failed'));
		worker.postMessage(message, transfer);
	});
}

export async function renderFlowerGif(
	source: SVGSVGElement,
	flower: FlowerParams,
	cancelled: () => boolean = () => false
): Promise<Blob> {
	const canvas = document.createElement('canvas');
	canvas.width = SIZE;
	canvas.height = Math.round((SIZE * 330) / 290);
	const context = canvas.getContext('2d', { willReadFrequently: true });
	if (!context) throw new Error('Canvas is unavailable');

	const worker = new Worker(new URL('./gifWorker.ts', import.meta.url), { type: 'module' });
	try {
		const snapshot = createSnapshot(source);
		const duration = plantMatureMs(flower) + 800;
		for (let time = 0; time <= duration; time += GIF_FRAME_DELAY) {
			if (cancelled()) throw new Error('GIF render cancelled');
			await idle();
			if (cancelled()) throw new Error('GIF render cancelled');
			await drawSvg(context, snapshot(time));
			const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
			await sendToWorker(
				worker,
				{
					type: 'frame',
					pixels: pixels.buffer as ArrayBuffer,
					width: canvas.width,
					height: canvas.height
				},
				[pixels.buffer as ArrayBuffer]
			);
		}

		const result = await sendToWorker(worker, { type: 'finish' });
		if (result.type !== 'done') throw new Error('GIF worker returned no file');
		return new Blob([result.bytes], { type: 'image/gif' });
	} finally {
		worker.terminate();
	}
}

function gifFile(blob: Blob, filename: string): File {
	return new File([blob], filename, { type: 'image/gif' });
}

export function canShareFlowerGif(blob: Blob, filename: string): boolean {
	const file = gifFile(blob, filename);
	return typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] }) === true;
}

export async function shareFlowerGif(
	blob: Blob,
	filename: string
): Promise<'shared' | 'ready' | 'error'> {
	const file = gifFile(blob, filename);
	if (!canShareFlowerGif(blob, filename)) return 'error';

	try {
		await navigator.share({ files: [file] });
		return 'shared';
	} catch (error) {
		if (error instanceof DOMException && error.name === 'AbortError') return 'ready';
		return 'error';
	}
}
