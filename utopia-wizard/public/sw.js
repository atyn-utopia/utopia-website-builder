/**
 * Inert service worker.
 *
 * The previous version did too much during activate (cache wipe +
 * unregister + force-reload of every controlled client) and that race
 * was breaking pages mid-activation. This one does nothing — no fetch
 * handler, no install steps, no activate steps. The client-side
 * RegisterSW component handles the actual unregister cleanly after the
 * page is rendered.
 */

self.addEventListener('install', () => { self.skipWaiting() })
self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()) })
