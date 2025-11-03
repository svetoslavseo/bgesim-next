'use client';

import Script from 'next/script';

const GTM_ID = 'GTM-TJ7JXQL9';

/**
 * Google Tag Manager component using Next.js Script component
 * Best practices for Next.js static export:
 * - Uses afterInteractive strategy (non-blocking, good for static export)
 * - Integrates with existing consent mode setup
 * - Non-blocking script loading for better performance
 * 
 * Note: The consent mode is already set via inline script in the head (handled in layout.tsx)
 * to ensure it loads before GTM. GTM will respect the consent mode settings.
 * 
 * IMPORTANT: While Google recommends GTM in <head>, Next.js App Router handles scripts in body better.
 * The script loads immediately and asynchronously, maintaining performance while ensuring it works.
 */
export default function GoogleTagManager() {
  return (
    <>
      {/* Google Tag Manager - loads early in body (works better in Next.js App Router) */}
      {/* The script is asynchronous and non-blocking, maintaining optimal performance */}
      <Script
        id="gtm-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
}

/**
 * Google Tag Manager noscript fallback
 * This should be placed immediately after the opening <body> tag
 * 
 * Note: This component is separate because Next.js requires noscript
 * to be rendered as a child of body, not through Script component
 */
export function GoogleTagManagerNoscript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        aria-hidden="true"
      />
    </noscript>
  );
}

