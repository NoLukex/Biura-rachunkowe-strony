import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import TrafficEssentials from './components/TrafficEssentials';
import Transformations from './components/Transformations';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import MobileStickyCta from './components/MobileStickyCta';
import QuickWinBlocks from './components/QuickWinBlocks';
import { scrollToSection } from './utils/scrollToSection';
import currentTrainer from './data/currentTrainer';
import { getQuickWinConfig } from './data/quickWinConfig';

const setMetaContent = (selector: string, value: string) => {
  if (typeof document === 'undefined') {
    return;
  }
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) {
    el.setAttribute('content', value);
  }
};

const setLinkHref = (selector: string, value: string) => {
  if (typeof document === 'undefined') {
    return;
  }
  const el = document.querySelector<HTMLLinkElement>(selector);
  if (el) {
    el.setAttribute('href', value);
  }
};

const cleanUrl = (value: string) => {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value;
  }
};

const buildSeoDescription = () => {
  const lead = `${currentTrainer.brandName} - trener personalny`; 
  const city = currentTrainer.city ? `w ${currentTrainer.city}` : '';
  const tagline = currentTrainer.brandTagline || 'trening 1:1 i online';
  return `${lead} ${city}. ${tagline}. Umow konsultacje i zacznij trening.`.replace(/\s+/g, ' ').trim();
};

function App() {
  const quickWin = getQuickWinConfig(currentTrainer.slug);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-400', currentTrainer.theme.accentSoft || '#b2e23a');
    root.style.setProperty('--brand-500', currentTrainer.theme.accent || '#94c918');
    root.style.setProperty('--brand-600', currentTrainer.theme.accentDark || '#73a10f');
    root.style.setProperty('--app-bg', currentTrainer.theme.bg || '#09090b');
    root.style.setProperty('--app-bg-soft', currentTrainer.theme.bgSoft || '#18181b');
    root.style.setProperty('--app-surface', currentTrainer.theme.surface || '#18181b');
    root.style.setProperty('--app-surface-alt', currentTrainer.theme.surfaceAlt || '#27272a');
    root.style.setProperty('--app-border', currentTrainer.theme.border || '#3f3f46');
    root.style.setProperty('--app-muted', currentTrainer.theme.textMuted || '#a1a1aa');

    const pageTitle = `${currentTrainer.brandName} | Trener personalny ${currentTrainer.city}`;
    const pageDescription = buildSeoDescription();
    const canonical = typeof window !== 'undefined'
      ? cleanUrl(window.location.href)
      : (currentTrainer.website || 'https://twojadomena.pl/');

    document.title = pageTitle;
    setMetaContent('meta[name="description"]', pageDescription);
    setMetaContent('meta[property="og:title"]', pageTitle);
    setMetaContent('meta[property="og:description"]', pageDescription);
    setMetaContent('meta[property="og:url"]', canonical);
    setMetaContent('meta[name="twitter:title"]', pageTitle);
    setMetaContent('meta[name="twitter:description"]', pageDescription);
    setLinkHref('link[rel="canonical"]', canonical);

    const localBusinessSchema = document.getElementById('local-business-schema');
    if (localBusinessSchema) {
      localBusinessSchema.textContent = JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: currentTrainer.brandName,
          description: pageDescription,
          address: {
            '@type': 'PostalAddress',
            addressLocality: currentTrainer.city || 'Bydgoszcz',
            addressCountry: 'PL',
          },
          areaServed: [currentTrainer.city || 'Bydgoszcz', 'Polska'],
          telephone: currentTrainer.phone || undefined,
          email: currentTrainer.email || undefined,
          url: canonical,
        },
        null,
        0,
      );
    }

    const scrollFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        return;
      }

      window.setTimeout(() => {
        scrollToSection(hash);
      }, 0);
    };

    scrollFromHash();
    window.addEventListener('hashchange', scrollFromHash);
    return () => window.removeEventListener('hashchange', scrollFromHash);
  }, [currentTrainer]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-brand-500 selection:text-black" style={{ backgroundColor: 'var(--app-bg)' }}>
      <a
        href="#main-content"
        className="skip-link fixed left-4 top-4 z-[60] rounded-md bg-brand-500 px-4 py-2 font-bold text-zinc-950"
      >
        Przejdz do tresci
      </a>
      <Navbar />
      
      <main id="main-content" className="pb-24 md:pb-0">
        <Hero />
        <QuickWinBlocks placement="after-hero" />
        <About />
        <Features />
        <TrafficEssentials />
        <Transformations />
        <Testimonials />
        {!quickWin.hideBasePricing && <Pricing />}
        <QuickWinBlocks placement="after-pricing" />
        <FAQ />
        <QuickWinBlocks placement="before-contact" />
        <ContactForm />
      </main>

      <Footer />
      <MobileStickyCta />
    </div>
  );
}

export default App;
