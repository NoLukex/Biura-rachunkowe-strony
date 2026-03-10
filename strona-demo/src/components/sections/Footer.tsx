import { useState } from 'react';
import { SITE_CONFIG } from '@/src/constants';
import { Facebook, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { biuroPath } from '@/src/data/biura/biuroRouting';

export function Footer() {
  const defaultLogoUrl = '/images/logo-biuro-default.svg';
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const [logoSrc, setLogoSrc] = useState(SITE_CONFIG.logoUrl || defaultLogoUrl);
  const hasNip = SITE_CONFIG.nip && !SITE_CONFIG.nip.toLowerCase().includes('uzupelnij');
  const hasRegon = SITE_CONFIG.regon && !SITE_CONFIG.regon.toLowerCase().includes('uzupelnij');
  const showImageLogo = Boolean(logoSrc && !logoLoadFailed);

  const socialLinks = [
    { key: 'facebook', href: SITE_CONFIG.socials.facebook, icon: Facebook, label: 'Facebook' },
    { key: 'linkedin', href: SITE_CONFIG.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { key: 'instagram', href: SITE_CONFIG.socials.instagram, icon: Instagram, label: 'Instagram' },
  ].filter((item) => item.href);

  const quickLinks = [
    { label: 'Nasze usługi', to: biuroPath('/', '#uslugi') },
    { label: 'Kalkulator ceny', to: biuroPath('/', '#kalkulator') },
    { label: 'Pakiety współpracy', to: biuroPath('/', '#pakiety') },
    { label: 'O nas', to: biuroPath('/o-nas') },
    { label: 'Baza wiedzy', to: biuroPath('/wiedza', '#wiedza') },
    { label: 'FAQ', to: biuroPath('/', '#faq') },
    { label: 'Kontakt', to: biuroPath('/', '#kontakt') },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to={biuroPath('/')} className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                {showImageLogo ? (
                  <img
                    src={logoSrc}
                    alt={`${SITE_CONFIG.name} logo`}
                    className="h-7 w-7 rounded-md object-contain bg-white"
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
                  <span className="text-white font-bold text-xl leading-none">{SITE_CONFIG.name.charAt(0)}</span>
                )}
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Biuro rachunkowe w {SITE_CONFIG.cityForms.locative}. Zakres usług, proces współpracy i model kontaktu dopasowane do potrzeb firm.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Na skróty</h4>
            <ul className="space-y-4 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Kontakt</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <span className="block text-slate-500 mb-1">Telefon</span>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`} className="text-white hover:text-blue-400 transition-colors">
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <span className="block text-slate-500 mb-1">Email</span>
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-white hover:text-blue-400 transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <span className="block text-slate-500 mb-1">Adres</span>
                <span className="text-white">{SITE_CONFIG.address}</span>
              </li>
              {hasNip && (
                <li>
                  <span className="block text-slate-500 mb-1">NIP</span>
                  <span className="text-white">{SITE_CONFIG.nip}</span>
                </li>
              )}
              {hasRegon && (
                <li>
                  <span className="block text-slate-500 mb-1">REGON</span>
                  <span className="text-white">{SITE_CONFIG.regon}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Map */}
          <div>
            <h4 className="text-white font-semibold mb-6">Lokalizacja</h4>
            <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-800">
              <iframe 
                src={SITE_CONFIG.mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa dojazdu"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Wszelkie prawa zastrzeżone.</p>
          </div>
          <div className="flex gap-6">
            <Link to={biuroPath('/polityka-prywatnosci')} className="hover:text-blue-400 transition-colors">
              Polityka prywatności (RODO)
            </Link>
            <Link to={biuroPath('/regulamin')} className="hover:text-blue-400 transition-colors">
              Regulamin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
