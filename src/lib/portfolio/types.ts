/** Asset class of a holding. */
export type AssetType = 'stock' | 'etf' | 'crypto';

/** A single investment position within a portfolio. */
export type Holding = {
	id: string;
	symbol: string;
	name: string;
	assetType: AssetType;
	quantity: number;
	buyPrice: number;
	currency: string;
	buyDate: string;
	exchange?: string;
	isin?: string;
};

/** An investment portfolio containing one or more holdings. */
export type Portfolio = {
	id: string;
	name: string;
	description?: string;
	tags?: string[];
	currency: string;
	createdAt: string;
	updatedAt: string;
	holdings: Holding[];
};

export type CreatePortfolioDto = Pick<Portfolio, 'name' | 'currency'> &
	Partial<Pick<Portfolio, 'description' | 'tags'>>;

export type UpdatePortfolioDto = Partial<
	Pick<Portfolio, 'name' | 'currency' | 'description' | 'tags'>
>;

export type CreateHoldingDto = Omit<Holding, 'id'>;

export type UpdateHoldingDto = Partial<Omit<Holding, 'id'>>;
