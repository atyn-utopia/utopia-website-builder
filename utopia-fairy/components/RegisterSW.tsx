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
    type WindowWithIdle = Window & { requestIdleCallback?: (cb: () => void) => void }
    const w = window as WindowWithIdle
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(register)
    } else {
      window.setTimeout(register, 800)
    }
  }, [])
  return null
}
