'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import StickyCurrencySwitcher from '@/components/common/StickyCurrencySwitcher';

export default function ClientProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isArticlePage = pathname?.startsWith('/blog/') || pathname?.startsWith('/en/blog/');

  return (
    <CurrencyProvider>
      {children}
      {!isArticlePage && <StickyCurrencySwitcher />}
    </CurrencyProvider>
  );
}




