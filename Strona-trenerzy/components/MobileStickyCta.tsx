import React from 'react';
import { Phone, MessageCircle, Send } from 'lucide-react';
import currentTrainer from '../data/currentTrainer';
import { getQuickWinConfig } from '../data/quickWinConfig';
import { saveLeadIntent } from '../utils/leadIntent';
import { scrollToSection } from '../utils/scrollToSection';

const MobileStickyCta: React.FC = () => {
  const quickWin = getQuickWinConfig(currentTrainer.slug);
  const cleanPhone = currentTrainer.phone.replace(/\D/g, '');
  const telHref = cleanPhone ? `tel:${cleanPhone}` : '#contact';
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : '#contact';

  const stickyLabel =
    quickWin.stickyMode === 'consult-15'
      ? '15 min'
      : quickWin.stickyMode === 'callback-today'
        ? 'Oddzwonie dzis'
        : quickWin.stickyMode === 'consult-60'
          ? 'Konsultacja 60'
          : 'Formularz';

  const handleFormShortcut = (e: React.MouseEvent) => {
    e.preventDefault();

    if (quickWin.stickyMode === 'consult-15') {
      saveLeadIntent({
        consultationType: 'Konsultacja 15 min',
        source: 'sticky-cta-15',
      });
    }

    if (quickWin.stickyMode === 'callback-today') {
      saveLeadIntent({
        note: 'Prosze o oddzwonienie dzisiaj.',
        source: 'sticky-cta-callback',
      });
    }

    if (quickWin.stickyMode === 'consult-60') {
      saveLeadIntent({
        consultationType: 'Konsultacja 60 min',
        source: 'sticky-cta-60',
      });
    }

    scrollToSection('contact', { updateHash: true });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur p-3">
      <div className="grid grid-cols-3 gap-2">
        <a
          href={telHref}
          className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 py-3 text-sm font-bold"
          aria-label="Zadzwon do trenera"
        >
          <Phone size={16} />
          Telefon
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 py-3 text-sm font-bold"
          aria-label="Napisz na WhatsApp"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <a
          href="#contact"
          onClick={handleFormShortcut}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-black text-zinc-950"
          aria-label="Przejdz do formularza"
        >
          <Send size={16} />
          {stickyLabel}
        </a>
      </div>
    </div>
  );
};

export default MobileStickyCta;
