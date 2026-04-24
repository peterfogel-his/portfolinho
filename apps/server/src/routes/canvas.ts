import { Hono } from 'hono'

export const canvasRoutes = new Hono()

// Synka lärandemål från Canvas API (kräver Canvas OAuth2-token)
canvasRoutes.post('/sync-outcomes/:courseId', async (c) => {
  // TODO: GET /api/v1/courses/:id/outcome_groups + outcomes
  // Cachea i canvas_outcomes-tabellen
  return c.json({ synced: 0 })
})

// Synka rubrik från Canvas
canvasRoutes.post('/sync-rubric/:courseId/:rubricId', async (c) => {
  // TODO: GET /api/v1/courses/:id/rubrics/:id
  return c.json({ synced: 0 })
})

// Skicka slutbetyg till Canvas via LTI AGS
canvasRoutes.post('/submit-grade', async (c) => {
  // TODO: LTI AGS grade passback
  return c.json({ ok: true })
})
