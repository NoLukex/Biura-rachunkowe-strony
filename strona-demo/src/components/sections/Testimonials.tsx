import { motion } from 'motion/react';
import { Star, Building2, Clock, FileCheck2 } from 'lucide-react';
import { currentBiuro } from '@/src/data/biura/currentBiuro';

function toClientVoice(challenge: string, result: string): string {
  const first = (challenge || '').trim();
  const second = (result || '').trim();
  if (!first && !second) {
    return 'Dzięki współpracy uporządkowaliśmy proces księgowy i mamy większą przewidywalność finansową.';
  }
  if (!first) {
    return `Po rozpoczęciu współpracy ${second.charAt(0).toLowerCase()}${second.slice(1)}`;
  }
  if (!second) {
    return `Przed współpracą mierzyliśmy się z tym, że ${first.charAt(0).toLowerCase()}${first.slice(1)}`;
  }
  return `Przed współpracą mieliśmy problem: ${first.charAt(0).toLowerCase()}${first.slice(1)} Po wdrożeniu zmian: ${second.charAt(0).toLowerCase()}${second.slice(1)}`;
}

const defaultTestimonials = [
  {
    company: 'TechFlow Sp. z o.o.',
    quote: 'Po zmianie biura uporządkowaliśmy dokumenty i proces raportowania. Mamy jasny harmonogram działań i szybki kontakt z księgową.',
    author: 'Michał Kowalski, CEO',
  },
  {
    company: 'E-commerce Plus',
    quote: 'Przy dużej liczbie faktur dostaliśmy stabilny obieg dokumentów i lepszą przewidywalność rozliczeń. Zespół reaguje szybko przy zmianach.',
    author: 'Anna Nowak, Właścicielka',
  },
  {
    company: 'Studio Architektoniczne',
    quote: 'Konsultacja pomogła nam dobrać lepszy model rozliczeń. Przejście do nowego biura było sprawne i bez przestojów operacyjnych.',
    author: 'Piotr Wiśniewski, Architekt',
  },
  {
    company: 'Agencja Marketingowa',
    quote: 'Przenieśliśmy obieg dokumentów do online i skończyły się nerwowe końcówki miesiąca. Cały proces jest teraz bardziej przewidywalny.',
    author: 'Katarzyna Lewandowska, założycielka',
  },
  {
    company: 'Janusz-Pol Transport',
    quote: 'Przy wdrożeniu KSeF dostaliśmy konkretny plan działania i wsparcie zespołu. Dzisiaj proces fakturowania jest dla nas prostszy.',
    author: 'Janusz Dąbrowski, Właściciel',
  },
  {
    company: 'IT Consulting',
    quote: 'Doceniam przejrzystą komunikację i jasne informacje o terminach. Dzięki temu łatwiej planuję płynność finansową firmy.',
    author: 'Tomasz Zieliński, konsultant B2B',
  },
];

export function Testimonials() {
  const testimonials = currentBiuro.caseStudies?.length
    ? currentBiuro.caseStudies.map((item, index) => ({
        company: item.company,
        quote: toClientVoice(item.challenge, item.result),
        author: index === 0 ? 'Właściciel firmy' : 'Klient biura',
      }))
    : defaultTestimonials;

  const stats = [
    {
      icon: Building2,
      value: '100+',
      label: 'zadowolonych klientów',
    },
    {
      icon: Clock,
      value: '24h',
      label: 'czas odpowiedzi',
    },
    {
      icon: FileCheck2,
      value: '10+ lat',
      label: 'doświadczenia',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-100" id="opinie">
      <div className="container mx-auto px-4 md:px-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <stat.icon size={32} strokeWidth={1.5} />
              </div>
              <div className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{stat.value}</div>
              <div className="text-lg text-slate-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Opinie i rezultaty klientów
          </h2>
          <p className="text-lg text-slate-600">
            Krótkie przykłady pokazujące, jak wygląda współpraca operacyjna i jakie daje efekty.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-slate-700 mb-8 flex-1 text-lg leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shadow-sm">
                  {testimonial.company
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{testimonial.company}</div>
                  <div className="text-sm text-slate-500">{testimonial.author}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
