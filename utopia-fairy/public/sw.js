/**
 * Self-destructing service worker.
 *
 * The original SW caused stale-cache problems during the Vercel auth +
 * deployment-protection transition. This replacement unregisters itself
 * and wipes every cache the first time a browser fetches it, so any
 * client that registered v1 gets back to a clean state.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    } catch { /* ignore */ }
    try {
      await self.registration.unregister()
    } catch { /* ignore */ }
    try {
      const clients = await self.clients.matchAll({ type: 'window' })
      for (const c of clients) c.navigate(c.url).catch(() => {})
    } catch { /* ignore */ }
  })())
})

// Don't intercept any fetches — let the network handle everything.
self.addEventListener('fetch', () => {})
