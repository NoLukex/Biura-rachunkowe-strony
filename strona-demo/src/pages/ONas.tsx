import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HowItWorks } from '../components/sections/HowItWorks';
import { CaseStudies } from '../components/sections/CaseStudies';
import { Guarantees } from '../components/sections/Guarantees';
import { PricingPlans } from '../components/sections/PricingPlans';
import { currentBiuro } from '../data/biura/currentBiuro';
import { biuroPath } from '../data/biura/biuroRouting';

export function ONas() {
  return (
    <>
      <section className="pt-28 pb-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <p className="text-sm uppercase tracking-wider text-blue-300 font-semibold mb-3">O nas</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5">Model współpracy {currentBiuro.displayName}</h1>
          <p className="text-lg text-slate-300 mb-8">
            Zobacz, jak przebiega obsługa operacyjna, komunikacja oraz przekazywanie dokumentów w codziennej współpracy.
          </p>
          <Link
            to={biuroPath('/', '#kontakt')}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3 font-semibold transition-colors"
          >
            Umów konsultację <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      <HowItWorks />
      <CaseStudies />
      <PricingPlans />
      <Guarantees />
    </>
  );
}
