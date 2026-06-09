<script lang="ts">
	import AppSidebar from '$lib/components/core/sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';

	let { children } = $props();
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
