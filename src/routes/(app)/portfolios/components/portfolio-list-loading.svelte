<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PortfolioCardLayout from './portfolio-card-layout.svelte';
	import PortfolioListLayout from './portfolio-list-layout.svelte';
</script>

<PortfolioListLayout>
	{#snippet summary()}
		{#each Array(3) as _}
			<div class="bg-card ring-border flex flex-col gap-3 rounded-lg p-4 ring-1">
				<Skeleton class="h-3 w-28" />
				<Skeleton class="h-7 w-20" />
				<Skeleton class="h-3 w-36" />
			</div>
		{/each}
	{/snippet}

	{#snippet cards()}
		{#each Array(3) as _}
			<PortfolioCardLayout>
				{#snippet header()}
					<div class="flex items-start justify-between">
						<div class="flex items-center gap-3">
							<Skeleton class="h-10 w-10 shrink-0 rounded-lg" />
							<div class="flex flex-col gap-2">
								<Skeleton class="h-4 w-36" />
								<div class="flex gap-2">
									<Skeleton class="h-3 w-14" />
									<Skeleton class="h-3 w-14" />
								</div>
							</div>
						</div>
						<div class="flex flex-col items-end gap-2">
							<Skeleton class="h-5 w-24" />
							<Skeleton class="h-3 w-20" />
						</div>
					</div>
				{/snippet}

				{#snippet metrics()}
					<div class="grid grid-cols-4 gap-4">
						{#each Array(4) as _}
							<div class="flex flex-col gap-2">
								<Skeleton class="h-3 w-16" />
								<Skeleton class="h-4 w-12" />
							</div>
						{/each}
					</div>
				{/snippet}

				{#snippet actions()}
					<div class="flex gap-2">
						<Skeleton class="h-7 w-20" />
						<Skeleton class="h-7 w-24" />
						<Skeleton class="h-7 w-20" />
						<Skeleton class="ml-auto h-7 w-16" />
					</div>
				{/snippet}
			</PortfolioCardLayout>
		{/each}
	{/snippet}
</PortfolioListLayout>
