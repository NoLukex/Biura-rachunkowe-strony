import type { TrainerProfile } from './trainerProfile';

export type TrainerProfileOverride = Partial<TrainerProfile>;

export const emailTrainerPersonalization: Record<string, TrainerProfileOverride> = {
  "arkadiusz-czajkowski-trener-personalny": {
    heroTitleTop: "TRENING MEDYCZNY",
    heroTitleAccent: "Z PLANEM DLA CIALA.",
    heroText: "Strategia oparta o diagnostyke ruchu, progres obciazen i jasny plan powrotu do formy. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Arkadiusz - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta jest ustawiona pod klientow z bolem, po kontuzji i osoby, ktore chca trenowac bezpiecznie. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening medyczny / fizjo",
    quickWin: "Rozdzielic CTA na Schudnij i Pozbadz sie bolu plecow z osobnymi formularzami.",
    researchCue: "Arkadiusz Czajkowski Trener Personalny.",
    researchSource: "http://arkadiuszczajkowski.pl/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Sciezka bol -> forma",
        desc: "Jasny podzial: osobna komunikacja dla problemow zdrowotnych i osobna dla celu sylwetkowego."
      },
{
        title: "Diagnostyka + plan 12 tygodni",
        desc: "Start od konsultacji i analizy ruchu, potem plan etapowy z mierzalnym progresem."
      },
{
        title: "Case studies zamiast ogolnikow",
        desc: "Wynik + czas wspolpracy + kontekst problemu, zeby budowac wiarygodnosc."
      }
    ],
    pricingPlans: [
{
        name: "Start Bez Bolu",
        subtitle: "Pierwsze 4 tygodnie pod kontrola.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Konsultacja + analiza ruchu",
"Plan medyczny dopasowany do objawow",
"Korekta techniki raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Bez Bolu"
      },
{
        name: "Ruch + Sila",
        subtitle: "Kompleksowe prowadzenie i progres.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko ze Start Bez Bolu",
"Plan silowy + mobilnosc + prewencja",
"Cotygodniowy raport i korekty",
"Kontakt biezacy 1:1"
        ],
        ctaLabel: "Wybieram Ruch + Sila"
      },
{
        name: "Performance Care",
        subtitle: "Dla osob z ambitnym celem.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Prowadzenie 1:1 premium",
"Priorytetowe konsultacje",
"Plan pod start lub sezon"
        ],
        ctaLabel: "Wybieram Performance Care"
      }
    ],
    faqItems: [
{
        q: "Czy moge trenowac przy bolu plecow lub kolan?",
        a: "Tak, plan zaczyna sie od bezpiecznych zakresow ruchu i stopniowej progresji."
      },
{
        q: "Jak szybko zobacze ulge?",
        a: "Pierwsze zmiany zwykle widac po 2-4 tygodniach regularnej pracy i korekcie nawykow."
      },
{
        q: "Czy potrzebuje silowni?",
        a: "Nie, start mozliwy jest z podstawowym sprzetem i cwiczeniami domowymi."
      },
{
        q: "Czy jest kontakt miedzy treningami?",
        a: "Tak, kontakt biezacy sluzy szybkiej korekcie i utrzymaniu bezpiecznego progresu."
      }
    ],
    leadMagnetTitle: "Pobierz checkliste: 7 krokow treningu bez bolu.",
    leadMagnetText: "Material startowy dla osob po kontuzji i z przeciazeniami - jak trenowac bezpiecznie i skutecznie."
  },
  "bartosz-jaszczak-trener-personalny-bydgoszcz": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "Z PLANEM I OPIEKA.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Bartosz - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Dodac quiz Wybierz typ treningu i kierowac do jednego dopasowanego CTA.",
    researchCue: "Bartosz Jaszczak.",
    researchSource: "https://bartoszjaszczak.pl/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "bartosz-trzebiatowski-trener-personalny": {
    heroTitleTop: "TRENING MEDYCZNY",
    heroTitleAccent: "Z PLANEM DLA CIALA.",
    heroText: "Strategia oparta o diagnostyke ruchu, progres obciazen i jasny plan powrotu do formy. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Bartosz - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta jest ustawiona pod klientow z bolem, po kontuzji i osoby, ktore chca trenowac bezpiecznie. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening medyczny / fizjo",
    quickWin: "Dopisac sekcje dla kogo ktory program nad formularzem.",
    researchCue: "NAUKOWE PODEJSCIE w twoim treningu.",
    researchSource: "https://www.bartosztrzebiatowski.pl/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Sciezka bol -> forma",
        desc: "Jasny podzial: osobna komunikacja dla problemow zdrowotnych i osobna dla celu sylwetkowego."
      },
{
        title: "Diagnostyka + plan 12 tygodni",
        desc: "Start od konsultacji i analizy ruchu, potem plan etapowy z mierzalnym progresem."
      },
{
        title: "Case studies zamiast ogolnikow",
        desc: "Wynik + czas wspolpracy + kontekst problemu, zeby budowac wiarygodnosc."
      }
    ],
    pricingPlans: [
{
        name: "Start Bez Bolu",
        subtitle: "Pierwsze 4 tygodnie pod kontrola.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Konsultacja + analiza ruchu",
"Plan medyczny dopasowany do objawow",
"Korekta techniki raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Bez Bolu"
      },
{
        name: "Ruch + Sila",
        subtitle: "Kompleksowe prowadzenie i progres.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko ze Start Bez Bolu",
"Plan silowy + mobilnosc + prewencja",
"Cotygodniowy raport i korekty",
"Kontakt biezacy 1:1"
        ],
        ctaLabel: "Wybieram Ruch + Sila"
      },
{
        name: "Performance Care",
        subtitle: "Dla osob z ambitnym celem.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Prowadzenie 1:1 premium",
"Priorytetowe konsultacje",
"Plan pod start lub sezon"
        ],
        ctaLabel: "Wybieram Performance Care"
      }
    ],
    faqItems: [
{
        q: "Czy moge trenowac przy bolu plecow lub kolan?",
        a: "Tak, plan zaczyna sie od bezpiecznych zakresow ruchu i stopniowej progresji."
      },
{
        q: "Jak szybko zobacze ulge?",
        a: "Pierwsze zmiany zwykle widac po 2-4 tygodniach regularnej pracy i korekcie nawykow."
      },
{
        q: "Czy potrzebuje silowni?",
        a: "Nie, start mozliwy jest z podstawowym sprzetem i cwiczeniami domowymi."
      },
{
        q: "Czy jest kontakt miedzy treningami?",
        a: "Tak, kontakt biezacy sluzy szybkiej korekcie i utrzymaniu bezpiecznego progresu."
      }
    ],
    leadMagnetTitle: "Pobierz checkliste: 7 krokow treningu bez bolu.",
    leadMagnetText: "Material startowy dla osob po kontuzji i z przeciazeniami - jak trenowac bezpiecznie i skutecznie."
  },
  "bartosz-tywusik-trener-personalny": {
    heroTitleTop: "TRENING MEDYCZNY",
    heroTitleAccent: "BEZ BOLU I PRZYPADKU.",
    heroText: "Strategia oparta o diagnostyke ruchu, progres obciazen i jasny plan powrotu do formy. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Bartosz - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta jest ustawiona pod klientow z bolem, po kontuzji i osoby, ktore chca trenowac bezpiecznie. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening medyczny / fizjo",
    quickWin: "Dodac ankiete bolu i automatycznie proponowac najblizszy typ konsultacji.",
    researchCue: "Medyczny Trening Personalny w Bydgoszczy. Polacz skutecznosc treningu z bezpieczenstwem .",
    researchSource: "https://architektciala.pl/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Sciezka bol -> forma",
        desc: "Jasny podzial: osobna komunikacja dla problemow zdrowotnych i osobna dla celu sylwetkowego."
      },
{
        title: "Diagnostyka + plan 12 tygodni",
        desc: "Start od konsultacji i analizy ruchu, potem plan etapowy z mierzalnym progresem."
      },
{
        title: "Case studies zamiast ogolnikow",
        desc: "Wynik + czas wspolpracy + kontekst problemu, zeby budowac wiarygodnosc."
      }
    ],
    pricingPlans: [
{
        name: "Start Bez Bolu",
        subtitle: "Pierwsze 4 tygodnie pod kontrola.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Konsultacja + analiza ruchu",
"Plan medyczny dopasowany do objawow",
"Korekta techniki raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Bez Bolu"
      },
{
        name: "Ruch + Sila",
        subtitle: "Kompleksowe prowadzenie i progres.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko ze Start Bez Bolu",
"Plan silowy + mobilnosc + prewencja",
"Cotygodniowy raport i korekty",
"Kontakt biezacy 1:1"
        ],
        ctaLabel: "Wybieram Ruch + Sila"
      },
{
        name: "Performance Care",
        subtitle: "Dla osob z ambitnym celem.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Prowadzenie 1:1 premium",
"Priorytetowe konsultacje",
"Plan pod start lub sezon"
        ],
        ctaLabel: "Wybieram Performance Care"
      }
    ],
    faqItems: [
{
        q: "Czy moge trenowac przy bolu plecow lub kolan?",
        a: "Tak, plan zaczyna sie od bezpiecznych zakresow ruchu i stopniowej progresji."
      },
{
        q: "Jak szybko zobacze ulge?",
        a: "Pierwsze zmiany zwykle widac po 2-4 tygodniach regularnej pracy i korekcie nawykow."
      },
{
        q: "Czy potrzebuje silowni?",
        a: "Nie, start mozliwy jest z podstawowym sprzetem i cwiczeniami domowymi."
      },
{
        q: "Czy jest kontakt miedzy treningami?",
        a: "Tak, kontakt biezacy sluzy szybkiej korekcie i utrzymaniu bezpiecznego progresu."
      }
    ],
    leadMagnetTitle: "Pobierz checkliste: 7 krokow treningu bez bolu.",
    leadMagnetText: "Material startowy dla osob po kontuzji i z przeciazeniami - jak trenowac bezpiecznie i skutecznie."
  },
  "damian-piskorz": {
    heroTitleTop: "METAMORFOZA",
    heroTitleAccent: "BEZ CHAOSU I LOSOWOSCI.",
    heroText: "Program ustawiony pod redukcje lub budowe sylwetki, z jasnym procesem i regularnym rozliczaniem progresu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Damian - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Komunikacja strony skupia sie na realnych efektach, konkretnej sciezce wspolpracy i prostym CTA. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "metamorfoza sylwetki",
    quickWin: "Pokazac dwa osobne wejscia: sport/kickboxing i forma/sylwetka.",
    researchCue: "Damian Piskorz.",
    researchSource: "https://teampiskorz.pl/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Sciezka pierwsze 30 dni",
        desc: "Jasny plan startu: diagnoza, plan, pierwsze nawyki i pierwszy raport."
      },
{
        title: "Dowody efektow",
        desc: "Historie klientow z wynikiem, czasem i zakresem wspolpracy."
      },
{
        title: "Jeden glowny CTA",
        desc: "Krotka droga do kontaktu: formularz i szybka kwalifikacja."
      }
    ],
    pricingPlans: [
{
        name: "Start Sylwetka",
        subtitle: "Plan i wdrozenie na 4 tygodnie.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Indywidualny plan treningowy",
"Podstawy odzywiania i nawykow",
"Kontrola postepu raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Sylwetka"
      },
{
        name: "Transformacja 1:1",
        subtitle: "Pelne prowadzenie pod efekt.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start Sylwetka",
"Plan zywieniowy i monitoring",
"Cotygodniowy raport i korekty",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Transformacje 1:1"
      },
{
        name: "VIP Metamorfoza",
        subtitle: "Dla osob z ambitnym celem.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe konsultacje",
"Strategia na 90 dni",
"Wsparcie premium i analiza wynikow"
        ],
        ctaLabel: "Wybieram VIP Metamorfoza"
      }
    ],
    faqItems: [
{
        q: "Czy dam rade, jesli zaczynam od zera?",
        a: "Tak, program jest skalowany pod poziom startowy i tempo klienta."
      },
{
        q: "Kiedy widac pierwsze efekty?",
        a: "Najczesciej po 3-4 tygodniach widac zmiany w obwodach i samopoczuciu."
      },
{
        q: "Czy dieta jest restrykcyjna?",
        a: "Nie, priorytetem sa nawyki i plan, ktory da sie utrzymac dlugoterminowo."
      },
{
        q: "Jak wyglada kontakt?",
        a: "Kontakt biezacy i cotygodniowy raport pomagaja utrzymac tempo progresu."
      }
    ],
    leadMagnetTitle: "Pobierz plan: pierwsze 30 dni metamorfozy.",
    leadMagnetText: "Gotowy start pod redukcje lub budowe sylwetki z checklistami i prostymi zasadami."
  },
  "daria-petla-trener-personalny": {
    heroTitleTop: "METAMORFOZA",
    heroTitleAccent: "BEZ CHAOSU I LOSOWOSCI.",
    heroText: "Program ustawiony pod redukcje lub budowe sylwetki, z jasnym procesem i regularnym rozliczaniem progresu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Daria - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Komunikacja strony skupia sie na realnych efektach, konkretnej sciezce wspolpracy i prostym CTA. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "metamorfoza sylwetki",
    quickWin: "W pierwszym ekranie zostawic 1 obietnice + 3 pakiety + 1 CTA.",
    researchCue: "Daria Petla Trenerka personalna z Bydgoszczy DariaFit.pl.",
    researchSource: "https://dariafit.pl/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Sciezka pierwsze 30 dni",
        desc: "Jasny plan startu: diagnoza, plan, pierwsze nawyki i pierwszy raport."
      },
{
        title: "Dowody efektow",
        desc: "Historie klientow z wynikiem, czasem i zakresem wspolpracy."
      },
{
        title: "Jeden glowny CTA",
        desc: "Krotka droga do kontaktu: formularz i szybka kwalifikacja."
      }
    ],
    pricingPlans: [
{
        name: "Start Sylwetka",
        subtitle: "Plan i wdrozenie na 4 tygodnie.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Indywidualny plan treningowy",
"Podstawy odzywiania i nawykow",
"Kontrola postepu raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Sylwetka"
      },
{
        name: "Transformacja 1:1",
        subtitle: "Pelne prowadzenie pod efekt.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start Sylwetka",
"Plan zywieniowy i monitoring",
"Cotygodniowy raport i korekty",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Transformacje 1:1"
      },
{
        name: "VIP Metamorfoza",
        subtitle: "Dla osob z ambitnym celem.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe konsultacje",
"Strategia na 90 dni",
"Wsparcie premium i analiza wynikow"
        ],
        ctaLabel: "Wybieram VIP Metamorfoza"
      }
    ],
    faqItems: [
{
        q: "Czy dam rade, jesli zaczynam od zera?",
        a: "Tak, program jest skalowany pod poziom startowy i tempo klienta."
      },
{
        q: "Kiedy widac pierwsze efekty?",
        a: "Najczesciej po 3-4 tygodniach widac zmiany w obwodach i samopoczuciu."
      },
{
        q: "Czy dieta jest restrykcyjna?",
        a: "Nie, priorytetem sa nawyki i plan, ktory da sie utrzymac dlugoterminowo."
      },
{
        q: "Jak wyglada kontakt?",
        a: "Kontakt biezacy i cotygodniowy raport pomagaja utrzymac tempo progresu."
      }
    ],
    leadMagnetTitle: "Pobierz plan: pierwsze 30 dni metamorfozy.",
    leadMagnetText: "Gotowy start pod redukcje lub budowe sylwetki z checklistami i prostymi zasadami."
  },
  "dawid-cichanski": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "DOPASOWANY DO CIEBIE.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Dawid - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Postawic prosty landing one-page z cennikiem start i formularzem.",
    researchCue: "Dawid Cichanski - Trener Personalny Bydgoszcz | Bydgoszcz.",
    researchSource: "https://www.facebook.com/share/1Epp57ukgP/",
    researchConfidence: "medium",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "dietetyk-bydgoszcz-tomasz-giza": {
    heroTitleTop: "FORMA + ODWZYWIANIE",
    heroTitleAccent: "JEDEN SPOJNY SYSTEM.",
    heroText: "Laczenie treningu z nawykami zyciowymi i odzywianiem, tak aby dowozic efekt bez skokow motywacji. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Tomasz - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Strona komunikuje pelna opieke: diagnoza celu, plan ruchu i plan zywieniowy w jednej sciezce. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening + odzywianie",
    quickWin: "Dodac lead magnet i formularz celu z automatycznym follow-upem.",
    researchCue: "NBPTM nowy model odchudzania.",
    researchSource: "https://gizafit.com/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Trening i dieta w jednym planie",
        desc: "Jeden proces zamiast dwoch niespojnych uslug."
      },
{
        title: "Formularz celu i nawykow",
        desc: "Lepsza kwalifikacja klienta przed startem wspolpracy."
      },
{
        title: "Automatyczny follow-up",
        desc: "Szybsze domykanie leadow po pierwszym kontakcie."
      }
    ],
    pricingPlans: [
{
        name: "Start Nawyki",
        subtitle: "Prosty plan pod codziennosc.",
        price: "349 zl",
        period: "/ mies",
        features: [
"Plan treningowy + zalecenia zywieniowe",
"Checklisty tygodniowe",
"Korekta raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Nawyki"
      },
{
        name: "Metaboliczny Growth",
        subtitle: "Prowadzenie pod wynik.",
        price: "649 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start Nawyki",
"Plan posilkow i monitoring",
"Cotygodniowy raport + korekty",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Metaboliczny Growth"
      },
{
        name: "Premium 360",
        subtitle: "Maksymalne wsparcie 1:1.",
        price: "1099 zl",
        period: "/ mies",
        features: [
"Pelna opieka trening + odzywianie",
"Priorytetowe konsultacje",
"Plan 90-dniowy i rewizje"
        ],
        ctaLabel: "Wybieram Premium 360"
      }
    ],
    faqItems: [
{
        q: "Czy musze liczyc kazda kalorie?",
        a: "Nie zawsze, plan jest dopasowany do celu i preferencji klienta."
      },
{
        q: "Czy to wspolpraca online czy stacjonarna?",
        a: "Mozliwe sa oba warianty, zalezne od pakietu i potrzeb."
      },
{
        q: "Jak wyglada raportowanie postepu?",
        a: "Co tydzien weryfikujemy dane i aktualizujemy plan dzialania."
      },
{
        q: "Czy plan jest dla osob zapracowanych?",
        a: "Tak, cala strategia jest ustawiona pod realny rytm dnia klienta."
      }
    ],
    leadMagnetTitle: "Pobierz checkliste: trening + odzywianie na 7 dni.",
    leadMagnetText: "Praktyczny punkt startu pod redukcje, energie i regularnosc bez skomplikowanych zasad."
  },
  "forever-athlete-vincent-marek": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "Z PLANEM I OPIEKA.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Forever - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Dopisac jasna oferte 3 pakietow i jeden kontaktowy CTA.",
    researchCue: "Forever Athlete.",
    researchSource: "https://www.facebook.com/forverathlete.treningmotoryczny/",
    researchConfidence: "low",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "jagoda-konczal-trener-personalny": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "Z PLANEM I OPIEKA.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Jagoda - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Uzupelnic minimum: oferta, cennik, 3 opinie i formularz.",
    researchCue: "Na stronie brakuje tresci, wiec lepiej oprzec demo o prosty model 1:1.",
    researchSource: "https://jagodatwojatrenerka.com/",
    researchConfidence: "low",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "jakub-stypczynski-trener-personalny-bydgoszcz": {
    heroTitleTop: "METAMORFOZA",
    heroTitleAccent: "Z PLANEM I WYNIKIEM.",
    heroText: "Program ustawiony pod redukcje lub budowe sylwetki, z jasnym procesem i regularnym rozliczaniem progresu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Jakub - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Komunikacja strony skupia sie na realnych efektach, konkretnej sciezce wspolpracy i prostym CTA. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "metamorfoza sylwetki",
    quickWin: "Dodac sticky CTA Umow konsultacje 15 min i skrocic sciezke zapisu.",
    researchCue: "Jakub stypczynski.",
    researchSource: "https://silakonsekwencji.pl/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Sciezka pierwsze 30 dni",
        desc: "Jasny plan startu: diagnoza, plan, pierwsze nawyki i pierwszy raport."
      },
{
        title: "Dowody efektow",
        desc: "Historie klientow z wynikiem, czasem i zakresem wspolpracy."
      },
{
        title: "Jeden glowny CTA",
        desc: "Krotka droga do kontaktu: formularz i szybka kwalifikacja."
      }
    ],
    pricingPlans: [
{
        name: "Start Sylwetka",
        subtitle: "Plan i wdrozenie na 4 tygodnie.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Indywidualny plan treningowy",
"Podstawy odzywiania i nawykow",
"Kontrola postepu raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Sylwetka"
      },
{
        name: "Transformacja 1:1",
        subtitle: "Pelne prowadzenie pod efekt.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start Sylwetka",
"Plan zywieniowy i monitoring",
"Cotygodniowy raport i korekty",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Transformacje 1:1"
      },
{
        name: "VIP Metamorfoza",
        subtitle: "Dla osob z ambitnym celem.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe konsultacje",
"Strategia na 90 dni",
"Wsparcie premium i analiza wynikow"
        ],
        ctaLabel: "Wybieram VIP Metamorfoza"
      }
    ],
    faqItems: [
{
        q: "Czy dam rade, jesli zaczynam od zera?",
        a: "Tak, program jest skalowany pod poziom startowy i tempo klienta."
      },
{
        q: "Kiedy widac pierwsze efekty?",
        a: "Najczesciej po 3-4 tygodniach widac zmiany w obwodach i samopoczuciu."
      },
{
        q: "Czy dieta jest restrykcyjna?",
        a: "Nie, priorytetem sa nawyki i plan, ktory da sie utrzymac dlugoterminowo."
      },
{
        q: "Jak wyglada kontakt?",
        a: "Kontakt biezacy i cotygodniowy raport pomagaja utrzymac tempo progresu."
      }
    ],
    leadMagnetTitle: "Pobierz plan: pierwsze 30 dni metamorfozy.",
    leadMagnetText: "Gotowy start pod redukcje lub budowe sylwetki z checklistami i prostymi zasadami."
  },
  "kaja-narkun": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "Z PLANEM I OPIEKA.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Kaja - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Jednostronicowy profil z 3 efektami i przyciskiem oddzwonie dzis.",
    researchCue: "Trener personalny Kaja Narkun.",
    researchSource: "https://zdrofit.pl/kadra/kaja-narkun-3",
    researchConfidence: "low",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "lukasz-dziennik-atletyczna-sila": {
    heroTitleTop: "TRENING SPORTOWY",
    heroTitleAccent: "SEZON ZA SEZONEM.",
    heroText: "Planowanie pod sezon, kontrola obciazen i przygotowanie motoryczne pod wynik sportowy. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Lukasz - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta jest pozycjonowana pod sportowcow i ambitnych amatorow, ktorzy oczekuja mierzalnych rezultatow. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "sport wytrzymalosciowy",
    quickWin: "Zrobic osobna strone trenerska (nie sam katalog) z case studies i CTA.",
    researchCue: "Lukasz Dziennik.",
    researchSource: "https://repspolska.pl/index.php/trener/Lukasz-Dziennik/REPS-TR-1621",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Diagnoza celu sezonu",
        desc: "Plan oparty o termin startu, poziom i realne zasoby czasowe."
      },
{
        title: "Monitoring obciazen",
        desc: "Regularny raport pracy, regeneracji i realizacji zalozen."
      },
{
        title: "Integracja sila + wytrzymalosc",
        desc: "Spina trening uzupelniajacy z glowna dyscyplina."
      }
    ],
    pricingPlans: [
{
        name: "Start Sezon",
        subtitle: "Plan bazowy i kierunek przygotowan.",
        price: "349 zl",
        period: "/ mies",
        features: [
"Analiza celu i kalendarza startow",
"Plan tygodniowy i strefy pracy",
"Korekta techniki i nawykow"
        ],
        ctaLabel: "Wybieram Start Sezon"
      },
{
        name: "Plan Startowy Pro",
        subtitle: "Prowadzenie pod wynik.",
        price: "649 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko ze Start Sezon",
"Cotygodniowa analiza i korekty",
"Integracja sila/mobilnosc/regen",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Plan Startowy Pro"
      },
{
        name: "Race Premium",
        subtitle: "Pelne wsparcie przed i w sezonie.",
        price: "1099 zl",
        period: "/ mies",
        features: [
"Priorytetowe konsultacje",
"Dlugofalowa strategia wynikowa",
"Wsparcie startowe i mikrocykle"
        ],
        ctaLabel: "Wybieram Race Premium"
      }
    ],
    faqItems: [
{
        q: "Czy program jest pod konkretny start?",
        a: "Tak, plan powstaje pod termin zawodow i aktualny poziom."
      },
{
        q: "Czy laczysz trening silowy z dyscyplina?",
        a: "Tak, plan zawiera uzupelnienie silowo-motoryczne i regeneracje."
      },
{
        q: "Jak monitorowany jest progres?",
        a: "Cotygodniowo analizujemy obciazenia, samopoczucie i realizacje planu."
      },
{
        q: "Czy to tylko dla zawodowcow?",
        a: "Nie, program jest dla ambitnych amatorow i osob startujacych rekreacyjnie."
      }
    ],
    leadMagnetTitle: "Pobierz mini-plan: przygotowanie do sezonu w 7 krokach.",
    leadMagnetText: "Praktyczna checklista dla osob trenujacych wytrzymalosc i sporty sezonowe."
  },
  "maciej-karolczyk-trener-personalny": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "BEZ PRZYPADKOWYCH METOD.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Maciej - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Landing start od zera + formularz kwalifikacyjny.",
    researchCue: "Maciej Karolczyk.",
    researchSource: "https://www.facebook.com/maciek.karolczyk/",
    researchConfidence: "low",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "maja-burek-trener-personalny": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "BEZ PRZYPADKOWYCH METOD.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Maja - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Dopisac bio-site z sekcja dla kogo pracuje i szybkim zapisem.",
    researchCue: "Maja Burek - Trenerka Personalna Bydgoszcz | Bydgoszcz.",
    researchSource: "https://www.facebook.com/share/19JqaeRu85/?mibextid=wwXIfr",
    researchConfidence: "medium",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "mateusz-mazur": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "Z PLANEM I OPIEKA.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Mateusz - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Pokazac 3 case studies z wynikiem i czasem wspolpracy obok ofert.",
    researchCue: "Mateusz Mazur Trener Personalny - Payhip.",
    researchSource: "https://payhip.com/mateuszmazur",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "mikolaj-karaszewski-fitness-lifestyle": {
    heroTitleTop: "METAMORFOZA",
    heroTitleAccent: "KROK PO KROKU.",
    heroText: "Program ustawiony pod redukcje lub budowe sylwetki, z jasnym procesem i regularnym rozliczaniem progresu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Mikolaj - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Komunikacja strony skupia sie na realnych efektach, konkretnej sciezce wspolpracy i prostym CTA. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "metamorfoza sylwetki",
    quickWin: "Dopisac program 90 dni i tygodniowy check-in na stronie.",
    researchCue: "Fitness & Lifestyle (@mikolaj.karaszewski) Instagram photos and videos.",
    researchSource: "https://www.instagram.com/mikolaj.karaszewski/",
    researchConfidence: "medium",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Sciezka pierwsze 30 dni",
        desc: "Jasny plan startu: diagnoza, plan, pierwsze nawyki i pierwszy raport."
      },
{
        title: "Dowody efektow",
        desc: "Historie klientow z wynikiem, czasem i zakresem wspolpracy."
      },
{
        title: "Jeden glowny CTA",
        desc: "Krotka droga do kontaktu: formularz i szybka kwalifikacja."
      }
    ],
    pricingPlans: [
{
        name: "Start Sylwetka",
        subtitle: "Plan i wdrozenie na 4 tygodnie.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Indywidualny plan treningowy",
"Podstawy odzywiania i nawykow",
"Kontrola postepu raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Sylwetka"
      },
{
        name: "Transformacja 1:1",
        subtitle: "Pelne prowadzenie pod efekt.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start Sylwetka",
"Plan zywieniowy i monitoring",
"Cotygodniowy raport i korekty",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Transformacje 1:1"
      },
{
        name: "VIP Metamorfoza",
        subtitle: "Dla osob z ambitnym celem.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe konsultacje",
"Strategia na 90 dni",
"Wsparcie premium i analiza wynikow"
        ],
        ctaLabel: "Wybieram VIP Metamorfoza"
      }
    ],
    faqItems: [
{
        q: "Czy dam rade, jesli zaczynam od zera?",
        a: "Tak, program jest skalowany pod poziom startowy i tempo klienta."
      },
{
        q: "Kiedy widac pierwsze efekty?",
        a: "Najczesciej po 3-4 tygodniach widac zmiany w obwodach i samopoczuciu."
      },
{
        q: "Czy dieta jest restrykcyjna?",
        a: "Nie, priorytetem sa nawyki i plan, ktory da sie utrzymac dlugoterminowo."
      },
{
        q: "Jak wyglada kontakt?",
        a: "Kontakt biezacy i cotygodniowy raport pomagaja utrzymac tempo progresu."
      }
    ],
    leadMagnetTitle: "Pobierz plan: pierwsze 30 dni metamorfozy.",
    leadMagnetText: "Gotowy start pod redukcje lub budowe sylwetki z checklistami i prostymi zasadami."
  },
  "norbert-lysiak-trener-osobisty-triathlon-mtb-plywanie": {
    heroTitleTop: "TRENING SPORTOWY",
    heroTitleAccent: "Z PLANEM I MONITORINGIEM.",
    heroText: "Planowanie pod sezon, kontrola obciazen i przygotowanie motoryczne pod wynik sportowy. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Norbert - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta jest pozycjonowana pod sportowcow i ambitnych amatorow, ktorzy oczekuja mierzalnych rezultatow. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "sport wytrzymalosciowy",
    quickWin: "Kalkulator pakietu pod cel sezonu + CTA na konsultacje 60 min.",
    researchCue: "Twoje cele staja sie moimi. Osiagniemy je wspolnie.",
    researchSource: "http://norbertlysiak.pl/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Diagnoza celu sezonu",
        desc: "Plan oparty o termin startu, poziom i realne zasoby czasowe."
      },
{
        title: "Monitoring obciazen",
        desc: "Regularny raport pracy, regeneracji i realizacji zalozen."
      },
{
        title: "Integracja sila + wytrzymalosc",
        desc: "Spina trening uzupelniajacy z glowna dyscyplina."
      }
    ],
    pricingPlans: [
{
        name: "Start Sezon",
        subtitle: "Plan bazowy i kierunek przygotowan.",
        price: "349 zl",
        period: "/ mies",
        features: [
"Analiza celu i kalendarza startow",
"Plan tygodniowy i strefy pracy",
"Korekta techniki i nawykow"
        ],
        ctaLabel: "Wybieram Start Sezon"
      },
{
        name: "Plan Startowy Pro",
        subtitle: "Prowadzenie pod wynik.",
        price: "649 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko ze Start Sezon",
"Cotygodniowa analiza i korekty",
"Integracja sila/mobilnosc/regen",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Plan Startowy Pro"
      },
{
        name: "Race Premium",
        subtitle: "Pelne wsparcie przed i w sezonie.",
        price: "1099 zl",
        period: "/ mies",
        features: [
"Priorytetowe konsultacje",
"Dlugofalowa strategia wynikowa",
"Wsparcie startowe i mikrocykle"
        ],
        ctaLabel: "Wybieram Race Premium"
      }
    ],
    faqItems: [
{
        q: "Czy program jest pod konkretny start?",
        a: "Tak, plan powstaje pod termin zawodow i aktualny poziom."
      },
{
        q: "Czy laczysz trening silowy z dyscyplina?",
        a: "Tak, plan zawiera uzupelnienie silowo-motoryczne i regeneracje."
      },
{
        q: "Jak monitorowany jest progres?",
        a: "Cotygodniowo analizujemy obciazenia, samopoczucie i realizacje planu."
      },
{
        q: "Czy to tylko dla zawodowcow?",
        a: "Nie, program jest dla ambitnych amatorow i osob startujacych rekreacyjnie."
      }
    ],
    leadMagnetTitle: "Pobierz mini-plan: przygotowanie do sezonu w 7 krokach.",
    leadMagnetText: "Praktyczna checklista dla osob trenujacych wytrzymalosc i sporty sezonowe."
  },
  "oskar-kaliszewski-trener-personalny": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "DOPASOWANY DO CIEBIE.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Oskar - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Mini-landing z 3 sciezkami celu i formularzem kwalifikacyjnym.",
    researchCue: "Trener Personalny Bydgoszcz Oskar Kaliszewski (@trener_oskar.kaliszewski) Instagram photos and videos.",
    researchSource: "https://www.instagram.com/trener_oskar.kaliszewski/",
    researchConfidence: "low",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "patryk-kozikowski": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "Z PLANEM I OPIEKA.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Patryk - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "One-page + kalendarz konsultacji i FAQ dla poczatkujacych.",
    researchCue: "Patryk Kozikowski.",
    researchSource: "https://repspolska.pl/index.php/trener/Patryk-Kozikowski/REPS-TR-6042",
    researchConfidence: "low",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "patryk-michalek-trener-personalny": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "Z PLANEM I OPIEKA.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Patryk - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Dodac sekcje pierwsze 30 dni bezposrednio pod hero.",
    researchCue: "Trener Personalny Patryk Michalek.",
    researchSource: "http://patrykmichalek.pl/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "trener-personalny-bydgoszcz-nicolas-marysiak": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "Z PLANEM I OPIEKA.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Nicolas - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Formularz z 3 pytaniami (cel, termin, budzet) dla lepszej kwalifikacji.",
    researchCue: "Trener Personalny Bydgoszcz Nicolas Marysiak.",
    researchSource: "https://trener-personalny-bydgoszcz.localo.site/?utm_source=google_profile&utm_campaign=localo&utm_medium=mainlink",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "trener-personalny-kamil-makowski": {
    heroTitleTop: "TRENING MEDYCZNY",
    heroTitleAccent: "BEZ BOLU I PRZYPADKU.",
    heroText: "Strategia oparta o diagnostyke ruchu, progres obciazen i jasny plan powrotu do formy. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Kamil - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta jest ustawiona pod klientow z bolem, po kontuzji i osoby, ktore chca trenowac bezpiecznie. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening medyczny / fizjo",
    quickWin: "Pokazac osobne case studies dla bol/kontuzja i sylwetka.",
    researchCue: "Trener Personalny | Kamil Makowski.",
    researchSource: "https://kamilmakowski.com/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Sciezka bol -> forma",
        desc: "Jasny podzial: osobna komunikacja dla problemow zdrowotnych i osobna dla celu sylwetkowego."
      },
{
        title: "Diagnostyka + plan 12 tygodni",
        desc: "Start od konsultacji i analizy ruchu, potem plan etapowy z mierzalnym progresem."
      },
{
        title: "Case studies zamiast ogolnikow",
        desc: "Wynik + czas wspolpracy + kontekst problemu, zeby budowac wiarygodnosc."
      }
    ],
    pricingPlans: [
{
        name: "Start Bez Bolu",
        subtitle: "Pierwsze 4 tygodnie pod kontrola.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Konsultacja + analiza ruchu",
"Plan medyczny dopasowany do objawow",
"Korekta techniki raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Bez Bolu"
      },
{
        name: "Ruch + Sila",
        subtitle: "Kompleksowe prowadzenie i progres.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko ze Start Bez Bolu",
"Plan silowy + mobilnosc + prewencja",
"Cotygodniowy raport i korekty",
"Kontakt biezacy 1:1"
        ],
        ctaLabel: "Wybieram Ruch + Sila"
      },
{
        name: "Performance Care",
        subtitle: "Dla osob z ambitnym celem.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Prowadzenie 1:1 premium",
"Priorytetowe konsultacje",
"Plan pod start lub sezon"
        ],
        ctaLabel: "Wybieram Performance Care"
      }
    ],
    faqItems: [
{
        q: "Czy moge trenowac przy bolu plecow lub kolan?",
        a: "Tak, plan zaczyna sie od bezpiecznych zakresow ruchu i stopniowej progresji."
      },
{
        q: "Jak szybko zobacze ulge?",
        a: "Pierwsze zmiany zwykle widac po 2-4 tygodniach regularnej pracy i korekcie nawykow."
      },
{
        q: "Czy potrzebuje silowni?",
        a: "Nie, start mozliwy jest z podstawowym sprzetem i cwiczeniami domowymi."
      },
{
        q: "Czy jest kontakt miedzy treningami?",
        a: "Tak, kontakt biezacy sluzy szybkiej korekcie i utrzymaniu bezpiecznego progresu."
      }
    ],
    leadMagnetTitle: "Pobierz checkliste: 7 krokow treningu bez bolu.",
    leadMagnetText: "Material startowy dla osob po kontuzji i z przeciazeniami - jak trenowac bezpiecznie i skutecznie."
  },
  "trener-personalny-szymon-idzinski": {
    heroTitleTop: "TRENING 1:1",
    heroTitleAccent: "DOPASOWANY DO CIEBIE.",
    heroText: "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Szymon - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening personalny 1:1",
    quickWin: "Prosty landing z oferta 1:1 i sekcja jak wyglada pierwszy trening.",
    researchCue: "Trener personalny - Szymon Idzinski.",
    researchSource: "https://www.facebook.com/profile.php?id=61556486013241",
    researchConfidence: "medium",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Jasna oferta 3-pakietowa",
        desc: "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami."
      },
{
        title: "Krotki formularz kwalifikacyjny",
        desc: "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy."
      },
{
        title: "Sekcja pierwsze 30 dni",
        desc: "Transparentny proces startu redukuje obawy klienta."
      }
    ],
    pricingPlans: [
{
        name: "Start 1:1",
        subtitle: "Plan i wdrozenie podstaw.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Plan treningowy dopasowany do celu",
"Instrukcje i korekta techniki",
"Kontakt raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start 1:1"
      },
{
        name: "Prowadzenie 1:1",
        subtitle: "Najczesciej wybierany pakiet.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start 1:1",
"Cotygodniowy raport i korekty",
"Plan odzywiania lub wskazowki",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Prowadzenie 1:1"
      },
{
        name: "VIP Hybrid",
        subtitle: "Opieka premium + konsultacje.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe wsparcie",
"Strategia 90 dni",
"Pelna personalizacja procesu"
        ],
        ctaLabel: "Wybieram VIP Hybrid"
      }
    ],
    faqItems: [
{
        q: "Czy moge zaczac od zera?",
        a: "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci."
      },
{
        q: "Czy wspolpraca jest tylko stacjonarna?",
        a: "Nie, mozliwy jest model online lub hybrydowy."
      },
{
        q: "Jak szybko odpisujesz po zgloszeniu?",
        a: "Najczesciej w 24h, z propozycja pierwszego kroku."
      },
{
        q: "Czy dostane plan pod cel i czas?",
        a: "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia."
      }
    ],
    leadMagnetTitle: "Pobierz plan startowy: pierwsze 7 dni wspolpracy.",
    leadMagnetText: "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc."
  },
  "trener-radoslaw-habera": {
    heroTitleTop: "TRENING MEDYCZNY",
    heroTitleAccent: "BEZPIECZNIE I SKUTECZNIE.",
    heroText: "Strategia oparta o diagnostyke ruchu, progres obciazen i jasny plan powrotu do formy. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Radoslaw - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Oferta jest ustawiona pod klientow z bolem, po kontuzji i osoby, ktore chca trenowac bezpiecznie. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "trening medyczny / fizjo",
    quickWin: "Podpiac CTA pod wpisy blogowe (np. staw skokowy -> konsultacja).",
    researchCue: "Stopa i staw skokowy skrecenie.",
    researchSource: "https://radoslawhabera.pl/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Sciezka bol -> forma",
        desc: "Jasny podzial: osobna komunikacja dla problemow zdrowotnych i osobna dla celu sylwetkowego."
      },
{
        title: "Diagnostyka + plan 12 tygodni",
        desc: "Start od konsultacji i analizy ruchu, potem plan etapowy z mierzalnym progresem."
      },
{
        title: "Case studies zamiast ogolnikow",
        desc: "Wynik + czas wspolpracy + kontekst problemu, zeby budowac wiarygodnosc."
      }
    ],
    pricingPlans: [
{
        name: "Start Bez Bolu",
        subtitle: "Pierwsze 4 tygodnie pod kontrola.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Konsultacja + analiza ruchu",
"Plan medyczny dopasowany do objawow",
"Korekta techniki raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Bez Bolu"
      },
{
        name: "Ruch + Sila",
        subtitle: "Kompleksowe prowadzenie i progres.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko ze Start Bez Bolu",
"Plan silowy + mobilnosc + prewencja",
"Cotygodniowy raport i korekty",
"Kontakt biezacy 1:1"
        ],
        ctaLabel: "Wybieram Ruch + Sila"
      },
{
        name: "Performance Care",
        subtitle: "Dla osob z ambitnym celem.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Prowadzenie 1:1 premium",
"Priorytetowe konsultacje",
"Plan pod start lub sezon"
        ],
        ctaLabel: "Wybieram Performance Care"
      }
    ],
    faqItems: [
{
        q: "Czy moge trenowac przy bolu plecow lub kolan?",
        a: "Tak, plan zaczyna sie od bezpiecznych zakresow ruchu i stopniowej progresji."
      },
{
        q: "Jak szybko zobacze ulge?",
        a: "Pierwsze zmiany zwykle widac po 2-4 tygodniach regularnej pracy i korekcie nawykow."
      },
{
        q: "Czy potrzebuje silowni?",
        a: "Nie, start mozliwy jest z podstawowym sprzetem i cwiczeniami domowymi."
      },
{
        q: "Czy jest kontakt miedzy treningami?",
        a: "Tak, kontakt biezacy sluzy szybkiej korekcie i utrzymaniu bezpiecznego progresu."
      }
    ],
    leadMagnetTitle: "Pobierz checkliste: 7 krokow treningu bez bolu.",
    leadMagnetText: "Material startowy dla osob po kontuzji i z przeciazeniami - jak trenowac bezpiecznie i skutecznie."
  },
  "wiktoria-wasik": {
    heroTitleTop: "METAMORFOZA",
    heroTitleAccent: "BEZ CHAOSU I LOSOWOSCI.",
    heroText: "Program ustawiony pod redukcje lub budowe sylwetki, z jasnym procesem i regularnym rozliczaniem progresu. Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia.",
    aboutHeading: "Wiktoria - trening personalny z planem, ktory da sie utrzymac.",
    aboutText: "Komunikacja strony skupia sie na realnych efektach, konkretnej sciezce wspolpracy i prostym CTA. Wspolprace zaczynamy od jasnego celu i prostego planu startowego, a potem regularnie korygujemy dzialania pod realny progres.",
    nicheLabel: "metamorfoza sylwetki",
    quickWin: "W pierwszym ekranie pokazac 3 kafle ofert i jedno mocne CTA.",
    researchCue: "Trener Personalny Bydgoszcz.",
    researchSource: "https://wiktoria.fit/",
    researchConfidence: "high",
    valueProps: [
{
        title: "Start od konsultacji i diagnozy",
        desc: "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie."
      },
{
        title: "Sciezka pierwsze 30 dni",
        desc: "Jasny plan startu: diagnoza, plan, pierwsze nawyki i pierwszy raport."
      },
{
        title: "Dowody efektow",
        desc: "Historie klientow z wynikiem, czasem i zakresem wspolpracy."
      },
{
        title: "Jeden glowny CTA",
        desc: "Krotka droga do kontaktu: formularz i szybka kwalifikacja."
      }
    ],
    pricingPlans: [
{
        name: "Start Sylwetka",
        subtitle: "Plan i wdrozenie na 4 tygodnie.",
        price: "299 zl",
        period: "/ mies",
        features: [
"Indywidualny plan treningowy",
"Podstawy odzywiania i nawykow",
"Kontrola postepu raz w tygodniu"
        ],
        ctaLabel: "Wybieram Start Sylwetka"
      },
{
        name: "Transformacja 1:1",
        subtitle: "Pelne prowadzenie pod efekt.",
        price: "599 zl",
        period: "/ mies",
        featured: true,
        features: [
"Wszystko z Start Sylwetka",
"Plan zywieniowy i monitoring",
"Cotygodniowy raport i korekty",
"Kontakt biezacy"
        ],
        ctaLabel: "Wybieram Transformacje 1:1"
      },
{
        name: "VIP Metamorfoza",
        subtitle: "Dla osob z ambitnym celem.",
        price: "999 zl",
        period: "/ mies",
        features: [
"Priorytetowe konsultacje",
"Strategia na 90 dni",
"Wsparcie premium i analiza wynikow"
        ],
        ctaLabel: "Wybieram VIP Metamorfoza"
      }
    ],
    faqItems: [
{
        q: "Czy dam rade, jesli zaczynam od zera?",
        a: "Tak, program jest skalowany pod poziom startowy i tempo klienta."
      },
{
        q: "Kiedy widac pierwsze efekty?",
        a: "Najczesciej po 3-4 tygodniach widac zmiany w obwodach i samopoczuciu."
      },
{
        q: "Czy dieta jest restrykcyjna?",
        a: "Nie, priorytetem sa nawyki i plan, ktory da sie utrzymac dlugoterminowo."
      },
{
        q: "Jak wyglada kontakt?",
        a: "Kontakt biezacy i cotygodniowy raport pomagaja utrzymac tempo progresu."
      }
    ],
    leadMagnetTitle: "Pobierz plan: pierwsze 30 dni metamorfozy.",
    leadMagnetText: "Gotowy start pod redukcje lub budowe sylwetki z checklistami i prostymi zasadami."
  }
};
