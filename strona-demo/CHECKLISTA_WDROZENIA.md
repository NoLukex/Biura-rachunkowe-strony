# Checklista wdrożenia pod klienta

## 1) Dane firmy
- [ ] Uzupełnij `src/constants.ts` (nazwa, telefon, email, NIP, REGON, adres)
- [ ] Uzupełnij profile social media w `src/constants.ts`
- [ ] Ustaw endpoint formularza (`VITE_CONTACT_ENDPOINT` lub `SITE_CONFIG.contact.formEndpoint`)

## 2) Tryb strony
- [ ] Dla demo ustaw `VITE_SITE_MODE=demo`
- [ ] Dla produkcji ustaw `VITE_SITE_MODE=prod`
- [ ] Ustaw docelową domenę w `VITE_SITE_URL`
- [ ] Zweryfikuj `/.env.production` przed buildem produkcyjnym

## 3) SEO i indeksacja
- [ ] Uruchom `npm run seo:generate` (lub `npm run build`, które robi to automatycznie)
- [ ] Zweryfikuj wygenerowane `public/robots.txt` (w prod ma być `Allow: /`)
- [ ] Zweryfikuj wygenerowane `public/sitemap.xml` (poprawna domena i wszystkie trasy)
- [ ] Sprawdź metadane per podstrona (title/description/canonical/OG)

## 4) Treści i zgodność
- [ ] Dopasuj treści gwarancji do realnej oferty klienta
- [ ] Zweryfikuj i uzupełnij `PolitykaPrywatnosci.tsx` oraz `Regulamin.tsx`
- [ ] Podmień zdjęcia i opinie na wersje zaakceptowane przez klienta

## 5) Testy przed publikacją
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Test formularza kontaktowego (wysyłka i odbiór)
- [ ] Test mobile + desktop (menu, CTA, FAQ, podstrony usług)
- [ ] Test scrolli hash (`#kontakt`, `#panel`, `#faq`, `#pakiety`) z różnych podstron
