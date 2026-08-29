<script lang="ts">
	import { page } from '$app/state';
	import { t } from '$lib/i18n';
	import { navBar } from '$lib/stores/navBar.svelte';

	let active = $derived(
		page.url.pathname === '/' ? 0 : page.url.pathname.startsWith('/bouquets') ? 2 : 1
	);

	const buttonClass =
		'relative z-10 grid size-14 shrink-0 place-items-center rounded-[1.25rem] transition-colors duration-300 active:scale-95';
</script>

<div class="relative flex items-center gap-2">
	<span
		class="pointer-events-none absolute size-14 rounded-[1.25rem] bg-emerald-950 shadow-[inset_0_1px_rgb(255_255_255/0.16),0_7px_18px_rgb(15_67_46/0.22)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
		style="transform: translateX({active * 4}rem)"
		aria-hidden="true"
	></span>

	{#if navBar.onRegenerate}
		<button
			type="button"
			onclick={navBar.onRegenerate}
			aria-label={$t('ui.generateNewFlower')}
			class="{buttonClass} {active === 0 ? 'text-white' : 'text-emerald-800 hover:bg-emerald-100/60'}"
		>
			<svg viewBox="0 0 24 24" class="size-7" aria-hidden="true">
				<g fill="currentColor">
					{#each [0, 60, 120, 180, 240, 300] as angle}
						<ellipse
							cx="12"
							cy="6.8"
							rx="2.1"
							ry="3.4"
							transform="rotate({angle} 12 12)"
							opacity="0.9"
						/>
					{/each}
				</g>
				<circle cx="12" cy="12" r="2.6" fill="white" />
				<circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="0.6" />
			</svg>
		</button>
	{:else}
		<a
			href="/"
			aria-label={$t('ui.growAnotherFlower')}
			class="{buttonClass} {active === 0 ? 'text-white' : 'text-emerald-800 hover:bg-emerald-100/60'}"
		>
			<svg viewBox="0 0 24 24" class="size-7" aria-hidden="true">
				<g fill="currentColor">
					{#each [0, 60, 120, 180, 240, 300] as angle}
						<ellipse
							cx="12"
							cy="6.8"
							rx="2.1"
							ry="3.4"
							transform="rotate({angle} 12 12)"
							opacity="0.9"
						/>
					{/each}
				</g>
				<circle cx="12" cy="12" r="2.6" fill="white" />
				<circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="0.6" />
			</svg>
		</a>
	{/if}

	<a
		href="/gallery"
		aria-label={$t('ui.openSavedGarden')}
		class="{buttonClass} {active === 1 ? 'text-white' : 'text-emerald-800 hover:bg-emerald-100/60'}"
	>
		<svg viewBox="0 0 24 24" class="size-6" fill="none" aria-hidden="true">
			<path d="M4 19.5V10m8 9.5V5m8 14.5V8" stroke="currentColor" stroke-width="1.7" />
			<path
				d="M4 12c-3-2-3.2-5.1 0-6 3.2.9 3 4 0 6Zm8-4c-3.3-2.2-3.4-5.6 0-6.5 3.4.9 3.3 4.3 0 6.5Zm8 3c-3-2-3.2-5.1 0-6 3.2.9 3 4 0 6Z"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linejoin="round"
			/>
		</svg>
	</a>

	<a
		href="/bouquets"
		aria-label={$t('ui.bouquets')}
		class="{buttonClass} {active === 2 ? 'text-white' : 'text-emerald-800 hover:bg-emerald-100/60'}"
	>
		<svg viewBox="0 0 24 24" class="size-8" fill="none" aria-hidden="true">
			<circle cx="8" cy="8" r="1.2" fill="currentColor" />
			<circle cx="16" cy="8" r="1.2" fill="currentColor" />
			<circle cx="8" cy="16" r="1.2" fill="currentColor" />
			<circle cx="16" cy="16" r="1.2" fill="currentColor" />
		</svg>
	</a>
</div>
