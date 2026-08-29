import type { Snippet } from 'svelte';

export const navBar: {
	onRegenerate: (() => void) | null;
	trailing: Snippet | null;
} = $state({
	onRegenerate: null,
	trailing: null
});
