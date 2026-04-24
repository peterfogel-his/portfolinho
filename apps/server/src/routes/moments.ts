import { Hono } from 'hono'

export const momentRoutes = new Hono()

momentRoutes.get('/:portfolioId',           async (c) => c.json({ moments: [] }))
momentRoutes.post('/:portfolioId',          async (c) => c.json({ id: 'stub' }))
momentRoutes.get('/:portfolioId/:momentId', async (c) => c.json({ id: c.req.param('momentId') }))
momentRoutes.patch('/:portfolioId/:momentId', async (c) => c.json({ ok: true }))

// Versionshantering
momentRoutes.post('/:portfolioId/:momentId/versions',     async (c) => c.json({ versionNumber: 1 }))
momentRoutes.get('/:portfolioId/:momentId/versions',      async (c) => c.json({ versions: [] }))
momentRoutes.patch('/:portfolioId/:momentId/versions/:v', async (c) => c.json({ ok: true }))

// Bedömning (tre lager: self / peer / teacher)
momentRoutes.post('/:portfolioId/:momentId/assessments',  async (c) => c.json({ id: 'stub' }))
momentRoutes.get('/:portfolioId/:momentId/assessments',   async (c) => c.json({ assessments: [] }))
