import { currentBiuroSlug } from './currentBiuro';

export function biuroSearchParam(): string {
  return currentBiuroSlug ? `?biuro=${currentBiuroSlug}` : '';
}

export function biuroPath(pathname: string, hash?: string) {
  return {
    pathname,
    search: biuroSearchParam(),
    hash,
  };
}
