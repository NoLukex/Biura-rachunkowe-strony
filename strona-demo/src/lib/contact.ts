import { SITE_CONFIG } from '@/src/constants';
import { trackEvent } from '@/src/lib/analytics';

export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  formStartedAt: string;
};

function trackContactSubmit(method: 'endpoint' | 'mailto') {
  trackEvent('contact_form_submit', {
    contact_method: method,
  });

  trackEvent('generate_lead', {
    event_category: 'contact',
    method,
  });
}

export async function submitContact(payload: ContactPayload) {
  const envEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
  const endpoint = SITE_CONFIG.contact.formEndpoint || envEndpoint;

  if (!endpoint) {
    if (!SITE_CONFIG.isDemo) {
      throw new Error('Brak endpointu formularza kontaktowego');
    }

    const subject = encodeURIComponent(`Zapytanie ze strony: ${SITE_CONFIG.name}`);
    const body = encodeURIComponent(
      [
        `Imię i nazwisko / firma: ${payload.name}`,
        `Telefon: ${payload.phone}`,
        `Email: ${payload.email}`,
        '',
        'Wiadomość:',
        payload.message,
      ].join('\n'),
    );
    trackContactSubmit('mailto');
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`;
    return;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      message: payload.message,
      consent: payload.consent,
      source: 'website-contact-form',
      formStartedAt: payload.formStartedAt,
      sentAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Nie udało się wysłać formularza');
  }

  trackContactSubmit('endpoint');
}
