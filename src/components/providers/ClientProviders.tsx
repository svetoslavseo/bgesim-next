'use client';

import { ReactNode } from 'react';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      {children}
    </CurrencyProvider>
  );
}



