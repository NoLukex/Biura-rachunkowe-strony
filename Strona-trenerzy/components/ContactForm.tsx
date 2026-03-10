import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitLead } from '../services/leadService';
import currentTrainer from '../data/currentTrainer';
import { getQuickWinConfig } from '../data/quickWinConfig';
import { clearLeadIntent, readLeadIntent, subscribeLeadIntent } from '../utils/leadIntent';

const ContactForm: React.FC = () => {
  const cleanPhone = currentTrainer.phone.replace(/\D/g, '');
  const quickWin = getQuickWinConfig(currentTrainer.slug);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startedAt] = useState(Date.now());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: 'Chcę schudnąć',
    timeline: '',
    budget: '',
    consultationType: '',
    note: '',
    consent: false,
    marketingConsent: false,
    website: '',
  });

  const baseGoalOptions = ['Chcę schudnąć', 'Chcę zbudować mięśnie', 'Chcę poprawić zdrowie', 'Inne / Konsultacja'];
  const baseTimelineOptions = ['Od razu / ten tydzien', 'W ciagu 2 tygodni', 'W ciagu miesiaca', 'Najpierw konsultacja, potem decyzja'];
  const baseBudgetOptions = ['Do 300 zl', '300-600 zl', '600-1000 zl', 'Powyzej 1000 zl'];

  const goalOptions = baseGoalOptions.includes(formData.goal)
    ? baseGoalOptions
    : [formData.goal, ...baseGoalOptions];

  const timelineOptions = formData.timeline && !baseTimelineOptions.includes(formData.timeline)
    ? [formData.timeline, ...baseTimelineOptions]
    : baseTimelineOptions;

  const budgetOptions = formData.budget && !baseBudgetOptions.includes(formData.budget)
    ? [formData.budget, ...baseBudgetOptions]
    : baseBudgetOptions;

  React.useEffect(() => {
    const applyIntent = (intent: {
      goal?: string;
      timeline?: string;
      budget?: string;
      consultationType?: string;
      note?: string;
    }) => {
      setFormData((prev) => ({
        ...prev,
        goal: intent.goal || prev.goal,
        timeline: intent.timeline || prev.timeline,
        budget: intent.budget || prev.budget,
        consultationType: intent.consultationType || prev.consultationType,
        note: intent.note || prev.note,
      }));
    };

    const existingIntent = readLeadIntent();
    if (existingIntent) {
      applyIntent(existingIntent);
    }

    return subscribeLeadIntent(applyIntent);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const nextValue = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : value;

    setFormData(prev => ({ ...prev, [name]: nextValue }));
    if (error && (name === 'email' || name === 'phone')) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() && !formData.phone.trim()) {
      setError('Podaj email lub numer telefonu, abym mogl sie z Toba skontaktowac.');
      return;
    }

    if (quickWin.contactMode === 'qualification-3q' && (!formData.timeline.trim() || !formData.budget.trim())) {
      setError('Dla kwalifikacji uzupelnij termin startu i budzet.');
      return;
    }

    setLoading(true);
    setError('');
    const result = await submitLead(
      {
        source: 'contact-form',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        goal: formData.goal,
        timeline: formData.timeline || undefined,
        budget: formData.budget || undefined,
        consultationType: formData.consultationType || undefined,
        note: formData.note || undefined,
        consent: formData.consent,
        marketingConsent: formData.marketingConsent,
        honeypot: formData.website,
      },
      { fillTimeMs: Date.now() - startedAt },
    );

    if (!result.ok) {
      setError(result.error || 'Wystapil blad podczas wysylki formularza.');
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      goal: 'Chcę schudnąć',
      timeline: '',
      budget: '',
      consultationType: '',
      note: '',
      consent: false,
      marketingConsent: false,
      website: '',
    });
    clearLeadIntent();
    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 scroll-mt-32 bg-zinc-950 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-900/10 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl grid md:grid-cols-2">
            
            <div className="p-10 md:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">{quickWin.contactMode === 'qualification-3q' ? <>Formularz <br /><span className="text-brand-500">Kwalifikacyjny</span></> : <>Zacznijmy Twoją <br /><span className="text-brand-500">Przemianę</span></>}</h2>
                <p className="text-zinc-400 mb-8">
                    {quickWin.contactMode === 'qualification-3q'
                      ? 'Uzupelnij 3 kluczowe pytania (cel, termin, budzet), zebym dopasowal najlepszy wariant wspolpracy.'
                      : 'Wypelnij formularz, a oddzwonie w ciagu 24h i ustalimy plan dzialania.'}
                    {cleanPhone ? <> Mozesz tez zadzwonic bezposrednio: <a className="text-brand-400 hover:underline" href={`tel:${cleanPhone}`}>{currentTrainer.phone}</a>.</> : ''}
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-brand-500 font-bold">1</div>
                        <span className="text-white font-medium">Analiza Twojego celu</span>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-brand-500 font-bold">2</div>
                        <span className="text-white font-medium">Dobór odpowiedniej strategii</span>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-brand-500 font-bold">3</div>
                        <span className="text-white font-medium">Start współpracy</span>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-950 p-10 md:p-16">
                {submitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <CheckCircle className="w-20 h-20 text-brand-500 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">Zgloszenie wyslane</h3>
                        <p className="text-zinc-400">Dziekujemy za kontakt. Odpowiedz wraca zazwyczaj w ciagu 24 godzin.</p>
                        <button onClick={() => setSubmitted(false)} className="mt-8 text-brand-500 hover:underline cursor-pointer min-h-[44px]">Wyslij nowe zgloszenie</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="contact-name" className="block text-xs font-bold uppercase text-zinc-500 mb-2">Imię i Nazwisko</label>
                            <input 
                                required 
                                id="contact-name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                type="text" 
                                autoComplete="name"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-brand-500 outline-none transition-colors placeholder-zinc-700" 
                                placeholder="Jan Kowalski" 
                            />
                        </div>
                        
                        {/* Contact Info Group */}
                        <div className="space-y-6 p-4 border border-zinc-800 rounded-xl bg-zinc-900/30">
                            <p className="text-xs text-zinc-400 font-medium">Wybierz preferowaną formę kontaktu (podaj min. jedno):</p>
                            <div>
                                <label htmlFor="contact-email" className="block text-xs font-bold uppercase text-zinc-500 mb-2">Email</label>
                                <input 
                                    id="contact-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email" 
                                    autoComplete="email"
                                    aria-invalid={Boolean(error && !formData.email && !formData.phone)}
                                    aria-describedby={error ? 'contact-error' : undefined}
                                    className={`w-full bg-zinc-900 border ${error && !formData.email && !formData.phone ? 'border-red-500' : 'border-zinc-800'} rounded-lg p-4 text-white focus:border-brand-500 outline-none transition-colors placeholder-zinc-700`} 
                                    placeholder="jan@example.com" 
                                />
                            </div>
                            <div>
                                <label htmlFor="contact-phone" className="block text-xs font-bold uppercase text-zinc-500 mb-2">Numer Telefonu</label>
                                <input 
                                    id="contact-phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    type="tel" 
                                    autoComplete="tel"
                                    aria-invalid={Boolean(error && !formData.email && !formData.phone)}
                                    aria-describedby={error ? 'contact-error' : undefined}
                                    className={`w-full bg-zinc-900 border ${error && !formData.email && !formData.phone ? 'border-red-500' : 'border-zinc-800'} rounded-lg p-4 text-white focus:border-brand-500 outline-none transition-colors placeholder-zinc-700`} 
                                    placeholder="+48 000 000 000" 
                                />
                            </div>
                            
                            {error && (
                                <div id="contact-error" role="alert" aria-live="assertive" className="flex items-center gap-2 text-red-400 text-sm animate-pulse">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contact-goal" className="block text-xs font-bold uppercase text-zinc-500 mb-2">Twój Cel</label>
                            <select 
                                id="contact-goal"
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-brand-500 outline-none transition-colors"
                            >
                                {goalOptions.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        {quickWin.contactMode === 'qualification-3q' && (
                          <>
                            <div>
                              <label htmlFor="contact-timeline" className="block text-xs font-bold uppercase text-zinc-500 mb-2">Termin Startu</label>
                              <select
                                id="contact-timeline"
                                name="timeline"
                                value={formData.timeline}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-brand-500 outline-none transition-colors"
                              >
                                <option value="">Wybierz termin</option>
                                {timelineOptions.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label htmlFor="contact-budget" className="block text-xs font-bold uppercase text-zinc-500 mb-2">Budzet Miesieczny</label>
                              <select
                                id="contact-budget"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-brand-500 outline-none transition-colors"
                              >
                                <option value="">Wybierz budzet</option>
                                {budgetOptions.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}

                        {(formData.consultationType || formData.note) && (
                          <div className="rounded-lg border border-brand-500/40 bg-brand-500/10 p-3 text-sm text-zinc-200">
                            {formData.consultationType && <p><span className="font-semibold">Typ konsultacji:</span> {formData.consultationType}</p>}
                            {formData.note && <p className="mt-1"><span className="font-semibold">Notatka:</span> {formData.note}</p>}
                          </div>
                        )}

                        <div className="space-y-3 text-sm text-zinc-400">
                            <label className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  name="consent"
                                  checked={formData.consent}
                                  onChange={handleChange}
                                  className="mt-1"
                                  required
                                />
                                <span>
                                  Wyrazam zgode na kontakt w sprawie oferty. Zapoznalem sie z <a className="text-brand-400 hover:underline" href="/polityka-prywatnosci.html" target="_blank" rel="noreferrer">Polityka prywatnosci</a>.
                                </span>
                            </label>
                            <label className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  name="marketingConsent"
                                  checked={formData.marketingConsent}
                                  onChange={handleChange}
                                  className="mt-1"
                                />
                                <span>Opcjonalnie: zgadzam sie na informacje o promocjach i nowych uslugach.</span>
                            </label>
                            <input
                              type="text"
                              name="website"
                              value={formData.website}
                              onChange={handleChange}
                              tabIndex={-1}
                              autoComplete="off"
                              className="hidden"
                              aria-hidden="true"
                            />
                        </div>

                        <p className="text-xs text-zinc-500">Po wyslaniu formularza oddzwaniam zwykle w ciagu 24h.</p>

                        <button type="submit" disabled={loading} className="w-full bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group cursor-pointer min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? 'Wysylam...' : 'Wyslij zgloszenie'}
                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
