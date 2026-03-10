import { motion } from 'motion/react';
import { Users, CalendarClock, ShieldCheck, FileSignature, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { biuroPath } from '../data/biura/biuroRouting';
import { currentBiuro } from '../data/biura/currentBiuro';
import { SERVICE_PRICING } from '../content/pricing';

const workflow = [
  {
    step: '01',
    title: 'Onboarding pracowników',
    desc: 'Przygotowujemy wzory dokumentów, umowy i listę kontrolną danych kadrowych.',
  },
  {
    step: '02',
    title: 'Miesięczne rozliczenia',
    desc: 'Naliczamy listy płac, składki ZUS i deklaracje zgodnie z aktualnymi przepisami.',
  },
  {
    step: '03',
    title: 'Obsługa zmian',
    desc: 'Prowadzimy aneksy, urlopy, zwolnienia i zakończenia umów bez chaosu administracyjnego.',
  },
];

export function KadryZUS() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Kadry i ZUS bez błędów i opóźnień</h1>
          <p className="text-xl text-slate-600">
            {currentBiuro.displayName} przejmuje pełną obsługę kadrowo-płacową,
            abyś mógł skupić się na zespole i rozwoju firmy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <h2 className="text-2xl font-bold mb-6">Dla kogo jest ta usługa?</h2>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-start gap-3"><Users className="w-6 h-6 text-blue-600 shrink-0" /> Firmy zatrudniające od 1 do 100+ osób</li>
              <li className="flex items-start gap-3"><Users className="w-6 h-6 text-blue-600 shrink-0" /> Spółki i JDG z rosnącym zespołem</li>
              <li className="flex items-start gap-3"><Users className="w-6 h-6 text-blue-600 shrink-0" /> Pracodawcy potrzebujący stabilnego procesu HR</li>
              <li className="flex items-start gap-3"><Users className="w-6 h-6 text-blue-600 shrink-0" /> Firmy, które chcą ograniczyć ryzyko kar i korekt</li>
            </ul>
          </motion.div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Co zyskujesz?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <CalendarClock className="w-8 h-8 text-blue-700 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Terminowość i porządek</h3>
                  <p className="text-sm text-slate-600">Stałe harmonogramy i przypomnienia eliminują pośpiech przy rozliczeniach.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <ShieldCheck className="w-8 h-8 text-blue-700 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Bezpieczna zgodność</h3>
                  <p className="text-sm text-slate-600">Aktualne procedury i kontrola dokumentów minimalizują ryzyko błędów.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <FileSignature className="w-8 h-8 text-blue-700 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Pełna dokumentacja</h3>
                  <p className="text-sm text-slate-600">Umowy, aneksy i ewidencje masz zawsze uporządkowane i gotowe do wglądu.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Jak wygląda współpraca?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {workflow.map((item, i) => (
              <motion.div
                key={item.step}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 bg-white rounded-xl border border-slate-100 shadow-sm"
              >
                <div className="text-4xl font-black text-blue-100 mb-4">{item.step}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Usprawnij kadry i ZUS od najbliższego miesiąca</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Pakiety kadrowo-płacowe od {SERVICE_PRICING.kadryZus}.
            Otrzymasz indywidualną wycenę i harmonogram wdrożenia procesu.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-14 px-8" asChild>
            <Link to={biuroPath('/', '#kontakt')}>
              Poproś o wycenę kadrową <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
