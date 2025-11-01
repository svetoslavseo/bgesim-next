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

function isDebugMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const qs = window.location.search || '';
    return window.location.hostname === 'localhost' || qs.includes('debug_ga=1') || qs.includes('debug_mode=1');
  } catch {
    return false;
  }
}

export function trackPageview(path?: string) {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  // @ts-ignore
  if (typeof window.gtag !== 'function') return;
  const page_path = path || window.location.pathname + window.location.search;
  // Prefer event page_view to ensure a hit even if config was sent earlier without consent
  // @ts-ignore
  window.gtag('event', 'page_view', { page_path, ...(isDebugMode() ? { debug_mode: true } : {}) });
}

export function trackEvent(name: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  // @ts-ignore
  if (typeof window.gtag !== 'function') return;
  // @ts-ignore
  window.gtag('event', name, { ...(isDebugMode() ? { debug_mode: true } : {}), ...params });
}

export function trackEventWithCallback(
  name: string,
  params: Record<string, any> = {},
  onDone?: () => void,
  timeoutMs: number = 800,
): void {
  if (typeof window === 'undefined') {
    onDone?.();
    return;
  }
  // If no consent or gtag not available, do not block navigation
  // @ts-ignore
  if (!hasAnalyticsConsent() || typeof window.gtag !== 'function') {
    onDone?.();
    return;
  }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    onDone?.();
  };

  const eventParams = {
    ...(isDebugMode() ? { debug_mode: true } : {}),
    ...params,
    event_callback: finish,
    event_timeout: Math.max(200, timeoutMs),
  };

  try {
    // @ts-ignore
    window.gtag('event', name, eventParams);
    // Fallback timeout in case callback doesn't fire
    setTimeout(finish, Math.max(200, timeoutMs + 200));
  } catch {
    finish();
  }
}


