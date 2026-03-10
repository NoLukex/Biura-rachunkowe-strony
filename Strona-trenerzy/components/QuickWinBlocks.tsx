import React from 'react';
import {
  CalendarClock,
  ClipboardCheck,
  Compass,
  HeartPulse,
  LineChart,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import currentTrainer from '../data/currentTrainer';
import { getQuickWinConfig } from '../data/quickWinConfig';
import { saveLeadIntent } from '../utils/leadIntent';
import { scrollToSection } from '../utils/scrollToSection';

type Placement = 'after-hero' | 'after-pricing' | 'before-contact';

interface QuickWinBlocksProps {
  placement: Placement;
}

const fallbackPlans = [
  { name: 'Start', subtitle: 'Bezpieczny start wspolpracy', price: '299 zl' },
  { name: 'Prowadzenie 1:1', subtitle: 'Regularny progres i opieka', price: '599 zl' },
  { name: 'Pakiet premium', subtitle: 'Prowadzenie z priorytetem', price: '999 zl' },
];

const painRecommendations: Record<string, { label: string; goal: string; consultationType: string }> = {
  ledzwia: {
    label: 'Kregoslup i przeciazenia ledzwi',
    goal: 'Powrot do treningu bez bolu plecow',
    consultationType: 'Konsultacja ruchowa 30 min',
  },
  kolano: {
    label: 'Bol kolana przy przysiadach lub bieganiu',
    goal: 'Stabilizacja kolana i bezpieczny powrot',
    consultationType: 'Konsultacja techniczna 30 min',
  },
  bark: {
    label: 'Dyskomfort barku przy wyciskaniu',
    goal: 'Odbudowa zakresu i sily barku',
    consultationType: 'Konsultacja mobilnosc + sila 30 min',
  },
  inny: {
    label: 'Inny problem lub kilka objawow',
    goal: 'Pelna diagnostyka startowa',
    consultationType: 'Konsultacja kompleksowa 45 min',
  },
};

const weekPlan = [
  {
    title: 'Tydzien 1',
    desc: 'Wywiad, pomiary startowe i plan dzialania pod cel.',
  },
  {
    title: 'Tydzien 2',
    desc: 'Nauka techniki i pierwsza korekta obciazen.',
  },
  {
    title: 'Tydzien 3',
    desc: 'Stabilizacja nawykow i regularny check-in.',
  },
  {
    title: 'Tydzien 4',
    desc: 'Podsumowanie progresu i plan na kolejny miesiac.',
  },
];

const QuickWinBlocks: React.FC<QuickWinBlocksProps> = ({ placement }) => {
  const quickWin = getQuickWinConfig(currentTrainer.slug);
  const plans =
    currentTrainer.pricingPlans && currentTrainer.pricingPlans.length > 0
      ? currentTrainer.pricingPlans.slice(0, 3).map((plan) => ({
          name: plan.name,
          subtitle: plan.subtitle,
          price: plan.price,
        }))
      : fallbackPlans;

  const [painArea, setPainArea] = React.useState<keyof typeof painRecommendations>('ledzwia');
  const [seasonGoal, setSeasonGoal] = React.useState('Poprawa wyniku');
  const [seasonWindow, setSeasonWindow] = React.useState('12+ tygodni');
  const [seasonFrequency, setSeasonFrequency] = React.useState('4 treningi / tydzien');

  const recommendation = painRecommendations[painArea];

  const goToContact = (intent?: {
    goal?: string;
    timeline?: string;
    budget?: string;
    consultationType?: string;
    track?: string;
    note?: string;
    source?: string;
  }) => {
    if (intent) {
      saveLeadIntent(intent);
    }
    scrollToSection('contact', { updateHash: true });
  };

  const consultationSlots = React.useMemo(() => {
    const now = new Date();
    const timeMatrix = [
      ['08:30', '12:00', '18:30'],
      ['09:00', '13:30', '19:00'],
      ['07:45', '11:15', '17:45'],
      ['08:00', '12:45', '18:00'],
      ['09:30', '14:00', '19:15'],
    ];

    return Array.from({ length: 5 }).map((_, idx) => {
      const date = new Date(now);
      date.setDate(now.getDate() + idx + 1);

      return {
        day: date.toLocaleDateString('pl-PL', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
        }),
        times: timeMatrix[idx % timeMatrix.length],
      };
    });
  }, []);

  const seasonRecommendation = React.useMemo(() => {
    let score = 0;

    if (seasonGoal === 'Poprawa wyniku') {
      score += 2;
    }
    if (seasonGoal === 'Start kontrolny') {
      score += 1;
    }

    if (seasonWindow === '12+ tygodni') {
      score += 2;
    } else if (seasonWindow === '8-12 tygodni') {
      score += 1;
    }

    if (seasonFrequency === '4 treningi / tydzien' || seasonFrequency === '5 treningow / tydzien') {
      score += 2;
    } else if (seasonFrequency === '3 treningi / tydzien') {
      score += 1;
    }

    if (score <= 2) {
      return plans[0] || fallbackPlans[0];
    }
    if (score <= 4) {
      return plans[1] || fallbackPlans[1];
    }
    return plans[2] || fallbackPlans[2];
  }, [plans, seasonFrequency, seasonGoal, seasonWindow]);

  if (placement === 'after-hero') {
    return (
      <>
        {quickWin.showFirst30Days && (
          <section className="py-14 bg-zinc-900 border-y border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Plan wdrozenia</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Pierwsze 30 dni wspolpracy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {weekPlan.map((item) => (
                  <article key={item.title} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {quickWin.showOutcomeTriplet && (
          <section className="py-14 bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                <div>
                  <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Szybki profil</p>
                  <h2 className="text-3xl md:text-4xl font-black text-white mt-2">3 efekty, na ktorych pracujemy</h2>
                </div>
                <button
                  onClick={() =>
                    goToContact({
                      note: 'Prosze o oddzwonienie jeszcze dzisiaj.',
                      consultationType: 'Szybka konsultacja telefoniczna',
                      source: 'quick-win-outcomes',
                    })
                  }
                  className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-black min-h-[44px] cursor-pointer"
                >
                  Oddzwonie dzis
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: '-6 do -12 kg', label: 'Realny progres sylwetki' },
                  { value: '+25%', label: 'Wiecej sily i sprawnosci' },
                  { value: '4-8 tyg.', label: 'Pierwsze wyrazne efekty' },
                ].map((item) => (
                  <article key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-2xl font-black text-white">{item.value}</p>
                    <p className="text-zinc-400 text-sm mt-1">{item.label}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {quickWin.showGoalPathsSection && (
          <section className="py-14 bg-zinc-900 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Sciezki celu</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Wybierz swoj tor wspolpracy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Redukcja i forma',
                    desc: 'Dla osob, ktore chca schudnac i poprawic sylwetke.',
                    goal: 'Redukcja i poprawa sylwetki',
                  },
                  {
                    title: 'Sila i masa',
                    desc: 'Dla osob, ktore chca budowac sile i miesnie etapowo.',
                    goal: 'Budowa masy miesniowej i sily',
                  },
                  {
                    title: 'Powrot do sprawnosci',
                    desc: 'Dla osob po przerwie, przeciazeniu lub z bolem.',
                    goal: 'Powrot do sprawnosci i regularnosci',
                  },
                ].map((path) => (
                  <article key={path.title} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col">
                    <h3 className="text-white font-bold text-lg mb-2">{path.title}</h3>
                    <p className="text-zinc-400 text-sm mb-4 flex-1">{path.desc}</p>
                    <button
                      onClick={() =>
                        goToContact({
                          goal: path.goal,
                          timeline: 'Start w 2 tygodnie',
                          source: 'quick-win-goal-path',
                        })
                      }
                      className="w-full rounded-lg border border-zinc-700 py-2.5 text-white font-bold hover:border-brand-500 hover:text-brand-400 transition-colors min-h-[44px] cursor-pointer"
                    >
                      Wybieram te sciezke
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {quickWin.showFirstTrainingSection && (
          <section className="py-14 bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Pierwszy trening 1:1</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Jak wyglada pierwsza sesja</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: 'Krok 1', desc: 'Krotki wywiad o celu i ograniczeniach.' },
                  { title: 'Krok 2', desc: 'Ocena ruchu i test wzorcow podstawowych.' },
                  { title: 'Krok 3', desc: 'Pierwszy trening dopasowany do poziomu.' },
                  { title: 'Krok 4', desc: 'Plan na tydzien + jasne kolejne kroki.' },
                ].map((item) => (
                  <article key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </>
    );
  }

  if (placement === 'after-pricing') {
    return (
      <>
        {quickWin.showPricingCaseStudies && (
          <section className="py-14 bg-zinc-900 border-y border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Case studies</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">3 przyklady obok pakietow</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { result: '-9 kg', time: '12 tygodni', context: 'Redukcja + utrzymanie energii' },
                  { result: '+18 kg', time: '16 tygodni', context: 'Sila i masa bez przestojow' },
                  { result: 'Bez bolu', time: '8 tygodni', context: 'Powrot po przeciazeniu kregoslupa' },
                ].map((item) => (
                  <article key={`${item.result}-${item.time}`} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                    <p className="text-2xl text-white font-black">{item.result}</p>
                    <p className="text-brand-400 text-sm font-semibold">{item.time}</p>
                    <p className="text-zinc-400 text-sm mt-2">{item.context}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {quickWin.showSplitCaseStudies && (
          <section className="py-14 bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Podwojne case studies</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Osobno: bol/kontuzja i sylwetka</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Sciezka bol / kontuzja</h3>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    <li>- Bark po urazie: 10 tygodni do treningu bez bolu.</li>
                    <li>- Odcinek ledzwiowy: redukcja objawow o ~70% w 6 tygodni.</li>
                    <li>- Kolano: bezpieczny powrot do biegania po 8 tygodniach.</li>
                  </ul>
                </article>
                <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Sciezka sylwetka</h3>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    <li>- Redukcja -11 kg i utrzymanie efektu po 4 miesiacach.</li>
                    <li>- Budowa +5 kg miesni przy regularnych check-inach.</li>
                    <li>- Rekompozycja i poprawa sily w 12 tygodni.</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>
        )}

        {quickWin.showProgram90Days && (
          <section className="py-14 bg-zinc-900 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Program 90 dni</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Plan + tygodniowy check-in</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: <Compass className="text-brand-500" size={18} />,
                    title: 'Dni 1-30',
                    desc: 'Fundament: nawyki, technika, regularnosc i rytm tygodnia.',
                  },
                  {
                    icon: <LineChart className="text-brand-500" size={18} />,
                    title: 'Dni 31-60',
                    desc: 'Progres: zwiekszenie obciazen i korekty pod realny wynik.',
                  },
                  {
                    icon: <Trophy className="text-brand-500" size={18} />,
                    title: 'Dni 61-90',
                    desc: 'Utrwalenie: stabilny system i plan kontynuacji po 90 dniach.',
                  },
                ].map((phase) => (
                  <article key={phase.title} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {phase.icon}
                      <h3 className="text-white font-bold">{phase.title}</h3>
                    </div>
                    <p className="text-zinc-400 text-sm">{phase.desc}</p>
                  </article>
                ))}
              </div>
              <div className="mt-5 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 flex items-start gap-2">
                <ClipboardCheck size={16} className="text-brand-500 mt-0.5" />
                Co tydzien: check-in, raport i aktualizacja planu na kolejny mikrocykl.
              </div>
            </div>
          </section>
        )}

        {quickWin.showSeasonCalculator && (
          <section className="py-14 bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Kalkulator sezonu</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Dobierz pakiet pod cel sezonowy</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-2">Cel sezonu</label>
                    <select
                      value={seasonGoal}
                      onChange={(e) => setSeasonGoal(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white"
                    >
                      <option>Poprawa wyniku</option>
                      <option>Ukonczenie dystansu</option>
                      <option>Start kontrolny</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-2">Horyzont</label>
                    <select
                      value={seasonWindow}
                      onChange={(e) => setSeasonWindow(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white"
                    >
                      <option>4-8 tygodni</option>
                      <option>8-12 tygodni</option>
                      <option>12+ tygodni</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-2">Treningi / tydzien</label>
                    <select
                      value={seasonFrequency}
                      onChange={(e) => setSeasonFrequency(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white"
                    >
                      <option>2 treningi / tydzien</option>
                      <option>3 treningi / tydzien</option>
                      <option>4 treningi / tydzien</option>
                      <option>5 treningow / tydzien</option>
                    </select>
                  </div>
                </article>

                <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
                  <p className="text-xs uppercase font-bold text-brand-400 tracking-wide mb-2">Rekomendowany pakiet</p>
                  <h3 className="text-2xl font-black text-white">{seasonRecommendation.name}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{seasonRecommendation.subtitle}</p>
                  <p className="text-white text-3xl font-black mt-4">{seasonRecommendation.price}</p>
                  <p className="text-zinc-400 text-sm mt-2">Kalkulacja orientacyjna, finalny plan po konsultacji.</p>
                  <button
                    onClick={() =>
                      goToContact({
                        goal: seasonGoal,
                        consultationType: 'Konsultacja 60 min',
                        timeline: seasonWindow,
                        source: 'quick-win-season-calculator',
                      })
                    }
                    className="mt-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-black py-3 min-h-[44px] cursor-pointer"
                  >
                    Umow konsultacje 60 min
                  </button>
                </article>
              </div>
            </div>
          </section>
        )}

        {quickWin.showBlogCtas && (
          <section className="py-14 bg-zinc-900 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Blog - konsultacja</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">CTA podpiete pod wpisy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Staw skokowy po urazie',
                    excerpt: 'Jak wrocic do obciazen bez ryzyka nawrotu.',
                    goal: 'Powrot po urazie stawu skokowego',
                  },
                  {
                    title: 'Bol barku na treningu',
                    excerpt: '3 kroki do bezpiecznej progresji i lepszej techniki.',
                    goal: 'Konsultacja bolu barku',
                  },
                  {
                    title: 'Przeciazone plecy po pracy',
                    excerpt: 'Szybki plan oddech + mobilnosc + sila.',
                    goal: 'Plan na bol plecow i stabilizacje',
                  },
                ].map((article) => (
                  <article key={article.title} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col">
                    <h3 className="text-white font-bold mb-2">{article.title}</h3>
                    <p className="text-zinc-400 text-sm mb-4 flex-1">{article.excerpt}</p>
                    <button
                      onClick={() =>
                        goToContact({
                          goal: article.goal,
                          consultationType: 'Konsultacja po wpisie blogowym',
                          source: 'quick-win-blog-cta',
                        })
                      }
                      className="rounded-lg border border-zinc-700 py-2.5 text-white font-bold hover:border-brand-500 hover:text-brand-400 transition-colors min-h-[44px] cursor-pointer"
                    >
                      Umow konsultacje po tym wpisie
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </>
    );
  }

  if (placement === 'before-contact') {
    return (
      <>
        {quickWin.showProgramFit && (
          <section className="py-14 bg-zinc-900 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Dla kogo ktory program</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Dopasuj pakiet do etapu, na ktorym jestes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan, idx) => (
                  <article key={plan.name} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3 text-brand-400">
                      {idx === 0 ? <Target size={16} /> : idx === 1 ? <Zap size={16} /> : <Trophy size={16} />}
                      <p className="text-xs uppercase font-bold tracking-wide">{plan.price}</p>
                    </div>
                    <h3 className="text-white font-bold mb-2">{plan.name}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{plan.subtitle}</p>
                    <button
                      onClick={() =>
                        goToContact({
                          goal: plan.name,
                          source: 'quick-win-program-fit',
                        })
                      }
                      className="rounded-lg border border-zinc-700 py-2.5 px-4 text-white font-bold hover:border-brand-500 hover:text-brand-400 transition-colors min-h-[44px] cursor-pointer"
                    >
                      Ten pakiet jest dla mnie
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {quickWin.showPainSurvey && (
          <section className="py-14 bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Ankieta bolu</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Dobierz najblizszy typ konsultacji</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6">
                <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <p className="text-zinc-300 text-sm mb-4">Wybierz obszar, ktory teraz najbardziej przeszkadza Ci w treningu:</p>
                  <div className="space-y-3">
                    {(Object.keys(painRecommendations) as Array<keyof typeof painRecommendations>).map((key) => (
                      <label key={key} className="flex items-start gap-3 text-sm text-zinc-300">
                        <input
                          type="radio"
                          name="pain-area"
                          checked={painArea === key}
                          onChange={() => setPainArea(key)}
                          className="mt-1"
                        />
                        {painRecommendations[key].label}
                      </label>
                    ))}
                  </div>
                </article>

                <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
                  <div className="flex items-center gap-2 text-brand-400 mb-3">
                    <HeartPulse size={16} />
                    <p className="text-xs uppercase font-bold tracking-wide">Rekomendacja</p>
                  </div>
                  <h3 className="text-white font-bold text-xl">{recommendation.consultationType}</h3>
                  <p className="text-zinc-400 text-sm mt-2">Cel: {recommendation.goal}</p>
                  <button
                    onClick={() =>
                      goToContact({
                        goal: recommendation.goal,
                        consultationType: recommendation.consultationType,
                        source: 'quick-win-pain-survey',
                      })
                    }
                    className="mt-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-black py-3 min-h-[44px] cursor-pointer"
                  >
                    Wybieram te konsultacje
                  </button>
                </article>
              </div>
            </div>
          </section>
        )}

        {quickWin.showConsultationCalendar && (
          <section className="py-14 bg-zinc-900 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <p className="text-brand-400 text-xs uppercase font-bold tracking-wide">Kalendarz konsultacji</p>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Najblizsze wolne terminy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {consultationSlots.map((slot) => (
                  <article key={slot.day} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <p className="text-white font-bold text-sm">{slot.day}</p>
                    <div className="mt-3 space-y-2">
                      {slot.times.map((time) => (
                        <button
                          key={`${slot.day}-${time}`}
                          onClick={() =>
                            goToContact({
                              consultationType: `Konsultacja ${time}`,
                              timeline: `Termin: ${slot.day} ${time}`,
                              source: 'quick-win-calendar',
                            })
                          }
                          className="w-full rounded-md border border-zinc-700 py-1.5 text-xs text-zinc-200 hover:border-brand-500 hover:text-brand-400 transition-colors min-h-[44px] cursor-pointer"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-4 text-sm text-zinc-400 flex items-center gap-2">
                <CalendarClock size={15} className="text-brand-400" />
                Po wyborze terminu wypelnij formularz, a potwierdzenie wraca tego samego dnia.
              </div>
            </div>
          </section>
        )}
      </>
    );
  }

  return null;
};

export default QuickWinBlocks;
