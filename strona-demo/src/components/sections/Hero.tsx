import { useMemo, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { SITE_CONFIG } from '@/src/constants';
import { ArrowRight, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { trackEvent } from '@/src/lib/analytics';
import { currentBiuro } from '@/src/data/biura/currentBiuro';
import { useLocation } from 'react-router-dom';

const maleNameExceptionsEndingWithA = new Set([
  'kuba',
  'barnaba',
  'bonawentura',
]);

function inferFemaleOwner(): boolean {
  if (currentBiuro.teamType !== 'jednoosobowe') {
    return false;
  }

  const ownerName = (currentBiuro.team?.[0]?.name || currentBiuro.displayName || '').trim();
  if (!ownerName) {
    return false;
  }

  const firstToken = ownerName
    .split(/\s+/)
    .map((token) => token.replace(/[^A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż-]/g, ''))
    .find(Boolean)
    ?.toLowerCase();

  if (!firstToken) {
    return false;
  }

  if (maleNameExceptionsEndingWithA.has(firstToken)) {
    return false;
  }

  return firstToken.endsWith('a');
}

export function Hero() {
  const defaultLogoUrl = '/images/logo-biuro-default.svg';
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const [logoSrc, setLogoSrc] = useState(SITE_CONFIG.logoUrl || defaultLogoUrl);
  const location = useLocation();

  const heroTheme = useMemo(() => {
    const variant = new URLSearchParams(location.search).get('heroVariant')?.toLowerCase();

    if (variant === '2' || variant === 'trust') {
      return {
        sectionClass: 'relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-slate-900',
        ambient: [
          'absolute -top-28 -left-16 h-[26rem] w-[26rem] rounded-full bg-cyan-400/20 blur-3xl max-md:blur-2xl max-md:opacity-70 z-0',
          'absolute top-16 right-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-3xl max-md:blur-2xl max-md:opacity-70 z-0',
          'absolute -bottom-10 left-1/3 h-[20rem] w-[34rem] rounded-full bg-blue-500/15 blur-3xl max-md:blur-2xl max-md:opacity-60 z-0',
        ],
        overlayClass: 'absolute inset-0 bg-gradient-to-b from-[#071933]/85 via-[#0b2244]/90 to-[#0a1c38] z-0',
        badgeClass: 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-200 border border-cyan-300/25 text-sm font-semibold mb-8',
        dotClass: 'relative inline-flex rounded-full h-2 w-2 bg-cyan-300',
        accentClass: 'block text-cyan-300',
        primaryButtonClass: 'w-full sm:w-auto text-base h-14 px-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30',
        secondaryButtonClass: 'w-full sm:w-auto text-base h-14 px-8 rounded-full border-cyan-200/30 text-cyan-50 hover:bg-cyan-500/10 hover:text-white bg-transparent',
        valueIconClass: 'h-5 w-5 text-cyan-300',
        cardClass: 'relative rounded-3xl overflow-hidden border border-cyan-300/30 shadow-2xl bg-slate-900/40',
        stripGradientClass: 'absolute inset-0 bg-gradient-to-r from-cyan-500/25 via-sky-400/15 to-transparent',
        stripIconClass: 'h-4 w-4 shrink-0 text-cyan-300',
        trustBadgeClass: 'absolute top-4 right-4 rounded-xl bg-cyan-500/90 text-slate-950 px-3 py-2 text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-900/30',
      };
    }

    if (variant === '3' || variant === 'editorial') {
      return {
        sectionClass: 'relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-slate-900',
        ambient: [
          'absolute -top-24 -left-20 h-[28rem] w-[28rem] rounded-full bg-slate-500/15 blur-3xl max-md:blur-2xl max-md:opacity-70 z-0',
          'absolute top-10 right-8 h-[22rem] w-[22rem] rounded-full bg-blue-400/12 blur-3xl max-md:blur-2xl max-md:opacity-70 z-0',
          'absolute bottom-0 left-1/2 -translate-x-1/2 h-[18rem] w-[40rem] rounded-full bg-white/5 blur-3xl max-md:blur-2xl max-md:opacity-60 z-0',
        ],
        overlayClass: 'absolute inset-0 bg-gradient-to-b from-[#0d1628]/90 via-[#131f33]/92 to-[#0d1628] z-0',
        badgeClass: 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-slate-100 border border-white/20 text-sm font-semibold mb-8',
        dotClass: 'relative inline-flex rounded-full h-2 w-2 bg-slate-200',
        accentClass: 'block text-slate-200',
        primaryButtonClass: 'w-full sm:w-auto text-base h-14 px-8 rounded-full bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-slate-900/30',
        secondaryButtonClass: 'w-full sm:w-auto text-base h-14 px-8 rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent',
        valueIconClass: 'h-5 w-5 text-slate-200',
        cardClass: 'relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900/50',
        stripGradientClass: 'absolute inset-0 bg-gradient-to-r from-white/10 via-slate-300/5 to-transparent',
        stripIconClass: 'h-4 w-4 shrink-0 text-slate-100',
        trustBadgeClass: 'absolute top-4 right-4 rounded-xl bg-white/90 text-slate-900 px-3 py-2 text-xs font-semibold flex items-center gap-2 shadow-lg shadow-slate-900/20',
      };
    }

    return {
      sectionClass: 'relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-slate-900',
      ambient: [
        'absolute -top-32 -left-16 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl max-md:blur-2xl max-md:opacity-70 z-0',
        'absolute top-20 right-0 w-[28rem] h-[28rem] rounded-full bg-sky-500/10 blur-3xl max-md:blur-2xl max-md:opacity-70 z-0',
        'absolute bottom-0 left-1/2 -translate-x-1/2 w-[44rem] h-[20rem] rounded-full bg-indigo-500/15 blur-3xl max-md:blur-2xl max-md:opacity-60 z-0',
      ],
      overlayClass: 'absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900 z-0',
      badgeClass: 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-sm font-semibold mb-8',
      dotClass: 'relative inline-flex rounded-full h-2 w-2 bg-blue-400',
      accentClass: 'block text-blue-300',
      primaryButtonClass: 'w-full sm:w-auto text-base h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20',
      secondaryButtonClass: 'w-full sm:w-auto text-base h-14 px-8 rounded-full border-slate-600 text-white hover:bg-slate-800 hover:text-white bg-transparent',
      valueIconClass: 'h-5 w-5 text-blue-400',
      cardClass: 'relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800',
      stripGradientClass: 'absolute inset-0 bg-gradient-to-r from-blue-500/20 via-sky-400/10 to-transparent',
      stripIconClass: 'h-4 w-4 shrink-0 text-blue-300',
      trustBadgeClass: 'absolute top-4 right-4 rounded-xl bg-blue-600/90 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-900/30',
    };
  }, [location.search]);
  const hero = currentBiuro.hero;
  const valueProps = currentBiuro.valueProps.slice(0, 3);
  const showImageLogo = Boolean(logoSrc && !logoLoadFailed);
  const preferredOwnerFallback = inferFemaleOwner() ? '/images/team-anna.jpg' : '/images/team-tomasz.jpg';
  const heroImageSrc = hero.image || preferredOwnerFallback;
  const heroImagePositionMobile = hero.imagePositionMobile || 'center 18%';
  const heroImagePositionDesktop = hero.imagePositionDesktop || 'center 20%';
  const heroStripText = 'Dedykowana opieka księgowa i szybki kontakt';

  return (
    <section className={heroTheme.sectionClass} id="home">
      {heroTheme.ambient.map((className) => (
        <div key={className} className={className} />
      ))}
      <div className={heroTheme.overlayClass} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className={heroTheme.badgeClass}>
              <span className="relative flex h-2 w-2">
                <span className={heroTheme.dotClass}></span>
              </span>
              {hero.badge}
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              {hero.titleTop}
              <span className={heroTheme.accentClass}>{hero.titleAccent}</span>
            </h1>

            <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed font-light mx-auto lg:mx-0">
              {hero.text}
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <Button size="lg" className={heroTheme.primaryButtonClass} asChild>
                <a
                  href="#kontakt"
                  onClick={() => trackEvent('hero_cta_click', { cta: 'consultation' })}
                >
                  <span className="sm:hidden">Umów konsultację</span>
                  <span className="hidden sm:inline">Umów darmową 15-minutową konsultację</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className={heroTheme.secondaryButtonClass} asChild>
                <a
                  href="#panel"
                  onClick={() => trackEvent('hero_cta_click', { cta: 'panel_demo' })}
                >
                  Zobacz demo panelu klienta
                </a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-300 font-medium">
              {valueProps.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className={heroTheme.valueIconClass} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className={heroTheme.cardClass}>
              <img
                src={heroImageSrc}
                alt={`${SITE_CONFIG.name} - zdjęcie biura`}
                width={1200}
                height={900}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-[400px] object-cover md:hidden"
                style={{ objectPosition: heroImagePositionMobile }}
                referrerPolicy="no-referrer"
                onError={(event) => {
                  const img = event.currentTarget;
                  if (img.dataset.fallbackApplied === '1') return;
                  img.dataset.fallbackApplied = '1';
                  img.src = hero.imageFallback || preferredOwnerFallback;
                }}
              />
              <img
                src={heroImageSrc}
                alt={`${SITE_CONFIG.name} - zdjęcie biura`}
                width={1200}
                height={900}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="hidden w-full h-[480px] object-cover md:block"
                style={{ objectPosition: heroImagePositionDesktop }}
                referrerPolicy="no-referrer"
                onError={(event) => {
                  const img = event.currentTarget;
                  if (img.dataset.fallbackApplied === '1') return;
                  img.dataset.fallbackApplied = '1';
                  img.src = hero.imageFallback || preferredOwnerFallback;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/25 to-transparent" />

              <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 text-slate-900 px-3 py-1.5 text-xs font-semibold">
                {showImageLogo ? (
                  <img
                    src={logoSrc}
                    alt={`${SITE_CONFIG.name} logo`}
                    className="h-5 w-5 rounded object-contain bg-white"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      if (logoSrc !== defaultLogoUrl) {
                        setLogoSrc(defaultLogoUrl);
                        return;
                      }
                      setLogoLoadFailed(true);
                    }}
                  />
                ) : (
                  <Building2 className="w-4 h-4 text-blue-600" />
                )}
                {SITE_CONFIG.name}
              </div>

              <div className="absolute bottom-4 left-1/2 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
                <div className="relative overflow-hidden rounded-full border border-white/20 bg-slate-950/75 px-4 py-2.5 shadow-[0_14px_34px_rgba(2,6,23,0.45)] backdrop-blur-md">
                  <div className={heroTheme.stripGradientClass} aria-hidden="true" />
                  <div className="relative flex items-center justify-center gap-2 text-center text-xs font-semibold leading-snug text-white sm:text-sm">
                    <CheckCircle2 className={heroTheme.stripIconClass} />
                    <span>{heroStripText}</span>
                  </div>
                </div>
              </div>

              <div className={heroTheme.trustBadgeClass}>
                <ShieldCheck className="w-4 h-4" />
                Zgodność i bezpieczeństwo
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
