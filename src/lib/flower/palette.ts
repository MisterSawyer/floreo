import type { ColorPalette, FlowerKind } from './types';
import { pick, range } from './prng';

const HUES: Record<FlowerKind, readonly number[]> = {
	rose: [350, 2, 12, 28, 44, 322, 274],
	freesia: [48, 38, 24, 344, 286, 212],
	lily: [48, 24, 6, 342, 305, 282],
	carnation: [350, 4, 18, 326, 300, 46],
	tulip: [350, 4, 18, 34, 48, 302, 274],
	poppy: [348, 2, 8, 18, 32, 46],
	daisy: [42, 48, 52, 330],
	sunflower: [42, 45, 48, 52],
	daffodil: [43, 48, 52, 56],
	iris: [252, 265, 278, 292, 326, 46],
	lavender: [248, 256, 264, 272],
	cosmos: [330, 340, 350, 4, 286],
	hibiscus: [348, 358, 8, 20, 42, 322],
	columbine: [230, 248, 266, 285, 324, 345],
	bluebell: [226, 236, 244, 252]
};

export function generatePalette(rng: () => number, kind: FlowerKind): ColorPalette {
	const baseHue = (pick(rng, HUES[kind]) + range(rng, -7, 7) + 360) % 360;
	const pale =
		kind === 'lily' || kind === 'daisy' || kind === 'daffodil' || kind === 'cosmos' || rng() > 0.58;
	const saturation =
		kind === 'daisy'
			? range(rng, 18, 35)
			: kind === 'sunflower' || kind === 'daffodil'
				? range(rng, 72, 90)
				: kind === 'lavender'
					? range(rng, 42, 62)
					: kind === 'bluebell'
						? range(rng, 50, 70)
						: kind === 'hibiscus'
							? range(rng, 70, 90)
							: kind === 'poppy'
								? range(rng, 72, 90)
								: kind === 'lily'
									? range(rng, 48, 72)
									: pale
										? range(rng, 46, 67)
										: range(rng, 62, 82);

	return {
		baseHue,
		secondaryHue: (baseHue + range(rng, kind === 'lily' ? 5 : -15, 18) + 360) % 360,
		stemHue: range(rng, 91, 132),
		saturation,
		centerLightness:
			kind === 'daisy'
				? range(rng, 91, 96)
				: kind === 'sunflower'
					? range(rng, 48, 57)
					: kind === 'lavender'
						? range(rng, 48, 61)
						: kind === 'bluebell'
							? range(rng, 44, 57)
							: kind === 'lily'
								? range(rng, 58, 72)
								: pale
									? range(rng, 64, 77)
									: range(rng, 47, 63),
		tipLightness:
			kind === 'daisy'
				? range(rng, 96, 99)
				: kind === 'sunflower'
					? range(rng, 72, 82)
					: kind === 'bluebell'
						? range(rng, 72, 86)
						: pale
							? range(rng, 88, 96)
							: range(rng, 74, 90),
		throatHue:
			kind === 'sunflower'
				? range(rng, 25, 34)
				: kind === 'lily' && rng() > 0.5
					? range(rng, 70, 112)
					: range(rng, 38, 55)
	};
}

function wrapHue(hue: number): number {
	return (hue + 360) % 360;
}

export function petalColor(
	palette: ColorPalette,
	depth: number,
	lightnessShift = 0,
	hueShift = 0
): string {
	const lightness = palette.tipLightness + (palette.centerLightness - palette.tipLightness) * depth;
	return `hsl(${wrapHue(palette.baseHue + hueShift)} ${palette.saturation}% ${Math.max(18, Math.min(97, lightness + lightnessShift))}%)`;
}

export function petalShadowColor(palette: ColorPalette, hueShift = 0): string {
	return `hsl(${wrapHue(palette.secondaryHue + hueShift)} ${Math.min(96, palette.saturation + 4)}% ${Math.max(24, palette.centerLightness - 17)}%)`;
}

export function petalHighlightColor(palette: ColorPalette, hueShift = 0): string {
	return `hsl(${wrapHue(palette.baseHue + hueShift)} ${Math.max(30, palette.saturation - 18)}% 97%)`;
}

export function accentColor(palette: ColorPalette, lightness = 34): string {
	return `hsl(${palette.stemHue} 42% ${lightness}%)`;
}

export function pollenColor(palette: ColorPalette, lightness = 58): string {
	return `hsl(${palette.throatHue} 76% ${lightness}%)`;
}
