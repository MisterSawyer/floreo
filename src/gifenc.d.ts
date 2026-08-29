declare module 'gifenc' {
	type Palette = number[][];

	export function quantize(
		pixels: Uint8Array | Uint8ClampedArray,
		maxColors: number,
		options?: { format?: 'rgb444' | 'rgb565' | 'rgba4444' }
	): Palette;
	export function applyPalette(
		pixels: Uint8Array | Uint8ClampedArray,
		palette: Palette,
		format?: 'rgb444' | 'rgb565' | 'rgba4444'
	): Uint8Array;
	export function GIFEncoder(): {
		writeFrame(
			pixels: Uint8Array,
			width: number,
			height: number,
			options: { palette: Palette; delay: number }
		): void;
		finish(): void;
		bytes(): Uint8Array;
	};
}
