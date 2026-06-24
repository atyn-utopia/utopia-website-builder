/**
 * AES-GCM encryption for GitHub tokens at rest (wizard_users.github_token_encrypted).
 *
 * Key comes from WIZARD_TOKEN_KEY (base64 of 32 raw bytes). Ciphertext is
 * stored as `${ivB64}.${cipherB64}` so each value is self-describing. Uses Web
 * Crypto so it runs in the Node runtime of route handlers.
 *
 * Never log plaintext tokens. Decryption is only ever done server-side right
 * before a git operation, then discarded.
 */

/**
 * Copy bytes into a freshly-allocated ArrayBuffer-backed view. The TS DOM lib
 * types Web Crypto's BufferSource as ArrayBufferView<ArrayBuffer> specifically
 * (not ArrayBufferLike), so Buffer/SharedArrayBuffer-backed arrays are rejected
 * — this normalises them.
 */
function toAbView(src: ArrayLike<number>): Uint8Array<ArrayBuffer> {
  const ab = new ArrayBuffer(src.length)
  const view = new Uint8Array(ab)
  view.set(src)
  return view
}

/** base64 → ArrayBuffer-backed Uint8Array. */
function b64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  return toAbView(Buffer.from(b64, 'base64'))
}

function getKeyBytes(): Uint8Array<ArrayBuffer> | null {
  const b64 = process.env.WIZARD_TOKEN_KEY ?? ''
  if (!b64) return null
  try {
    const raw = b64ToBytes(b64)
    if (raw.length !== 32) return null
    return raw
  } catch {
    return null
  }
}

export function tokenCryptoConfigured(): boolean {
  return getKeyBytes() !== null
}

async function importKey(usage: KeyUsage): Promise<CryptoKey | null> {
  const bytes = getKeyBytes()
  if (!bytes) return null
  return crypto.subtle.importKey('raw', bytes, { name: 'AES-GCM' }, false, [usage])
}

/** Encrypt a token → `${ivB64}.${cipherB64}`. Throws if no key configured. */
export async function encryptToken(plaintext: string): Promise<string> {
  const key = await importKey('encrypt')
  if (!key) throw new Error('WIZARD_TOKEN_KEY not set (32 base64 bytes required)')
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = toAbView(new TextEncoder().encode(plaintext))
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc)
  const ivB64 = Buffer.from(iv).toString('base64')
  const cipherB64 = Buffer.from(new Uint8Array(cipher)).toString('base64')
  return `${ivB64}.${cipherB64}`
}

/** Decrypt `${ivB64}.${cipherB64}` → token. Returns null on any failure. */
export async function decryptToken(blob: string | null | undefined): Promise<string | null> {
  if (!blob) return null
  const [ivB64, cipherB64] = blob.split('.')
  if (!ivB64 || !cipherB64) return null
  const key = await importKey('decrypt')
  if (!key) return null
  try {
    const iv = b64ToBytes(ivB64)
    const cipher = b64ToBytes(cipherB64)
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher)
    return new TextDecoder().decode(plain)
  } catch {
    return null
  }
}
