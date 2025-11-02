'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { trackPageview } from '@/lib/ga';

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
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

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

    const openHandler = () => {
      setOpen(true);
      // Load current preferences when reopening
      if (storageOk) {
        try {
          const saved = window.localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved) as { analytics?: boolean; marketing?: boolean };
            setAnalyticsEnabled(Boolean(parsed.analytics));
            setMarketingEnabled(Boolean(parsed.marketing));
          }
        } catch {
          // ignore
        }
      }
    };
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
    setShowSettings(false);

    // Update Google Consent Mode v2
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      functionality_storage: 'denied',
      security_storage: 'granted',
      });
    }

    // Fire a page_view immediately after granting analytics consent
    if (consent.analytics) {
      trackPageview();
    }
  };

  const handleSaveSettings = () => {
    save({ analytics: analyticsEnabled, marketing: marketingEnabled });
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
      <p id="cookie-banner-desc" style={{ color: '#D0D0D0' }}>
        Използваме бисквитки за аналитични цели. При предоставено съгласие използваме бисквитки и за маркетинг. Можете да промените настройките си по всяко време.{' '}
        <Link href="/privacy-policy" style={{ color: '#D0D0D0', textDecoration: 'underline' }}>
          Политика за поверителност
        </Link>
      </p>

      {!showSettings ? (
        <>
          <div className="actions-primary">
            <button onClick={() => save({ analytics: true, marketing: true })} className="accept-btn">Приемам всички</button>
          </div>
          <div className="actions-secondary">
            <button onClick={() => setShowSettings(true)} className="settings-btn">Настройки</button>
            <button onClick={() => save({ analytics: false, marketing: false })} className="reject-btn">Отказвам всички</button>
          </div>
        </>
      ) : (
        <>
          <div className="cookie-settings">
            <div className="cookie-category">
              <div className="category-header">
                <span className="category-name">Необходими бисквитки</span>
                <span className="category-status always-on">Винаги активни</span>
              </div>
              <p className="category-desc">Тези бисквитки са необходими за основното функциониране на сайта и не могат да бъдат деактивирани.</p>
            </div>

            <div className="cookie-category">
              <div className="category-header">
                <span className="category-name">Аналитични бисквитки</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    aria-label="Аналитични бисквитки"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <p className="category-desc">Тези бисквитки ни помагат да разберем как посетителите използват нашия сайт чрез анонимни данни.</p>
            </div>

            <div className="cookie-category">
              <div className="category-header">
                <span className="category-name">Маркетинг бисквитки</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={marketingEnabled}
                    onChange={(e) => setMarketingEnabled(e.target.checked)}
                    aria-label="Маркетинг бисквитки"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <p className="category-desc">Тези бисквитки се използват за персонализиране на реклами и измерване на ефективността на рекламните кампании.</p>
            </div>
          </div>

          <div className="actions">
            <button onClick={() => setShowSettings(false)}>Назад</button>
            <button onClick={handleSaveSettings} className="save-btn">Запази избора</button>
          </div>
        </>
      )}

      <style jsx>{`
        /* overlay is styled inline to avoid scoping issues */
        .cookie-banner {
          position: fixed;
          top: 70%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          background: #000000;
          color: #D0D0D0;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          max-width: 720px;
          width: calc(100% - 32px);
        }
        .cookie-banner h2 {
          margin: 0 0 12px 0;
          font-size: 20px;
          line-height: 1.3;
          color: #D0D0D0;
          font-weight: 600;
        }
        .cookie-banner p {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }
        @media (max-width: 767px) {
          .cookie-banner {
            padding: 20px 16px;
            width: calc(100% - 24px);
            max-width: none;
          }
          .cookie-banner h2 {
            font-size: 18px;
            margin-bottom: 10px;
          }
          .cookie-banner p {
            font-size: 13px;
            line-height: 1.4;
          }
          .actions-primary {
            margin-top: 16px;
            margin-bottom: 10px;
          }
          .actions-secondary {
            flex-direction: column;
            gap: 10px;
            margin-top: 10px;
          }
          .accept-btn {
            padding: 16px 32px;
            font-size: 1rem;
            min-width: 100%;
            width: 100%;
            border-radius: 30px;
            min-height: 48px;
          }
          .reject-btn,
          .settings-btn {
            padding: 14px 20px;
            font-size: 0.875rem;
            width: 100%;
            border-radius: 30px;
            min-height: 44px;
          }
          .cookie-settings {
            margin-top: 12px;
            margin-bottom: 12px;
          }
          .cookie-category {
            margin-bottom: 14px;
            padding-bottom: 14px;
          }
          .category-name {
            font-size: 15px;
          }
          .category-desc {
            font-size: 13px;
          }
          .actions {
            flex-direction: column;
            gap: 10px;
          }
          .actions button {
            width: 100%;
            min-height: 44px;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .cookie-banner {
            padding: 22px 20px;
          }
          .accept-btn {
            padding: 15px 40px;
            font-size: 1.0625rem;
            min-width: 220px;
          }
        }
        @media (min-width: 1024px) {
          .cookie-banner {
            top: auto;
            bottom: 24px;
            left: 50%;
            transform: translate(-50%, 0);
            width: auto;
            max-width: 720px;
          }
        }
        .actions-primary {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          margin-bottom: 12px;
        }
        .actions-secondary {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        button {
          padding: 8px 12px;
          border-radius: 30px;
          border: 1px solid #D0D0D0;
          background: #000000;
          color: #D0D0D0;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        @media (hover: hover) {
          button:hover {
            opacity: 0.8;
          }
          .accept-btn:hover {
            background: var(--color-neon-yellow-hover, #d4d800);
            border-color: var(--color-neon-yellow-hover, #d4d800);
            opacity: 1;
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(229, 233, 0, 0.5);
          }
        }
        .reject-btn {
          padding: 8px 16px;
          font-size: 0.875rem;
        }
        .settings-btn {
          padding: 8px 16px;
          font-size: 0.875rem;
        }
        .accept-btn {
          background: var(--color-neon-yellow, #e5e900);
          color: #000000;
          border-color: var(--color-neon-yellow, #e5e900);
          padding: 16px 48px;
          font-weight: 700;
          font-size: 1.125rem;
          border-radius: 30px;
          box-shadow: 0 4px 12px rgba(229, 233, 0, 0.4);
          transform: scale(1);
          min-width: 200px;
        }
        .accept-btn:active {
          transform: scale(0.98);
        }
        .save-btn {
          background: var(--color-neon-yellow, #e5e900);
          color: #000000;
          border-color: var(--color-neon-yellow, #e5e900);
          padding: 12px 24px;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 30px;
        }
        .save-btn:hover {
          background: var(--color-neon-yellow-hover, #d4d800);
          border-color: var(--color-neon-yellow-hover, #d4d800);
          opacity: 1;
        }
        .cookie-settings {
          margin-top: 16px;
          margin-bottom: 8px;
        }
        .cookie-category {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(208, 208, 208, 0.2);
        }
        .cookie-category:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .category-name {
          font-weight: 600;
          color: #D0D0D0;
          font-size: 16px;
        }
        .category-status {
          font-size: 12px;
          color: #D0D0D0;
        }
        .always-on {
          opacity: 0.7;
        }
        .category-desc {
          margin: 4px 0 0 0;
          font-size: 14px;
          line-height: 1.4;
          color: #D0D0D0;
          opacity: 0.9;
        }
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(208, 208, 208, 0.3);
          transition: 0.3s;
          border-radius: 24px;
        }
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: #D0D0D0;
          transition: 0.3s;
          border-radius: 50%;
        }
        .toggle-switch input:checked + .toggle-slider {
          background-color: var(--color-neon-yellow, #e5e900);
        }
        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }
        .toggle-switch input:focus + .toggle-slider {
          box-shadow: 0 0 1px var(--color-neon-yellow, #e5e900);
        }
      `}</style>
      </div>
    </>
  );
}

