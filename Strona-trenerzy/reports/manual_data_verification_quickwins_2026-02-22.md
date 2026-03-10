# Manual verification - quickwin trainers (2026-02-22)

- Scope: 26 trainers from `quickWinConfig.ts`
- Identity check method: live source URL HTTP fetch + name/token match in title/content/URL
- Result: 26/26 OK, 0 require manual follow-up

## Key findings
- Identity match confirmed for 25/26 directly from main source URLs.
- `jagoda-konczal-trener-personalny`: homepage title is only `start`, but identity confirmed manually via subpage `https://jagodatwojatrenerka.com/jagoda-konczal-trener`.
- Data completeness issue: 12 trainers marked `email: verified` in local review file have empty `profile.ts` email field.
- Data hygiene issue: 3 trainers have multi-value social links stored in single URL fields (semicolon-separated).
- Not part of identity mismatch but important: several marketing blocks (testimonials/case studies) are template content, not verified real-person outcomes.

## Identity verification per trainer

| slug | fullName | confidence | HTTP | verdict | title (source) |
|---|---|---|---:|---|---|
| arkadiusz-czajkowski-trener-personalny | Arkadiusz Czajkowski | high | 200 | OK | Trener personalny Bydgoszcz - Arkadiusz Czajkowski |
| bartosz-jaszczak-trener-personalny-bydgoszcz | Bartosz Jaszczak | high | 200 | OK | Home - bartoszjaszczak.pl |
| bartosz-trzebiatowski-trener-personalny | Bartosz Trzebiatowski | high | 200 | OK | Współpraca - Bartosz Trzebiatowski |
| bartosz-tywusik-trener-personalny | Bartosz Tywusik | high | 200 | OK | Architekt Ciała – Transformacja Sylwetki w 90 dni |
| damian-piskorz | Damian Piskorz | high | 200 | OK | Team Piskorz |
| daria-petla-trener-personalny | Daria Petla | high | 200 | OK | Daria Petla – Trenerka personalna z Bydgoszczy – DariaFit.pl |
| dawid-cichanski | Dawid Cichański | medium | 200 | OK | Dawid Cichański - Trener Personalny Bydgoszcz / Bydgoszcz |
| dietetyk-bydgoszcz-tomasz-giza | Tomasz Giza | high | 200 | OK | gizafit.com |
| forever-athlete-vincent-marek | Forever Athlete | low | 200 | OK | Forever Athlete |
| jagoda-konczal-trener-personalny | Jagoda Kończal | low | 200 | OK_with_manual_subpage | start |
| jakub-stypczynski-trener-personalny-bydgoszcz | Jakub Stypczyński | high | 200 | OK | Strona główna - Jakub Stypczyński |
| kaja-narkun | Kaja Narkun | low | 200 | OK | Trener: Kaja Narkun w Zdrofit - klub fitness i siłownia |
| lukasz-dziennik-atletyczna-sila | Lukasz Dziennik | high | 200 | OK | Łukasz Dziennik - REPs Polska |
| maciej-karolczyk-trener-personalny | Maciej Karolczyk | low | 200 | OK | Maciej Karolczyk |
| maja-burek-trener-personalny | Maja Burek | medium | 200 | OK | Maja Burek - Trenerka Personalna Bydgoszcz / Bydgoszcz |
| mateusz-mazur | Mateusz Mazur | high | 200 | OK | Mateusz Mazur Trener Personalny - Payhip |
| mikolaj-karaszewski-fitness-lifestyle | Mikołaj Karaszewski | medium | 200 | OK | Fitness & Lifestyle (@mikolaj.karaszewski) • Instagram photos and videos |
| norbert-lysiak-trener-osobisty-triathlon-mtb-plywanie | Norbert Łysiak | high | 200 | OK | Norbert Łysiak - trener triatlonu, MTB / Bydgoszcz |
| oskar-kaliszewski-trener-personalny | Oskar Kaliszewski | low | 200 | OK | Trener Personalny Bydgoszcz Oskar Kaliszewski (@trener_oskar.kaliszewski) • Instagram p... |
| patryk-kozikowski | Patryk Kozikowski | low | 200 | OK | Patryk Kozikowski - REPs Polska |
| patryk-michalek-trener-personalny | Patryk Michałek | high | 200 | OK | Patryk Michałek Trener Personalny Bydgoszcz |
| trener-personalny-bydgoszcz-nicolas-marysiak | Nicolas Marysiak | high | 200 | OK | Trener Personalny Bydgoszcz Nicolas Marysiak |
| trener-personalny-kamil-makowski | Kamil Makowski | high | 200 | OK | Trener Personalny / Kamil Makowski |
| trener-personalny-szymon-idzinski | Szymon Idziński | medium | 200 | OK | Trener personalny - Szymon Idziński |
| trener-radoslaw-habera | Radosław Habera | high | 200 | OK | Trener Medyczny – RadosÅaw Habera |
| wiktoria-wasik | Wiktoria Wasik | high | 200 | OK | Wiktoria Wasik - Trener Personalny Bydgoszcz |

## Issues to fix (manual)

### Verified email missing in profile

- `dawid-cichanski` (`emailStatus=verified`, `profileEmail` empty)
- `forever-athlete-vincent-marek` (`emailStatus=verified`, `profileEmail` empty)
- `kaja-narkun` (`emailStatus=verified`, `profileEmail` empty)
- `maciej-karolczyk-trener-personalny` (`emailStatus=verified`, `profileEmail` empty)
- `maja-burek-trener-personalny` (`emailStatus=verified`, `profileEmail` empty)
- `mateusz-mazur` (`emailStatus=verified`, `profileEmail` empty)
- `mikolaj-karaszewski-fitness-lifestyle` (`emailStatus=verified`, `profileEmail` empty)
- `oskar-kaliszewski-trener-personalny` (`emailStatus=verified`, `profileEmail` empty)
- `patryk-kozikowski` (`emailStatus=verified`, `profileEmail` empty)
- `trener-personalny-bydgoszcz-nicolas-marysiak` (`emailStatus=verified`, `profileEmail` empty)
- `trener-personalny-szymon-idzinski` (`emailStatus=verified`, `profileEmail` empty)
- `trener-radoslaw-habera` (`emailStatus=verified`, `profileEmail` empty)

### Multi-value social URL fields

- `bartosz-jaszczak-trener-personalny-bydgoszcz` -> instagram:multi_value
- `trener-personalny-kamil-makowski` -> instagram:multi_value
- `wiktoria-wasik` -> instagram:multi_value, facebook:multi_value

### High-priority data anomalies

- `jakub-stypczynski-trener-personalny-bydgoszcz`: suspicious email value `%20stypczynsky@o2.p` (likely malformed).
