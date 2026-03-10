import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { SITE_CONFIG } from '../../constants';
import { trackEvent } from '@/src/lib/analytics';
import { useLocation } from 'react-router-dom';

export function FloatingContact() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isNearContact, setIsNearContact] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    setIsDismissed(localStorage.getItem('floating_contact_dismissed') === '1');
  }, [pathname, hash]);

  useEffect(() => {
    const section = document.getElementById('kontakt');
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearContact(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (isDismissed || isNearContact) {
    return null;
  }

  if (!SITE_CONFIG.contact.enableFloatingPhone && !SITE_CONFIG.contact.enableFloatingWhatsApp) {
    return null;
  }

  const dismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('floating_contact_dismissed', '1');
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3 items-end">
      <button
        type="button"
        onClick={dismiss}
        className="h-7 w-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
        aria-label="Ukryj szybki kontakt"
      >
        <X className="w-4 h-4" />
      </button>
      {SITE_CONFIG.contact.enableFloatingWhatsApp && (
        <motion.a
          href={`https://wa.me/${SITE_CONFIG.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Napisz na WhatsApp"
          onClick={() => trackEvent('floating_contact_click', { channel: 'whatsapp' })}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.a>
      )}
      {SITE_CONFIG.contact.enableFloatingPhone && (
        <motion.a
          href={`tel:${SITE_CONFIG.phone.replace(/[^0-9+]/g, '')}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.1 }}
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Zadzwoń do nas"
          onClick={() => trackEvent('floating_contact_click', { channel: 'phone' })}
        >
          <Phone className="w-6 h-6" />
        </motion.a>
      )}
    </div>
  );
}
