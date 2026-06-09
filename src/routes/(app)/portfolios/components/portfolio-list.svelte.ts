import { usePortfolioRepo } from '$lib/portfolio/repository.svelte';
import type { ListState } from './portfolio-list-state';

/**
 * Custom hook to manage the state of the portfolio list.
 * @returns An object containing the current state of the portfolio list.
 */
export const createPortfolioList = () => {
	const repo = usePortfolioRepo();

	let state = $state<ListState>({ status: 'loading' });

	async function load() {
		try {
			const portfolios = await repo.getAll();
			state = portfolios.length === 0 ? { status: 'empty' } : { status: 'data', portfolios };
		} catch (err) {
			state = {
				status: 'error',
				error:
					err instanceof Error ? err : new Error('Unknown error occurred while loading portfolios'),
			};
		}
	}

	$effect(() => {
		load();
	});

	return {
		get state() {
			return state;
		},
	};
};
