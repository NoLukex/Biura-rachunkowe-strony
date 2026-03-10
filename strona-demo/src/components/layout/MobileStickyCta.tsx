import { useEffect, useState } from 'react';
import { Phone, Send } from 'lucide-react';
import { SITE_CONFIG } from '@/src/constants';

export function MobileStickyCta() {
  const telHref = `tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`;
  const [isHiddenForInput, setIsHiddenForInput] = useState(false);

  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const isFormField = target.matches('input, textarea, select');
      const isInsideContact = Boolean(target.closest('#kontakt'));
      if (isFormField && isInsideContact) {
        setIsHiddenForInput(true);
      }
    };

    const onFocusOut = () => {
      window.setTimeout(() => {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement)) {
          setIsHiddenForInput(false);
          return;
        }
        const isFormField = active.matches('input, textarea, select');
        const isInsideContact = Boolean(active.closest('#kontakt'));
        setIsHiddenForInput(isFormField && isInsideContact);
      }, 30);
    };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  if (isHiddenForInput) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-2 z-40 px-3 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto flex max-w-md items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur">
        <a
          href={telHref}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800"
        >
          <Phone className="h-4 w-4" />
          Zadzwoń
        </a>
        <a
          href="#kontakt"
          className="flex h-11 flex-[1.2] items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white"
        >
          <Send className="h-4 w-4" />
          Wyślij zapytanie
        </a>
      </div>
    </div>
  );
}
