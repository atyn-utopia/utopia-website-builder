/**
 * Simple HMAC-signed cookie auth. Single shared passcode lives in
 * MONITOR_PASSCODE — the passcode itself doubles as the HMAC key so rotating
 * it invalidates every active session.
 *
 * Uses Web Crypto (works in both Node + Edge runtimes), so the same helpers
 * can be called from middleware and API routes.
 */

export const AUTH_COOKIE = 'uf-auth'
const TTL_SECONDS = 30 * 24 * 60 * 60 // 30 days

function getSecret(): string {
  return process.env.MONITOR_PASSCODE ?? ''
}

export function isAuthConfigured(): boolean {
  return !!getSecret()
}

async function hmac(key: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const k = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(data))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return mismatch === 0
}

export async function makeAuthToken(now: number = Date.now()): Promise<string> {
  const exp = now + TTL_SECONDS * 1000
  const sig = await hmac(getSecret(), String(exp))
  return `${exp}.${sig}`
}

export async function verifyAuthToken(token: string | undefined | null): Promise<boolean> {
  const secret = getSecret()
  if (!token || !secret) return false
  const [expStr, sig] = token.split('.')
  if (!expStr || !sig) return false
  const exp = Number.parseInt(expStr, 10)
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  const expected = await hmac(secret, expStr)
  return timingSafeEqual(sig, expected)
}

export const COOKIE_OPTIONS = {
  name: AUTH_COOKIE,
  ttlSeconds: TTL_SECONDS,
}
