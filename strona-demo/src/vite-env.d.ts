/// <reference types="vite/client" />

interface Window {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
}
