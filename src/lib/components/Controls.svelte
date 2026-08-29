<script lang="ts">
	import { t } from '$lib/i18n';

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
</script>

<div
	class="fixed inset-x-0 bottom-0 z-30 flex justify-center px-3"
	style:padding-bottom="calc(env(safe-area-inset-bottom) + 0.75rem)"
>
	<div
		class="flex items-center gap-2 rounded-[1.7rem] border border-white/40 bg-white/35 p-2 shadow-[0_18px_55px_rgb(31_74_53/0.18),inset_0_1px_rgb(255_255_255/0.6)] backdrop-blur-2xl backdrop-saturate-150"
	>
		<button
			type="button"
			onclick={onSave}
			aria-pressed={saved}
			aria-label={saved ? $t('ui.unsaveFlower') : $t('ui.saveFlower')}
			class="grid size-12 shrink-0 place-items-center rounded-[1.2rem] transition-all active:scale-95 {saved
				? 'bg-emerald-100 text-emerald-700'
				: 'bg-rose-50 text-rose-500 hover:bg-rose-100'}"
		>
			<svg viewBox="0 0 24 24" class="size-5" aria-hidden="true">
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
			onclick={onRegenerate}
			aria-label={$t('ui.generateNewFlower')}
			class="grid size-14 shrink-0 place-items-center rounded-[1.25rem] bg-emerald-950 text-white shadow-[inset_0_1px_rgb(255_255_255/0.16),0_7px_18px_rgb(15_67_46/0.22)] transition-transform hover:rotate-3 active:scale-95"
		>
			<svg viewBox="0 0 24 24" class="size-6" fill="none" aria-hidden="true">
				<path
					d="M19 7v4.5h-4.5M5 17v-4.5h4.5"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M17.8 11.5A6.2 6.2 0 0 0 7.1 7.2L5 9m2.2 3.5a6.2 6.2 0 0 0 10.7 4.3L20 15"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
				/>
				<circle cx="12" cy="12" r="1.5" fill="currentColor" />
			</svg>
		</button>

		<a
			href="/gallery"
			aria-label={$t('ui.openSavedGarden')}
			class="grid size-12 shrink-0 place-items-center rounded-[1.2rem] bg-emerald-50 text-emerald-800 transition-transform hover:bg-emerald-100 active:scale-95"
		>
			<svg viewBox="0 0 24 24" class="size-5" fill="none" aria-hidden="true">
				<path d="M4 19.5V10m8 9.5V5m8 14.5V8" stroke="currentColor" stroke-width="1.7" />
				<path
					d="M4 12c-3-2-3.2-5.1 0-6 3.2.9 3 4 0 6Zm8-4c-3.3-2.2-3.4-5.6 0-6.5 3.4.9 3.3 4.3 0 6.5Zm8 3c-3-2-3.2-5.1 0-6 3.2.9 3 4 0 6Z"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linejoin="round"
				/>
			</svg>
		</a>

		<div class="mx-1 h-8 w-px bg-emerald-950/15" aria-hidden="true"></div>

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
			class="grid size-12 shrink-0 place-items-center rounded-[1.2rem] bg-emerald-50 text-emerald-800 transition-transform hover:bg-emerald-100 active:scale-95 disabled:cursor-wait disabled:opacity-55"
		>
			{#if exportStatus === 'preparing' || exportStatus === 'sharing'}
				<span class="size-5 animate-spin rounded-full border-2 border-current border-t-transparent"
				></span>
			{:else if exportStatus === 'shared'}
				<svg viewBox="0 0 24 24" class="size-5" fill="none" aria-hidden="true">
					<path
						d="m5 12 4 4L19 6"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{:else if exportStatus === 'ready'}
				<svg viewBox="0 0 24 24" class="size-5" fill="none" aria-hidden="true">
					<path
						d="M8 12.5 16 8m-8 3.5 8 4.5M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm13-5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
			{:else if exportStatus === 'error' || exportStatus === 'unavailable'}
				<svg viewBox="0 0 24 24" class="size-5" fill="none" aria-hidden="true">
					<path d="M12 7v6m0 4h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
			{/if}
		</button>
	</div>
</div>
