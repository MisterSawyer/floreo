<script lang="ts">
	import { locale, LOCALES, t, type Locale } from '$lib/i18n';

	let open = $state(false);

	function select(code: Locale) {
		locale.set(code);
		open = false;
	}
</script>

{#snippet flag(code: Locale)}
	<svg viewBox="0 0 640 480" class="size-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
		{#if code === 'pl'}
			<path fill="#fff" d="M0 0h640v240H0z" />
			<path fill="#dc143c" d="M0 240h640v240H0z" />
		{:else}
			<path fill="#012169" d="M0 0h640v480H0z" />
			<path
				fill="#FFF"
				d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 63V0z"
			/>
			<path
				fill="#C8102E"
				d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
			/>
			<path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
			<path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
		{/if}
	</svg>
{/snippet}

{#if open}
	<button
		type="button"
		class="fixed inset-0 z-30 cursor-default"
		aria-label={$t('ui.closeLanguageMenu')}
		onclick={() => (open = false)}
	></button>
{/if}

<div
	class="fixed right-3 z-40 flex flex-col items-end gap-2"
	style:bottom="calc(env(safe-area-inset-bottom) + 0.75rem)"
>
	{#if open}
		<div
			class="flex flex-col gap-1 rounded-full border border-white/25 bg-white/15 p-1 shadow-[0_8px_28px_rgb(31_74_53/0.1)] backdrop-blur-xl"
		>
			{#each LOCALES as entry (entry.code)}
				<button
					type="button"
					onclick={() => select(entry.code)}
					aria-pressed={$locale === entry.code}
					aria-label={entry.label}
					class="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full transition-all active:scale-95 {$locale ===
					entry.code
						? 'opacity-100 ring-2 ring-emerald-700/70 ring-offset-1'
						: 'opacity-50 hover:opacity-90'}"
				>
					{@render flag(entry.code)}
				</button>
			{/each}
		</div>
	{/if}

	<button
		type="button"
		onclick={() => (open = !open)}
		aria-label={$t('ui.switchLanguage')}
		aria-expanded={open}
		class="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full border border-white/25 bg-white/15 opacity-60 shadow-[0_8px_28px_rgb(31_74_53/0.1)] backdrop-blur-xl transition-all hover:opacity-100 active:scale-95"
	>
		{@render flag($locale)}
	</button>
</div>
