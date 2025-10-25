'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log CLS (Cumulative Layout Shift)
        if (entry.entryType === 'layout-shift') {
          const layoutShiftEntry = entry as PerformanceEntry & { value: number; hadRecentInput?: boolean };
          if (!layoutShiftEntry.hadRecentInput) {
            console.log('CLS:', layoutShiftEntry.value);
          }
        }
        
        // Log LCP (Largest Contentful Paint)
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        
        // Log FID (First Input Delay)
        if (entry.entryType === 'first-input') {
          const firstInputEntry = entry as PerformanceEntry & { processingStart: number };
          console.log('FID:', firstInputEntry.processingStart - entry.startTime);
        }
      }
    });

    // Observe different performance metrics
    try {
      observer.observe({ entryTypes: ['layout-shift', 'largest-contentful-paint', 'first-input'] });
    } catch (error) {
      // Fallback for browsers that don't support all entry types
      console.warn('Performance monitoring not fully supported:', error);
    }

    // Monitor FCP (First Contentful Paint)
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime);
        }
      }
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('Paint monitoring not supported:', error);
    }

    // Cleanup
    return () => {
      observer.disconnect();
      paintObserver.disconnect();
    };
  }, []);

  return null;
}
