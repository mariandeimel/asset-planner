<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Structural shell for a portfolio card — defines the border, padding, and 3-section layout. */
	const { header, metrics, actions }: { header: Snippet; metrics: Snippet; actions: Snippet } =
		$props();
</script>

<div
	class="bg-card text-card-foreground flex flex-col rounded-lg ring-1 ring-border transition-shadow hover:ring-foreground/20"
>
	<div class="p-5">
		{@render header()}
	</div>

	<div class="border-t border-border px-5 py-4">
		{@render metrics()}
	</div>

	<div class="border-t border-border px-5 py-3">
		{@render actions()}
	</div>
</div>
