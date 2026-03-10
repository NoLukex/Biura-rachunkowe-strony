import { PhoneCall, FileSignature, RefreshCw, Smartphone, PieChart } from 'lucide-react';

const steps = [
  {
    icon: PhoneCall,
    title: 'Darmowa konsultacja (15 min)',
    description: 'Analizujemy Twoją sytuację i dobieramy optymalną formę opodatkowania.'
  },
  {
    icon: FileSignature,
    title: 'Przejrzysta umowa',
    description: 'Podpisujemy umowę online (Autenti/DocuSign). Zero ukrytych opłat.'
  },
  {
    icon: RefreshCw,
    title: 'Szybkie wdrożenie',
    description: 'Pomagamy wypowiedzieć umowę poprzedniemu biuru i przenosimy Twoje dane do naszego systemu. Konfigurujemy dostęp do KSeF.'
  },
  {
    icon: Smartphone,
    title: 'Wygodna codzienność',
    description: 'Wgrywasz dokumenty przez aplikację 24/7. My zajmujemy się resztą.'
  },
  {
    icon: PieChart,
    title: 'Spokój i raporty',
    description: 'Co miesiąc otrzymujesz jasne podsumowanie finansowe i informacje o podatkach z odpowiednim wyprzedzeniem.'
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-100" id="jak-to-dziala">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Jak to działa?
          </h2>
          <p className="text-lg text-slate-600">
            Zmiana księgowego nie musi być trudna. Zobacz, jak prosty jest proces przejścia do naszego biura.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-6 pb-12 last:pb-0">
              {/* Line connecting steps */}
              {index !== steps.length - 1 && (
                <div className="absolute left-6 top-14 bottom-0 w-px bg-blue-100" />
              )}
              
              <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                <step.icon className="w-6 h-6" />
              </div>
              
              <div className="pt-2">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
