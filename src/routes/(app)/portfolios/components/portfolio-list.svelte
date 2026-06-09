<script lang="ts">
	import PortfolioListLoading from './portfolio-list-loading.svelte';
	import { createPortfolioList } from './portfolio-list.svelte.ts';

	const { state } = createPortfolioList();
</script>

<div class="p-6">
	{#if state.status === 'loading'}
		<PortfolioListLoading />
	{:else if state.status === 'error'}
		<div>Error loading portfolios: {state.error.message}</div>
	{:else if state.status === 'empty'}
		<div>No portfolios found.</div>
	{:else if state.status === 'data'}
		<ul>
			{#each state.portfolios as portfolio}
				<li>{portfolio.name}</li>
			{/each}
		</ul>
	{/if}
</div>
