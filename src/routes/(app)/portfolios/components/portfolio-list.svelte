<script lang="ts">
	import PortfolioListData from './portfolio-list-data.svelte';
	import PortfolioListLoading from './portfolio-list-loading.svelte';
	import { createPortfolioList } from './portfolio-list.svelte.ts';

	const list = createPortfolioList();
</script>

{#if list.state.status === 'loading'}
	<PortfolioListLoading />
{:else if list.state.status === 'error'}
	<div>Error loading portfolios: {list.state.error.message}</div>
{:else if list.state.status === 'empty'}
	<div>No portfolios found.</div>
{:else if list.state.status === 'data'}
	<PortfolioListData portfolios={list.state.portfolios} />
{/if}
