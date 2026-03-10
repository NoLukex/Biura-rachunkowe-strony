interface ScrollOptions {
  updateHash?: boolean;
}

const getNavbarOffset = (): number => {
  const nav = document.querySelector('nav');
  if (!(nav instanceof HTMLElement)) {
    return 104;
  }

  return nav.offsetHeight + 16;
};

const getSectionExtraOffset = (targetId: string): number => {
  if (targetId === 'transformations') {
    return -120;
  }

  return 0;
};

const getScrollBehavior = (): ScrollBehavior => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'auto';
  }

  return 'smooth';
};

export const scrollToSection = (targetId: string, options: ScrollOptions = {}): void => {
  if (!targetId) {
    return;
  }

  if (targetId === 'top') {
    window.scrollTo({ top: 0, behavior: getScrollBehavior() });
    if (options.updateHash) {
      window.history.pushState(null, '', '#');
    }
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  const offset = getNavbarOffset() + getSectionExtraOffset(targetId);
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: getScrollBehavior(),
  });

  if (options.updateHash) {
    window.history.pushState(null, '', `#${targetId}`);
  }
};
