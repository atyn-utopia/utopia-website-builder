'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { siteConfig } from '@/config/site'

const FALLBACK_PHONE = siteConfig.fallbackPhone

export default function RedirectClient() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading')

  useEffect(() => {
    async function redirect() {
      try {
        const message = searchParams.get('message') ?? ''
        const location = searchParams.get('location') ?? ''

        let phone = FALLBACK_PHONE

        // Dynamically import to avoid Supabase init crash when env vars are missing
        if (location) {
          try {
            const { getPhoneNumbers, getRandomPhone } = await import('@/lib/getPhoneNumber')
            const result = await getPhoneNumbers(location)
            phone = getRandomPhone(result.phones)
          } catch {
            // Supabase not configured — use fallback
          }
        }

        const waUrl = new URL(`https://wa.me/${phone}`)
        if (message) {
          waUrl.searchParams.set('text', message)
        }

        setStatus('redirecting')
        window.location.href = waUrl.toString()
      } catch {
        setStatus('error')
        window.location.href = `https://wa.me/${FALLBACK_PHONE}`
      }
    }

    redirect()
  }, [searchParams])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--wa-green)' }}
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
          </svg>
        </div>
        <p className="text-lg font-semibold" style={{ color: 'var(--brand-dark)' }}>
          {status === 'loading' ? 'Connecting to WhatsApp...' : status === 'redirecting' ? 'Opening WhatsApp...' : 'Redirecting...'}
        </p>
        <p className="text-sm mt-2" style={{ color: 'var(--brand-text-muted)' }}>
          If nothing happens, <a href={`https://wa.me/${FALLBACK_PHONE}`} className="underline" style={{ color: 'var(--brand-primary)' }}>click here</a>.
        </p>
      </div>
    </div>
  )
}
