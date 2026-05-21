'use client'

import { useEffect } from 'react'

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    // Defer to idle so it doesn't compete with initial paint
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => { /* silently ignore */ })
    }
    if ('requestIdleCallback' in window) {
      ;(window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(register)
    } else {
      window.setTimeout(register, 800)
    }
  }, [])
  return null
}
