/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/sections/Footer';
import { FloatingContact } from './components/ui/FloatingContact';
import { ScrollToHash } from './components/layout/ScrollToHash';
import { RouteMeta } from './components/layout/RouteMeta';
import { SITE_CONFIG } from './constants';
import { Toaster } from 'sonner';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const PelnaKsiegowosc = lazy(() =>
  import('./pages/PelnaKsiegowosc').then((m) => ({ default: m.PelnaKsiegowosc })),
);
const KpirRyczalt = lazy(() => import('./pages/KpirRyczalt').then((m) => ({ default: m.KpirRyczalt })));
const KadryZUS = lazy(() => import('./pages/KadryZUS').then((m) => ({ default: m.KadryZUS })));
const ObslugaKSEF = lazy(() => import('./pages/ObslugaKSEF').then((m) => ({ default: m.ObslugaKSEF })));
const DoradztwoPodatkowe = lazy(() =>
  import('./pages/DoradztwoPodatkowe').then((m) => ({ default: m.DoradztwoPodatkowe })),
);
const Sprawozdania = lazy(() => import('./pages/Sprawozdania').then((m) => ({ default: m.Sprawozdania })));
const ONas = lazy(() => import('./pages/ONas').then((m) => ({ default: m.ONas })));
const Wiedza = lazy(() => import('./pages/Wiedza').then((m) => ({ default: m.Wiedza })));
const PolitykaPrywatnosci = lazy(() =>
  import('./pages/PolitykaPrywatnosci').then((m) => ({ default: m.PolitykaPrywatnosci })),
);
const Regulamin = lazy(() => import('./pages/Regulamin').then((m) => ({ default: m.Regulamin })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

export default function App() {
  useEffect(() => {
    document.body.dataset.siteMode = SITE_CONFIG.siteMode;

    const robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) return;

    robotsMeta.setAttribute(
      'content',
      SITE_CONFIG.isDemo ? 'noindex, nofollow, noarchive' : 'index, follow',
    );
  }, []);

  useEffect(() => {
    const defaultFavicon = '/favicon.svg';
    const logoUrl = SITE_CONFIG.logoUrl?.trim();
    const faviconHref = !logoUrl || logoUrl.includes('logo-biuro-default.svg') ? defaultFavicon : logoUrl;

    const ensureIconLink = (rel: string) => {
      let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      return link;
    };

    const iconLink = ensureIconLink('icon');
    iconLink.href = faviconHref;
    iconLink.type = faviconHref.endsWith('.svg') ? 'image/svg+xml' : 'image/png';

    const appleTouchIconLink = ensureIconLink('apple-touch-icon');
    appleTouchIconLink.href = faviconHref;
  }, []);

  return (
    <Router>
      <ScrollToHash />
      <RouteMeta />
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow"
        >
          Przejdź do treści
        </a>
        <Navbar />
        <main id="main-content">
          <Suspense fallback={<div className="h-24" aria-hidden="true" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pelna-ksiegowosc" element={<PelnaKsiegowosc />} />
              <Route path="/kpir-ryczalt" element={<KpirRyczalt />} />
              <Route path="/kadry-zus" element={<KadryZUS />} />
              <Route path="/obsluga-ksef" element={<ObslugaKSEF />} />
              <Route path="/doradztwo-podatkowe" element={<DoradztwoPodatkowe />} />
              <Route path="/sprawozdania" element={<Sprawozdania />} />
              <Route path="/o-nas" element={<ONas />} />
              <Route path="/wiedza" element={<Wiedza />} />
              <Route path="/polityka-prywatnosci" element={<PolitykaPrywatnosci />} />
              <Route path="/regulamin" element={<Regulamin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
        <FloatingContact />
      </div>
    </Router>
  );
}
