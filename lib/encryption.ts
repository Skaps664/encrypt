/* Client-side encryption utilities using WebCrypto API.
 * - PBKDF2 with SHA-256 for key derivation
 * - AES-GCM with 96-bit IV for authenticated encryption
 *
 * NOTE: This is a reference implementation and suffices for demo / frontend use.
 */

export const DEFAULT_PBKDF2_ITERATIONS = 200000

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function buf2hex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  return hex
}

function buf2b64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)))
  }
  return btoa(binary)
}

function b642buf(base64: string) {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

export async function deriveKeyFromPassword(password: string, saltB64: string, iterations = DEFAULT_PBKDF2_ITERATIONS) {
  const salt = b642buf(saltB64)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
  return key
}

export async function encryptText(plaintext: string, password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const saltB64 = buf2b64(salt.buffer)
  const ivB64 = buf2b64(iv.buffer)
  const derivedKey = await deriveKeyFromPassword(password, saltB64)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, derivedKey, encoder.encode(plaintext))
  const ciphertextB64 = buf2b64(ciphertext)
  return {
    ciphertext: ciphertextB64,
    iv: ivB64,
    salt: saltB64,
    iterations: DEFAULT_PBKDF2_ITERATIONS,
  }
}

export async function decryptText(encrypted: { ciphertext: string; iv: string; salt: string; iterations?: number }, password: string) {
  const { ciphertext, iv, salt } = encrypted
  const key = await deriveKeyFromPassword(password, salt, encrypted.iterations)
  const deciphered = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b642buf(iv) }, key, b642buf(ciphertext))
  return decoder.decode(deciphered)
}

export function generateSaltB64() {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return buf2b64(salt.buffer)
}
