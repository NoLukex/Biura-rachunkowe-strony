import { currentBiuro } from '@/src/data/biura/currentBiuro';

function findServicePriceHint(keyword: string, fallback: string): string {
  const matched = currentBiuro.services.find((service) => service.title.toLowerCase().includes(keyword));
  return matched?.priceHint || fallback;
}

function findPlanPrice(planName: string, fallback: string): string {
  const matched = currentBiuro.pricingPlans.find((plan) => plan.name.toLowerCase() === planName.toLowerCase());
  return matched?.price || fallback;
}

export const SERVICE_PRICING = {
  pelnaKsiegowosc: findServicePriceHint('pełna', 'od 1200 zł/mc'),
  kpirRyczalt: findServicePriceHint('kpir', 'od 350 zł/mc'),
  kadryZus: findServicePriceHint('kadry', 'od 50 zł/pracownika'),
  obslugaKsef: findServicePriceHint('ksef', 'W cenie pakietu'),
  doradztwo: findServicePriceHint('doradztw', 'od 300 zł/h'),
  sprawozdania: findServicePriceHint('sprawozd', 'od 1500 zł/rok'),
} as const;

export const PLAN_PRICING = {
  start: findPlanPrice('Start', 'od 350 zł netto / mies.'),
  biznes: findPlanPrice('Biznes', 'od 990 zł netto / mies.'),
  premium: findPlanPrice('Premium', 'wycena indywidualna'),
} as const;
