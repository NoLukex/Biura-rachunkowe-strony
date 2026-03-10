import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { SITE_CONFIG } from '@/src/constants';
import { Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { submitContact } from '@/src/lib/contact';
import { Link } from 'react-router-dom';
import { biuroPath } from '@/src/data/biura/biuroRouting';
import { currentBiuro } from '@/src/data/biura/currentBiuro';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Imię musi mieć co najmniej 2 znaki' }),
  phone: z.string().min(9, { message: 'Podaj prawidłowy numer telefonu' }),
  email: z.string().email({ message: 'Podaj prawidłowy adres email' }),
  message: z.string().min(10, { message: 'Wiadomość musi mieć co najmniej 10 znaków' }),
  consent: z.boolean().refine((value) => value, {
    message: 'Musisz zaakceptować politykę prywatności.',
  }),
  website: z.string().max(0),
  formStartedAt: z.string().min(1),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      consent: false,
      website: '',
      formStartedAt: String(Date.now()),
    },
  });

  const ownerName = currentBiuro.teamType === 'jednoosobowe'
    ? (currentBiuro.team?.[0]?.name || currentBiuro.displayName)
    : currentBiuro.displayName;
  const introText = currentBiuro.teamType === 'jednoosobowe'
    ? `Umów krótką konsultację z ${ownerName}. Sprawdzimy, jaki zakres obsługi będzie najlepszy dla Twojej firmy i jak uporządkować księgowość bez zbędnych komplikacji.`
    : 'Umów się na darmową, 15-minutową konsultację. Sprawdzimy, jak możemy zoptymalizować Twoje podatki i przygotować Cię na KSeF.';
  const startNote = currentBiuro.teamType === 'jednoosobowe'
    ? 'Po konsultacji dostaniesz konkretną rekomendację zakresu współpracy i plan startu zwykle w ciągu 24h.'
    : 'Po konsultacji dostaniesz rekomendację zakresu i plan uruchomienia obsługi zwykle w ciągu 24h.';
  const consultBenefits = currentBiuro.teamType === 'jednoosobowe'
    ? [
        'Rekomendowany zakres współpracy dopasowany do etapu Twojej firmy',
        'Orientacyjny koszt i sposób prowadzenia dokumentów',
        'Listę najbliższych kroków potrzebnych do sprawnego startu współpracy',
      ]
    : [
        'Rekomendowany model współpracy dopasowany do Twojej firmy',
        'Orientacyjny zakres i koszt obsługi',
        'Listę najbliższych kroków wdrożeniowych (KSeF, kadry, podatki)',
      ];

  useEffect(() => {
    const pricingHint = sessionStorage.getItem('pricing_calculator_hint');
    const articleHint = sessionStorage.getItem('knowledge_article_hint');
    const hint = articleHint || pricingHint;

    if (hint) {
      setValue('message', hint, { shouldDirty: true, shouldTouch: true });
      sessionStorage.removeItem('pricing_calculator_hint');
      sessionStorage.removeItem('knowledge_article_hint');
    }
  }, [setValue]);

  const onSubmit = async (data: ContactFormValues) => {
    const startedAt = Number(data.formStartedAt || 0);
    const secondsElapsed = Number.isFinite(startedAt)
      ? (Date.now() - startedAt) / 1000
      : 0;

    if (data.website) {
      return;
    }

    if (secondsElapsed > 0 && secondsElapsed < 2) {
      toast.error('Wysyłka zatrzymana przez filtr antyspamowy.');
      return;
    }

    const lastSubmitAt = Number(sessionStorage.getItem('contact_last_submit_at') || 0);
    if (Date.now() - lastSubmitAt < 15000) {
      toast.error('Poczekaj chwilę przed ponowną wysyłką.');
      return;
    }

    try {
      await submitContact(data);
      sessionStorage.setItem('contact_last_submit_at', String(Date.now()));
      toast.success('Wiadomość została wysłana!', {
        description: 'Skontaktujemy się z Tobą w najbliższym czasie.',
      });
      reset({
        consent: false,
        website: '',
        formStartedAt: String(Date.now()),
      });
    } catch {
      toast.error('Nie udało się wysłać formularza.', {
        description: 'Spróbuj ponownie albo skontaktuj się telefonicznie.',
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50" id="kontakt">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
                Porozmawiajmy o Twojej firmie
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                {introText}
              </p>

              <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-semibold mb-1">Szybki start współpracy</p>
                <p>{startNote}</p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 mb-10">
                <h4 className="font-semibold text-slate-900 mb-3">Co otrzymasz po konsultacji?</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  {consultBenefits.map((benefit) => (
                    <li key={benefit}>• {benefit}</li>
                  ))}
                </ul>
              </div>

            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-slate-900 mb-1">Zadzwoń do nas</h4>
                  <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`} className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    {SITE_CONFIG.phone}
                  </a>
                  <p className="text-slate-500 text-sm mt-1">Pn-Pt: 8:00 - 16:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-slate-900 mb-1">Napisz maila</h4>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-slate-900 mb-1">Odwiedź nas</h4>
                  <p className="text-lg font-medium text-slate-700">
                    {SITE_CONFIG.address}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Wyślij wiadomość</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Imię i nazwisko / Nazwa firmy</Label>
                <Input
                  id="name"
                  placeholder="Jan Kowalski"
                  autoComplete="name"
                  {...register('name')}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-500" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123 456 789"
                    autoComplete="tel"
                    inputMode="tel"
                    {...register('phone')}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="text-sm text-red-500" role="alert">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jan@firma.pl"
                    autoComplete="email"
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-500" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Wiadomość</Label>
                <Textarea
                  id="message"
                  placeholder="Opisz krótko, jakiej pomocy potrzebujesz..."
                  className={`min-h-[120px] resize-none ${errors.message ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  {...register('message')}
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="text-sm text-red-500" role="alert">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="hidden" aria-hidden="true">
                <Label htmlFor="website">Strona internetowa</Label>
                <Input id="website" autoComplete="off" tabIndex={-1} {...register('website')} />
              </div>
              <input type="hidden" {...register('formStartedAt')} />

              <div className="space-y-2">
                <label className="flex items-start gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    {...register('consent')}
                    aria-invalid={errors.consent ? 'true' : 'false'}
                    aria-describedby={errors.consent ? 'consent-error' : undefined}
                  />
                  <span>
                    Wyrażam zgodę na kontakt w celu obsługi zapytania i potwierdzam zapoznanie z{' '}
                    <Link to={biuroPath('/polityka-prywatnosci')} className="text-blue-600 hover:text-blue-700 underline">
                      polityką prywatności
                    </Link>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p id="consent-error" className="text-sm text-red-500" role="alert">
                    {errors.consent.message}
                  </p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? 'Wysyłanie...' : 'Wyślij zapytanie'}
              </Button>
              <p className="text-xs text-slate-500 text-center mt-4">
                Jeśli nie skonfigurujesz endpointu formularza, zapytanie otworzy się w Twoim kliencie poczty.
              </p>
              <p className="text-xs text-slate-500 text-center">
                Odpowiadamy zwykle w ciągu 24 godzin roboczych.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
