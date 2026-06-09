import type { AssetType, Portfolio } from './types';

/** One colored segment in the allocation bar, representing a single asset type. */
export type AllocSegment = {
	type: AssetType;
	/** Share of total cost basis, 0–1. */
	pct: number;
	color: string;
};

/** Aggregate numbers shown in the portfolio list summary row. */
export type SummaryMetrics = {
	/** Sum of cost basis across all portfolios (FX ignored in Phase 1). */
	totalCostBasis: number;
	portfolioCount: number;
	totalPositions: number;
};

const ASSET_COLORS: Record<AssetType, string> = {
	stock: '#3b82f6',
	etf: '#22c55e',
	crypto: '#eab308',
};

/**
 * Returns the total cost basis of a portfolio (sum of quantity × buyPrice per holding).
 * @param portfolio - The portfolio to calculate the cost basis for.
 * @returns The total cost basis.
 */
export function getCostBasis(portfolio: Portfolio): number {
	return portfolio.holdings.reduce((sum, h) => sum + h.quantity * h.buyPrice, 0);
}

/**
 * Returns allocation bar segments grouped by asset type, ordered by descending share.
 * @param portfolio - The portfolio to calculate allocation segments for.
 * @returns An array of allocation segments.
 */
export function getAllocSegments(portfolio: Portfolio): AllocSegment[] {
	const totals = new Map<AssetType, number>();

	for (const holding of portfolio.holdings) {
		const current = totals.get(holding.assetType) ?? 0;
		totals.set(holding.assetType, current + holding.quantity * holding.buyPrice);
	}

	const total = [...totals.values()].reduce((sum, v) => sum + v, 0);

	if (total === 0) return [];

	return [...totals.entries()]
		.map(([type, value]) => ({ type, pct: value / total, color: ASSET_COLORS[type] }))
		.sort((a, b) => b.pct - a.pct);
}

/**
 * Returns aggregate metrics across all portfolios for the summary row.
 * @param portfolios - The list of portfolios to aggregate.
 * @returns The summary metrics.
 */
export function getSummaryMetrics(portfolios: Portfolio[]): SummaryMetrics {
	return {
		totalCostBasis: portfolios.reduce((sum, p) => sum + getCostBasis(p), 0),
		portfolioCount: portfolios.length,
		totalPositions: portfolios.reduce((sum, p) => sum + p.holdings.length, 0),
	};
}
