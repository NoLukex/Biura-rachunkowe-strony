# Zalecenia ogolne

## Cel i wzorzec
- Wzor referencyjny: `AM Kancelaria`.
- Kazde kolejne biuro doprowadzamy do takiego samego poziomu jakosci UX/copy jak `AM Kancelaria`.
- Pracujemy iteracyjnie: jeden slug -> poprawki -> szybkie QA -> kolejny slug.

## Zasada obowiazkowa: skill-first
- Przy kazdym nowym wdrozeniu najpierw uzywamy skilli z folderu `skills/`.
- Minimalny zestaw:
  - brainstorming (kierunek copy i UX, 1 pytanie naraz, bez zgadywania),
  - ui-ux-pro-max (wybor stylu, mikrocopy, czytelnosc, kontrast, responsive),
  - dopiero potem implementacja.
- Nie wdrazamy zmian UX/copy bez uprzedniego ustalenia kierunku.

## Branding i nazewnictwo
- W marketingowej nazwie usuwamy dopiski formalne (`Sp. z o.o`, `S.A.` itp.).
- Pola formalne zostaja bez zmian (`legalName`).
- Dotyczy: `displayName`, `hero.titleTop`, `navName`, etykiety roli zespolu.

## Logo i identyfikacja
- Jesli istnieje `logoUrl`, logo musi byc widoczne na stronie.
- Miejsca obowiazkowe: navbar, hero badge, footer.
- Fallback: litera marki, gdy obraz sie nie laduje.

## Hero (header ze zdjeciem)
- Hero image ma byc trafione tematycznie dla biura (bez przypadkowych budynkow i nietrafionych stockow).
- Dla `jednoosobowe` fallback zdjecia:
  - kobieta, jesli wlascicielka,
  - mezczyzna, jesli brak pewnosci.
- Na zdjeciu hero ma byc 1 estetyczny trust strip (nie dwa male kafelki):
  - `Dedykowana opieka ksiegowa i szybki kontakt`.
- Trust strip ma byc subtelny i premium (czytelny kontrast, bez topornosci).

## Sekcja zespolu
- Brak duplikacji zdjec dla kilku osob.
- Nie uzywamy zdjec nietwarzowych jako zdjec zespolu (budynek, logo, banner, wnnetrza).
- Uklad dynamiczny:
  - 1 osoba: wycentrowany layout,
  - 2 osoby: wycentrowane 2 kolumny,
  - 3 osoby: wycentrowane 3 kolumny,
  - 4+: standardowa siatka.
- Dla `jednoosobowe`:
  - naglowek `Twoj opiekun ksiegowy`,
  - 1 karta osoby prowadzacej,
  - blok `Jak wyglada wspolpraca 1:1`.

## Copy i jezyk
- Nie pokazujemy technicznego jezyka typu `typ zespolu`, `model pracy`.
- Komunikacja ma byc kliencka i konkretna (korzysci + jasnosc).
- Sekcja efektow wspolpracy:
  - naglowek: `Efekty wspolpracy`,
  - podtytul: aktualny, uzgodniony z userem,
  - tresc w tonie marki biura, nie suchy opis techniczny.
- Statystyki nad sekcja efektow:
  - `100+ zadowolonych klientow`,
  - `24h czas odpowiedzi`,
  - `10+ lat doswiadczenia`.

## Sekcja kontaktu
- Usuniety blok `Strona www` na dole sekcji kontaktu.
- Priorytet: telefon, email, adres, formularz.

## CRM i ready pages
- W CRM rekordy z `ready page` maja byc na gorze listy.
- Link localhost dla gotowych biur ma prowadzic do `?biuro=<slug>`.
- Dla biur pokazujemy status `ready page` / `no ready page`.

## Procedura dzienna (zeby jutro robic to identycznie)
1. Otworz CRM i wybierz kolejny slug z `ready page`.
2. Uruchom brainstorming dla kierunku zmian (jedno pytanie naraz).
3. Uzyj `ui-ux-pro-max` do szybkiej walidacji stylu/mikrocopy.
4. Wprowadz zmiany w danych i komponentach.
5. Sprawdz na localhost dla konkretnego sluga (hard refresh).
6. Uruchom `npm run lint` i `npm run build`.
7. Zapisz wynik i przejdz do kolejnego sluga.

## Definicja done dla pojedynczego biura
- Nazwa marketingowa bez dopiskow formalnych.
- Logo widoczne i poprawne.
- Hero wyglada wiarygodnie, trust strip czytelny.
- Sekcja zespolu dopasowana do typu biura (1:1 albo zespol).
- Sekcja `Efekty wspolpracy` ma poprawny naglowek, podtytul i statystyki.
- Kontakt bez bloku `Strona www`.
- Lint i build przechodza.
