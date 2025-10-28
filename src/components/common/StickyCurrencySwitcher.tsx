'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import styles from './StickyCurrencySwitcher.module.css';

export default function StickyCurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Inject a hard override to guarantee viewport-fixed placement on all devices
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-sticky-currency-overrides', '');
    styleEl.textContent = `
      .StickyCurrencySwitcher_stickyCurrencyContainer__MndaZ{position:fixed!important;bottom:16px!important;right:16px!important;top:auto!important;left:auto!important;z-index:2147483647!important;transform:none!important;contain:none!important;will-change:auto!important}
      @media (max-width:768px){.StickyCurrencySwitcher_stickyCurrencyContainer__MndaZ{bottom:16px!important;right:16px!important}}
      @media (max-width:480px){.StickyCurrencySwitcher_stickyCurrencyContainer__MndaZ{bottom:12px!important;right:12px!important}}
    `;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

  if (!isClient) {
    return null;
  }

  const node = (
    <div
      className={styles.stickyCurrencyContainer}
      suppressHydrationWarning
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        top: 'unset',
        left: 'unset',
        zIndex: 2147483647,
        transform: 'none',
        willChange: 'auto',
        contain: 'none'
      }}
    >
      <div className={styles.currencySwitcher}>
        <span className={styles.currencyLabel}>Валута:</span>
        <button
          className={`${styles.currencyButton} ${currency === 'BGN' ? styles.active : ''}`}
          onClick={() => setCurrency('BGN')}
          aria-pressed={currency === 'BGN'}
          aria-label="Превключи на BGN"
        >
          BGN
        </button>
        <button
          className={`${styles.currencyButton} ${currency === 'EUR' ? styles.active : ''}`}
          onClick={() => setCurrency('EUR')}
          aria-pressed={currency === 'EUR'}
          aria-label="Превключи на EUR"
        >
          EUR
        </button>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
