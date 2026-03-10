import React from 'react';
import { ShieldCheck, MessageCircle, TrendingUp, Smartphone } from 'lucide-react';
import currentTrainer from '../data/currentTrainer';

const Features: React.FC = () => {
  const defaultFeatures = [
    {
      title: "Plan Szyty na Miarę",
      desc: "Koniec z metodą 'kopiuj-wklej'. Twój plan uwzględnia Twoją anatomię, historię kontuzji i tryb życia."
    },
    {
      title: "Stały Progres",
      desc: "Monitorujemy wyniki co tydzień. Jeśli waga stanie, reagujemy natychmiast. Żadnych przestojów."
    },
    {
      title: "Szybki Kontakt",
      desc: "Masz pytanie o trening lub diete? Dostajesz szybka odpowiedz i jasne wskazowki do wdrozenia."
    },
    {
      title: "Wygodna Aplikacja",
      desc: "Dostęp do planów, filmów instruktażowych i raportów w jednej, intuicyjnej aplikacji."
    }
  ];

  const icons = [ShieldCheck, TrendingUp, MessageCircle, Smartphone];
  const features = (currentTrainer.valueProps && currentTrainer.valueProps.length > 0)
    ? currentTrainer.valueProps
    : defaultFeatures;

  return (
    <section id="features" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-500 font-bold tracking-wider uppercase text-sm">Dlaczego Warto?</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6">
            To nie jest kolejna dieta, <br />którą <span className="underline decoration-brand-500 decoration-4 underline-offset-4">rzucisz po tygodniu</span>.
          </h2>
          <p className="text-zinc-400">
            Dostajesz ode mnie wędkę, rybę i instrukcję jak łowić. Budujemy nawyki, które zostaną z Tobą na lata, nie na lato.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div key={idx} className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-brand-500/50 transition-all hover:bg-zinc-900 group">
                <div className="mb-6 bg-zinc-950 w-16 h-16 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:scale-110 transition-transform shadow-lg shadow-black">
                  <Icon className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
