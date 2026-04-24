import { Hono } from 'hono'

export const ltiRoutes = new Hono()

// LTI 1.3 OIDC login initiation
// Canvas skickar hit när en student/lärare öppnar Portfolinho-verktyget
ltiRoutes.post('/login', async (c) => {
  // TODO: ltijs hanterar OIDC-flödet här
  // 1. Ta emot login_hint + lti_message_hint från Canvas
  // 2. Skicka tillbaka OIDC auth request till Canvas
  return c.json({ status: 'lti_login_stub' })
})

// LTI 1.3 launch endpoint — Canvas POSTar JWT hit efter OIDC
ltiRoutes.post('/launch', async (c) => {
  // TODO: ltijs
  // 1. Validera JWT från Canvas (signatur, claims)
  // 2. Extrahera: user_id, course_id, role (student/instructor)
  // 3. Skapa/uppdatera användare i vår DB
  // 4. Skapa session
  // 5. Redirect till rätt vy i web-appen
  return c.json({ status: 'lti_launch_stub' })
})

// Jwks-endpoint — Canvas hämtar vår publika nyckel
ltiRoutes.get('/jwks', async (c) => {
  // TODO: returnera JWKS med vår publika nyckel
  return c.json({ keys: [] })
})
