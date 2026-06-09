import type {
	CreateHoldingDto,
	CreatePortfolioDto,
	Holding,
	Portfolio,
	UpdateHoldingDto,
	UpdatePortfolioDto,
} from '$lib/portfolio/types';

export interface IPortfolioRepository {
	getAll(): Promise<Portfolio[]>;
	getById(id: string): Promise<Portfolio | null>;
	create(data: CreatePortfolioDto): Promise<Portfolio>;
	delete(id: string): Promise<void>;
	update(id: string, data: UpdatePortfolioDto): Promise<Portfolio>;
	addHolding(portfolioId: string, holding: CreateHoldingDto): Promise<Holding>;
	updateHolding(portfolioId: string, holdingId: string, data: UpdateHoldingDto): Promise<Holding>;
	removeHolding(portfolioId: string, holdingId: string): Promise<void>;
}

export class PortfolioRepository implements IPortfolioRepository {
	#load(): Portfolio[] {
		const raw = localStorage.getItem('portfolios');
		return raw ? JSON.parse(raw) : [];
	}

	getAll(): Promise<Portfolio[]> {
		return Promise.resolve(this.#load());
	}

	getById(id: string): Promise<Portfolio | null> {
		throw new Error('Method not implemented.');
	}

	create(data: CreatePortfolioDto): Promise<Portfolio> {
		throw new Error('Method not implemented.');
	}

	delete(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	update(id: string, data: UpdatePortfolioDto): Promise<Portfolio> {
		throw new Error('Method not implemented.');
	}

	addHolding(portfolioId: string, holding: CreateHoldingDto): Promise<Holding> {
		throw new Error('Method not implemented.');
	}

	updateHolding(portfolioId: string, holdingId: string, data: UpdateHoldingDto): Promise<Holding> {
		throw new Error('Method not implemented.');
	}

	removeHolding(portfolioId: string, holdingId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
