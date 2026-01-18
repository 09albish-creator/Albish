
// sw.js
const CACHE_NAME = 'mikuwave-cache-v3'; // Bumped version to trigger re-installation
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.tsx',
  '/utils.ts',
  '/components/Visualizer.tsx',
  '/components/MikuChat.tsx',
  '/components/LyricsDisplay.tsx',
  '/services/geminiService.ts',
  '/services/mikuVoiceService.ts',
  '/manifest.json',
  '/icon.svg',
  // External assets
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;600;700;900&display=swap',
  // Images
  'https://picsum.photos/seed/miku1/400/400',
  'https://picsum.photos/seed/miku2/400/400',
  'https://picsum.photos/seed/miku3/400/400',
  'https://picsum.photos/seed/miku4/400/400',
  'https://picsum.photos/seed/miku5/400/400',
  // JS Modules from importmap
  'https://esm.sh/react@^19.2.3',
  'https://esm.sh/react-dom@^19.2.3/client',
  'https://esm.sh/@google/genai@^1.37.0',
  'https://esm.sh/d3@^7.9.0'
];

// Install: Caches the app shell and all required assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching all assets for offline use.');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Failed to cache assets during install:', err);
      })
  );
});

// Activate: Cleans up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch: Implements a cache-first, network-fallback strategy
self.addEventListener('fetch', event => {
  // Ignore non-GET requests and Gemini API calls
  if (event.request.method !== 'GET' || event.request.url.includes(':generateContent')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If the resource is in the cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch it from the network
        return fetch(event.request).then(networkResponse => {
          // A copy of the response must be made to put in the cache
          const responseToCache = networkResponse.clone();
          
          caches.open(CACHE_NAME).then(cache => {
            // We only cache successful responses (status 200) for same-origin requests.
            // For cross-origin (opaque) responses, we cache them regardless,
            // as we can't see their status. This is crucial for CDNs.
            if (responseToCache.status === 200 || responseToCache.type === 'opaque') {
               cache.put(event.request, responseToCache);
            }
          });
          
          return networkResponse;
        }).catch(error => {
          console.error('Fetch failed; app is likely offline.', error);
        });
      })
  );
});
