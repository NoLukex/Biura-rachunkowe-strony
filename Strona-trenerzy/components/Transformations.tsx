import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Star,
  TrendingUp,
  Trophy,
  Zap,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Activity,
  Heart,
} from 'lucide-react';
import { scrollToSection } from '../utils/scrollToSection';
import currentTrainer from '../data/currentTrainer';

type StorySeed = {
  name: string;
  age: number;
  result: string;
  time: string;
  type: string;
  quote: string;
};

type Story = StorySeed & {
  id: number;
  image: string;
  icon: React.ReactNode;
};

const storySets: Record<string, StorySeed[]> = {
  'trening medyczny / fizjo': [
    {
      name: 'Robert',
      age: 39,
      result: '-80% bolu',
      time: '8 tygodni',
      type: 'Kregoslup',
      quote:
        'Po pracy przy biurku bol odcinka ledzwiowego byl codziennoscia. Po wdrozeniu planu ruchu i mobilnosci moge cwiczyc bez strachu o nawrot objawow.',
    },
    {
      name: 'Kasia',
      age: 44,
      result: 'Pelny zakres',
      time: '10 tygodni',
      type: 'Kolano',
      quote:
        'Wczesniej kazde wejscie po schodach konczylo sie dyskomfortem. Dzis chodze bez bolu i regularnie trenuje silowo.',
    },
    {
      name: 'Marcin',
      age: 31,
      result: '+12 kg sila',
      time: '4 miesiace',
      type: 'Powrot po kontuzji',
      quote:
        'Po urazie barku balem sie wyciskania. Plan etapowy i kontrola techniki pozwolily wrocic do mocnych treningow.',
    },
    {
      name: 'Iza',
      age: 35,
      result: 'Lepsza postura',
      time: '6 tygodni',
      type: 'Ruch bez bolu',
      quote:
        'Najbardziej zaskoczylo mnie to, jak drobne korekty techniki zmienily codzienne funkcjonowanie i samopoczucie.',
    },
    {
      name: 'Damian',
      age: 29,
      result: 'Bez nawrotow',
      time: '3 miesiace',
      type: 'Stabilizacja',
      quote:
        'Zamiast przypadkowych cwiczen dostalem jasna kolejnosc i obciazenia. Wreszcie czulem, ze wiem co i po co robie.',
    },
    {
      name: 'Ewa',
      age: 47,
      result: '-9 kg',
      time: '5 miesiecy',
      type: 'Forma + zdrowie',
      quote:
        'Najpierw priorytetem byl bol i sprawnosc, potem sylwetka. Takie podejscie pozwolilo utrzymac regularnosc.',
    },
  ],
  'metamorfoza sylwetki': [
    {
      name: 'Tomek',
      age: 34,
      result: '-24 kg',
      time: '6 miesiecy',
      type: 'Redukcja',
      quote:
        'Myslalem, ze po 30. roku zycia wszystko idzie wolniej. Kluczowe okazaly sie regularnosc i dobrze ustawiony plan.',
    },
    {
      name: 'Magda',
      age: 28,
      result: '+6 kg',
      time: '8 miesiecy',
      type: 'Modelowanie sylwetki',
      quote:
        'Dzieki prowadzeniu 1:1 przestalam skakac po planach z internetu. Progres byl stabilny i bez cofania efektow.',
    },
    {
      name: 'Piotr',
      age: 41,
      result: 'Rekompozycja',
      time: '4 miesiace',
      type: 'Sila + forma',
      quote:
        'Polaczenie treningu i nawykow zywieniowych dalo lepszy efekt niz moje poprzednie proby na wlasna reke.',
    },
    {
      name: 'Natalia',
      age: 32,
      result: '-13 cm',
      time: '3 miesiace',
      type: 'Talia',
      quote:
        'Najwieksza roznice zrobily proste zasady, ktore bylam w stanie utrzymac przy pracy i zyciu rodzinnym.',
    },
    {
      name: 'Krzysztof',
      age: 26,
      result: '+7 kg',
      time: '7 miesiecy',
      type: 'Masa miesniowa',
      quote:
        'W koncu przestalem trenowac przypadkowo. Plan byl konkretny, a korekty robione na biezaco.',
    },
    {
      name: 'Monika',
      age: 37,
      result: '-11 kg',
      time: '5 miesiecy',
      type: 'Powrot do formy',
      quote:
        'Program byl dopasowany do realnego tygodnia. Bez skrajnosci, ale z efektem, ktory utrzymal sie po zakonczeniu wspolpracy.',
    },
  ],
  'sport wytrzymalosciowy': [
    {
      name: 'Norbert',
      age: 36,
      result: '-9 min',
      time: '12 tygodni',
      type: '10 km',
      quote:
        'Dzieki monitorowaniu obciazen i regeneracji poprawilem wynik bez przetrenowania i bez kryzysow w trakcie sezonu.',
    },
    {
      name: 'Aneta',
      age: 30,
      result: 'Pierwszy start',
      time: '4 miesiace',
      type: 'Triathlon sprint',
      quote:
        'Dostalam jasna rozpiske, co robic tydzien po tygodniu. Start byl spokojny i bez improwizacji.',
    },
    {
      name: 'Marek',
      age: 42,
      result: '+18% FTP',
      time: '5 miesiecy',
      type: 'Kolarstwo',
      quote:
        'Najbardziej docenilem laczenie treningu wytrzymalosciowego z silowym. Czuje stabilny progres przez caly sezon.',
    },
    {
      name: 'Karolina',
      age: 33,
      result: '-6 min',
      time: '10 tygodni',
      type: 'Polmaraton',
      quote:
        'Wreszcie trenowalam pod cel i termin, a nie pod przypadkowe inspiracje. Wynik i samopoczucie mocno na plus.',
    },
    {
      name: 'Adam',
      age: 27,
      result: 'Bez urazow',
      time: '6 miesiecy',
      type: 'Przygotowanie sezonowe',
      quote:
        'W poprzednich sezonach lapalem przeciazenia. Teraz plan i kontrola regeneracji utrzymaly ciaglosc treningu.',
    },
    {
      name: 'Paulina',
      age: 35,
      result: '+22% wydolnosc',
      time: '4 miesiace',
      type: 'MTB',
      quote:
        'Dokladne mikrocykle i feedback co tydzien daly mi pewnosc, ze wszystko idzie we wlasciwym kierunku.',
    },
  ],
  'trening + odzywianie': [
    {
      name: 'Marta',
      age: 33,
      result: '-14 kg',
      time: '5 miesiecy',
      type: 'Forma + nawyki',
      quote:
        'Najwiekszy plus to spojny plan treningu i jedzenia. Wczesniej probowalam laczyc to sama i szybko tracilam motywacje.',
    },
    {
      name: 'Daniel',
      age: 40,
      result: '-10 cm',
      time: '4 miesiace',
      type: 'Redukcja centralna',
      quote:
        'Drobne zmiany nawykow i regularne raporty daly efekt bez radykalnych diet i bez efektu jojo.',
    },
    {
      name: 'Klaudia',
      age: 29,
      result: '+4 kg',
      time: '6 miesiecy',
      type: 'Sila i sylwetka',
      quote:
        'Dostalam plan dopasowany do pracy zmianowej. W koncu jadlam i trenowalam tak, by to bylo do utrzymania.',
    },
    {
      name: 'Michal',
      age: 38,
      result: '-8 kg',
      time: '3 miesiace',
      type: 'Restart formy',
      quote:
        'Program byl prosty i konkretny. Co tydzien wiedzialem, czy idziemy zgodnie z planem i co poprawic.',
    },
    {
      name: 'Ola',
      age: 31,
      result: '-16 cm',
      time: '5 miesiecy',
      type: 'Sylwetka',
      quote:
        'Najbardziej pomogla regularna korekta planu. Bez tego bardzo latwo byloby sie zablokowac po kilku tygodniach.',
    },
    {
      name: 'Sebastian',
      age: 45,
      result: '-12 kg',
      time: '6 miesiecy',
      type: 'Zdrowie metaboliczne',
      quote:
        'To pierwsza wspolpraca, w ktorej plan byl realistyczny. Mniej chaosu, wiecej systemu i spokojny, trwaly progres.',
    },
  ],
  'trening personalny 1:1': [
    {
      name: 'Marek',
      age: 29,
      result: '-10 kg',
      time: '4 miesiace',
      type: 'Redukcja',
      quote:
        'Dzieki prowadzeniu 1:1 przestalem zgadywac co robic na treningu. Kazdy tydzien mial jasny cel i to dalo efekt.',
    },
    {
      name: 'Ania',
      age: 35,
      result: '+5 kg',
      time: '7 miesiecy',
      type: 'Sila i sylwetka',
      quote:
        'Wspolpraca byla dopasowana do mojego grafiku. Malo chaosu, duzo konkretu i stale wsparcie po drodze.',
    },
    {
      name: 'Kamil',
      age: 42,
      result: 'Lepsza forma',
      time: '10 tygodni',
      type: 'Kondycja',
      quote:
        'Najwazniejsze bylo to, ze plan byl realny. Trening przestal byc dodatkowym obowiazkiem, a stal sie rutyna.',
    },
    {
      name: 'Joanna',
      age: 31,
      result: '-11 cm',
      time: '3 miesiace',
      type: 'Modelowanie',
      quote:
        'Regularne check-iny i szybkie korekty pomogly utrzymac tempo. Efekty byly widoczne juz po kilku tygodniach.',
    },
    {
      name: 'Pawel',
      age: 37,
      result: '+6 kg',
      time: '8 miesiecy',
      type: 'Masa miesniowa',
      quote:
        'Po raz pierwszy mialem plan z prawdziwego zdarzenia i wiedzialem, jak progresowac bez przestojow.',
    },
    {
      name: 'Ewelina',
      age: 34,
      result: '-9 kg',
      time: '5 miesiecy',
      type: 'Powrot do formy',
      quote:
        'To byl system krok po kroku. Zero skrajnosci, za to regularnosc i wyniki, ktore zostaly na dluzej.',
    },
  ],
};

