import type { Portfolio } from '$lib/portfolio/types';

export type ListState =
	| { status: 'loading' }
	| { status: 'error'; error: Error }
	| { status: 'empty' }
	| { status: 'data'; portfolios: Portfolio[] };
