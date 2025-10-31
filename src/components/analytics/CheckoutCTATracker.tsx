'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/ga';

const MOBILE_SELECTOR = '.page_checkoutButton___nsl5';
const DESKTOP_SELECTOR = '.page_desktopCtaButton__8ySNe';

export default function CheckoutCTATracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (variant: 'mobile' | 'desktop', event: Event) => {
      const target = event.target as HTMLElement;
      // Find the button element (in case click is on child element)
      const button = target.closest(MOBILE_SELECTOR) || target.closest(DESKTOP_SELECTOR) || target;
      trackEvent('checkout_continue_click', {
        variant,
        page_path: window.location.pathname + window.location.search,
        page_referrer: document.referrer || '(direct)',
        button_text: button.textContent?.trim() || '',
      });
    };

    const attachListeners = () => {
      // Find all buttons matching the selectors
      const mobileButtons = Array.from(document.querySelectorAll<HTMLElement>(MOBILE_SELECTOR));
      const desktopButtons = Array.from(document.querySelectorAll<HTMLElement>(DESKTOP_SELECTOR));

      // Attach event listeners
      const mobileHandlers = mobileButtons.map((btn) => {
        const handler = (e: Event) => handleClick('mobile', e);
        btn.addEventListener('click', handler);
        return { btn, handler };
      });

      const desktopHandlers = desktopButtons.map((btn) => {
        const handler = (e: Event) => handleClick('desktop', e);
        btn.addEventListener('click', handler);
        return { btn, handler };
      });

      return { mobileHandlers, desktopHandlers };
    };

    // Initial attachment attempt
    let handlers = attachListeners();

    // Use MutationObserver to watch for dynamically added buttons
    const observer = new MutationObserver(() => {
      // Re-attach listeners in case buttons were added/removed
      handlers.mobileHandlers.forEach(({ btn, handler }) => {
        btn.removeEventListener('click', handler);
      });
      handlers.desktopHandlers.forEach(({ btn, handler }) => {
        btn.removeEventListener('click', handler);
      });
      handlers = attachListeners();
    });

    // Observe the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      observer.disconnect();
      handlers.mobileHandlers.forEach(({ btn, handler }) => {
        btn.removeEventListener('click', handler);
      });
      handlers.desktopHandlers.forEach(({ btn, handler }) => {
        btn.removeEventListener('click', handler);
      });
    };
  }, []);

  return null;
}

