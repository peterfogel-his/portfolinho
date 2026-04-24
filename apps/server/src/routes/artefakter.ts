import { Hono } from 'hono'

export const artefaktRoutes = new Hono()

// Uppladdning av fil-artefakt
artefaktRoutes.post('/upload', async (c) => {
  // TODO: ta emot multipart/form-data, spara till lokal FS eller MinIO
  return c.json({ blobId: 'stub', url: '/files/stub' })
})

// Servera lokalt lagrade filer
artefaktRoutes.get('/files/:path{.+}', async (c) => {
  // TODO: läs fil från lokal storage och streama
  return c.notFound()
})

// CRUD för artefakter kopplade till en moment-version
artefaktRoutes.post('/:momentVersionId',    async (c) => c.json({ id: 'stub' }))
artefaktRoutes.get('/:momentVersionId',     async (c) => c.json({ artefakter: [] }))
artefaktRoutes.patch('/:momentVersionId/:id', async (c) => c.json({ ok: true }))
artefaktRoutes.delete('/:momentVersionId/:id', async (c) => c.json({ ok: true }))
