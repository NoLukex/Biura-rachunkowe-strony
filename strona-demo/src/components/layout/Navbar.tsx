import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { SITE_CONFIG } from '@/src/constants';
import { Link, useLocation } from 'react-router-dom';
import { biuroPath } from '@/src/data/biura/biuroRouting';

export function Navbar() {
  const defaultLogoUrl = '/images/logo-biuro-default.svg';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const [logoSrc, setLogoSrc] = useState(SITE_CONFIG.logoUrl || defaultLogoUrl);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const showImageLogo = Boolean(logoSrc && !logoLoadFailed);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const focusableElements = mobileNavRef.current?.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Usługi', to: biuroPath('/', '#uslugi') },
    { name: 'Kalkulator', to: biuroPath('/', '#kalkulator') },
    { name: 'Pakiety', to: biuroPath('/', '#pakiety') },
    { name: 'O nas', to: biuroPath('/o-nas') },
    { name: 'Wiedza', to: biuroPath('/wiedza', '#wiedza') },
    { name: 'FAQ', to: biuroPath('/', '#faq') },
    { name: 'Kontakt', to: biuroPath('/', '#kontakt') },
  ];

  const isTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isTransparent ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to={biuroPath('/')} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            {showImageLogo ? (
                <img
                  src={logoSrc}
                  alt={`${SITE_CONFIG.name} logo`}
                  className="h-7 w-7 rounded-md object-contain bg-white"
                  loading="eager"
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
          <span className={`font-bold text-xl tracking-tight ${!isTransparent ? 'text-slate-900' : 'text-white'}`}>
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                    to={link.to}
                    className={`text-sm font-medium transition-colors ${
                      !isTransparent
                        ? 'text-slate-600 hover:text-blue-600'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white">
            <Link to={biuroPath('/', '#kontakt')}>Umów konsultację</Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          ref={menuButtonRef}
          className={`md:hidden p-2 ${!isTransparent ? 'text-slate-600' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileNavRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu główne"
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg py-4 px-4 flex flex-col gap-4"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.to}
                  className="text-base font-medium text-slate-700 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Link to={biuroPath('/', '#kontakt')} onClick={() => setIsMobileMenuOpen(false)}>
              Umów konsultację
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
