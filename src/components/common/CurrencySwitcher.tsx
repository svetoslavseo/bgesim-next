'use client';

import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import styles from './CurrencySwitcher.module.css';

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={styles.currencySwitcher}>
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
  );
}



