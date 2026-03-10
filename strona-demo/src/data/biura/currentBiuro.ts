import { biuroProfiles, defaultProfileSlug } from './biuroProfiles';
import type { BiuroProfile } from './biuroProfile';

const getSlugFromEnv = (): string | null => {
  const envSlug = (import.meta.env.VITE_CLIENT_SLUG || '').trim().toLowerCase();
  if (envSlug && biuroProfiles[envSlug]) {
    return envSlug;
  }
  return null;
};

const getSlugFromQueryOrPath = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const querySlug = (params.get('biuro') || params.get('slug') || '').trim().toLowerCase();
  if (querySlug && biuroProfiles[querySlug]) {
    return querySlug;
  }

  const pathMatch = window.location.pathname.match(/^\/b\/([a-z0-9-]+)/i);
  if (pathMatch) {
    const fromPath = pathMatch[1].toLowerCase();
    if (biuroProfiles[fromPath]) {
      return fromPath;
    }
  }

  return null;
};

const getSlugFromHostname = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const host = window.location.hostname.toLowerCase();
  const firstLabel = host.split('.')[0];
  if (biuroProfiles[firstLabel]) {
    return firstLabel;
  }

  return null;
};

const resolvedSlug = getSlugFromEnv() || getSlugFromQueryOrPath() || getSlugFromHostname();

export const currentBiuroSlug = resolvedSlug || defaultProfileSlug;
export const currentBiuro: BiuroProfile = biuroProfiles[currentBiuroSlug] || biuroProfiles[defaultProfileSlug];

export function getBiuroBySlug(slug: string): BiuroProfile | null {
  const normalized = (slug || '').trim().toLowerCase();
  return biuroProfiles[normalized] || null;
}
