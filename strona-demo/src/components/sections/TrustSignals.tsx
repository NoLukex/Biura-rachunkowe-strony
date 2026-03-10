import { ShieldCheck, Clock3, BadgeCheck, Handshake } from 'lucide-react';
import { currentBiuro } from '@/src/data/biura/currentBiuro';

const baseSignals = [
  {
    icon: ShieldCheck,
    title: 'Procedury bezpieczeństwa',
    description: 'Kontrolowany obieg dokumentów i uporządkowane zasady dostępu do danych.',
  },
  {
    icon: Clock3,
    title: 'Terminowa komunikacja',
    description: 'Stały harmonogram kontaktu i przypomnienia kluczowych terminów podatkowych.',
  },
  {
    icon: BadgeCheck,
    title: 'Jasna odpowiedzialność',
    description: 'Każdy etap współpracy ma przypisaną osobę i klarowny zakres działań.',
  },
  {
    icon: Handshake,
    title: 'Współpraca długoterminowa',
    description: 'Model pracy nastawiony na ciągłość obsługi i przewidywalność dla firmy.',
  },
];

export function TrustSignals() {
  const teamModelLabel = currentBiuro.teamType === 'jednoosobowe' ? 'Kontakt 1:1 z opiekunem' : 'Zespół specjalistów';
  const signals = [
    {
      ...baseSignals[0],
      description: `${baseSignals[0].description} Model współpracy: ${teamModelLabel}.`,
    },
    ...baseSignals.slice(1),
  ];

  return (
    <section className="py-14 md:py-20 bg-white" id="standardy">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm uppercase tracking-wider text-blue-600 font-semibold mb-3">Standard współpracy</p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Jak dbamy o jakość obsługi</h2>
          <p className="text-lg text-slate-600">
            Konkretne zasady pracy, które porządkują księgowość i dają przewidywalność na co dzień.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {signals.map((signal) => (
            <article key={signal.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <signal.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{signal.title}</h3>
              <p className="text-slate-600 leading-relaxed">{signal.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
