import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { ltiRoutes } from './routes/lti'
import { portfolioRoutes } from './routes/portfolios'
import { momentRoutes } from './routes/moments'
import { artefaktRoutes } from './routes/artefakter'
import { canvasRoutes } from './routes/canvas'
import { authRoutes } from './routes/auth'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: process.env.WEB_URL ?? 'http://localhost:5173',
  credentials: true,
}))

app.get('/health', (c) => c.json({ ok: true, service: 'portfolinho' }))

app.route('/lti',        ltiRoutes)
app.route('/auth',       authRoutes)
app.route('/api/portfolios', portfolioRoutes)
app.route('/api/moments',    momentRoutes)
app.route('/api/artefakter', artefaktRoutes)
app.route('/api/canvas',     canvasRoutes)

const port = Number(process.env.PORT ?? 3001)

serve({ fetch: app.fetch, port }, () => {
  console.log(`Portfolinho server → http://localhost:${port}`)
})
