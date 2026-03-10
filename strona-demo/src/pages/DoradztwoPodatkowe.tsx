import { motion } from 'motion/react';
import { Lightbulb, Scale, PiggyBank, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { biuroPath } from '../data/biura/biuroRouting';
import { currentBiuro } from '../data/biura/currentBiuro';
import { SERVICE_PRICING } from '../content/pricing';

const cases = [
  {
    name: 'Zmiana formy opodatkowania',
    result: 'Niższe obciążenie roczne i większa przewidywalność przepływów.',
  },
  {
    name: 'Porządkowanie kosztów',
    result: 'Lepsza struktura księgowa i mniej korekt przy zamknięciu miesiąca.',
  },
  {
    name: 'Plan podatkowy dla wspólników',
    result: 'Jasne zasady wypłat i bezpieczne decyzje strategiczne.',
  },
];

export function DoradztwoPodatkowe() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Doradztwo podatkowe dla decyzji, które mają znaczenie</h1>
          <p className="text-xl text-slate-600">
            Zespół {currentBiuro.displayName} analizuje Twoją sytuację,
            proponuje warianty i pomaga wybrać bezpieczne rozwiązanie.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Obszary doradztwa</h2>
            <div className="space-y-5">
              <div className="flex gap-3"><Lightbulb className="w-6 h-6 text-blue-700 mt-0.5" /><p className="text-sm text-slate-700">Wybór optymalnej formy opodatkowania.</p></div>
              <div className="flex gap-3"><Scale className="w-6 h-6 text-blue-700 mt-0.5" /><p className="text-sm text-slate-700">Analiza ryzyk i konsekwencji podatkowych decyzji biznesowych.</p></div>
              <div className="flex gap-3"><PiggyBank className="w-6 h-6 text-blue-700 mt-0.5" /><p className="text-sm text-slate-700">Planowanie wypłat, kosztów i przepływów finansowych.</p></div>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-6">Przykładowe scenariusze</h2>
            <div className="space-y-4">
              {cases.map((item) => (
                <div key={item.name} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-slate-600">{item.result}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Jak pracujemy nad rekomendacją?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Diagnoza', desc: 'Krótki wywiad i analiza obecnych rozliczeń.' },
              { step: '02', title: 'Warianty', desc: 'Przedstawiamy 2-3 możliwe rozwiązania wraz z ryzykiem.' },
              { step: '03', title: 'Decyzja', desc: 'Wybierasz scenariusz, a my przygotowujemy plan wdrożenia.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 bg-white rounded-xl border border-slate-100 shadow-sm text-center"
              >
                <div className="text-4xl font-black text-blue-100 mb-4">{item.step}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Skonsultuj decyzję, zanim zapłacisz więcej</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Spotkanie doradcze od {SERVICE_PRICING.doradztwo}.
            Dla stałych klientów przygotowujemy preferencyjne pakiety konsultacyjne.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-14 px-8" asChild>
            <Link to={biuroPath('/', '#kontakt')}>
              Umów konsultację podatkową <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
