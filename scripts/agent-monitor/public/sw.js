// Website Factory service worker: keeps the page shell and art on hand so the
// app still opens while server.mjs restarts. Live data (/events, /api) is never cached.
const CACHE = 'factory-v1';
const SHELL = ['/', '/manifest.webmanifest', '/brand/logo-lockup-light.svg', '/brand/logo-lockup-dark.svg',
  '/brand/logo-mark-light.svg', '/brand/app-192.png', '/brand/utopia-locked-light.svg', '/brand/utopia-locked-dark.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/events') || url.pathname.startsWith('/api/')) return;
  // Network first, so a new version shows up straight away; cache as fallback.
  e.respondWith(fetch(e.request).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request).then((hit) => hit || caches.match('/'))));
});
