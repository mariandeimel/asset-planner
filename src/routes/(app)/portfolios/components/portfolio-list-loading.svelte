<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="flex flex-col gap-16">
	<div class="flex flex-row gap-4">
		<Card class="w-full p-4">
			<Skeleton class="h-4 w-1/2" />
			<Skeleton class="h-4 w-1/3 mt-2" />
		</Card>
		<Card class="w-full p-4">
			<Skeleton class="h-4 w-1/2" />
			<Skeleton class="h-4 w-1/3 mt-2" />
		</Card>
		<Card class="w-full p-4">
			<Skeleton class="h-4 w-1/2" />
			<Skeleton class="h-4 w-1/3 mt-2" />
		</Card>
	</div>

	<div class="flex flex-col gap-4">
		<Skeleton class="h-6 w-1/4" />
		{#each Array(3) as _}
			<Card class="w-full p-4">
				<Skeleton class="h-4 w-1/2" />
				<Skeleton class="h-4 w-1/3 mt-2" />
				<Skeleton class="h-4 w-1/4 mt-2" />
			</Card>
		{/each}
	</div>
</div>