const storyImages = [
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1887&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1887&auto=format&fit=crop',
  'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/4498294/pexels-photo-4498294.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1887&auto=format&fit=crop',
];

const storyIcons = [
  TrendingUp,
  Trophy,
  Zap,
  Heart,
  UserCheck,
  Activity,
];

const Transformations: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const transformations = useMemo<Story[]>(() => {
    const key = currentTrainer.nicheLabel || 'trening personalny 1:1';
    const baseStories = storySets[key] || storySets['trening personalny 1:1'];
    return baseStories.map((item, idx) => {
      const Icon = storyIcons[idx % storyIcons.length];
      return {
        id: idx + 1,
        ...item,
        image: storyImages[idx % storyImages.length],
        icon: <Icon className="text-brand-500" size={20} />,
      };
    });
  }, [currentTrainer.nicheLabel]);

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('contact', { updateHash: true });
  };

  const visibleTransformations = showAll ? transformations : transformations.slice(0, 3);

  return (
    <section id="transformations" className="py-24 scroll-mt-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-500 font-bold tracking-wider uppercase text-sm">Przykladowe historie</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
              Zobacz format <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">prezentacji efektow</span>
            </h2>
            <p className="text-zinc-400 mt-4 text-lg">
              Ponizej sa przykladowe case studies dobrane do typu wspolpracy, w ktorym specjalizuje sie {currentTrainer.fullName}.
            </p>
          </div>
          <a
            href="#contact"
            onClick={handleScrollToContact}
            className="px-6 py-3 border border-zinc-700 hover:bg-brand-500 hover:text-black hover:border-brand-500 text-white rounded-lg transition-all font-bold flex items-center gap-2 group"
          >
            Dolacz do nich <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleTransformations.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-[3/4] md:aspect-[4/5] bg-zinc-900 border border-zinc-800">
              <img
                src={item.image}
                alt={`Metamorfoza ${item.name}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="absolute top-6 right-6 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-2">
                  {item.icon}
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{item.type}</span>
                </div>

                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="mb-6">
                    <div className="flex text-brand-500 mb-2">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                    </div>
                    <p className="text-zinc-300 text-sm italic leading-relaxed border-l-2 border-brand-500 pl-3">
                      "{item.quote}"
                    </p>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-4">
                    {item.name}, <span className="text-zinc-500 text-xl font-bold">{item.age} l.</span>
                  </h3>

                  <div className="flex gap-4">
                    <div className="bg-brand-500 text-zinc-950 px-4 py-2 rounded-lg font-bold">
                      <p className="text-[10px] uppercase opacity-70 mb-0.5">Wynik</p>
                      <p className="text-lg leading-none">{item.result}</p>
                    </div>
                    <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700">
                      <p className="text-[10px] uppercase text-zinc-400 mb-0.5">Czas</p>
                      <p className="text-lg leading-none font-bold">{item.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-white border border-zinc-700 hover:border-brand-500 hover:text-brand-500 px-8 py-3 rounded-full transition-all duration-300 font-bold uppercase tracking-wider text-sm bg-zinc-900"
          >
            {showAll ? (
              <>
                Pokaz mniej <ChevronUp size={16} />
              </>
            ) : (
              <>
                Zobacz wiecej podopiecznych <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Transformations;
