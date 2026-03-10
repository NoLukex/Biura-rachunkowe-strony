import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToHash() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.replace('#', '');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    let attempts = 0;
    const maxAttempts = 25;
    let timeoutId: number | undefined;

    const scrollWhenReady = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior, block: 'start' });
        window.setTimeout(() => {
          const url = `${pathname}${search}`;
          window.history.replaceState(window.history.state, '', url);
        }, behavior === 'smooth' ? 350 : 0);
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        return;
      }

      timeoutId = window.setTimeout(scrollWhenReady, 120);
    };

    timeoutId = window.setTimeout(scrollWhenReady, 80);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [pathname, search, hash]);

  return null;
}
