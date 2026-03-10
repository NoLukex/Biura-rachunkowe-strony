import { Link } from 'react-router-dom';
import { 
  Calculator, 
  FileText, 
  Users, 
  FileCheck, 
  Lightbulb, 
  BarChart,
  ArrowRight
} from 'lucide-react';
import { SERVICE_PRICING } from '@/src/content/pricing';
import { currentBiuro } from '@/src/data/biura/currentBiuro';
import { biuroPath } from '@/src/data/biura/biuroRouting';

const defaultServices = [
  {
    icon: Calculator,
    title: 'Pełna księgowość',
    description: 'Kompleksowe prowadzenie ksiąg rachunkowych dla spółek z o.o., S.A. i innych podmiotów.',
    price: SERVICE_PRICING.pelnaKsiegowosc,
    link: '/pelna-ksiegowosc',
    tag: 'Spółki',
  },
  {
    icon: FileText,
    title: 'KPiR / ryczałt',
    description: 'Uproszczona księgowość dla jednoosobowych działalności gospodarczych i spółek cywilnych.',
    price: SERVICE_PRICING.kpirRyczalt,
    link: '/kpir-ryczalt',
    tag: 'JDG',
  },
  {
    icon: Users,
    title: 'Kadry i ZUS',
    description: 'Pełna obsługa kadrowo-płacowa, rozliczenia z ZUS, umowy, urlopy i zwolnienia lekarskie.',
    price: SERVICE_PRICING.kadryZus,
    link: '/kadry-zus',
    tag: 'HR i ZUS',
  },
  {
    icon: FileCheck,
    title: 'Obsługa KSeF (automat)',
    description: 'W pełni zautomatyzowane pobieranie i wysyłanie faktur ustrukturyzowanych z KSeF.',
    price: SERVICE_PRICING.obslugaKsef,
    link: '/obsluga-ksef',
    tag: 'Cyfryzacja',
  },
  {
    icon: Lightbulb,
    title: 'Doradztwo podatkowe',
    description: 'Optymalizacja podatkowa, wybór formy opodatkowania i reprezentacja przed US.',
    price: SERVICE_PRICING.doradztwo,
    link: '/doradztwo-podatkowe',
    tag: 'Decyzje podatkowe',
  },
  {
    icon: BarChart,
    title: 'Sprawozdania',
    description: 'Przygotowywanie rocznych sprawozdań finansowych oraz raportów zarządczych.',
    price: SERVICE_PRICING.sprawozdania,
    link: '/sprawozdania',
    tag: 'Raportowanie',
  },
];

function pickLinkByServiceName(serviceName: string): string {
  const normalized = serviceName.toLowerCase();
  if (normalized.includes('pełna')) return '/pelna-ksiegowosc';
  if (normalized.includes('kpir') || normalized.includes('ryczałt')) return '/kpir-ryczalt';
  if (normalized.includes('kadry') || normalized.includes('płac')) return '/kadry-zus';
  if (normalized.includes('ksef')) return '/obsluga-ksef';
  if (normalized.includes('doradztw') || normalized.includes('podatk')) return '/doradztwo-podatkowe';
  if (normalized.includes('sprawozd')) return '/sprawozdania';
  return '/o-nas';
}

const iconByServiceKeyword = [
  { keyword: 'pełna', icon: Calculator },
  { keyword: 'kpir', icon: FileText },
  { keyword: 'ryczałt', icon: FileText },
  { keyword: 'kadry', icon: Users },
  { keyword: 'płace', icon: Users },
  { keyword: 'ksef', icon: FileCheck },
  { keyword: 'doradztw', icon: Lightbulb },
  { keyword: 'podatk', icon: Lightbulb },
  { keyword: 'sprawozd', icon: BarChart },
];

function pickIconByServiceName(serviceName: string) {
  const normalized = serviceName.toLowerCase();
  const match = iconByServiceKeyword.find((item) => normalized.includes(item.keyword));
  return match ? match.icon : Calculator;
}

function formatServicePrice(value: string): string {
  const raw = (value || '').trim();
  if (!raw) {
    return 'wycena indywidualna';
  }

  if (/wycena/i.test(raw)) {
    return 'wycena indywidualna';
  }

  const match = raw.match(/\d{2,6}(?:[\s.,]\d{1,3})*/);
  if (!match) {
    return 'wycena indywidualna';
  }

  const amount = match[0].replace(/\s+/g, '').replace(',', '.');
  const rounded = Number.isFinite(Number(amount)) ? Math.round(Number(amount)) : null;
  if (!rounded || rounded < 99) {
    return 'wycena indywidualna';
  }
  return `od ${rounded} zł`;
}

function compactDescription(value: string): string {
  const text = (value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= 100) {
    return text;
  }
  const cut = text.slice(0, 100);
  const atSpace = cut.lastIndexOf(' ');
  return `${(atSpace > 70 ? cut.slice(0, atSpace) : cut).replace(/[.,;:\-\s]+$/g, '')}.`;
}

function serviceTag(title: string): string {
  const normalized = title.toLowerCase();
  if (normalized.includes('pełna')) return 'Spółki';
  if (normalized.includes('kpir') || normalized.includes('ryczałt')) return 'JDG';
  if (normalized.includes('kadry') || normalized.includes('zus')) return 'HR i ZUS';
  if (normalized.includes('ksef')) return 'Cyfryzacja';
  if (normalized.includes('doradzt')) return 'Decyzje podatkowe';
  if (normalized.includes('sprawozd')) return 'Raportowanie';
  return 'Obsługa firm';
}

export function Services() {
  const profileServices = currentBiuro.services;
  const services = profileServices.length > 0
    ? profileServices.slice(0, 6).map((service) => ({
        icon: pickIconByServiceName(service.title),
        title: service.title,
        description: compactDescription(service.description),
        price: formatServicePrice(service.priceHint),
        link: pickLinkByServiceName(service.title),
        tag: serviceTag(service.title),
      }))
    : defaultServices;

  return (
    <section className="py-16 md:py-24 bg-slate-50" id="uslugi">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Zakres usług biura
          </h2>
          <p className="text-lg text-slate-600">
            {currentBiuro.displayName} prowadzi obsługę księgową dopasowaną do modelu działalności i etapu rozwoju firmy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              to={biuroPath(service.link)}
              className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
            >
              <div className="h-full bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <service.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <span className="mb-3 inline-flex w-fit rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {service.tag}
                </span>
                <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                    {service.price}
                  </span>
                  <span className="text-blue-600 group-hover:text-blue-700 flex items-center gap-1 text-sm font-medium">
                    Szczegóły <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
