// Performance monitoring script
(function() {
  'use strict';

  // Only run in production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return;
  }

  // Core Web Vitals monitoring
  function getCLS(onPerfEntry) {
    let clsValue = 0;
    let clsEntries = [];
    let sessionValue = 0;
    let sessionEntries = [];

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (sessionValue && entry.startTime - lastSessionEntry.startTime < 1000 && entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            clsEntries = [...sessionEntries];
            onPerfEntry({ name: 'CLS', value: clsValue, entries: clsEntries });
          }
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  function getFID(onPerfEntry) {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        onPerfEntry({ name: 'FID', value: entry.processingStart - entry.startTime, entries: [entry] });
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  function getLCP(onPerfEntry) {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      onPerfEntry({ name: 'LCP', value: lastEntry.startTime, entries: [lastEntry] });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  function getFCP(onPerfEntry) {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          onPerfEntry({ name: 'FCP', value: entry.startTime, entries: [entry] });
        }
      }
    }).observe({ entryTypes: ['paint'] });
  }

  // Send metrics to analytics
  function sendToAnalytics(metric) {
    // Replace with your analytics endpoint
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }

    // Log to console for debugging
    console.log('Web Vital:', metric.name, metric.value);
  }

  // Initialize monitoring
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getLCP(sendToAnalytics);
  getFCP(sendToAnalytics);

  // Resource timing monitoring
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      const metrics = {
        'DOM Content Loaded': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        'Load Complete': navigation.loadEventEnd - navigation.loadEventStart,
        'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
        'TCP Connection': navigation.connectEnd - navigation.connectStart,
        'Request': navigation.responseStart - navigation.requestStart,
        'Response': navigation.responseEnd - navigation.responseStart,
        'DOM Processing': navigation.domComplete - navigation.domLoading,
      };

      console.log('Performance Metrics:', metrics);
    }
  });

  // Preload critical resources
  function preloadCriticalResources() {
    const criticalImages = [
      '/media/images/TeSim-Logo-Breeze.png',
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Initialize preloading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalResources);
  } else {
    preloadCriticalResources();
  }
})();
