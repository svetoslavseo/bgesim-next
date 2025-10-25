'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, ExchangeRates, loadExchangeRates } from '@/lib/currency';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRates: ExchangeRates['rates'] | null;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('BGN'); // Default to BGN for Bulgarian site
  // Start with default rates to prevent layout shifts during loading
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates['rates'] | null>({
    USD_TO_BGN: 1.80,
    USD_TO_EUR: 0.92,
  });
  const [isLoading, setIsLoading] = useState(false); // Start as false to prevent layout shifts

  useEffect(() => {
    // Load exchange rates on mount
    const loadRates = async () => {
      try {
        const rates = await loadExchangeRates();
        setExchangeRates(rates.rates);
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRates();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}




