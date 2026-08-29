<script lang="ts">
	import { t } from '$lib/i18n';
	import { navBar } from '$lib/stores/navBar.svelte';

	let {
		onRegenerate,
		onSave,
		onExport,
		exportStatus,
		saved
	}: {
		onRegenerate: () => void;
		onSave: () => void;
		onExport: () => void;
		exportStatus: 'preparing' | 'ready' | 'sharing' | 'shared' | 'unavailable' | 'error';
		saved: boolean;
	} = $props();

	$effect(() => {
		navBar.onRegenerate = onRegenerate;
		navBar.trailing = trailingActions;
		return () => {
			if (navBar.onRegenerate === onRegenerate) navBar.onRegenerate = null;
			if (navBar.trailing === trailingActions) navBar.trailing = null;
		};
	});
</script>

{#snippet trailingActions()}
	<button
		type="button"
		onclick={onSave}
		aria-pressed={saved}
		aria-label={saved ? $t('ui.unsaveFlower') : $t('ui.saveFlower')}
		class="grid size-10 shrink-0 place-items-center rounded-[1rem] transition-all active:scale-95 {saved
			? 'bg-emerald-100 text-emerald-700'
			: 'bg-rose-50 text-rose-500 hover:bg-rose-100'}"
	>
		<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
			<path
				d="M12 20.5S4 16 4 9.4C4 6.7 5.8 5 8.2 5c1.6 0 3 1 3.8 2.2C12.8 6 14.2 5 15.8 5 18.2 5 20 6.7 20 9.4c0 6.6-8 11.1-8 11.1Z"
				fill={saved ? 'currentColor' : 'none'}
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linejoin="round"
			/>
		</svg>
	</button>

	<button
		type="button"
		onclick={onExport}
		disabled={exportStatus === 'preparing' ||
			exportStatus === 'sharing' ||
			exportStatus === 'unavailable'}
		aria-label={$t(
			exportStatus === 'preparing'
				? 'ui.prepareFlowerGif'
				: exportStatus === 'sharing'
					? 'ui.shareFlowerGifInProgress'
					: exportStatus === 'shared'
						? 'ui.flowerGifShared'
						: exportStatus === 'unavailable'
							? 'ui.flowerGifShareUnavailable'
							: exportStatus === 'error'
								? 'ui.flowerGifShareFailed'
								: 'ui.shareFlowerGif'
		)}
		class="grid size-10 shrink-0 place-items-center rounded-[1rem] bg-emerald-50 text-emerald-800 transition-transform hover:bg-emerald-100 active:scale-95 disabled:cursor-wait disabled:opacity-55"
	>
		{#if exportStatus === 'preparing' || exportStatus === 'sharing'}
			<span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
			></span>
		{:else if exportStatus === 'shared'}
			<svg viewBox="0 0 24 24" class="size-4" fill="none" aria-hidden="true">
				<path
					d="m5 12 4 4L19 6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{:else if exportStatus === 'ready'}
			<svg viewBox="0 0 24 24" class="size-4" fill="none" aria-hidden="true">
				<path
					d="M8 12.5 16 8m-8 3.5 8 4.5M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm13-5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
				/>
			</svg>
		{:else if exportStatus === 'error' || exportStatus === 'unavailable'}
			<svg viewBox="0 0 24 24" class="size-4" fill="none" aria-hidden="true">
				<path d="M12 7v6m0 4h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
			</svg>
		{/if}
	</button>
{/snippet}
