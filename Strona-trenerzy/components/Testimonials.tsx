import React, { useMemo } from 'react';
import { Quote } from 'lucide-react';
import currentTrainer from '../data/currentTrainer';

type Review = {
  name: string;
  role: string;
  text: string;
  image: string;
};

const reviewSets: Record<string, Review[]> = {
  'trening medyczny / fizjo': [
    {
      name: 'Marta K.',
      role: 'Praca siedzaca',
      text: 'Po kilku tygodniach bol odcinka ledzwiowego wyraznie sie zmniejszyl, a trening przestal mnie przeciazac. W koncu mam plan, ktory jest bezpieczny i skuteczny.',
      image: 'https://picsum.photos/100/100?random=101',
    },
    {
      name: 'Piotr W.',
      role: 'Kierowca',
      text: 'Najlepiej dziala polaczenie mobilnosci i cwiczen silowych. Wszystko jest dobrze wytlumaczone, wiec wiem jak trenowac bez ryzyka nawrotu problemu.',
      image: 'https://picsum.photos/100/100?random=102',
    },
    {
      name: 'Karolina S.',
      role: 'Mama 2 dzieci',
      text: 'Po kontuzji balam sie wrocic do cwiczen. Tu dostalam spokojny progres i duze wsparcie, dzieki czemu znow czuje sie pewnie na treningu.',
      image: 'https://picsum.photos/100/100?random=103',
    },
  ],
  'metamorfoza sylwetki': [
    {
      name: 'Natalia P.',
      role: 'Specjalistka HR',
      text: 'Program byl prosty i konkretny. Efekty na sylwetce zobaczylam po kilku tygodniach, a najwieksza roznice zrobila regularna korekta planu.',
      image: 'https://picsum.photos/100/100?random=104',
    },
    {
      name: 'Adam R.',
      role: 'Przedsiebiorca',
      text: 'Wczesniej zaczynalem i szybko odpuszczalem. Teraz mam system, ktory moge utrzymac przy pracy i rodzinie. Waga spada, sila rosnie.',
      image: 'https://picsum.photos/100/100?random=105',
    },
    {
      name: 'Monika L.',
      role: 'Ksiegowa',
      text: 'Dieta bez skrajnosci i trening dopasowany do tygodnia. To pierwsza wspolpraca, gdzie zmiany zostaly ze mna na dluzej.',
      image: 'https://picsum.photos/100/100?random=106',
    },
  ],
  'sport wytrzymalosciowy': [
    {
      name: 'Pawel T.',
      role: 'Biegacz amator',
      text: 'Plan pod zawody i regularny monitoring daly mi najlepszy sezon od lat. Bez przetrenowania i bez chaosu w tygodniu startowym.',
      image: 'https://picsum.photos/100/100?random=107',
    },
    {
      name: 'Aneta M.',
      role: 'Triathlon',
      text: 'Duzy plus za laczenie treningu silowego i wytrzymalosci. Wreszcie wszystko bylo spojne, a progres mierzony z tygodnia na tydzien.',
      image: 'https://picsum.photos/100/100?random=108',
    },
    {
      name: 'Krzysztof D.',
      role: 'MTB',
      text: 'Szczegolowy plan i szybkie korekty uratowaly moj sezon. Wynik sportowy poprawil sie, ale wazniejsze, ze czulem kontrole nad procesem.',
      image: 'https://picsum.photos/100/100?random=109',
    },
  ],
  'trening + odzywianie': [
    {
      name: 'Kasia N.',
      role: 'Praca biurowa',
      text: 'Najbardziej cenie to, ze trening i odzywianie sa w jednym planie. Nie musze zgadywac co robic, bo wszystko mam rozpisane krok po kroku.',
      image: 'https://picsum.photos/100/100?random=110',
    },
    {
      name: 'Damian K.',
      role: 'Manager',
      text: 'Wspolpraca pomogla mi odzyskac energie i regularnosc. Efekt jest widoczny na sylwetce, ale tez w codziennym samopoczuciu.',
      image: 'https://picsum.photos/100/100?random=111',
    },
    {
      name: 'Ewa S.',
      role: 'Mama + praca zmianowa',
      text: 'Plan byl realistyczny i dopasowany do mojego tygodnia. To zadecydowalo, ze nie odpuscilam po pierwszym trudniejszym miesiacu.',
      image: 'https://picsum.photos/100/100?random=112',
    },
  ],
  'trening personalny 1:1': [
    {
      name: 'Marta K.',
      role: 'Pracownik biurowy',
      text: 'Nigdy nie sadzilam, ze utrzymam regularnosc. Podejscie 1:1 jest elastyczne i konkretne, dlatego progres jest widoczny z miesiaca na miesiac.',
      image: 'https://picsum.photos/100/100?random=113',
    },
    {
      name: 'Piotr W.',
      role: 'Programista',
      text: 'Plan zostal dopasowany do mojego trybu pracy i ograniczonego czasu. Treningi sa konkretne, a kontakt szybki i rzeczowy.',
      image: 'https://picsum.photos/100/100?random=114',
    },
    {
      name: 'Karolina S.',
      role: 'Mloda mama',
      text: 'Krotkie, dobrze zaplanowane treningi daly lepszy efekt niz moje poprzednie proby. Czuje sie mocniejsza i mam wiecej energii.',
      image: 'https://picsum.photos/100/100?random=115',
    },
  ],
};

const Testimonials: React.FC = () => {
  const reviews = useMemo(() => {
    const key = currentTrainer.nicheLabel || 'trening personalny 1:1';
    return reviewSets[key] || reviewSets['trening personalny 1:1'];
  }, [currentTrainer.nicheLabel]);

  return (
    <section className="py-24 bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-16 text-center">
          Opinie podopiecznych po wspolpracy <br />
          <span className="text-brand-500">z {currentTrainer.fullName}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 relative hover:-translate-y-2 transition-transform duration-300">
              <Quote className="absolute top-8 right-8 text-zinc-800 w-12 h-12" />
              <p className="text-zinc-300 mb-8 leading-relaxed relative z-10">"{review.text}"</p>

              <div className="flex items-center gap-4">
                <img src={review.image} alt={review.name} loading="lazy" decoding="async" className="w-12 h-12 rounded-full border border-zinc-700" />
                <div>
                  <h4 className="text-white font-bold">{review.name}</h4>
                  <p className="text-zinc-500 text-xs">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
