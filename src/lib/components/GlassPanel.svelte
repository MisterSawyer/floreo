<script lang="ts">
	import type { Snippet } from 'svelte';

	let { small = false, children }: { small?: boolean; children: Snippet } = $props();
</script>

<div
	class="flex items-center rounded-[1.7rem] border border-white/40 bg-white/35 shadow-[0_18px_55px_rgb(31_74_53/0.18),inset_0_1px_rgb(255_255_255/0.6)] backdrop-blur-2xl backdrop-saturate-150 {small
		? 'gap-1.5 px-1.5 py-1'
		: 'gap-2 p-2'}"
>
	{@render children()}
</div>
