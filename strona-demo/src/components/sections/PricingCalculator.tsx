import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { trackEvent } from '@/src/lib/analytics';

type BusinessType = 'jdg' | 'spolka' | 'other';

function formatPln(value: number) {
  return new Intl.NumberFormat('pl-PL').format(Math.round(value));
}

export function PricingCalculator() {
  const [businessType, setBusinessType] = useState<BusinessType>('jdg');
  const [documents, setDocuments] = useState(35);
  const [employees, setEmployees] = useState(0);
  const [vat, setVat] = useState(true);
  const [payroll, setPayroll] = useState(false);
  const [advisory, setAdvisory] = useState(false);

  const quote = useMemo(() => {
    let base = 0;
    if (businessType === 'jdg') base += 320;
    if (businessType === 'spolka') base += 1100;
    if (businessType === 'other') base += 650;

    base += Math.min(documents, 30) * 6;
    if (documents > 30) base += (documents - 30) * 8;
    if (documents > 100) base += (documents - 100) * 2;

    if (vat) base += 180;
    if (payroll) base += 140 + employees * 75;
    else if (employees > 0) base += employees * 65;
    if (advisory) base += 220;

    const min = base * 0.9;
    const max = base * 1.1;

    const tier = base < 900 ? 'Start' : base < 1800 ? 'Biznes' : 'Premium';

    return { min, max, tier };
  }, [businessType, documents, employees, vat, payroll, advisory]);

  const saveLeadHint = () => {
    const summary = `Proszę o dokładną wycenę. Forma: ${businessType.toUpperCase()}, dokumenty: ${documents}/mies., pracownicy: ${employees}, VAT: ${vat ? 'tak' : 'nie'}, kadry: ${payroll ? 'tak' : 'nie'}, doradztwo: ${advisory ? 'tak' : 'nie'}. Kalkulator pokazał: ${formatPln(quote.min)}-${formatPln(quote.max)} zł netto/mies.`;
    sessionStorage.setItem('pricing_calculator_hint', summary);
    trackEvent('pricing_calculator_cta_click', {
      business_type: businessType,
      documents,
      employees,
      vat,
      payroll,
      advisory,
      min_price: Math.round(quote.min),
      max_price: Math.round(quote.max),
      tier: quote.tier,
    });
  };

  return (
    <section id="kalkulator" className="py-16 md:py-24 bg-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-5 border border-blue-100">
            <Calculator className="h-4 w-4" />
            Kalkulator orientacyjnej ceny
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Sprawdź cenę księgowości w 30 sekund
          </h2>
          <p className="text-lg text-slate-600">
            Wynik jest orientacyjny i pomaga szybko ocenić budżet. Dokładną wycenę przygotujemy po konsultacji.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Forma działalności</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-slate-800"
              >
                <option value="jdg">JDG (KPiR / ryczałt)</option>
                <option value="spolka">Spółka z o.o. / pełna księgowość</option>
                <option value="other">Inna forma</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Liczba dokumentów miesięcznie: {documents}</label>
              <input
                type="range"
                min={5}
                max={250}
                step={5}
                value={documents}
                onChange={(e) => setDocuments(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Liczba pracowników / zleceniobiorców</label>
              <input
                type="number"
                min={0}
                max={200}
                value={employees}
                onChange={(e) => setEmployees(Math.max(0, Number(e.target.value) || 0))}
                className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-slate-800"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                <input type="checkbox" checked={vat} onChange={(e) => setVat(e.target.checked)} />
                Rozliczenie VAT
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                <input type="checkbox" checked={payroll} onChange={(e) => setPayroll(e.target.checked)} />
                Kadry i płace
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 sm:col-span-2">
                <input type="checkbox" checked={advisory} onChange={(e) => setAdvisory(e.target.checked)} />
                Doradztwo podatkowe / konsultacje miesięczne
              </label>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800"
          >
            <p className="text-sm uppercase tracking-wider text-blue-300 mb-3">Szacowany abonament miesięczny</p>
            <div className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              {formatPln(quote.min)} - {formatPln(quote.max)} zł
            </div>
            <p className="text-slate-300 mb-6">netto / miesiąc • pakiet {quote.tier}</p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-blue-400 mt-0.5" />
                Obsługa księgowa i przypomnienia o terminach
              </div>
              <div className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-blue-400 mt-0.5" />
                Panel klienta i bieżący podgląd rozliczeń
              </div>
              <div className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-blue-400 mt-0.5" />
                Wdrożenie pod KSeF i wsparcie przy zmianach
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <a href="#kontakt" onClick={saveLeadHint}>
                Otrzymaj wycenę i plan startu <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <p className="text-xs text-slate-400 mt-4 text-center">
              To kalkulacja orientacyjna. Finalna cena zależy od zakresu i specyfiki działalności.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
