<script lang="ts">
	import AppSidebar from '$lib/components/core/sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { PortfolioRepository } from '$lib/portfolio/repository';
	import { setPortfolioRepo } from '$lib/portfolio/repository.svelte';
	import { loadSeedData } from '$lib/portfolio/seed';

	let { children } = $props();

	// Seed localStorage on first load so there's data to work with during development.
	if (typeof localStorage !== 'undefined' && !localStorage.getItem('portfolios')) {
		loadSeedData();
	}

	setPortfolioRepo(new PortfolioRepository());
</script>

<Sidebar.Provider>
	<AppSidebar />
	<div class="flex flex-col h-screen flex-1">
		<header class="h-16 flex items-center px-4">
			<Sidebar.Trigger />
		</header>
		<main class="flex-1">
			{@render children?.()}
		</main>
	</div>
</Sidebar.Provider>
