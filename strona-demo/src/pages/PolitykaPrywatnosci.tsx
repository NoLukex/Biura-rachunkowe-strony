import { SITE_CONFIG } from '../constants';

export function PolitykaPrywatnosci() {
  const hasNip = SITE_CONFIG.nip && !SITE_CONFIG.nip.toLowerCase().includes('uzupelnij');

  return (
    <section className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">Polityka prywatności</h1>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Administrator danych</h2>
            <p>{SITE_CONFIG.name}</p>
            <p>{SITE_CONFIG.address}</p>
            {hasNip && <p>NIP: {SITE_CONFIG.nip}</p>}
            <p>Email kontaktowy: {SITE_CONFIG.email}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Zakres i cel przetwarzania</h2>
            <p>
              Dane z formularza kontaktowego są przetwarzane w celu obsługi zapytania i kontaktu zwrotnego. Zakres
              danych obejmuje imię i nazwisko, numer telefonu, adres email oraz treść wiadomości.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Podstawa prawna</h2>
            <p>
              Przetwarzanie danych odbywa się na podstawie art. 6 ust. 1 lit. b i f RODO, tj. w celu podjęcia działań
              przed zawarciem umowy oraz realizacji prawnie uzasadnionego interesu administratora polegającego na
              prowadzeniu komunikacji z potencjalnymi klientami.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Okres przechowywania danych</h2>
            <p>
              Dane przechowujemy przez okres niezbędny do obsługi zapytania, a następnie przez czas wynikający z
              obowiązków prawnych lub do czasu przedawnienia ewentualnych roszczeń.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Prawa osoby, której dane dotyczą</h2>
            <p>
              Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania,
              przenoszenia oraz wniesienia sprzeciwu, a także prawo wniesienia skargi do Prezesa UODO.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
