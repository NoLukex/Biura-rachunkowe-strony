import { motion } from 'motion/react';
import { CheckCircle2, FileText, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SITE_CONFIG } from '../constants';
import { Link } from 'react-router-dom';
import { biuroPath } from '../data/biura/biuroRouting';
import { currentBiuro } from '../data/biura/currentBiuro';
import { SERVICE_PRICING } from '../content/pricing';

export function PelnaKsiegowosc() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Pełna księgowość dla spółek w {SITE_CONFIG.cityForms.locative}
          </h1>
          <p className="text-xl text-slate-600">
            Zespół {currentBiuro.displayName} prowadzi pełną księgowość z naciskiem na bezpieczeństwo zarządu,
            przejrzyste raporty i sprawny obieg dokumentów.
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
                <span className="text-slate-700">Spółki z o.o., S.A., Proste Spółki Akcyjne</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                <span className="text-slate-700">Fundacje i Stowarzyszenia</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                <span className="text-slate-700">Podmioty z kapitałem zagranicznym</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                <span className="text-slate-700">Startupy szukające skalowalnej księgowości</span>
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
                <Shield className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Bezpieczeństwo zarządu</h3>
                  <p className="text-sm text-slate-600">Chronimy Cię przed odpowiedzialnością karnoskarbową dzięki rygorystycznym procedurom.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <TrendingUp className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Raporty zarządcze</h3>
                  <p className="text-sm text-slate-600">Co miesiąc widzisz, na czym dokładnie zarabiasz i gdzie uciekają koszty.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <FileText className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Optymalizacja wypłat</h3>
                  <p className="text-sm text-slate-600">Doradzamy, jak legalnie i najtaniej wypłacać środki ze spółki.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Przebieg współpracy</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Dedykowana księgowa', desc: 'Otrzymujesz jednego, stałego opiekuna, który zna Twój biznes.' },
              { step: '02', title: 'Obieg dokumentów', desc: 'Wgrywasz faktury przez aplikację (OCR). Zero papieru.' },
              { step: '03', title: 'Raportowanie', desc: 'Do 15. dnia miesiąca otrzymujesz pełny raport finansowy.' },
              { step: '04', title: 'Podatki', desc: 'Akceptujesz wyliczenia i robisz przelewy podatkowe jednym kliknięciem.' }
            ].map((item, i) => (
              <motion.div
                key={i}
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
          <h2 className="text-3xl font-bold mb-6">Gotowy na zmianę?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Pakiety pełnej księgowości od {SERVICE_PRICING.pelnaKsiegowosc.replace('/mc', ' netto / mc')}.
            Po konsultacji otrzymasz konkretną wycenę i rekomendowany model współpracy.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-14 px-8" asChild>
            <Link to={biuroPath('/', '#kontakt')}>
              Umów darmową wycenę <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
