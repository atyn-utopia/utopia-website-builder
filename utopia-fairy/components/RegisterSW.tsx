'use client'

import { useEffect } from 'react'

/**
 * The service worker is temporarily DISABLED — it caused stale-cache issues
 * during the deploy + Vercel-auth-protection transition, where stale chunks
 * would mask the real failure mode of POST requests.
 *
 * On mount, we unregister any existing SW and clear all caches so users who
 * installed v1 get back to a clean state. We can re-enable the SW once
 * everything is stable; until then this component is a one-shot scrubber.
 */
export default function RegisterSW() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    const scrub = async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map((r) => r.unregister().catch(() => {})))
        if ('caches' in window) {
          const keys = await caches.keys()
          await Promise.all(keys.map((k) => caches.delete(k)))
        }
      } catch { /* ignore */ }
    }
    scrub()
  }, [])
  return null
}
