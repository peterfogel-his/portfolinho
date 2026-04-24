import { createPrivateKey, createPublicKey } from 'node:crypto'

let _privateKey: ReturnType<typeof createPrivateKey> | null = null
let _publicJwk: Record<string, unknown> | null = null

function loadPem(): string {
  const raw = process.env.LTI_PRIVATE_KEY
  if (!raw) throw new Error('LTI_PRIVATE_KEY saknas i miljövariabler')
  // install.sh sparar nyckeln med bokstavliga \\n — konvertera till riktiga radbrytningar
  return raw.replace(/\\n/g, '\n')
}

export function getPrivateKey() {
  if (!_privateKey) _privateKey = createPrivateKey(loadPem())
  return _privateKey
}

export function getPublicJwk(): Record<string, unknown> {
  if (!_publicJwk) {
    const pub = createPublicKey(getPrivateKey())
    const jwk = pub.export({ format: 'jwk' }) as Record<string, unknown>
    _publicJwk = {
      ...jwk,
      use: 'sig',
      alg: 'RS256',
      kid: process.env.LTI_KEY_ID ?? 'portfolinho-key-1',
    }
  }
  return _publicJwk
}
