'use client'

import { useEffect } from 'react'

/**
 * One-shot SW scrubber. Runs after the page has rendered (so React + the
 * monitor data have loaded first), then quietly unregisters any service
 * worker still hanging around and clears all caches. Persisted via
 * localStorage so we only re-run when sw.js changes.
 */
export default function RegisterSW() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    const STAMP = 'uf-sw-scrubbed-v2'
    if (localStorage.getItem(STAMP) === '1') return
    const scrub = async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map((r) => r.unregister().catch(() => {})))
      } catch { /* ignore */ }
      try {
        if ('caches' in window) {
          const keys = await caches.keys()
          await Promise.all(keys.map((k) => caches.delete(k)))
        }
      } catch { /* ignore */ }
      try { localStorage.setItem(STAMP, '1') } catch { /* private mode */ }
    }
    // Defer past initial paint so we don't interfere with data fetching
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => { scrub() }, { timeout: 3000 })
    } else {
      window.setTimeout(scrub, 1500)
    }
  }, [])
  return null
}
