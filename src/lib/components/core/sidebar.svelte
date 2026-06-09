<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import {
		Briefcase,
		ChartPie,
		LayoutDashboard,
		Search,
		Settings,
		Star,
	} from '@lucide/svelte';

	const navMain = [
		{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/portfolios', label: 'Portfolios', icon: Briefcase },
		{ href: '/screener', label: 'Screener', icon: Search },
		{ href: '/watchlist', label: 'Watchlist', icon: Star },
	];
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<div class="flex items-center gap-2.5 px-2 py-3">
			<div
				class="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white"
			>
				<ChartPie class="size-4" />
			</div>
			<span class="text-sm font-medium">Portfol.io</span>
		</div>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each navMain as item}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								isActive={page.url.pathname.startsWith(item.href)}
								tooltipContent={item.label}
							>
								{#snippet child({ props })}
									<a href={item.href} {...props}>
										<item.icon />
										<span>{item.label}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Group class="mt-auto">
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							isActive={page.url.pathname.startsWith('/settings')}
							tooltipContent="Einstellungen"
						>
							{#snippet child({ props })}
								<a href="/settings" {...props}>
									<Settings />
									<span>Einstellungen</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<div class="flex items-center gap-2 px-2 text-xs text-muted-foreground">
			<span class="size-1.5 shrink-0 rounded-full bg-green-500"></span>
			<span>Kurse aktuell</span>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
