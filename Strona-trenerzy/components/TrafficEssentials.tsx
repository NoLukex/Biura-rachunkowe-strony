import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../services/leadService';
import currentTrainer from '../data/currentTrainer';
import { getQuickWinConfig } from '../data/quickWinConfig';

const TrafficEssentials: React.FC = () => {
  const quickWin = getQuickWinConfig(currentTrainer.slug);
  const leadMagnetTitle = currentTrainer.leadMagnetTitle || 'Pobierz plan startowy na 7 dni';
  const leadMagnetText = currentTrainer.leadMagnetText || 'Uniwersalny punkt wejscia dla kazdego trenera: lead magnet, szybka wartosc i naturalne przejscie do wspolpracy 1:1.';

  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('Redukcja tkanki tluszczowej');
  const [timeline, setTimeline] = useState('');
  const [consent, setConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startedAt] = useState(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Podaj adres e-mail, aby odebrac material.');
      return;
    }

    setLoading(true);
    setError('');
    const result = await submitLead(
      {
        source: 'lead-magnet',
        email,
        goal,
        timeline: timeline || undefined,
        note: quickWin.leadMagnetFollowup
          ? 'Automatyczny follow-up: D+1, D+3, D+7.'
          : undefined,
        consent,
        marketingConsent,
        honeypot,
      },
      { fillTimeMs: Date.now() - startedAt },
    );

    if (!result.ok) {
      setLoading(false);
      setError(result.error || 'Nie udalo sie zapisac formularza.');
      return;
    }

    setSubmitted(true);
    setEmail('');
    setTimeline('');
    setConsent(false);
    setMarketingConsent(false);
    setHoneypot('');
    setLoading(false);
  };

  return (
    <section id="start" className="py-24 bg-zinc-900 border-y border-zinc-800">
      <div className="max-w-3xl mx-auto px-6">
        <article className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wide mb-4">
            <Download size={14} />
            Darmowy material startowy
          </div>
          <h2 className="text-3xl font-black text-white mb-4">{leadMagnetTitle}</h2>
          <p className="text-zinc-400 mb-6">
            {leadMagnetText}
          </p>

          {submitted ? (
            <div className="bg-zinc-900 border border-brand-500/40 rounded-xl p-4 text-brand-300 flex items-center gap-2">
              <CheckCircle2 size={18} />
              Dziekujemy! Zgloszenie zapisane. Material startowy zostanie przeslany mailowo.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lead-email" className="block text-xs font-bold uppercase text-zinc-500 mb-2">
                  E-mail
                </label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="twoj@email.pl"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="lead-goal" className="block text-xs font-bold uppercase text-zinc-500 mb-2">
                  Cel
                </label>
                <select
                  id="lead-goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                >
                  <option>Redukcja tkanki tluszczowej</option>
                  <option>Budowa masy miesniowej</option>
                  <option>Poprawa kondycji</option>
                  <option>Powrot po kontuzji</option>
                </select>
              </div>

              {quickWin.leadMagnetFollowup && (
                <>
                  <div>
                    <label htmlFor="lead-timeline" className="block text-xs font-bold uppercase text-zinc-500 mb-2">
                      Kiedy chcesz zaczac?
                    </label>
                    <select
                      id="lead-timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                    >
                      <option value="">Wybierz termin</option>
                      <option>Od razu</option>
                      <option>W ciagu 14 dni</option>
                      <option>W ciagu miesiaca</option>
                      <option>Najpierw konsultacja</option>
                    </select>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-400">
                    Po zapisie uruchamia sie automatyczny follow-up: D+1 (start), D+3 (korekta), D+7 (plan wdrozenia).
                  </div>
                </>
              )}
              <div className="space-y-2 text-sm text-zinc-400">
                <label className="flex items-start gap-3">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-1" />
                  <span>
                    Wyrazam zgode na kontakt i znam <a className="text-brand-400 hover:underline" href="/polityka-prywatnosci.html" target="_blank" rel="noreferrer">Polityke prywatnosci</a>.
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} className="mt-1" />
                  <span>Opcjonalnie: chce otrzymywac wskazowki i oferty e-mail.</span>
                </label>
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
              </div>
              {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Zapisywanie...' : 'Pobieram darmowy plan'}
              </button>
            </form>
          )}
        </article>
      </div>
    </section>
  );
};

export default TrafficEssentials;
