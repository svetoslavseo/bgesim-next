/**
 * Global type definitions for Google Analytics (gtag)
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (
      command: 'config' | 'event' | 'js' | 'set' | 'consent',
      targetId: string | Date | Record<string, any>,
      config?: Record<string, any>
    ) => void;
  }
}

export {};

