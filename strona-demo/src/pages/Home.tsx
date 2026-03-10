import { lazy, Suspense } from 'react';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { MobileStickyCta } from '../components/layout/MobileStickyCta';

const Testimonials = lazy(() => import('../components/sections/Testimonials').then((m) => ({ default: m.Testimonials })));
const Team = lazy(() => import('../components/sections/Team').then((m) => ({ default: m.Team })));
const ClientPanel = lazy(() => import('../components/sections/ClientPanel').then((m) => ({ default: m.ClientPanel })));
const PricingCalculator = lazy(() =>
  import('../components/sections/PricingCalculator').then((m) => ({ default: m.PricingCalculator })),
);
const PricingPlans = lazy(() => import('../components/sections/PricingPlans').then((m) => ({ default: m.PricingPlans })));
const TrustSignals = lazy(() => import('../components/sections/TrustSignals').then((m) => ({ default: m.TrustSignals })));
const Faq = lazy(() => import('../components/sections/Faq').then((m) => ({ default: m.Faq })));
const Contact = lazy(() => import('../components/sections/Contact').then((m) => ({ default: m.Contact })));

function SectionFallback() {
  return <div className="h-40 bg-slate-50" aria-hidden="true" />;
}

export function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <Services />
        <PricingCalculator />
        <PricingPlans />
        <Team />
        <ClientPanel />
        <Testimonials />
        <TrustSignals />
        <Contact />
        <Faq />
      </Suspense>
      <MobileStickyCta />
    </>
  );
}
