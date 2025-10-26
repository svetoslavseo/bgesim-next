import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/critical.css';
import { SITE_CONFIG } from '@/lib/seo';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ClientProviders from '@/components/providers/ClientProviders';
import PerformanceMonitor from '@/components/common/PerformanceMonitor';
import StickyCurrencySwitcher from '@/components/common/StickyCurrencySwitcher';

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  
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
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//breezesim.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://breezesim.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Resource hints for critical resources */}
        <link rel="preload" href="/media/images/TeSim-Logo-Breeze.png" as="image" type="image/png" />
        
        {/* Font loading optimization to prevent CLS */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" />
        <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" /></noscript>
        
        {/* Viewport meta tag for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        
        {/* Mobile-specific optimizations */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#c8a2d0" />
        <meta name="msapplication-TileColor" content="#c8a2d0" />
        
        {/* Performance monitoring */}
        <script src="/performance.js" defer></script>
        
        {/* Defer non-critical JavaScript to prevent CLS */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Defer analytics and tracking scripts
              window.addEventListener('load', function() {
                // Load analytics after page is fully loaded
                setTimeout(function() {
                  // Add your analytics scripts here
                  console.log('Page fully loaded, analytics can be initialized');
                }, 1000);
              });
              
              // Mobile-specific optimizations
              if (window.innerWidth <= 768) {
                // Defer mobile-specific scripts
                document.addEventListener('DOMContentLoaded', function() {
                  // Mobile-specific optimizations
                  console.log('Mobile optimizations applied');
                });
              }
            `,
          }}
        />
        
        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <PerformanceMonitor />
        <ClientProviders>
          <Header />
          <main>{children}</main>
          <Footer />
          <StickyCurrencySwitcher />
        </ClientProviders>
      </body>
    </html>
  );
}

