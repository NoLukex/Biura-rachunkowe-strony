import React from 'react';
import { ChevronRight, Star, Activity } from 'lucide-react';
import { scrollToSection as scrollToTarget } from '../utils/scrollToSection';
import currentTrainer from '../data/currentTrainer';
import { getQuickWinConfig } from '../data/quickWinConfig';
import { saveLeadIntent } from '../utils/leadIntent';

const Hero: React.FC = () => {
  const quickWin = getQuickWinConfig(currentTrainer.slug);
  const [quizChoice, setQuizChoice] = React.useState<'Redukcja' | 'Sila i masa' | 'Powrot do sprawnosci'>('Redukcja');

  const pricingPreview =
    currentTrainer.pricingPlans && currentTrainer.pricingPlans.length > 0
      ? currentTrainer.pricingPlans.slice(0, 3)
      : [
          { name: 'Start', price: '299 zl', subtitle: 'Pierwszy krok' },
          { name: 'Prowadzenie 1:1', price: '599 zl', subtitle: 'Regularna opieka' },
          { name: 'Premium', price: '999 zl', subtitle: 'Pelna opieka' },
        ];

  const quickQuizMap = {
    Redukcja: {
      recommendation: pricingPreview[0] || pricingPreview[1],
      goal: 'Redukcja tkanki tluszczowej',
      timeline: 'Start w 2 tygodnie',
    },
    'Sila i masa': {
      recommendation: pricingPreview[1] || pricingPreview[0],
      goal: 'Budowa masy i sily',
      timeline: 'Start w 2-4 tygodnie',
    },
    'Powrot do sprawnosci': {
      recommendation: pricingPreview[2] || pricingPreview[1],
      goal: 'Powrot po przerwie lub przeciagzeniu',
      timeline: 'Start od konsultacji',
    },
  };

  const handleScrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToTarget(id, { updateHash: true });
  };

  const handleContactIntent = (
    e: React.MouseEvent<HTMLElement>,
    intent: {
      goal?: string;
      timeline?: string;
      budget?: string;
      consultationType?: string;
      track?: string;
      note?: string;
      source?: string;
    },
  ) => {
    e.preventDefault();
    saveLeadIntent(intent);
    scrollToTarget('contact', { updateHash: true });
  };

  const renderHeroActions = () => {
    if (quickWin.heroMode === 'split-goals') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <a
            href="#contact"
            onClick={(e) =>
              handleContactIntent(e, {
                goal: 'Chce schudnac',
                track: 'redukcja',
                source: 'quick-win-split-cta',
              })
            }
            className="px-6 py-4 bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-base rounded-xl transition-all hover:scale-[1.02] flex items-center justify-between gap-2"
          >
            Schudnij z planem
            <ChevronRight className="w-5 h-5" />
          </a>
          <a
            href="#contact"
            onClick={(e) =>
              handleContactIntent(e, {
                goal: 'Pozbycie sie bolu plecow',
                consultationType: 'Konsultacja plecy i ruch',
                track: 'bol-plecow',
                source: 'quick-win-split-cta',
              })
            }
            className="px-6 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-base rounded-xl transition-all flex items-center justify-between gap-2"
          >
            Pozbadz sie bolu plecow
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      );
    }

    if (quickWin.heroMode === 'quiz') {
      const selected = quickQuizMap[quizChoice];
      return (
        <div className="space-y-4 mt-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide font-bold text-zinc-500 mb-3">Quiz: wybierz typ treningu</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.keys(quickQuizMap) as Array<keyof typeof quickQuizMap>).map((choice) => (
                <button
                  key={choice}
                  onClick={() => setQuizChoice(choice)}
                  className={
                    choice === quizChoice
                      ? 'rounded-lg py-2.5 px-3 text-sm font-bold bg-brand-500 text-zinc-950 min-h-[44px] cursor-pointer'
                      : 'rounded-lg py-2.5 px-3 text-sm font-bold border border-zinc-700 text-zinc-300 hover:border-brand-500 hover:text-brand-400 min-h-[44px] cursor-pointer'
                  }
                >
                  {choice}
                </button>
              ))}
            </div>
            <p className="text-sm text-zinc-400 mt-3">
              Rekomendacja: <span className="text-white font-semibold">{selected.recommendation?.name || 'Pakiet 1:1'}</span>
            </p>
          </div>
          <a
            href="#contact"
            onClick={(e) =>
              handleContactIntent(e, {
                goal: selected.goal,
                timeline: selected.timeline,
                source: 'quick-win-quiz',
              })
            }
            className="px-8 py-4 bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-lg rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 group"
          >
            Wybieram dopasowany plan
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      );
    }

    if (quickWin.heroMode === 'dual-entry') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col">
            <p className="text-sm font-bold text-white mb-1">Sciezka sport / kickboxing</p>
            <p className="text-zinc-400 text-sm mb-3 flex-1">Rozwoj mocy, dynamiki i przygotowania pod trening kontaktowy.</p>
            <button
              onClick={(e) =>
                handleContactIntent(e, {
                  goal: 'Sport i kickboxing',
                  track: 'sport-kickboxing',
                  source: 'quick-win-dual-entry',
                })
              }
              className="rounded-lg border border-zinc-700 py-2.5 text-white font-bold hover:border-brand-500 hover:text-brand-400"
            >
              Wchodze w sport
            </button>
          </article>
          <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col">
            <p className="text-sm font-bold text-white mb-1">Sciezka forma / sylwetka</p>
            <p className="text-zinc-400 text-sm mb-3 flex-1">Redukcja, modelowanie sylwetki i poprawa codziennej sprawnosci.</p>
            <button
              onClick={(e) =>
                handleContactIntent(e, {
                  goal: 'Forma i sylwetka',
                  track: 'forma-sylwetka',
                  source: 'quick-win-dual-entry',
                })
              }
              className="rounded-lg border border-zinc-700 py-2.5 text-white font-bold hover:border-brand-500 hover:text-brand-400"
            >
              Wchodze w forme
            </button>
          </article>
        </div>
      );
    }

    if (quickWin.heroMode === 'promise-packages') {
      return (
        <div id={quickWin.hideBasePricing ? 'pricing' : undefined} className="space-y-4 mt-2 scroll-mt-24">
          <p className="text-sm text-zinc-400">Jeden cel: stabilny progres. Wybierz pakiet i przejdz do jednego formularza kontaktu.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {pricingPreview.slice(0, 3).map((plan) => (
              <div key={plan.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-white font-bold text-sm">{plan.name}</p>
                <p className="text-zinc-400 text-xs mt-1">{plan.subtitle}</p>
                <p className="text-brand-400 font-bold text-sm mt-2">{plan.price}</p>
              </div>
            ))}
          </div>
          <a
            href="#contact"
            onClick={(e) =>
              handleContactIntent(e, {
                consultationType: 'Konsultacja startowa',
                source: 'quick-win-promise-packages',
              })
            }
            className="px-8 py-4 bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-lg rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 group"
          >
            Umow konsultacje
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      );
    }

    if (quickWin.heroMode === 'goal-paths') {
      const paths = [
        { name: 'Redukcja', goal: 'Redukcja tkanki tluszczowej' },
        { name: 'Masa i sila', goal: 'Budowa masy miesniowej' },
        { name: 'Powrot do formy', goal: 'Powrot po przerwie' },
      ];

      return (
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {paths.map((path) => (
              <button
                key={path.name}
                onClick={(e) =>
                  handleContactIntent(e, {
                    goal: path.goal,
                    source: 'quick-win-goal-path-hero',
                  })
                }
                className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-left hover:border-brand-500 transition-colors min-h-[44px] cursor-pointer"
              >
                <p className="text-white font-bold text-sm">{path.name}</p>
                <p className="text-zinc-400 text-xs mt-1">Wybierz i przejdz do formularza.</p>
              </button>
            ))}
          </div>
          <a
            href="#contact"
            onClick={(e) => handleContactIntent(e, { source: 'quick-win-goal-path-hero-main' })}
            className="px-8 py-4 bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-lg rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 group"
          >
            Przejdz do formularza kwalifikacyjnego
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      );
    }

    if (quickWin.heroMode === 'single-cta') {
      return (
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            href="#contact"
            onClick={(e) => handleContactIntent(e, { source: 'quick-win-single-cta' })}
            className="px-8 py-4 bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-lg rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 group"
          >
            Umow konsultacje
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <a
          href="#contact"
          onClick={(e) => handleScrollToSection(e, 'contact')}
          className="px-8 py-4 bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-lg rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 group"
        >
          Bezplatna Konsultacja
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href="#start"
          onClick={(e) => handleScrollToSection(e, 'start')}
          className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Odbierz Plan Startowy
        </a>
      </div>
    );
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" id="home">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900 via-zinc-950 to-transparent opacity-50 z-0 hidden lg:block" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl z-0 animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* Text Content */}
        <div className="flex flex-col justify-center gap-8">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full w-fit">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
              Przyjmuje nowych podopiecznych
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
            {currentTrainer.heroTitleTop} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
              {currentTrainer.heroTitleAccent}
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
            {currentTrainer.heroText}
          </p>

          {renderHeroActions()}

          <div className="flex items-center gap-6 mt-8 pt-8 border-t border-zinc-800/50">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">{currentTrainer.rating.toFixed(1)}/5</span>
              <span className="text-sm text-zinc-500 uppercase tracking-wider">Ocena profilu</span>
            </div>
            <div className="w-px h-12 bg-zinc-800"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">{currentTrainer.city}</span>
              <span className="text-sm text-zinc-500 uppercase tracking-wider">Lokalizacja</span>
            </div>
            <div className="w-px h-12 bg-zinc-800"></div>
            <div className="flex items-center gap-1">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/40/40?random=${i+10}`} loading="lazy" decoding="async" className="w-10 h-10 rounded-full border-2 border-zinc-950" alt="Klient" />
                  ))}
               </div>
               <div className="flex flex-col ml-3">
                  <div className="flex text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                  <span className="text-xs font-bold text-white">4.9/5 Opinii</span>
               </div>
            </div>
          </div>
        </div>

        {/* Hero Image / Visual */}
        <div className="relative hidden lg:flex justify-center items-end h-full">
            <div className="relative z-10 w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-brand-900/20 group">
                <img 
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
                    alt="Trainer in action" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                />
                
                {/* Floating Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-md p-4 rounded-xl border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-500 rounded-lg">
                            <Activity size={16} className="text-black fill-black" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-400">Twój Cel</p>
                            <p className="font-bold text-sm">Wymarzona Sylwetka</p>
                        </div>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-brand-500 h-full w-[85%] rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-zinc-500">Realizacja planu</span>
                        <span className="text-[10px] text-brand-400 font-bold">85%</span>
                    </div>
                </div>
            </div>

            {/* Decorative Grid */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-none border border-zinc-800 opacity-20" style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
