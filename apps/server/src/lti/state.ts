// Tillfällig in-memory lagring av OIDC state/nonce (TTL 5 min)
// Tillräckligt för en instans — byt till Redis vid horisontell skalning

interface OidcState {
  nonce: string
  targetLinkUri: string
  expiresAt: number
}

const store = new Map<string, OidcState>()

// Rensa utgångna entries var 5:e minut
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of store.entries()) {
    if (val.expiresAt < now) store.delete(key)
  }
}, 5 * 60 * 1000).unref()

export function saveState(state: string, data: Omit<OidcState, 'expiresAt'>) {
  store.set(state, { ...data, expiresAt: Date.now() + 5 * 60 * 1000 })
}

export function consumeState(state: string): OidcState | null {
  const entry = store.get(state)
  if (!entry) return null
  if (entry.expiresAt < Date.now()) { store.delete(state); return null }
  store.delete(state) // state är engångsanvändning
  return entry
}
