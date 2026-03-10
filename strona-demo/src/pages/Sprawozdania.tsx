import { motion } from 'motion/react';
import { BarChart3, FileSpreadsheet, PieChart, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { biuroPath } from '../data/biura/biuroRouting';
import { currentBiuro } from '../data/biura/currentBiuro';
import { SERVICE_PRICING } from '../content/pricing';

export function Sprawozdania() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sprawozdania finansowe i raporty zarządcze</h1>
          <p className="text-xl text-slate-600">
            {currentBiuro.displayName} przygotowuje sprawozdania roczne i raporty,
            które pomagają podejmować lepsze decyzje biznesowe.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-20">
          {[
            { icon: FileSpreadsheet, title: 'Sprawozdanie roczne', desc: 'Bilans, rachunek zysków i strat oraz noty objaśniające.' },
            { icon: PieChart, title: 'Analiza rentowności', desc: 'Które obszary biznesu realnie budują marżę.' },
            { icon: BarChart3, title: 'Raporty okresowe', desc: 'Miesięczne i kwartalne podsumowania dla zarządu.' },
            { icon: Briefcase, title: 'Wsparcie zarządu', desc: 'Interpretacja danych i rekomendacje działań.' },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <item.icon className="w-8 h-8 text-blue-600 mb-4" />
              <h2 className="font-bold mb-2">{item.title}</h2>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Kiedy warto zamówić raport?</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>• Przed rozmową z bankiem lub inwestorem</li>
              <li>• Przed zamknięciem roku i planowaniem budżetu</li>
              <li>• Przy gwałtownym wzroście kosztów</li>
              <li>• Gdy chcesz porównać efektywność działów lub usług</li>
            </ul>
          </motion.div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-6">Zakres współpracy</h2>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">1) Ustalamy cel raportu i wymagany poziom szczegółowości.</p>
              <p className="text-sm text-slate-600">2) Zbieramy dane i przygotowujemy wersję roboczą.</p>
              <p className="text-sm text-slate-600">3) Omawiamy wnioski i rekomendacje na spotkaniu zarządczym.</p>
            </div>
          </motion.div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Podejmuj decyzje na podstawie danych</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Sprawozdania i raporty od {SERVICE_PRICING.sprawozdania}.
            Zakres i poziom szczegółowości dopasowujemy do potrzeb zarządu.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-14 px-8" asChild>
            <Link to={biuroPath('/', '#kontakt')}>
              Zamów wycenę raportu <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
