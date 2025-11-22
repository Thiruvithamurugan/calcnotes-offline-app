// Service Worker for Offline Functionality

const CACHE_NAME = 'calcnotes-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/calculator.js',
    '/notes.js',
    '/manifest.json',
    '/icon-72.png',
    '/icon-96.png',
    '/icon-128.png',
    '/icon-144.png',
    '/icon-152.png',
    '/icon-192.png',
    '/icon-384.png',
    '/icon-512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
            })
            .catch(err => {
                console.log('Cache failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Strategy: Cache First, Network Fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // Network failed, try to return cached version
                    return caches.match('/index.html');
                });
            })
    );
});
