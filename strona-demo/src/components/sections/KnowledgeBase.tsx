import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, X } from 'lucide-react';
import { trackEvent } from '@/src/lib/analytics';

type Article = {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  slug: string;
  image: string;
  readingTime: string;
  content: string[];
};

const articles: Article[] = [
  {
    title: 'KSeF krok po kroku. Jak przygotować firmę?',
    category: 'Przewodnik',
    date: '12 Mar 2026',
    excerpt: 'Praktyczny poradnik dla przedsiębiorców. Dowiedz się, jak wdrożyć Krajowy System e-Faktur bez stresu i kar.',
    slug: 'ksef-krok-po-kroku',
    image: '/images/blog-ksef.jpg',
    readingTime: '5 min',
    content: [
      'Wdrożenie KSeF warto zacząć od przeglądu obecnego obiegu dokumentów i listy systemów, z których korzysta firma.',
      'Następnie ustaw proces wystawiania i odbierania e-faktur, nadaj role pracownikom i przygotuj procedurę awaryjną.',
      'Na koniec zrób test na próbnych dokumentach i ustal harmonogram monitoringu błędów przed terminami podatkowymi.',
    ],
  },
  {
    title: 'Zmiany w VAT 2026. Co musisz wiedzieć?',
    category: 'Podatki',
    date: '05 Mar 2026',
    excerpt: 'Nowe stawki, odliczenia i terminy. Sprawdź, jak zoptymalizować rozliczenia VAT w nowym roku podatkowym.',
    slug: 'zmiany-vat-2026',
    image: '/images/blog-vat.jpg',
    readingTime: '4 min',
    content: [
      'Największe ryzyko w 2026 to błędne oznaczenia i opóźnienia, dlatego warto uporządkować schematy księgowania.',
      'Firmy z większą liczbą dokumentów powinny ustawić stałe alerty i listę kontrolną przed wysyłką deklaracji.',
      'Dzięki regularnemu audytowi rozliczeń można szybciej wykryć odchylenia i uniknąć kosztownych korekt.',
    ],
  },
  {
    title: 'Optymalizacja składek ZUS dla B2B',
    category: 'Optymalizacja',
    date: '28 Lut 2026',
    excerpt: 'Mały ZUS Plus, ulga na start czy działalność nierejestrowana? Wybierz najlepszą opcję dla swojego biznesu.',
    slug: 'optymalizacja-zus-b2b',
    image: '/images/blog-zus.jpg',
    readingTime: '6 min',
    content: [
      'Przed wyborem modelu rozliczeń warto porównać nie tylko wysokość składek, ale też limity i obciążenia roczne.',
      'Dla B2B kluczowe jest dopasowanie formy opodatkowania do struktury kosztów i sezonowości przychodów.',
      'Najlepszy efekt daje kwartalny przegląd rozliczeń i szybkie korekty strategii, gdy zmienia się skala biznesu.',
    ],
  },
];

export function KnowledgeBase() {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activeArticle) {
      document.body.style.overflow = '';
      return;
    }

    trackEvent('knowledge_article_open', { slug: activeArticle.slug });
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveArticle(null);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeArticle]);

  const saveArticleLeadHint = (article: Article) => {
    sessionStorage.setItem(
      'knowledge_article_hint',
      `Chcę omówić temat: ${article.title}. Proszę o kontakt i propozycję dalszych kroków dla mojej firmy.`,
    );
  };

  return (
    <section className="py-24 bg-slate-100" id="wiedza">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Baza wiedzy przedsiębiorcy
            </h2>
            <p className="text-lg text-slate-600">Mini blog: trzy praktyczne tematy, które najczęściej decydują o kosztach i bezpieczeństwie rozliczeń.</p>
          </div>
          <a
            href="#kontakt"
            onClick={() => trackEvent('knowledge_more_click')}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Zobacz więcej artykułów <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.button
              key={article.slug}
              type="button"
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setActiveArticle(article)}
              aria-label={`Otwórz artykuł: ${article.title}`}
              className="text-left bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="h-48 overflow-hidden relative bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/30" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                    <BookOpen className="w-3.5 h-3.5" />
                    {article.category}
                  </span>
                </div>
                <div className="absolute inset-x-6 bottom-6 text-white text-xl font-bold leading-tight drop-shadow">
                  {article.title}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-500 font-medium">{article.date}</span>
                  <span className="text-xs font-semibold text-slate-400">{article.readingTime}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mt-auto">
                  Czytaj więcej <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-4 text-sm text-blue-900 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p>
            <span className="font-semibold">Aktualizowane co miesiąc:</span> KSeF, VAT, ZUS i zmiany, które realnie wpływają na koszty firmy.
          </p>
          <a href="#kontakt" className="font-semibold inline-flex items-center gap-2 hover:text-blue-700 transition-colors">
            Otrzymaj PDF z listą kontrolną <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {activeArticle && (
        <div
          className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-slate-950/65 backdrop-blur-sm p-0 md:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveArticle(null);
            }
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="knowledge-modal-title"
            className="w-full md:max-w-3xl bg-white md:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            <div className="relative h-56 md:h-72">
              <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Zamknij podgląd artykułu"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute inset-x-6 bottom-6 text-white">
                <p className="text-xs uppercase tracking-wider font-semibold mb-2">{activeArticle.category} • {activeArticle.readingTime}</p>
                <h3 id="knowledge-modal-title" className="text-2xl md:text-3xl font-bold leading-tight">{activeArticle.title}</h3>
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-5 text-slate-700 leading-relaxed">
              <p className="text-sm text-slate-500">{activeArticle.date}</p>
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-600 mb-3">
                  Chcesz wersję PDF tego materiału i kroki wdrożenia dla swojej firmy?
                </p>
                <a
                  href="#kontakt"
                  onClick={() => {
                    trackEvent('knowledge_article_cta_click', { slug: activeArticle.slug });
                    saveArticleLeadHint(activeArticle);
                    setActiveArticle(null);
                  }}
                  className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Poproś o konsultację i listę kontrolną <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
