import type { TrainerProfile } from './trainerProfile';

const fallbackTrainer: TrainerProfile = {
  slug: 'profil-trenera',
  fullName: 'Trener Personalny',
  brandName: 'Trener Personalny',
  navName: 'Trener Personalny',
  brandTagline: 'Trening personalny',
  city: 'Bydgoszcz',
  address: 'Bydgoszcz, Polska',
  category: 'Trener osobisty',
  phone: '',
  email: '',
  website: '',
  instagram: '',
  facebook: '',
  rating: 5,
  heroTitleTop: 'TRENUJ',
  heroTitleAccent: 'SKUTECZNIE I REGULARNIE.',
  heroText:
    'Indywidualne podejscie, dopasowany plan i realny progres w treningu stacjonarnym oraz online.',
  aboutHeading: 'Profesjonalne wsparcie treningowe w Bydgoszczy.',
  aboutText:
    'Wspolpraca opiera sie na prostym planie, regularnych korektach i dopasowaniu do codziennego rytmu dnia.',
  theme: {
    accent: '#94c918',
    accentDark: '#73a10f',
    accentSoft: '#d6ef8a',
    bg: '#090b05',
    bgSoft: '#12170a',
    surface: '#171f0e',
    surfaceAlt: '#222d14',
    border: '#33411c',
    textMuted: '#b6c5a1',
  },
};

export default fallbackTrainer;
