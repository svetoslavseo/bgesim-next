import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/critical.css';
import { SITE_CONFIG } from '@/lib/seo';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ClientProviders from '@/components/providers/ClientProviders';
import PerformanceMonitor from '@/components/common/PerformanceMonitor';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import GoogleTagManager, { GoogleTagManagerNoscript } from '@/components/analytics/GoogleTagManager';
import dynamic from 'next/dynamic';
const CookieBanner = dynamic(() => import('@/components/common/CookieBanner'), { ssr: false });
// StickyCurrencySwitcher is now rendered conditionally inside ClientProviders

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: 'any', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Performance and security headers
  other: {
    'X-DNS-Prefetch-Control': 'on',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
  },
  
  // Verification (add your verification tokens here)
  // verification: {
  //   google: 'your-google-verification-code',
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <head>
        {/* Google Consent Mode v2 - MUST load FIRST before any GA/GTM scripts */}
        {/* This ensures consent mode is set before gtag.js/gtm.js loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                ad_storage: 'denied',
                analytics_storage: 'denied',
                functionality_storage: 'denied',
                security_storage: 'granted'
              });
            `,
          }}
        />
        
        {/* DNS prefetch for Google Tag Manager - critical for performance */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//breezesim.com" />
        
        {/* Preconnect to external domains - critical only */}
        <link rel="preconnect" href="https://breezesim.com" />
        
        {/* Viewport meta tag for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Mobile-specific optimizations */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#c8a2d0" />
        <meta name="msapplication-TileColor" content="#c8a2d0" />
        
        {/* Performance monitoring - defer to not block rendering */}
        <script src="/performance.js" defer async></script>
        
        {/* Optimized service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Register service worker with high priority
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    navigator.serviceWorker.register('/sw.js').catch(function() {
                      // Silently fail for performance
                    });
                  }, 100);
                });
              }
            `,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager - loads early in body for optimal performance */}
        {/* Note: In Next.js App Router, scripts in head don't always render, so we load GTM in body */}
        <GoogleTagManager />
        
        {/* Google Tag Manager noscript fallback - must be immediately after opening body tag */}
        <GoogleTagManagerNoscript />
        
        {/* Google Analytics - loads with proper consent mode and strategy */}
        <GoogleAnalytics />
        <PerformanceMonitor />
        <ClientProviders>
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
        </ClientProviders>
      </body>
    </html>
  );
}

