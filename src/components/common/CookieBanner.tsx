'use client';

import { useEffect, useMemo, useState } from 'react';

type Consent = { analytics: boolean; marketing: boolean };

const STORAGE_KEY = 'cookie-consent-v1';

function safeStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const testKey = '__test_localStorage__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  const storageOk = useMemo(() => safeStorageAvailable(), []);

  useEffect(() => {
    let saved: string | null = null;
    if (storageOk) {
      try {
        saved = window.localStorage.getItem(STORAGE_KEY);
      } catch {
        saved = null;
      }
    }

    if (!saved) {
      setOpen(true);
    } else {
      try {
        const parsed = JSON.parse(saved) as { analytics?: boolean; marketing?: boolean; ts?: number };
        const accepted = Boolean(parsed.analytics) || Boolean(parsed.marketing);
        const ts = typeof parsed.ts === 'number' ? parsed.ts : 0;
        const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
        const withinWindow = Date.now() - ts < THIRTY_DAYS_MS;

        // Show banner if not accepted, or accepted but expired
        if (!accepted || !withinWindow) {
          setOpen(true);
        }
      } catch {
        setOpen(true);
      }
    }

    const openHandler = () => setOpen(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('open-cookie-banner', openHandler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-cookie-banner', openHandler);
      }
    };
  }, [storageOk]);

  const save = (consent: Consent) => {
    if (storageOk) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consent, ts: Date.now() }));
      } catch {
        // ignore storage failures
      }
    }
    setOpen(false);

    // Update Google Consent Mode v2
    // @ts-ignore
    window.gtag?.('consent', 'update', {
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      functionality_storage: 'denied',
      security_storage: 'granted',
    });
  };

  if (!open) return null;

  return (
    <>
      <div
        className="cookie-overlay"
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9998 as any, pointerEvents: 'auto' }}
      ></div>
      <div role="dialog" aria-modal="true" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-desc" className="cookie-banner">
      <h2 id="cookie-banner-title">Настройки за бисквитки</h2>
      <p id="cookie-banner-desc">
        Използваме бисквитки за анализ, а при съгласие — за маркетинг. Можете да промените избора си по всяко време.
      </p>
      <div className="actions">
        <button onClick={() => save({ analytics: true, marketing: true })}>Приемам всички</button>
        <button onClick={() => save({ analytics: false, marketing: false })}>Отказвам всички</button>
      </div>
      <style jsx>{`
        /* overlay is styled inline to avoid scoping issues */
        .cookie-banner {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          background: #ffffff;
          color: #111111;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          max-width: 720px;
          width: calc(100% - 32px);
        }
        .cookie-banner h2 {
          margin: 0 0 8px 0;
          font-size: 18px;
          line-height: 1.3;
        }
        @media (min-width: 1024px) {
          .cookie-banner {
            top: auto;
            bottom: 24px;
            left: 50%;
            transform: translate(-50%, 0);
            width: auto;
          }
        }
        .actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        button {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          cursor: pointer;
        }
        button:first-of-type {
          background: #111111;
          color: #ffffff;
          border-color: #111111;
        }
      `}</style>
      </div>
    </>
  );
}


