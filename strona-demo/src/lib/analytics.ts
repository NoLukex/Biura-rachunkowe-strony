type EventParams = Record<string, unknown>;

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer?.push({
    event: eventName,
    ...params,
  });

  window.gtag?.('event', eventName, params);
}
