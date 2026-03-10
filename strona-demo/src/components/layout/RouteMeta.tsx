import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '@/src/constants';

type MetaConfig = {
  title: string;
  description: string;
};

const META_BY_PATH: Record<string, MetaConfig> = {
  '/': {
    title: 'Biuro rachunkowe dla firm',
    description:
      'Nowoczesna księgowość, kadry i obsługa KSeF. Sprawdź ofertę, pakiety współpracy i umów konsultację.',
  },
  '/o-nas': {
    title: 'O nas i model współpracy',
    description:
      'Poznaj proces współpracy, standard obsługi i przykładowe efekty działań dla firm.',
  },
  '/wiedza': {
    title: 'Baza wiedzy przedsiębiorcy',
    description:
      'Praktyczne materiały o KSeF, VAT i ZUS. Krótkie wskazówki dla właścicieli firm.',
  },
  '/pelna-ksiegowosc': {
    title: 'Pełna księgowość dla spółek',
    description:
      'Obsługa ksiąg rachunkowych, raportowanie i wsparcie podatkowe dla spółek.',
  },
  '/kpir-ryczalt': {
    title: 'KPiR i ryczałt dla JDG',
    description:
      'Księgowość dla jednoosobowych działalności: KPiR, ryczałt, ZUS i konsultacje.',
  },
  '/kadry-zus': {
    title: 'Kadry i ZUS',
    description:
      'Kompleksowa obsługa kadrowo-płacowa, rozliczenia ZUS i dokumentacja pracownicza.',
  },
  '/obsluga-ksef': {
    title: 'Obsługa KSeF',
    description:
      'Wdrożenie i bieżąca obsługa KSeF, automatyzacja obiegu dokumentów i wsparcie zespołu.',
  },
  '/doradztwo-podatkowe': {
    title: 'Doradztwo podatkowe',
    description:
      'Analizy i rekomendacje podatkowe dopasowane do modelu biznesowego firmy.',
  },
  '/sprawozdania': {
    title: 'Sprawozdania i raporty',
    description:
      'Przygotowanie sprawozdań finansowych oraz raportów zarządczych dla przedsiębiorców.',
  },
  '/polityka-prywatnosci': {
    title: 'Polityka prywatności',
    description: 'Informacje o przetwarzaniu danych osobowych i zasadach kontaktu przez formularz.',
  },
  '/regulamin': {
    title: 'Regulamin',
    description: 'Warunki korzystania ze strony i zasady kontaktu z biurem rachunkowym.',
  },
};

const FALLBACK_META: MetaConfig = {
  title: 'Strona nie została znaleziona',
  description: 'Podana strona nie istnieje lub została przeniesiona.',
};

function setMeta(name: string, content: string) {
  const tag = document.querySelector(`meta[name="${name}"]`);
  if (tag) {
    tag.setAttribute('content', content);
  }
}

function setPropertyMeta(property: string, content: string) {
  const tag = document.querySelector(`meta[property="${property}"]`);
  if (tag) {
    tag.setAttribute('content', content);
  }
}

export function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = META_BY_PATH[pathname] || FALLBACK_META;
    const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://demo-biuro-rachunkowe.local';
    const pageUrl = pathname === '/' ? `${siteUrl}/` : `${siteUrl}${pathname}`;
    const fullTitle = `${meta.title} | ${SITE_CONFIG.name}`;
    const description = `${SITE_CONFIG.name} w ${SITE_CONFIG.cityForms.locative}. ${meta.description}`;

    document.title = fullTitle;
    setMeta('description', description);
    setPropertyMeta('og:title', fullTitle);
    setPropertyMeta('og:description', description);
    setPropertyMeta('og:url', pageUrl);
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', pageUrl);
    }
  }, [pathname]);

  return null;
}
