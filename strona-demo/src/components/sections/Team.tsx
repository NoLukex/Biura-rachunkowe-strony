import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Award, Briefcase } from 'lucide-react';
import { currentBiuro } from '@/src/data/biura/currentBiuro';

const defaultTeam = [
  {
    name: 'Marta Kowalska',
    role: 'Główna Księgowa',
    experience: '15 lat doświadczenia',
    credentials: 'Uprawnienia księgowe i audytowe',
    image: '/images/team-marta.jpg',
    objectPosition: 'center 12%',
  },
  {
    name: 'Tomasz Nowak',
    role: 'Doradca Podatkowy',
    experience: '12 lat doświadczenia',
    credentials: 'Licencjonowany doradca podatkowy',
    image: '/images/team-tomasz.jpg',
    objectPosition: 'center 10%',
  },
  {
    name: 'Anna Wiśniewska',
    role: 'Ekspert ds. Kadr i ZUS',
    experience: '10 lat doświadczenia',
    credentials: 'Certyfikowany specjalista ds. kadr',
    image: '/images/team-anna.jpg',
    objectPosition: 'center 12%',
  },
  {
    name: 'Piotr Zieliński',
    role: 'Specjalista KSeF',
    experience: '8 lat doświadczenia',
    credentials: 'Ekspert wdrożeń procesów cyfrowych',
    image: '/images/team-piotr.jpg',
    objectPosition: 'center 10%',
  },
];

const nonPersonImageTokens = [
  'real-estate',
  'building',
  'biurow',
  'office',
  'nieruchom',
  'wnetrz',
  'interior',
  'logo',
  'ikona',
  'icon',
  'banner',
];

function isLikelyNonPersonImage(url: string): boolean {
  const lowered = (url || '').toLowerCase();
  if (!lowered) {
    return true;
  }
  return nonPersonImageTokens.some((token) => lowered.includes(token));
}

