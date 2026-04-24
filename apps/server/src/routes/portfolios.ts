import { Hono } from 'hono'

export const portfolioRoutes = new Hono()

portfolioRoutes.get('/',    async (c) => c.json({ portfolios: [] }))        // lista studentens portfolios
portfolioRoutes.post('/',   async (c) => c.json({ id: 'stub' }))            // skapa portfolio
portfolioRoutes.get('/:id', async (c) => c.json({ id: c.req.param('id') })) // hämta portfolio med moments
portfolioRoutes.patch('/:id', async (c) => c.json({ ok: true }))            // uppdatera titel/visibility
portfolioRoutes.delete('/:id', async (c) => c.json({ ok: true }))           // ta bort portfolio
