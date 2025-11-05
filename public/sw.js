// Service Worker for performance optimization
const CACHE_NAME = 'travelesim-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/media/images/TeSim-Logo-Breeze.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip Next.js RSC routes (React Server Components)
  if (url.searchParams.has('_rsc')) {
    return;
  }

  // Skip robots.txt if it causes issues
  if (url.pathname === '/robots.txt') {
    return;
  }

  // Skip Next.js internal routes that shouldn't be cached
  if (url.pathname.startsWith('/_next/')) {
    // Only cache static assets, skip RSC and other dynamic routes
    if (!url.pathname.includes('/static/')) {
      return;
    }
  }

  // Use a promise that always resolves to prevent unhandled rejections
  event.respondWith(
    Promise.resolve()
      .then(() => {
        return caches.match(request);
      })
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Try to fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            // Cache successful responses asynchronously (don't block response)
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              })
              .catch((cacheError) => {
                // Silently fail caching - don't block the response
                console.warn('Service Worker: Failed to cache:', request.url);
              });

            return response;
          })
          .catch((error) => {
            // If fetch fails, try one more time from network
            // This handles transient network errors
            console.warn('Service Worker fetch failed, retrying:', request.url);
            return fetch(request).catch((retryError) => {
              // If retry also fails, log and let browser handle it
              // by returning a failed fetch promise
              console.warn('Service Worker: Fetch failed after retry:', request.url);
              // Return the original fetch promise - browser will handle the error
              return fetch(request);
            });
          });
      })
      .catch((error) => {
        // Final fallback: try direct network fetch
        console.warn('Service Worker: Cache match failed, trying network:', request.url);
        return fetch(request);
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle background sync tasks
  console.log('Background sync triggered');
}
