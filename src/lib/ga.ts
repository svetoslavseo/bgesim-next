export const CONSENT_STORAGE_KEY = 'cookie-consent-v1';

type StoredConsent = {
  analytics?: boolean;
  marketing?: boolean;
  ts?: number;
};

export function getStoredConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredConsent;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  const consent = getStoredConsent();
  return Boolean(consent && consent.analytics);
}

export function trackPageview(path?: string) {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  // @ts-ignore
  if (typeof window.gtag !== 'function') return;
  const page_path = path || window.location.pathname + window.location.search;
  // Prefer event page_view to ensure a hit even if config was sent earlier without consent
  // @ts-ignore
  window.gtag('event', 'page_view', { page_path });
}

export function trackEvent(name: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  // @ts-ignore
  if (typeof window.gtag !== 'function') return;
  // @ts-ignore
  window.gtag('event', name, params);
}


