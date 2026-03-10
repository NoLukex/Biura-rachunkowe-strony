import { motion } from 'motion/react';
import { Bot, FileCheck2, Shield, Workflow, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { biuroPath } from '../data/biura/biuroRouting';
import { currentBiuro } from '../data/biura/currentBiuro';
import { SERVICE_PRICING } from '../content/pricing';

export function ObslugaKSEF() {
  const ksefPricingLabel = SERVICE_PRICING.obslugaKsef.toLowerCase().includes('cenie')
    ? SERVICE_PRICING.obslugaKsef
    : `od ${SERVICE_PRICING.obslugaKsef}`;

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Obsługa KSeF z automatyzacją dokumentów</h1>
          <p className="text-xl text-slate-600">
            {currentBiuro.displayName} wspiera integrację procesów z KSeF,
            automatyzuje przepływ faktur i pilnuje zgodności operacyjnej.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Bot,
              title: 'Automatyczny obieg',
              desc: 'Faktury pobierają się i porządkują automatycznie bez ręcznego przepisywania.',
            },
            {
              icon: FileCheck2,
              title: 'Kontrola poprawności',
              desc: 'Weryfikujemy statusy dokumentów i wychwytujemy błędy przed rozliczeniem.',
            },
            {
              icon: Shield,
              title: 'Bezpieczeństwo danych',
              desc: 'Stosujemy bezpieczne kanały, uprawnienia i procedury dostępu do faktur.',
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm"
            >
              <item.icon className="w-8 h-8 text-blue-600 mb-4" />
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 text-white p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Zakres wdrożenia</h2>
            <ul className="space-y-3 text-slate-200 text-sm">
              <li>• Konfiguracja ról i dostępów dla zespołu</li>
              <li>• Integracja z systemem fakturowania i księgowością</li>
              <li>• Procedura wyjątków i awarii w obiegu dokumentów</li>
              <li>• Szkolenie użytkowników i instrukcja operacyjna</li>
            </ul>
          </motion.div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Model współpracy</h2>
            <div className="space-y-5">
              <div className="flex gap-3">
                <Workflow className="w-6 h-6 text-blue-700 mt-0.5" />
                <p className="text-sm text-slate-700">Start od audytu procesu i mapy obiegu faktur.</p>
              </div>
              <div className="flex gap-3">
                <Workflow className="w-6 h-6 text-blue-700 mt-0.5" />
                <p className="text-sm text-slate-700">Wdrożenie etapami bez zatrzymywania bieżącej pracy.</p>
              </div>
              <div className="flex gap-3">
                <Workflow className="w-6 h-6 text-blue-700 mt-0.5" />
                <p className="text-sm text-slate-700">Stały monitoring i wsparcie po uruchomieniu.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Przygotuj firmę na KSeF bez stresu</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Wycena i zakres: {ksefPricingLabel}.
            Otrzymasz plan działań i kosztorys dopasowany do liczby dokumentów.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-14 px-8" asChild>
            <Link to={biuroPath('/', '#kontakt')}>
              Zamów audyt KSeF <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
