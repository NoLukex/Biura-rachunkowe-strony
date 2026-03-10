import React from 'react';
import { Check } from 'lucide-react';
import { scrollToSection } from '../utils/scrollToSection';
import currentTrainer from '../data/currentTrainer';
import { getQuickWinConfig } from '../data/quickWinConfig';
import { saveLeadIntent } from '../utils/leadIntent';

const Pricing: React.FC = () => {
  const quickWin = getQuickWinConfig(currentTrainer.slug);
  const defaultPlans = [
    {
      name: 'Plan Treningowy',
      subtitle: 'Dla tych, ktorzy potrzebuja tylko mapy.',
      price: '199 zl',
      period: '/ msc',
      features: [
        'Indywidualny plan treningowy',
        'Atlas cwiczen wideo',
        'Raz w miesiacu korekta planu',
      ],
      ctaLabel: 'Wybieram plan treningowy',
    },
    {
      name: 'Opieka 1:1 Online',
      subtitle: 'Kompleksowe prowadzenie dla najlepszych efektow.',
      price: '349 zl',
      period: '/ msc',
      features: [
        'Wszystko z pakietu podstawowego',
        'Plan zywieniowy / makroskladniki',
        'Cotygodniowe raporty i analiza',
        'Kontakt WhatsApp w godzinach 8-20',
      ],
      ctaLabel: 'Wybieram opieke 1:1',
      featured: true,
    },
    {
      name: 'VIP Hybryda',
      subtitle: 'Polaczenie online z treningami personalnymi.',
      price: '999 zl',
      period: '/ msc',
      features: [
        'Pelna opieka online',
        '4 treningi personalne (Bydgoszcz)',
        'Analiza skladu ciala co miesiac',
        'Wspolne zakupy / edukacja',
      ],
      ctaLabel: 'Wybieram pakiet VIP',
    },
  ];

  const plans = (currentTrainer.pricingPlans && currentTrainer.pricingPlans.length > 0)
    ? currentTrainer.pricingPlans
    : defaultPlans;

  const handleScrollToContact = (e: React.MouseEvent, planName: string) => {
    e.preventDefault();
    saveLeadIntent({
      goal: planName,
      source: 'pricing-cta',
    });
    scrollToSection('contact', { updateHash: true });
  };

  return (
    <section id="pricing" className="py-24 scroll-mt-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Wybierz Swoją Drogę</h2>
          <p className="text-zinc-400">Proste zasady. Żadnych ukrytych kosztów. Inwestujesz w siebie.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => {
            const featured = Boolean(plan.featured);
            return (
              <div
                key={`${plan.name}-${idx}`}
                className={featured
                  ? 'p-8 rounded-2xl bg-zinc-900 border-2 border-brand-500 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-brand-900/20'
                  : 'p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col'}
              >
                {featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-zinc-950 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    Bestseller
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-zinc-500 text-sm mb-6">{plan.subtitle}</p>
                <div className="text-3xl font-black text-white mb-6">
                  {plan.price} <span className="text-sm font-normal text-zinc-500">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={`${plan.name}-${feature}`}
                      className={featured ? 'flex items-center gap-3 text-white text-sm font-medium' : 'flex items-center gap-3 text-zinc-300 text-sm'}
                    >
                      <Check size={16} className="text-brand-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={(e) => handleScrollToContact(e, plan.name)}
                  className={featured
                    ? 'w-full py-3 bg-brand-500 text-zinc-950 rounded-lg text-center font-bold hover:bg-brand-400 transition-colors cursor-pointer min-h-[44px]'
                    : 'w-full py-3 border border-zinc-700 text-white rounded-lg text-center font-bold hover:bg-zinc-800 transition-colors cursor-pointer min-h-[44px]'}
                >
                  {quickWin.singleContactCta ? 'Umow konsultacje' : plan.ctaLabel}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
