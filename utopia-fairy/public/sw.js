/**
 * Utopia Wizard — minimal service worker.
 *
 * Goals:
 *   1. Make the app installable as a PWA on mobile + desktop.
 *   2. Cache the app shell so launches feel fast.
 *   3. Never stale-serve API data — /api/* always hits the network.
 *
 * Strategy: network-first for everything, fall back to cache only when
 * offline, and only for non-API routes.
 */

const CACHE = 'utopia-wizard-v1'
const SHELL = [
  '/manifest.json',
  '/utopia-wizard-logo.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL).catch(() => {})),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // API + Next data must always be live. No caching, no offline fallback.
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/data')) return

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {})
        }
        return res
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('/'))),
  )
})