export function Team() {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const isSoloOwner = currentBiuro.teamType === 'jednoosobowe';
  const generatedTeam = currentBiuro.team?.length
    ? currentBiuro.team
    : defaultTeam;

  const usedImages = new Set<string>();

  const team = generatedTeam.map((member, index) => {
    const fallbackImage = defaultTeam[index % defaultTeam.length].image;
    const altFallbackImage = defaultTeam[(index + 1) % defaultTeam.length].image;
    const isTemplateImage = Boolean(member.image && /^\/images\/team-/.test(member.image));

    const imageCandidates = [
      !isTemplateImage && member.image && !isLikelyNonPersonImage(member.image) ? member.image : '',
      index === 0 && currentBiuro.media.teamCandidateUrl && !isLikelyNonPersonImage(currentBiuro.media.teamCandidateUrl)
        ? currentBiuro.media.teamCandidateUrl
        : '',
      index === 0 && currentBiuro.media.heroCandidateUrl && !isLikelyNonPersonImage(currentBiuro.media.heroCandidateUrl)
        ? currentBiuro.media.heroCandidateUrl
        : '',
      fallbackImage,
      altFallbackImage,
    ].filter(Boolean);

    let resolvedImage = imageCandidates[0] || fallbackImage;
    for (const candidate of imageCandidates) {
      if (!usedImages.has(candidate)) {
        resolvedImage = candidate;
        break;
      }
    }
    usedImages.add(resolvedImage);

    return {
      ...member,
      image: resolvedImage,
      objectPosition: member.objectPosition || defaultTeam[index % defaultTeam.length].objectPosition,
      experience: member.experience || 'Doświadczenie branżowe',
      credentials: member.credentials || 'Obsługa księgowa i podatkowa',
    };
  });

  const visibleTeam = isSoloOwner ? team.slice(0, 1) : team;

  const gridLayoutClass = (() => {
    if (visibleTeam.length <= 1) {
      return 'max-w-md mx-auto grid-cols-1';
    }
    if (visibleTeam.length === 2) {
      return 'max-w-4xl mx-auto grid-cols-1 sm:grid-cols-2';
    }
    if (visibleTeam.length === 3) {
      return 'max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  })();

  const owner = visibleTeam[0];

  useEffect(() => {
    const prefetchSources = visibleTeam.slice(0, 2).map((member) => member.image).filter(Boolean);
    prefetchSources.forEach((src) => {
      if (loadedImages[src]) {
        return;
      }
      const image = new Image();
      image.src = src;
      image.onload = () => {
        setLoadedImages((prev) => ({ ...prev, [src]: true }));
      };
    });
  }, [visibleTeam, loadedImages]);

  return (
    <section className="py-16 md:py-24 bg-slate-50" id="zespol">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            {isSoloOwner ? 'Twój opiekun księgowy' : 'Zespół i opiekun współpracy'}
          </h2>
          <p className="text-lg text-slate-600">
            {isSoloOwner
              ? `W ${currentBiuro.displayName} pracujesz bezpośrednio z jedną osobą odpowiedzialną za prowadzenie Twoich spraw.`
              : 'Pracujesz bezpośrednio z konkretnymi osobami odpowiedzialnymi za księgowość, podatki oraz kadry.'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Stały opiekun</span>
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Szybki kontakt</span>
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">{isSoloOwner ? 'Kontakt 1:1' : 'Jasny podział odpowiedzialności'}</span>
        </div>

        {isSoloOwner && owner ? (
          <div className="grid gap-8 lg:grid-cols-5 max-w-6xl mx-auto items-stretch">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group lg:col-span-2 bg-white p-4 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative mb-6 overflow-hidden rounded-2xl bg-slate-100 flex-1 min-h-[34rem]">
                {!loadedImages[owner.image] && (
                  <div className="absolute inset-0 animate-pulse bg-slate-200" aria-hidden="true" />
                )}
                <img
                  src={owner.image}
                  alt={owner.name}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ objectPosition: owner.objectPosition }}
                  referrerPolicy="no-referrer"
                  onLoad={() => setLoadedImages((prev) => ({ ...prev, [owner.image]: true }))}
                />
              </div>
              <div className="px-2 pb-2 text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{owner.name}</h3>
                <p className="text-blue-600 font-medium">{owner.role}</p>
              </div>
            </motion.div>

            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 p-8 flex flex-col"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Jak wygląda współpraca 1:1</h3>
              <div className="space-y-4 text-slate-700">
                <p><span className="font-semibold text-slate-900">1. Ustalenie zasad współpracy:</span> wspólnie ustalamy zakres obsługi, terminy i kanał kontaktu.</p>
                <p><span className="font-semibold text-slate-900">2. Stała opieka nad rozliczeniami:</span> prowadzimy księgowość na bieżąco, bez przekazywania spraw między wieloma osobami.</p>
                <p><span className="font-semibold text-slate-900">3. Decyzje i konsultacje:</span> dostajesz jasne rekomendacje podatkowe i szybkie odpowiedzi w ważnych momentach.</p>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6 min-h-44 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-semibold tracking-wide text-slate-900 mb-3 uppercase">Co zyskujesz</p>
                    <p className="text-base leading-7 text-slate-600">
                      Jedną osobę odpowiedzialną za kontakt, spójny obieg dokumentów i mniej chaosu przy codziennych sprawach księgowych.
                    </p>
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-900">Jedna odpowiedzialność, jeden kontakt, mniej chaosu.</p>
                </div>
                <div className="rounded-3xl bg-blue-50 border border-blue-100 p-6 min-h-44 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-semibold tracking-wide text-slate-900 mb-3 uppercase">Najlepsze dla</p>
                    <p className="text-base leading-7 text-slate-600">
                      Firm, które chcą rozmawiać bezpośrednio z osobą prowadzącą sprawy, zamiast być przekazywane między członkami większego zespołu.
                    </p>
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-900">Model 1:1 dla firm ceniących prostą komunikację.</p>
                </div>
              </div>

            </motion.div>
          </div>
        ) : (

        <div className={`grid gap-8 ${gridLayoutClass}`}>
          {visibleTeam.map((member, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white p-4 rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative mb-6 overflow-hidden rounded-2xl bg-slate-100 aspect-[4/5]">
                {!loadedImages[member.image] && (
                  <div className="absolute inset-0 animate-pulse bg-slate-200" aria-hidden="true" />
                )}
                <img
                  src={member.image}
                  alt={member.name}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ objectPosition: member.objectPosition }}
                  referrerPolicy="no-referrer"
                  onLoad={() => setLoadedImages((prev) => ({ ...prev, [member.image]: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                      {member.experience}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Award className="w-4 h-4 text-blue-400" />
                      {member.credentials}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-2 pb-2 text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
