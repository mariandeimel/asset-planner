<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Layout shell for the portfolio list page — summary row + section label + cards area. */
	const { summary, cards }: { summary: Snippet; cards: Snippet } = $props();
</script>

<div class="flex flex-col gap-7 p-6">
	<div class="grid lg:grid-cols-3 grid-cols-1 gap-4">
		{@render summary()}
	</div>

	<div class="flex flex-col gap-3">
		<p class="text-xs font-medium tracking-widest text-muted-foreground uppercase">
			Alle Portfolios
		</p>
		<div class="flex flex-col gap-4">
			{@render cards()}
		</div>
	</div>
</div>
