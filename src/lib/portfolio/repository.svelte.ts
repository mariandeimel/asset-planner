import { getContext, setContext } from 'svelte';
import type { IPortfolioRepository } from './repository';

const REPO_KEY = Symbol('portfolio-repo');

export function setPortfolioRepo(repo: IPortfolioRepository) {
	setContext(REPO_KEY, repo);
}

export function usePortfolioRepo(): IPortfolioRepository {
	return getContext(REPO_KEY);
}
