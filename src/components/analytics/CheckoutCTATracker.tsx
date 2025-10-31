'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/ga';

// Use data attributes instead of CSS class selectors (which have changing hashes)
const CHECKOUT_BUTTON_SELECTOR = 'button[data-checkout-button]';

export default function CheckoutCTATracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (variant: 'mobile' | 'desktop', event: Event) => {
      const target = event.target as HTMLElement;
      // Find the button element (in case click is on child element)
      const button = target.closest('button[data-checkout-button]') as HTMLElement;
      
      if (!button) return;
      
      // Determine variant based on button location
      // CSS modules add hashes, so we check if any parent has "stickyBar" in class name
      let isSticky = false;
      let parent = button.parentElement;
      while (parent) {
        if (parent.className && typeof parent.className === 'string' && parent.className.includes('stickyBar')) {
          isSticky = true;
          break;
        }
        parent = parent.parentElement;
      }
      const variantType = isSticky ? 'mobile' : 'desktop';
      
      trackEvent('checkout_continue_click', {
        variant: variantType,
        page_path: window.location.pathname + window.location.search,
        page_referrer: document.referrer || '(direct)',
        button_text: button.textContent?.trim() || '',
      });
    };

    const attachListeners = () => {
      // Find all checkout buttons
      const buttons = Array.from(document.querySelectorAll<HTMLElement>(CHECKOUT_BUTTON_SELECTOR));

      // Attach event listeners
      const handlers = buttons.map((btn) => {
        const handler = (e: Event) => {
          // Check if button is in sticky bar (CSS modules add hashes, so check class name contains "stickyBar")
          let isSticky = false;
          let parent = btn.parentElement;
          while (parent) {
            if (parent.className && typeof parent.className === 'string' && parent.className.includes('stickyBar')) {
              isSticky = true;
              break;
            }
            parent = parent.parentElement;
          }
          handleClick(isSticky ? 'mobile' : 'desktop', e);
        };
        btn.addEventListener('click', handler);
        return { btn, handler };
      });

      return handlers;
    };

    // Initial attachment attempt
    let handlers = attachListeners();

    // Use MutationObserver to watch for dynamically added buttons
    const observer = new MutationObserver(() => {
      // Re-attach listeners in case buttons were added/removed
      handlers.forEach(({ btn, handler }) => {
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
      handlers.forEach(({ btn, handler }) => {
        btn.removeEventListener('click', handler);
      });
    };
  }, []);

  return null;
}
