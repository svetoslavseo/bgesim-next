'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import StickyCurrencySwitcher from '@/components/common/StickyCurrencySwitcher';
import { hasAnalyticsConsent, trackPageview } from '@/lib/ga';

export default function ClientProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isArticlePage = pathname?.startsWith('/blog/') || pathname?.startsWith('/en/blog/');
  const isHomepage = pathname === '/' || pathname === '';
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (!hasAnalyticsConsent()) return;
    if (lastTrackedPathRef.current === pathname) return;
    lastTrackedPathRef.current = pathname;
    trackPageview(pathname);
  }, [pathname]);

  return (
    <CurrencyProvider>
      {children}
      {!isArticlePage && !isHomepage && <StickyCurrencySwitcher />}
    </CurrencyProvider>
  );
}




