import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { KnowledgeBase } from '../components/sections/KnowledgeBase';
import { Contact } from '../components/sections/Contact';
import { currentBiuro } from '../data/biura/currentBiuro';
import { biuroPath } from '../data/biura/biuroRouting';

export function Wiedza() {
  return (
    <>
      <section className="pt-28 pb-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <p className="text-sm uppercase tracking-wider text-blue-300 font-semibold mb-3">Wiedza</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5">Praktyczne wskazówki dla klientów {currentBiuro.displayName}</h1>
          <p className="text-lg text-slate-300 mb-8">
            Krótkie materiały o KSeF, VAT i ZUS. Konkrety, które pomagają szybciej podejmować decyzje biznesowe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={biuroPath('/o-nas')}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 hover:border-white/50 px-6 py-3 font-semibold transition-colors"
            >
              Poznaj nasz model obsługi
            </Link>
            <Link
              to={biuroPath('/', '#kontakt')}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3 font-semibold transition-colors"
            >
              Umów konsultację <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      <div id="wiedza">
        <KnowledgeBase />
      </div>
      <Contact />
    </>
  );
}
