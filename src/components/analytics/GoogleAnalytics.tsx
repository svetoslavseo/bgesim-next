'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-J85XGQ483H';

/**
 * Google Analytics component using Next.js Script component
 * Best practices for Next.js static export:
 * - Consent Mode v2 loads first (using inline script in head)
 * - Scripts load with afterInteractive strategy (non-blocking, good for static export)
 * - Proper initialization order maintained
 * 
 * Note: For static export, we use afterInteractive strategy which works reliably.
 * The consent mode is set via inline script in the head (handled in layout.tsx)
 * to ensure it loads before gtag.js.
 */
export default function GoogleAnalytics() {
  return (
    <>
      {/* Google Analytics base script - loads after page becomes interactive */}
      {/* This ensures non-blocking load and works with static export */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        id="gtag-base"
      />
      
      {/* Google Analytics configuration */}
      <Script
        id="gtag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            (function(){
              try {
                var dbg = (location && (location.hostname === 'localhost' || location.search.indexOf('debug_ga=1') !== -1 || location.search.indexOf('debug_mode=1') !== -1));
                gtag('config', '${GA_MEASUREMENT_ID}', { 
                  debug_mode: dbg,
                  send_page_view: false
                });
              } catch (e) {
                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
              }
            })();
          `,
        }}
      />
    </>
  );
}

