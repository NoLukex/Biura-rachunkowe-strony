<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Demo strony biura rachunkowego

Szablon landing page pod biura rachunkowe. Dane są celowo demonstracyjne i powinny być uzupełnione pod klienta.

## Uruchomienie lokalne

Wymagania: Node.js 20+

1. Zainstaluj zależności:
   `npm install`
2. Uruchom dev server:
   `npm run dev`

## Formularz kontaktowy

Formularz działa na dwa sposoby:

1. **Z endpointem** (zalecane):
   - ustaw `VITE_CONTACT_ENDPOINT` w `.env.local`
   - albo wpisz endpoint w `src/constants.ts` -> `SITE_CONFIG.contact.formEndpoint`
2. **Bez endpointu**:
   - w trybie demo formularz otwiera domyślnego klienta poczty (`mailto:`)
   - w trybie produkcyjnym brak endpointu zwróci błąd

Po poprawnym wysłaniu formularza wysyłane są eventy:
- `dataLayer.push({ event: "contact_form_submit" })`
- `gtag("event", "generate_lead", ...)`

Przykład `.env.local`:

```bash
VITE_CONTACT_ENDPOINT="https://twoj-endpoint.pl/api/lead"
VITE_SITE_MODE="demo" # demo | prod
VITE_SITE_URL="https://twojebiuro.pl"
```

## SEO i indeksacja

Przed każdym buildem automatycznie generowane są:
- `public/robots.txt`
- `public/sitemap.xml`

na podstawie zmiennych `VITE_SITE_MODE` i `VITE_SITE_URL`.

- `VITE_SITE_MODE="demo"` -> blokada indeksacji (`Disallow: /`)
- `VITE_SITE_MODE="prod"` -> indeksacja włączona (`Allow: /`)

## Personalizacja pod klienta

Przed przekazaniem klientowi uzupełnij:
- `src/constants.ts` (nazwa, NIP, kontakt, adres, social media, mapa)
- `index.html` (meta SEO, canonical, OG/Twitter, JSON-LD)
- `public/robots.txt` i `public/sitemap.xml` (domena)
- treści prawne w `src/pages/PolitykaPrywatnosci.tsx` i `src/pages/Regulamin.tsx`

## Uwaga o publikacji

Przed publikacją ustaw:
- `VITE_SITE_MODE="prod"`
- `VITE_SITE_URL` na docelową domenę

Następnie uruchom `npm run build` i zweryfikuj wygenerowane pliki SEO.

Pełna checklista przekazania do klienta:
- `CHECKLISTA_WDROZENIA.md`
