import { TrendingUp, Clock3, ShieldCheck } from 'lucide-react';
import { currentBiuro } from '@/src/data/biura/currentBiuro';

const defaultCaseStudies = [
  {
    company: 'Software House (25 osób)',
    challenge: 'Chaotyczny obieg dokumentów i brak przewidywalności podatków.',
    result: 'Ujednolicony proces rozliczeń i comiesięczna informacja o zobowiązaniach z wyprzedzeniem.',
    icon: Clock3,
  },
  {
    company: 'E-commerce (1200+ dokumentów/mies.)',
    challenge: 'Duża liczba faktur i błędy przy ręcznym księgowaniu.',
    result: 'Automatyzacja obiegu oraz stabilny proces KSeF bez przestojów operacyjnych.',
    icon: TrendingUp,
  },
  {
    company: 'Spółka usługowa B2B',
    challenge: 'Niepewność przy decyzjach podatkowych i ryzyko korekt.',
    result: 'Stałe doradztwo i jasne warianty decyzji z opisem ryzyka.',
    icon: ShieldCheck,
  },
];

export function CaseStudies() {
  const icons = [Clock3, TrendingUp, ShieldCheck];
  const caseStudies = currentBiuro.caseStudies?.length
    ? currentBiuro.caseStudies.slice(0, 3).map((item, index) => ({
        ...item,
        icon: icons[index % icons.length],
      }))
    : defaultCaseStudies;

  return (
    <section className="py-24 bg-white" id="case-studies">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Przykładowe efekty współpracy
          </h2>
          <p className="text-lg text-slate-600">
            Krótkie scenariusze pokazujące typowe rezultaty współpracy z {currentBiuro.displayName}.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((item) => (
            <article key={item.company} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <item.icon className="w-7 h-7 text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">{item.company}</h3>
              <p className="text-sm text-slate-600 mb-3">
                <span className="font-semibold text-slate-800">Wyzwanie:</span> {item.challenge}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Efekt:</span> {item.result}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
