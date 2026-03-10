export interface LeadIntent {
  goal?: string;
  timeline?: string;
  budget?: string;
  consultationType?: string;
  track?: string;
  note?: string;
  source?: string;
}

const STORAGE_KEY = 'trainer_lead_intent';
const EVENT_NAME = 'trainer:lead-intent';

export const saveLeadIntent = (intent: LeadIntent): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const payload = {
    ...intent,
    updatedAt: Date.now(),
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }));
};

export const readLeadIntent = (): LeadIntent | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as LeadIntent;
  } catch {
    return null;
  }
};

export const clearLeadIntent = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.sessionStorage.removeItem(STORAGE_KEY);
};

export const subscribeLeadIntent = (handler: (intent: LeadIntent) => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const listener = (event: Event) => {
    const detail = (event as CustomEvent<LeadIntent>).detail;
    if (detail) {
      handler(detail);
    }
  };

  window.addEventListener(EVENT_NAME, listener as EventListener);
  return () => window.removeEventListener(EVENT_NAME, listener as EventListener);
};
