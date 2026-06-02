import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../server'
import { resetMockDb, seedMockDb } from './setup'

const sampleTemplate = {
  'classic-blue': { id: 'classic-blue', name: 'Classic Blue', category: 'classique', layout: 'single-column', fonts: { heading: 'Merriweather', body: 'Roboto' }, defaultColors: { primary: '#1e3a5f', secondary: '#3b82f6', accent: '#e2e8f0' } },
}

function authHeader(token: string) { return { Authorization: `Bearer ${token}` } }

describe('CV CRUD', () => {
  beforeEach(() => {
    resetMockDb()
    seedMockDb('templates', sampleTemplate)
  })

  let token: string
  let cvId: string

  describe('POST /api/cvs', () => {
    it('creates a CV without auth', async () => {
      const res = await request(app)
        .post('/api/cvs')
        .send({ templateId: 'classic-blue', title: 'Mon CV' })
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body.templateId).toBe('classic-blue')
      expect(res.body.title).toBe('Mon CV')
      expect(res.body.userId).toBeNull()
      cvId = res.body.id
    })

    it('creates a CV with auth', async () => {
      const reg = await request(app)
        .post('/api/auth/register')
        .send({ email: 'cv@example.com', password: 'password123', name: 'CV User' })
      token = reg.body.token

      const res = await request(app)
        .post('/api/cvs')
        .set(authHeader(token))
        .send({ templateId: 'classic-blue', title: 'Mon CV Pro' })
      expect(res.status).toBe(201)
      expect(res.body.userId).toBeTruthy()
      cvId = res.body.id
    })

    it('rejects invalid templateId', async () => {
      const res = await request(app)
        .post('/api/cvs')
        .send({ templateId: 'nonexistent' })
      expect(res.status).toBe(400)
    })
  })

  describe('GET /api/cvs', () => {
    it('lists CVs for authenticated user', async () => {
      const reg = await request(app)
        .post('/api/auth/register')
        .send({ email: 'list@example.com', password: 'password123', name: 'List User' })
      token = reg.body.token

      await request(app)
        .post('/api/cvs').set(authHeader(token))
        .send({ templateId: 'classic-blue', title: 'CV 1' })
      await request(app)
        .post('/api/cvs').set(authHeader(token))
        .send({ templateId: 'classic-blue', title: 'CV 2' })

      const res = await request(app)
        .get('/api/cvs').set(authHeader(token))
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
    })

    it('lists anonymous CVs when not authenticated', async () => {
      await request(app)
        .post('/api/cvs').send({ templateId: 'classic-blue', title: 'Anon CV' })

      const res = await request(app).get('/api/cvs')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(1)
    })
  })

  describe('GET /api/cvs/:id', () => {
    it('gets a CV by id', async () => {
      const created = await request(app)
        .post('/api/cvs').send({ templateId: 'classic-blue' })
      const id = created.body.id

      const res = await request(app).get(`/api/cvs/${id}`)
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(id)
    })

    it('returns 404 for non-existent id', async () => {
      const res = await request(app).get('/api/cvs/nonexistent-id')
      expect(res.status).toBe(404)
    })
  })

  describe('PUT /api/cvs/:id', () => {
    it('updates a CV', async () => {
      const created = await request(app)
        .post('/api/cvs').send({ templateId: 'classic-blue' })
      const id = created.body.id

      const res = await request(app)
        .put(`/api/cvs/${id}`)
        .send({ title: 'Updated CV', profile: 'New profile text' })
      expect(res.status).toBe(200)
      expect(res.body.title).toBe('Updated CV')
      expect(res.body.profile).toBe('New profile text')
    })

    it('returns 404 for non-existent id', async () => {
      const res = await request(app)
        .put('/api/cvs/nonexistent').send({ title: 'Nope' })
      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /api/cvs/:id', () => {
    it('deletes a CV', async () => {
      const created = await request(app)
        .post('/api/cvs').send({ templateId: 'classic-blue' })
      const id = created.body.id

      const del = await request(app).delete(`/api/cvs/${id}`)
      expect(del.status).toBe(204)

      const get = await request(app).get(`/api/cvs/${id}`)
      expect(get.status).toBe(404)
    })
  })

  describe('POST /api/cvs/:id/duplicate', () => {
    it('duplicates a CV', async () => {
      const created = await request(app)
        .post('/api/cvs').send({ templateId: 'classic-blue', title: 'Original' })
      const id = created.body.id

      const dup = await request(app).post(`/api/cvs/${id}/duplicate`)
      expect(dup.status).toBe(201)
      expect(dup.body.title).toBe('Original (copie)')
      expect(dup.body.id).not.toBe(id)
    })
  })
})
