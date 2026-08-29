<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import GlassPanel from '$lib/components/GlassPanel.svelte';
	import PrimaryNav from '$lib/components/PrimaryNav.svelte';
	import LanguageToggle from '$lib/components/LanguageToggle.svelte';
	import { navBar } from '$lib/stores/navBar.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

<div
	class="fixed inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 px-3"
	style:padding-bottom="calc(env(safe-area-inset-bottom) + 0.75rem)"
>
	{#if navBar.trailing}
		<GlassPanel small>
			{@render navBar.trailing()}
		</GlassPanel>
	{/if}
	<GlassPanel>
		<PrimaryNav />
	</GlassPanel>
</div>

<LanguageToggle />
