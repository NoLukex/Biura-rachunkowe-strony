import { currentBiuro } from './data/biura/currentBiuro';

const siteMode = (import.meta.env.VITE_SITE_MODE || 'demo').toLowerCase();

export const SITE_CONFIG = {
  name: currentBiuro.displayName,
  legalName: currentBiuro.legalName,
  slug: currentBiuro.slug,
  city: currentBiuro.city,
  cityForms: currentBiuro.cityForms,
  phone: currentBiuro.phone || '+48 500 600 700',
  email: currentBiuro.email || 'kontakt@twojebiuro.pl',
  emails: currentBiuro.emails,
  nip: 'uzupelnij NIP',
  regon: 'uzupelnij REGON',
  address: currentBiuro.address || `Poznań`,
  website: currentBiuro.website,
  teamType: currentBiuro.teamType,
  serviceModel: currentBiuro.serviceModel,
  siteMode,
  isDemo: siteMode !== 'prod',
  socials: {
    facebook: currentBiuro.socials.facebook,
    linkedin: currentBiuro.socials.linkedin,
    instagram: currentBiuro.socials.instagram,
    youtube: currentBiuro.socials.youtube,
  },
  logoUrl: currentBiuro.media.logoUrl,
  mapEmbedUrl: currentBiuro.mapUrl,
  contact: {
    formEndpoint: '',
    enableFloatingPhone: true,
    enableFloatingWhatsApp: true,
  },
};
