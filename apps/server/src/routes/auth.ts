import { Hono } from 'hono'

export const authRoutes = new Hono()

// TODO: Better Auth hanterar /auth/session, /auth/sign-out etc.
// Dessa routes proxyas hit från web-appen via React Query

authRoutes.get('/session', async (c) => {
  // TODO: Better Auth session lookup
  return c.json({ user: null })
})

authRoutes.post('/sign-out', async (c) => {
  // TODO: Better Auth sign-out
  return c.json({ ok: true })
})
