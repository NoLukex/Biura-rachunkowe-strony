import { defaultTrainerSlug, trainerProfiles } from './trainerProfiles';
import fallbackTrainer from './fallbackTrainer';
import { emailTrainerPersonalization } from './emailTrainerPersonalization';
import { poznanTop20ManualOverrides } from './poznanTop20ManualOverrides';
import { torunTrainerProfiles } from './torunTrainerProfiles';
import { poznanTrainerProfiles } from './poznanTrainerProfiles';
import { gdanskTrainerProfiles } from './gdanskTrainerProfiles';
import type { TrainerProfile } from './trainerProfile';

const POLISH_REPLACEMENTS: Array<[string, string]> = [
  ['Twoj', 'Twój'],
  ['twoj', 'twój'],
  ['Wspolpraca', 'Współpraca'],
  ['wspolpraca', 'współpraca'],
  ['sciezka', 'ścieżka'],
  ['Sciezka', 'Ścieżka'],
  ['sciezki', 'ścieżki'],
  ['Sciezki', 'Ścieżki'],
  ['sciezce', 'ścieżce'],
  ['Sciezce', 'Ścieżce'],
  ['wskazowki', 'wskazówki'],
  ['Wskazowki', 'Wskazówki'],
  ['wiecej', 'więcej'],
  ['Wiecej', 'Więcej'],
  ['miedzy', 'między'],
  ['Miedzy', 'Między'],
  ['krotki', 'krótki'],
  ['Krotki', 'Krótki'],
  ['moge', 'mogę'],
  ['Moge', 'Mogę'],
  ['zaczac', 'zacząć'],
  ['Zaczac', 'Zacząć'],
  ['trenowac', 'trenować'],
  ['Trenowac', 'Trenować'],
  ['wyglada', 'wygląda'],
  ['Wyglada', 'Wygląda'],
  ['dam rade', 'dam radę'],
  ['Dam rade', 'Dam radę'],
  ['checkliste', 'checklistę'],
  ['Checkliste', 'Checklistę'],
  ['krokow', 'kroków'],
  ['Krokow', 'Kroków'],
  ['redukcje', 'redukcję'],
  ['Redukcje', 'Redukcję'],
  ['budowe', 'budowę'],
  ['Budowe', 'Budowę'],
  ['postepu', 'postępu'],
  ['Postepu', 'Postępu'],
  ['poprawic', 'poprawić'],
  ['Poprawic', 'Poprawić'],
  ['jesli', 'jeśli'],
  ['Jesli', 'Jeśli'],
  ['ktore', 'które'],
  ['Ktore', 'Które'],
  ['ktory', 'który'],
  ['Ktory', 'Który'],
  ['sylwetke', 'sylwetkę'],
  ['Sylwetke', 'Sylwetkę'],
  ['bolu', 'bólu'],
  ['Bolu', 'Bólu'],
  ['plecow', 'pleców'],
  ['Plecow', 'Pleców'],
  ['miesni', 'mięśni'],
  ['Miesni', 'Mięśni'],
  ['cwiczen', 'ćwiczeń'],
  ['Cwiczen', 'Ćwiczeń'],
  ['cwiczyc', 'ćwiczyć'],
  ['Cwiczyc', 'Ćwiczyć'],
  ['uzupelnic', 'uzupełnić'],
  ['Uzupelnic', 'Uzupełnić'],
  ['dodac', 'dodać'],
  ['Dodac', 'Dodać'],
  ['pakietow', 'pakietów'],
  ['Pakietow', 'Pakietów'],
  ['rezerwacje', 'rezerwację'],
  ['Rezerwacje', 'Rezerwację'],
  ['obciazenie', 'obciążenie'],
  ['Obciazenie', 'Obciążenie'],
  ['technike', 'technikę'],
  ['Technike', 'Technikę'],
  ['ciala', 'ciała'],
  ['Ciala', 'Ciała'],
  ['najwazniejsze', 'najważniejsze'],
  ['Najwazniejsze', 'Najważniejsze'],
  ['miesiac', 'miesiąc'],
  ['Miesiac', 'Miesiąc'],
  ['miesiacu', 'miesiącu'],
  ['Miesiacu', 'Miesiącu'],
  ['umow', 'umów'],
  ['Umow', 'Umów'],
  ['Laczymy', 'Łączymy'],
  ['laczymy', 'łączymy'],
  ['laczycie', 'łączycie'],
  ['Laczycie', 'Łączycie'],
  ['odzywianie', 'odżywianie'],
  ['Odzywianie', 'Odżywianie'],
  ['odzywiania', 'odżywiania'],
  ['Odzywiania', 'Odżywiania'],
  ['zeby', 'żeby'],
  ['Zeby', 'Żeby'],
  ['byl', 'był'],
  ['Byl', 'Był'],
  ['uproscic', 'uprościć'],
  ['Uproscic', 'Uprościć'],
  ['chca', 'chcą'],
  ['Chca', 'Chcą'],
  ['przeciazeniami', 'przeciążeniami'],
  ['glowne', 'główne'],
  ['Glowne', 'Główne'],
  ['glownej', 'głównej'],
  ['Glownej', 'Głównej'],
  ['regularnosci', 'regularności'],
  ['Regularnosci', 'Regularności'],
  ['regularnosc', 'regularność'],
  ['Regularnosc', 'Regularność'],
  ['wdrozenie', 'wdrożenie'],
  ['Wdrozenie', 'Wdrożenie'],
  ['Uruchomic', 'Uruchomić'],
  ['uruchomic', 'uruchomić'],
  ['Naprawic', 'Naprawić'],
  ['naprawic', 'naprawić'],
  ['sekcje', 'sekcję'],
  ['Sekcje', 'Sekcję'],
  ['ruszyc', 'ruszyć'],
  ['Ruszyc', 'Ruszyć'],
  ['utrzymac', 'utrzymać'],
  ['Utrzymac', 'Utrzymać'],
  ['mobilnosc', 'mobilność'],
  ['Mobilnosc', 'Mobilność'],
];

