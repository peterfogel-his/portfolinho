import { Hono } from 'hono'
import { randomBytes } from 'node:crypto'
import { jwtVerify, createRemoteJWKSet } from 'jose'
import { getPublicJwk } from '../lti/keys'
import { saveState, consumeState } from '../lti/state'

export const ltiRoutes = new Hono()

const canvasIssuer  = () => process.env.CANVAS_ISSUER ?? ''
const clientId      = () => process.env.CANVAS_CLIENT_ID ?? ''
const publicUrl     = () => process.env.PUBLIC_URL ?? 'http://localhost:3000'

// Canvas OIDC-endpoint dit vi skickar inloggningsredirect
const oidcAuthUrl   = () => `${canvasIssuer()}/api/lti/authorize_redirect`
// Canvas publika nycklar för att verifiera id_token
const canvasJwksUrl = () => `${canvasIssuer()}/api/lti/security/jwks`

// ── JWKS — vår publika nyckel (Canvas hämtar denna för AGS-validering) ─────
ltiRoutes.get('/jwks', (c) => {
  return c.json({ keys: [getPublicJwk()] })
})

// ── LTI 1.3 OIDC login initiation ─────────────────────────────────────────
// Canvas POST:ar hit när en student/lärare klickar på Portfolinho-länken
// Body: iss, login_hint, lti_message_hint, target_link_uri
ltiRoutes.post('/login', async (c) => {
  const body = await c.req.parseBody()

  const loginHint      = body['login_hint'] as string
  const ltiMessageHint = body['lti_message_hint'] as string
  const targetLinkUri  = (body['target_link_uri'] as string) ?? `${publicUrl()}/lti/launch`

  if (!loginHint) {
    return c.json({ error: 'login_hint saknas' }, 400)
  }

  const state = randomBytes(16).toString('hex')
  const nonce = randomBytes(16).toString('hex')

  saveState(state, { nonce, targetLinkUri })

  const params = new URLSearchParams({
    response_type:    'id_token',
    response_mode:    'form_post',
    scope:            'openid',
    client_id:        clientId(),
    redirect_uri:     `${publicUrl()}/lti/launch`,
    login_hint:       loginHint,
    lti_message_hint: ltiMessageHint,
    state,
    nonce,
    prompt:           'none',
  })

  return c.redirect(`${oidcAuthUrl()}?${params.toString()}`)
})

// ── LTI 1.3 launch — Canvas POST:ar id_token hit efter OIDC ───────────────
ltiRoutes.post('/launch', async (c) => {
  const body    = await c.req.parseBody()
  const idToken = body['id_token'] as string
  const state   = body['state']   as string

  if (!idToken || !state) {
    return c.text('Felaktig LTI-launch: id_token eller state saknas', 400)
  }

  const savedState = consumeState(state)
  if (!savedState) {
    return c.text('Ogiltigt eller utgånget state — försök igen', 400)
  }

  // Validera JWT mot Canvas publika nycklar
  let payload: Record<string, unknown>
  try {
    const jwks = createRemoteJWKSet(new URL(canvasJwksUrl()))
    const { payload: p } = await jwtVerify(idToken, jwks, {
      issuer:   canvasIssuer(),
      audience: clientId(),
    })
    payload = p as Record<string, unknown>
  } catch (err) {
    console.error('[LTI] JWT-validering misslyckades:', err)
    return c.text('Ogiltig LTI-token', 401)
  }

  // Extrahera användarinfo från standardiserade LTI 1.3-claims
  const roles   = (payload['https://purl.imsglobal.org/spec/lti/claim/roles'] as string[]) ?? []
  const context = payload['https://purl.imsglobal.org/spec/lti/claim/context'] as Record<string, string> | undefined

  const user = {
    canvasUserId: payload.sub as string,
    name:         (payload.name as string)  ?? 'Okänd',
    email:        (payload.email as string) ?? '',
    isTeacher:    roles.some(r => r.includes('Instructor') || r.includes('TeachingAssistant') || r.includes('Administrator')),
    courseId:     context?.id    ?? '',
    courseTitle:  context?.title ?? '',
    launchedAt:   Date.now(),
  }

  console.log(`[LTI] Launch: ${user.name} (${user.isTeacher ? 'lärare' : 'student'}) i kurs "${user.courseTitle}"`)

  // Enkel session-cookie (ersätts med Better Auth i nästa steg)
  // SameSite=None + Secure krävs för LTI i iframe
  const sessionData = Buffer.from(JSON.stringify(user)).toString('base64url')
  c.header('Set-Cookie',
    `portfolinho_session=${sessionData}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=28800`
  )

  const destination = user.isTeacher ? '/portfolinho/teacher' : '/portfolinho/student'
  return c.redirect(`${publicUrl()}${destination}`)
})
