import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { currentBiuro } from '@/src/data/biura/currentBiuro';

const defaultFaqItems = [
  {
    question: 'Ile trwa zmiana biura rachunkowego?',
    answer:
      'W większości przypadków od 3 do 10 dni roboczych. Przejmujemy kontakt z poprzednim biurem i listę kontrolną dokumentów.',
  },
  {
    question: 'Czy pomagacie we wdrożeniu KSeF?',
    answer:
      'Tak. Konfigurujemy obieg dokumentów, weryfikujemy poprawność i wspieramy zespół po starcie.',
  },
  {
    question: 'Czy mogę mieć dedykowaną księgową?',
    answer:
      'Tak, model współpracy 1:1 jest standardem w pakietach biznesowych i premium.',
  },
  {
    question: 'Jak wygląda odpowiedzialność za rozliczenia?',
    answer:
      'Zakres odpowiedzialności i procedury bezpieczeństwa opisujemy jasno w umowie oraz modelu współpracy.',
  },
  {
    question: 'Czy moje dane finansowe są bezpieczne?',
    answer:
      'Tak. Korzystamy z kontrolowanego dostępu do danych, bezpiecznych kanałów i uporządkowanych procedur operacyjnych.',
  },
  {
    question: 'Jak wygląda przekazywanie dokumentów?',
    answer:
      'Dokumenty przekazujesz online, a status rozliczeń widzisz w panelu klienta bez papierowych segregatorów.',
  },
  {
    question: 'Czy obsługujecie kadry i ZUS?',
    answer:
      'Tak, prowadzimy pełną obsługę kadrowo-płacową od umów po miesięczne rozliczenia.',
  },
  {
    question: 'Kiedy dostanę dokładną wycenę?',
    answer:
      'Po krótkiej konsultacji przesyłamy wycenę i rekomendowany pakiet zwykle w ciągu 24 godzin.',
  },
];

const curatedFaqItems = [
  {
    question: 'Jak wygląda migracja z obecnego biura?',
    answer:
      'Najpierw robimy checklistę przejęcia dokumentów i terminów, potem prowadzimy Cię krok po kroku przez zmianę bez przestoju operacyjnego.',
  },
  {
    question: 'Kto odpowiada za poprawność rozliczeń?',
    answer:
      'Zakres odpowiedzialności i procedury bezpieczeństwa są opisane w umowie. Każdy etap ma przypisaną osobę odpowiedzialną po naszej stronie.',
  },
  {
    question: 'Po jakim czasie możemy realnie wystartować?',
    answer:
      'Najczęściej od 3 do 10 dni roboczych. Harmonogram uruchomienia potwierdzamy po krótkim audycie Twoich procesów.',
  },
  {
    question: 'Jak wygląda kontakt operacyjny na co dzień?',
    answer:
      'Masz dedykowanego opiekuna i jasny kanał kontaktu. Odpowiadamy zwykle w ciągu 24 godzin roboczych.',
  },
  {
    question: 'Czy pomożecie nam w KSeF i obiegu dokumentów?',
    answer:
      'Tak. Wspieramy konfigurację procesu, testy i bieżącą pracę po uruchomieniu, żeby zespół działał bez chaosu.',
  },
];

export function Faq() {
  const faqItems = currentBiuro.faq?.length ? currentBiuro.faq : curatedFaqItems.length ? curatedFaqItems : defaultFaqItems;

  return (
    <section className="py-16 md:py-24 bg-white" id="faq">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Najczęstsze pytania
          </h2>
          <p className="text-lg text-slate-600">
            Szybkie odpowiedzi na pytania, które klienci najczęściej zadają przed rozpoczęciem współpracy z {currentBiuro.displayName}.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-4">
          {faqItems.map((item, idx) => (
            <motion.details
              key={item.question}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 open:bg-white open:shadow-sm"
            >
              <summary className="cursor-pointer list-none font-semibold text-slate-900 pr-6">
                {item.question}
              </summary>
              <p className="mt-3 text-slate-600 leading-relaxed">{item.answer}</p>
            </motion.details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Masz inne pytanie? Napisz do opiekuna <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