const polishify = (value: string): string => {
  let out = value;
  POLISH_REPLACEMENTS.forEach(([oldValue, newValue]) => {
    if (/^[A-Za-z]+$/.test(oldValue)) {
      out = out.replace(new RegExp(`\\b${oldValue}\\b`, 'g'), newValue);
    } else {
      out = out.replaceAll(oldValue, newValue);
    }
  });
  return out;
};

const polishifyProfile = (profile: TrainerProfile): TrainerProfile => ({
  ...profile,
  navName: polishify(profile.navName),
  brandTagline: polishify(profile.brandTagline),
  heroTitleTop: polishify(profile.heroTitleTop),
  heroTitleAccent: polishify(profile.heroTitleAccent),
  heroText: polishify(profile.heroText),
  aboutHeading: polishify(profile.aboutHeading),
  aboutText: polishify(profile.aboutText),
  nicheLabel: profile.nicheLabel ? polishify(profile.nicheLabel) : profile.nicheLabel,
  quickWin: profile.quickWin ? polishify(profile.quickWin) : profile.quickWin,
  researchCue: profile.researchCue ? polishify(profile.researchCue) : profile.researchCue,
  leadMagnetTitle: profile.leadMagnetTitle ? polishify(profile.leadMagnetTitle) : profile.leadMagnetTitle,
  leadMagnetText: profile.leadMagnetText ? polishify(profile.leadMagnetText) : profile.leadMagnetText,
  valueProps: profile.valueProps?.map((item) => ({
    title: polishify(item.title),
    desc: polishify(item.desc),
  })),
  pricingPlans: profile.pricingPlans?.map((plan) => ({
    ...plan,
    name: polishify(plan.name),
    subtitle: polishify(plan.subtitle),
    features: plan.features.map((feature) => polishify(feature)),
    ctaLabel: polishify(plan.ctaLabel),
  })),
  faqItems: profile.faqItems?.map((item) => ({
    q: polishify(item.q),
    a: polishify(item.a),
  })),
});

const allTrainerProfiles: Record<string, TrainerProfile> = {
  ...trainerProfiles,
  ...torunTrainerProfiles,
  ...poznanTrainerProfiles,
  ...gdanskTrainerProfiles,
};

const getSlugFromEnv = (): string | null => {
  const envSlug = (import.meta.env.VITE_CLIENT_SLUG || '').trim().toLowerCase();
  if (envSlug && allTrainerProfiles[envSlug]) {
    return envSlug;
  }

  return null;
};

const getSlugFromPath = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const querySlug = (new URLSearchParams(window.location.search).get('trainer') || '').trim().toLowerCase();
  if (querySlug && allTrainerProfiles[querySlug]) {
    return querySlug;
  }

  const match = window.location.pathname.match(/^\/t\/([a-z0-9-]+)/i);
  if (match && allTrainerProfiles[match[1]]) {
    return match[1];
  }

  return null;
};

const getSlugFromHostname = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const host = window.location.hostname.toLowerCase();
  const firstLabel = host.split('.')[0];
  const allSlugs = Object.keys(allTrainerProfiles);

  if (allTrainerProfiles[firstLabel]) {
    return firstLabel;
  }

  const candidate = firstLabel.startsWith('trener-')
    ? firstLabel.replace(/^trener-/, '')
    : firstLabel;

  if (allTrainerProfiles[candidate]) {
    return candidate;
  }

  const prefixMatches = allSlugs.filter((slug) => slug.startsWith(candidate));
  if (prefixMatches.length === 1) {
    return prefixMatches[0];
  }

  if (prefixMatches.length > 1) {
    return prefixMatches.sort((a, b) => a.length - b.length)[0];
  }

  return null;
};

const resolvedSlug = getSlugFromEnv() || getSlugFromPath() || getSlugFromHostname();

const useLocalDefault =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const baseTrainer =
  (resolvedSlug && allTrainerProfiles[resolvedSlug]) ||
  (useLocalDefault ? allTrainerProfiles[defaultTrainerSlug] : null) ||
  fallbackTrainer;

const trainerOverride = {
  ...(emailTrainerPersonalization[baseTrainer.slug] || {}),
  ...(poznanTop20ManualOverrides[baseTrainer.slug] || {}),
};

const currentTrainer: TrainerProfile = trainerOverride
  ? { ...baseTrainer, ...trainerOverride }
  : baseTrainer;

const localizedTrainer = currentTrainer.slug.startsWith('poznan-')
  ? polishifyProfile(currentTrainer)
  : currentTrainer;

export default localizedTrainer;
