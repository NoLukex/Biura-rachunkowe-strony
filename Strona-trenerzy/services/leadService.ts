export type LeadSource = 'contact-form' | 'lead-magnet';

export interface LeadPayload {
  source: LeadSource;
  name?: string;
  email?: string;
  phone?: string;
  goal?: string;
  timeline?: string;
  budget?: string;
  consultationType?: string;
  note?: string;
  consent: boolean;
  marketingConsent: boolean;
  honeypot?: string;
}

interface SubmitLeadOptions {
  fillTimeMs: number;
}

export interface SubmitLeadResult {
  ok: boolean;
  mode: 'webhook' | 'draft';
  error?: string;
}

const DRAFT_STORAGE_KEY = 'trainer_leads_draft';

const appendDraftLead = (payload: LeadPayload): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
  const parsed = raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
  parsed.push({
    ...payload,
    createdAt: new Date().toISOString(),
  });
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(parsed));
};

export const submitLead = async (payload: LeadPayload, options: SubmitLeadOptions): Promise<SubmitLeadResult> => {
  if (payload.honeypot && payload.honeypot.trim()) {
    return { ok: false, mode: 'draft', error: 'Wykryto niepoprawne zgloszenie.' };
  }

  if (options.fillTimeMs < 1200) {
    return { ok: false, mode: 'draft', error: 'Formularz zostal wyslany zbyt szybko. Sprobuj ponownie.' };
  }

  if (!payload.consent) {
    return { ok: false, mode: 'draft', error: 'Zaznacz zgode na kontakt, aby wyslac formularz.' };
  }

  const webhookUrl = import.meta.env.VITE_LEAD_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        return { ok: false, mode: 'webhook', error: 'Nie udalo sie wyslac formularza. Sprobuj ponownie.' };
      }

      return { ok: true, mode: 'webhook' };
    } catch {
      return { ok: false, mode: 'webhook', error: 'Nie udalo sie polaczyc z serwerem formularza.' };
    }
  }

  appendDraftLead(payload);
  return { ok: true, mode: 'draft' };
};
