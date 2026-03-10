import { motion } from 'motion/react';
import { CheckCircle2, Smartphone, Zap, Bell, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SITE_CONFIG } from '../constants';
import { Link } from 'react-router-dom';
import { SERVICE_PRICING } from '../content/pricing';
import { biuroPath } from '../data/biura/biuroRouting';
import { currentBiuro } from '../data/biura/currentBiuro';

export function KpirRyczalt() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            KPiR i ryczałt dla JDG w {SITE_CONFIG.cityForms.locative}
          </h1>
          <p className="text-xl text-slate-600">
            {currentBiuro.displayName} prowadzi księgowość JDG z naciskiem na prosty obieg dokumentów,
            spokojne rozliczenia ZUS i przewidywalne podatki.
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
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                <span className="text-slate-700">Programiści B2B (IT)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                <span className="text-slate-700">Lekarze i branża medyczna</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                <span className="text-slate-700">E-commerce i mały handel</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                <span className="text-slate-700">Freelancerzy i usługi profesjonalne</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Główne korzyści</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Zap className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Optymalizacja podatkowa</h3>
                  <p className="text-sm text-slate-600">Dobieramy formę opodatkowania tak, abyś płacił jak najmniej (ryczałt vs podatek liniowy).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Smartphone className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Aplikacja mobilna</h3>
                  <p className="text-sm text-slate-600">Wystawiasz faktury i skanujesz koszty prosto z telefonu.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Bell className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Powiadomienia SMS</h3>
                  <p className="text-sm text-slate-600">Zawsze wiesz, ile i kiedy zapłacić ZUS i podatki. Zero niespodzianek.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Przebieg współpracy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Robisz zdjęcie faktury', desc: 'Wgrywasz dokumenty przez aplikację mobilną 24/7.' },
              { step: '02', title: 'My księgujemy', desc: 'Nasz zespół weryfikuje i księguje dokumenty w systemie.' },
              { step: '03', title: 'Dostajesz SMS', desc: 'Otrzymujesz powiadomienie z kwotą podatku i numerem konta US.' }
            ].map((item, i) => (
              <motion.div
                key={i}
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
          <h2 className="text-3xl font-bold mb-6">Zacznij oszczędzać czas i pieniądze</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Obsługa KPiR / ryczałtu od {SERVICE_PRICING.kpirRyczalt.replace('/mc', ' netto / mc')}.
            Sprawdź pełny zakres usług i umów konsultację.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-14 px-8" asChild>
            <Link to={biuroPath('/', '#uslugi')}>
              Sprawdź pakiety <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
