import { derived, writable } from 'svelte/store';
import { browser } from '$app/environment';
import translations from './translations.json';

export type Locale = keyof typeof translations;

export const LOCALES: { code: Locale; label: string }[] = [
	{ code: 'en', label: 'English' },
	{ code: 'pl', label: 'Polski' }
];

const STORAGE_KEY = 'floreo:locale';

function isLocale(value: string | null): value is Locale {
	return value !== null && value in translations;
}

function initialLocale(): Locale {
	if (!browser) return 'en';
	const stored = localStorage.getItem(STORAGE_KEY);
	return isLocale(stored) ? stored : 'en';
}

export const locale = writable<Locale>(initialLocale());

if (browser) {
	locale.subscribe((value) => localStorage.setItem(STORAGE_KEY, value));
}

function resolve(node: unknown, path: string[]): unknown {
	return path.reduce<unknown>((current, key) => (current as never)?.[key], node);
}

function format(value: string, params?: Record<string, string | number>): string {
	if (!params) return value;
	return value.replace(/\{(\w+)\}/g, (match, key) => String(params[key] ?? match));
}

export const t = derived(
	locale,
	($locale) => (key: string, params?: Record<string, string | number>) => {
		const value = resolve(translations[$locale], key.split('.')) ?? resolve(translations.en, key.split('.'));
		return typeof value === 'string' ? format(value, params) : key;
	}
);
